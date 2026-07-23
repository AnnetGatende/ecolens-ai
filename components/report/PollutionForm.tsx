"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/components/LanguageContext"; 

type Props = {
  image: File | null;
  latitude: number | null;
  longitude: number | null;
};

export default function PollutionForm({
  image,
  latitude,
  longitude,
}: Props) {
  const router = useRouter();
  const { language } = useLanguage(); 

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    image: false,
    description: false,
    location: false,
  });

  function validate() {
    const newErrors = {
      image: false,
      description: false,
      location: false,
    };

    let valid = true;

    if (!image) {
      newErrors.image = true;
      valid = false;
    }

    if (description.trim().length < 10) {
      newErrors.description = true;
      valid = false;
    }

    if (latitude === null || longitude === null) {
      newErrors.location = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function analyze() {
    if (!validate()) return;
    if (!image) return;

    // --- NEW: Vercel 4MB File Size Limit Check ---
    const fileSizeInMB = image.size / (1024 * 1024);
    if (fileSizeInMB > 4) {
      alert(
        language === "en" 
          ? "Sorry, the image is too large! Please upload a photo under 4MB." 
          : "Samahani, picha ni kubwa mno! Tafadhali pakia picha chini ya 4MB."
      );
      return; // Stops the execution right here so Vercel doesn't crash
    }
    // ---------------------------------------------

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("description", description);
      formData.append("latitude", latitude!.toString());
      formData.append("longitude", longitude!.toString());
      formData.append("category", category);
      formData.append("severity", severity);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Analyze Response:", data);

      if (!data.success) {
        alert(
          data.error || 
          (language === "en" ? "Gemma failed to analyze the report." : "Gemma imeshindwa kuchanganua ripoti.")
        );
        return;
      }

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