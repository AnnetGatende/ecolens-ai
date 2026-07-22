"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function AnalysisHero() {
  const { language } = useLanguage();

  return (
    <section className="rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-10 text-white shadow-xl">
      <p className="uppercase tracking-widest text-emerald-100">
        {language === "en" ? "Environmental Intelligence Platform" : "Jukwaa la Ujasusi la Kimazingira"}
      </p>

      <h1 className="mt-3 text-5xl font-black">
        {language === "en" ? "EcoLens AI Analysis Center" : "Kituo cha Uchanganuzi cha EcoLens AI"}
      </h1>

      <p className="mt-6 max-w-3xl text-lg text-emerald-100">
        {language === "en"
          ? "Real-time AI verification of citizen pollution reports, hotspot monitoring, AQI prediction, and municipal response coordination."
          : "Uthibitishaji wa wakati halisi wa AI wa ripoti za uchafuzi za wananchi, ufuatiliaji wa maeneo hatari, utabiri wa AQI, na uratibu wa majibu ya manispaa."}
      </p>
    </section>
  );
}