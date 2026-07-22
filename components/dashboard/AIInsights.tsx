"use client";

import {
  BrainCircuit,
  ShieldAlert,
  Wind,
  Trees,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function AIInsights() {
  const { language } = useLanguage();

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit className="text-emerald-600" size={30} />
        <h2 className="text-3xl font-bold">
          {language === "en" ? "Gemma AI Environmental Analysis" : "Uchanganuzi wa Kimazingira wa Gemma AI"}
        </h2>
      </div>

      <div className="rounded-3xl border bg-gradient-to-br from-emerald-50 to-cyan-50 p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-yellow-500" />
          <p className="font-semibold text-lg">
            {language === "en" ? "Latest AI Assessment" : "Tathmini ya Hivi Punde ya AI"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="flex items-center gap-2 mb-3">
              <Wind className="text-red-500" />
              <h3 className="font-bold">
                {language === "en" ? "Pollution Type" : "Aina ya Uchafuzi"}
              </h3>
            </div>
            <p className="text-2xl font-bold">
              {language === "en" ? "Open Waste Burning" : "Uchomaji Taka Wazi"}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="text-orange-500" />
              <h3 className="font-bold">
                {language === "en" ? "Health Risk" : "Hatari ya Kiafya"}
              </h3>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {language === "en" ? "HIGH" : "JUU"}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <h3 className="font-bold mb-3">
              {language === "en" ? "AI Confidence" : "Uhakika wa AI"}
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-emerald-500 h-4 rounded-full"
                style={{ width: "96%" }}
              />
            </div>
            <p className="mt-3 font-bold">96%</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="flex items-center gap-2 mb-3">
              <Trees className="text-green-600" />
              <h3 className="font-bold">
                {language === "en" ? "Recommended Action" : "Hatua Inayopendekezwa"}
              </h3>
            </div>
            <p>
              {language === "en" 
                ? "Dispatch environmental officers, extinguish the burning waste, inspect nearby residences and monitor air quality for the next 24 hours." 
                : "Tuma maafisa wa mazingira, zima taka zinazowaka, kagua makazi ya karibu na ufuatilie hali ya hewa kwa saa 24 zijazo."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}