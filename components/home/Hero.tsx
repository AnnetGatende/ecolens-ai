"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageContext";

export default function Hero() {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          🌿 {language === "en" ? "CleanAir & Clear Streets Solution" : "Suluhisho la Hewa Safi na Mitaa Safi"}
        </span>

        <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
          {language === "en" ? (
            <>Hyper-Local Detection.<br />Municipal Dispatch.</>
          ) : (
            <>Ugunduzi wa Kiwango cha Mtaa.<br />Usambazaji wa Manispaa.</>
          )}
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-slate-600">
          {language === "en" 
            ? "EcoLens AI empowers cities to spot hidden environmental hazards, fuse citizen evidence with satellite data, predict 24-hour AQI spikes, and deploy resources exactly where they are needed."
            : "EcoLens AI inawezesha majiji kugundua hatari zilizojificha za kimazingira, kuunganisha ushahidi wa wananchi na data za satelaiti, kutabiri ongezeko la AQI la saa 24, na kusambaza rasilimali haswa zinapohitajika."}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <Link href="/dashboard">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              {language === "en" ? "Launch Command Center" : "Fungua Kituo cha Amri"}
            </Button>
          </Link>

          <Link href="/report">
            <Button variant="outline" size="lg" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
              {language === "en" ? "Report an Incident" : "Ripoti Tukio"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}