"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function MapLegend() {
  const { language } = useLanguage();

  return (
    <div className="absolute left-5 bottom-8 z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-5 w-64 border border-gray-100">
      <h3 className="font-bold text-lg mb-4 text-gray-800">
        {language === "en" ? "Pollution Levels" : "Viwango vya Uchafuzi"}
      </h3>
      
      <div className="space-y-3 text-sm text-gray-600 font-medium">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm" />
          <span>{language === "en" ? "Low (AQI 0–50)" : "Chini (AQI 0-50)"}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-sm" />
          <span>{language === "en" ? "Moderate (51–100)" : "Wastani (51-100)"}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm" />
          <span>{language === "en" ? "High (101–150)" : "Juu (101-150)"}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-600 shadow-sm" />
          <span>{language === "en" ? "Severe (151–200)" : "Vikali (151-200)"}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-900 shadow-sm" />
          <span>{language === "en" ? "Critical (201+)" : "Hatari (201+)"}</span>
        </div>
      </div>
    </div>
  );
}