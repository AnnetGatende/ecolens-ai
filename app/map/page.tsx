"use client";

import MapClient from "@/components/map/MapClient";
import { useLanguage } from "@/components/LanguageContext";

export default function MapPage() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-5xl font-bold mb-4">
          {language === "en" ? "Pollution Map" : "Ramani ya Uchafuzi"}
        </h1>

        <p className="text-gray-600 mb-8">
          {language === "en" 
            ? "Interactive visualization of citizen pollution reports across Mombasa." 
            : "Taswira shirikishi ya ripoti za wananchi za uchafuzi kote Mombasa."}
        </p>

        <MapClient />
      </section>
    </main>
  );
}