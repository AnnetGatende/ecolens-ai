"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { reverseGeocode } from "@/lib/geocoding";
import { useLanguage } from "@/components/LanguageContext";

type Props = {
  latitude: number | null;
  longitude: number | null;
  error?: string;
};

export default function LocationCard({
  latitude,
  longitude,
  error,
}: Props) {
  const { language } = useLanguage();
  // We store exactly what the API gives us, even if it is messy
  const [rawLocation, setRawLocation] = useState<string>("");

  useEffect(() => {
    async function fetchLocation() {
      if (latitude !== null && longitude !== null) {
        const data = await reverseGeocode(latitude, longitude);
        setRawLocation(data.displayLocation || "");
      }
    }
    fetchLocation();
  }, [latitude, longitude]);

  // --- THE INSTANT RENDER FORMATTER ---
  // This function is immune to Next.js cache. It intercepts the messy string 
  // (e.g. "Sub-County - Timbwani ward, Ward - Likoni") and forces it into the correct hierarchy.
  const formatLocation = (rawStr: string) => {
    if (!rawStr) return "";
    
    // The master list of true Mombasa Sub-Counties
    const subCounties = ["likoni", "mvita", "nyali", "kisauni", "jomvu", "changamwe"];
    let actualSubCounty = "";
    let actualWard = "";
    
    // Break the messy string into pieces based on commas
    const parts = rawStr.split(",");
    
    parts.forEach(part => {
        // Strip away all hardcoded labels, hyphens, and the stray word 'ward'
        let clean = part.replace(/(county|sub-county|ward|-)/ig, "").trim();
        let lower = clean.toLowerCase();
        
        // Allocate the clean names to their proper variables
        if (subCounties.includes(lower)) {
            actualSubCounty = clean;
        } else if (lower !== "mombasa" && lower !== "kenya" && clean.length > 0) {
            actualWard = clean;
        }
    });
    
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    
    // Reconstruct the string with a strict, professional hierarchy
    let result = "County - Mombasa";
    if (actualSubCounty) {
        result += `, Sub-County - ${capitalize(actualSubCounty)}`;
    }
    if (actualWard && actualWard.toLowerCase() !== actualSubCounty.toLowerCase()) {
        result += `, Ward - ${capitalize(actualWard)}`;
    }
    
    return result;
  };

  return (
    <div className="rounded-2xl border bg-white shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-red-500" />
          <h2 className="text-xl font-bold">
            {language === "en" ? "GPS Location" : "Eneo la GPS"}
          </h2>
        </div>
      </div>

      {latitude && longitude ? (
        <div className="space-y-3">
          {rawLocation ? (
            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-900 font-semibold border border-emerald-100">
              {/* We apply the formatter right here in the JSX! */}
              {formatLocation(rawLocation)}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              {language === "en" ? "Formatting address..." : "Inapanga anwani..."}
            </p>
          )}
          
          <div className="flex gap-4 text-sm text-gray-500">
            <p><strong>Lat:</strong> {latitude.toFixed(6)}</p>
            <p><strong>Lon:</strong> {longitude.toFixed(6)}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 bg-gray-50 p-3 rounded-lg">
          {language === "en" ? "Detecting location..." : "Inatafuta eneo..."}
        </p>
      )}

      {error && (
        <p className="mt-3 text-red-600 text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
}