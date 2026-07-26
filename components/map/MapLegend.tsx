"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function MapLegend() {
  const { language } = useLanguage();

  return (
    <div className="absolute bottom-0 left-0 w-full sm:bottom-8 sm:left-5 sm:w-64 z-10 bg-white/95 backdrop-blur-sm sm:rounded-2xl rounded-b-3xl shadow-xl p-5 border-t sm:border border-gray-100">
      <h3 className="font-bold text-lg mb-4 text-gray-800">
        {language === "en" ? "Pollution Levels" : "Viwango vya Uchafuzi"}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 text-sm text-gray-600 font-medium">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm shrink-0" />
          <span>{language === "en" ? "Low (AQI 0–50)" : "Chini (AQI 0-50)"}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-sm shrink-0" />
          <span>{language === "en" ? "Moderate (51–100)" : "Wastani (51-100)"}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm shrink-0" />
          <span>{language === "en" ? "High (101–150)" : "Juu (101-150)"}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-600 shadow-sm shrink-0" />
          <span>{language === "en" ? "Severe (151–200)" : "Vikali (151-200)"}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-900 shadow-sm shrink-0" />
          <span>{language === "en" ? "Critical (201+)" : "Hatari (201+)"}</span>
        </div>
      </div>
    </div>
  );
}