"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { reverseGeocode } from "@/lib/geocode";
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
  const [displayLocation, setDisplayLocation] = useState<string>("");

  useEffect(() => {
    async function fetchLocation() {
      if (latitude !== null && longitude !== null) {
        const data = await reverseGeocode(latitude, longitude);
        setDisplayLocation(data.displayLocation);
      }
    }
    fetchLocation();
  }, [latitude, longitude]);

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
          {/* Renders the beautifully formatted string */}
          {displayLocation ? (
            <div className="bg-gray-50 p-3 rounded-lg text-gray-700 font-medium">
              {displayLocation}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              {language === "en" ? "Formatting address..." : "Inapanga anwani..."}
            </p>
          )}
          
          {/* Keep the raw coordinates visible but subtle */}
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