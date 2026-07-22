"use client";

import { Satellite, MapPinned, BrainCircuit, Truck } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function Features() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Satellite,
      title: language === "en" ? "Multi-Source Data Fusion" : "Muunganiko wa Data Mbalimbali",
      description: language === "en" 
        ? "Combines citizen-uploaded visual evidence with live OpenAQ sensor readings and Sentinel-2 satellite imagery."
        : "Inaunganisha ushahidi wa picha wa wananchi na usomaji wa moja kwa moja wa OpenAQ na picha za satelaiti za Sentinel-2.",
    },
    {
      icon: BrainCircuit,
      title: language === "en" ? "24-Hour AI Forecasting" : "Utabiri wa AI wa Saa 24",
      description: language === "en"
        ? "Utilizes multimodal Gemma AI to analyze threats and predict localized Air Quality Index (AQI) spikes."
        : "Inatumia Gemma AI kuchanganua vitisho na kutabiri ongezeko la Kielezo cha Ubora wa Hewa (AQI) katika maeneo maalum.",
    },
    {
      icon: MapPinned,
      title: language === "en" ? "Actionable Hotspot Mapping" : "Uchoraji wa Maeneo Hatari",
      description: language === "en"
        ? "Automatically groups isolated incident reports into distinct, prioritized neighborhood zones for intervention."
        : "Inapanga ripoti za matukio kibinafsi kiotomatiki kuwa kanda maalum za mitaa ili kurahisisha uingiliaji kati.",
    },
    {
      icon: Truck,
      title: language === "en" ? "Rapid Resource Deployment" : "Usambazaji wa Rasilimali Haraka",
      description: language === "en"
        ? "A complete dispatch dashboard allowing officials to instantly deploy water-mist cannons and cleanup crews."
        : "Dashibodi kamili inawaruhusu maafisa kusambaza magari ya maji na timu za usafi mara moja.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold text-slate-900">
          {language === "en" ? "Enterprise Civic Infrastructure" : "Miundombinu ya Kijamii ya Kiwango cha Juu"}
        </h2>
        
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl bg-white p-8 shadow-sm border border-slate-100 hover:shadow-md transition"
            >
              <feature.icon className="h-10 w-10 text-emerald-600" />
              <h3 className="mt-6 text-xl font-bold text-slate-800">
                {feature.title}
              </h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}