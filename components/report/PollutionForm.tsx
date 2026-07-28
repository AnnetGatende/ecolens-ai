"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/components/LanguageContext"; 
import { reverseGeocode } from "@/lib/geocoding";

type Props = {
  image: File | null;
  latitude: number | null;
  longitude: number | null;
};

// --- CLIENT-SIDE RESIZER UTILITY ---
const resizeImage = (file: File, maxWidth = 1024): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleSize = maxWidth / img.width;
        
        // Only resize if the image is larger than maxWidth
        if (scaleSize < 1) {
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], file.name, { type: file.type });
            resolve(newFile);
          }
        }, file.type, 0.8); // 80% JPEG quality
      };
    };
  });
};

export default function PollutionForm({ image, latitude, longitude }: Props) {
  const router = useRouter();
  const { language } = useLanguage(); 

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationString, setLocationString] = useState("County - Mombasa"); 

  const [errors, setErrors] = useState({
    image: false,
    description: false,
    location: false,
  });

  useEffect(() => {
    async function fetchFormattedLocation() {
      if (latitude !== null && longitude !== null) {
        const data = await reverseGeocode(latitude, longitude);
        
        // --- STRICT KENYAN ADMINISTRATIVE HIERARCHY FORMATTER ---
        
        // Helper to detect invalid/messy data
        const isBad = (str: string | null | undefined) => 
          !str || 
          str.toLowerCase().includes("unknown") || 
          str.toLowerCase().includes("unnamed") || 
          str.toLowerCase().includes("null");

        // 1. Extract raw data and aggressively strip out redundant words
        let rawCounty = (data.county || "Mombasa").replace(/county/gi, "").trim();
        let rawSubCounty = (data.subCounty || "").replace(/(sub-?county|ward)/gi, "").trim();
        let rawWard = (data.ward || "").replace(/(ward|sub-?county)/gi, "").trim();

        // 2. The Mombasa Smart-Swap
        // APIs often flip Ward and Sub-County in Kenya. Let's force correction.
        const mombasaSubCounties = ["likoni", "mvita", "nyali", "kisauni", "jomvu", "changamwe"];
        
        // If the API put a known Sub-County into the 'Ward' slot, swap them!
        if (mombasaSubCounties.includes(rawWard.toLowerCase())) {
            const temp = rawSubCounty;
            rawSubCounty = rawWard;
            rawWard = temp;
        }

        // 3. Fallback Parser (If the API only returned a single string)
        if (isBad(rawSubCounty) || isBad(rawWard)) {
           const stringParts = (data.displayLocation || "")
                .split(",")
                .map((p: string) => p.replace(/(county|sub-county|ward)/ig, '').trim())
                .filter((p: string) => !isBad(p) && p.toLowerCase() !== "kenya" && p.toLowerCase() !== "mombasa");
           
           // Search the string for a known Sub-County
           const subCountyMatch = stringParts.find(p => mombasaSubCounties.includes(p.toLowerCase()));
           if (subCountyMatch) {
               rawSubCounty = subCountyMatch;
               // The Ward is whatever is left over
               rawWard = stringParts.find(p => p !== subCountyMatch) || rawWard;
           }
        }

        // 4. Build the final strict hierarchy
        const formattedParts: string[] = [];
        
        // A. Capitalize and add County
        const cleanCounty = rawCounty.charAt(0).toUpperCase() + rawCounty.slice(1);
        formattedParts.push(`County - ${isBad(rawCounty) ? "Mombasa" : cleanCounty}`);

        // B. Capitalize and add Sub-County
        if (!isBad(rawSubCounty)) {
          const cleanSub = rawSubCounty.charAt(0).toUpperCase() + rawSubCounty.slice(1);
          formattedParts.push(`Sub-County - ${cleanSub}`);
        }

        // C. Capitalize and add Ward (Ensuring it isn't just a duplicate of the Sub-County)
        if (!isBad(rawWard) && rawWard.toLowerCase() !== rawSubCounty.toLowerCase()) {
           const cleanWard = rawWard.charAt(0).toUpperCase() + rawWard.slice(1);
          formattedParts.push(`Ward - ${cleanWard}`);
        }

        setLocationString(formattedParts.join(", "));
      }
    }
    fetchFormattedLocation();
  }, [latitude, longitude]);

  function validate() {
    const newErrors = { image: false, description: false, location: false };
    let valid = true;

    if (!image) { newErrors.image = true; valid = false; }
    if (description.trim().length < 10) { newErrors.description = true; valid = false; }
    if (latitude === null || longitude === null) { newErrors.location = true; valid = false; }

    setErrors(newErrors);
    return valid;
  }

  async function analyze() {
    if (!validate()) return;
    if (!image) return;

    setLoading(true);

    try {
      // Compress the image before uploading
      const compressedImage = await resizeImage(image);

      const formData = new FormData();
      formData.append("image", compressedImage);
      formData.append("description", description);
      formData.append("latitude", latitude!.toString());
      formData.append("longitude", longitude!.toString());
      formData.append("category", category);
      formData.append("severity", severity);
      formData.append("locationString", locationString);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        alert(
          data.error || 
          (language === "en" ? "Gemma failed to analyze the report." : "Gemma imeshindwa kuchanganua ripoti.")
        );
        return;
      }

      // --- INSTANT CACHE REFRESH ---
      router.refresh();
      
      router.push(`/analysis/${data.reportId}`);
    } catch (error) {
      console.error(error);
      alert(language === "en" ? "Something went wrong." : "Kuna kitu kimeenda kombo.");
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    { value: "Smoke", en: "Smoke", sw: "Moshi" },
    { value: "Dust", en: "Dust", sw: "Vumbi" },
    { value: "Garbage Burning", en: "Garbage Burning", sw: "Uchomaji Taka" },
    { value: "Industrial Emissions", en: "Industrial Emissions", sw: "Moshi wa Viwanda" },
    { value: "Water Pollution", en: "Water Pollution", sw: "Uchafuzi wa Maji" },
    { value: "Chemical Spill", en: "Chemical Spill", sw: "Mwagiko wa Kemikali" },
  ];

  const severityLevels = [
    { value: "Low", en: "Low", sw: "Chini" },
    { value: "Medium", en: "Medium", sw: "Kati" },
    { value: "High", en: "High", sw: "Juu" },
  ];

  return (
    <div className="rounded-2xl border bg-white shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {language === "en" ? "Pollution Details" : "Maelezo ya Uchafuzi"}
        </h2>
        <p className="text-gray-500 mt-1">
          {language === "en" 
            ? "Help Gemma understand the environmental incident." 
            : "Saidia Gemma kuelewa tukio hili la kimazingira."}
        </p>
      </div>

      {errors.image && (
        <p className="text-red-600 font-medium">
          📷 {language === "en" ? "Please upload a pollution photo." : "Tafadhali pakia picha ya uchafuzi."}
        </p>
      )}

      {errors.location && (
        <p className="text-red-600 font-medium">
          📍 {language === "en" ? "Unable to detect your current location." : "Imeshindwa kupata eneo lako la sasa."}
        </p>
      )}

      <div>
        <label className="font-semibold">
          {language === "en" ? "Description" : "Maelezo"}
        </label>
        <Textarea
          rows={6}
          placeholder={language === "en" ? "Describe the pollution incident..." : "Eleza tukio la uchafuzi..."}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2"
        />
        <div className="flex justify-between mt-2">
          {errors.description ? (
            <span className="text-red-600 text-sm">
              {language === "en" 
                ? "Please provide a meaningful description (minimum 10 characters)." 
                : "Tafadhali toa maelezo ya kutosha (angalau herufi 10)."}
            </span>
          ) : (
            <span />
          )}
          <span className="text-sm text-gray-500">
            {description.length}/500
          </span>
        </div>
      </div>

      <div>
        <label className="font-semibold">
          {language === "en" ? "Pollution Category" : "Aina ya Uchafuzi"}
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border p-3 mt-2"
        >
          <option value="">
            {language === "en" ? "Let Gemma Detect Automatically" : "Ruhusu Gemma Itambue Moja kwa Moja"}
          </option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {language === "en" ? cat.en : cat.sw}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-semibold">
          {language === "en" ? "Estimated Severity (Optional)" : "Kadirio la Ukali (Sio Lazima)"}
        </label>
        <div className="flex gap-3 mt-3">
          {severityLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setSeverity(level.value)}
              className={`px-5 py-2 rounded-full border transition ${
                severity === level.value
                  ? "bg-emerald-600 text-white"
                  : "hover:bg-emerald-50"
              }`}
            >
              {language === "en" ? level.en : level.sw}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={analyze}
        disabled={loading}
        className="w-full h-14 text-lg"
      >
        {loading
          ? (language === "en" ? "Analyzing with Gemma..." : "Inachanganua na Gemma...")
          : (language === "en" ? "✨ Analyze with Gemma" : "✨ Changanua na Gemma")}
      </Button>
    </div>
  );
}