"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function HowItWorks() {
  const { language } = useLanguage();

  const steps = [
    {
      title: language === "en" ? "1. Crowdsource Detect" : "1. Ugunduzi wa Pamoja",
      description: language === "en"
        ? "Citizens capture visual evidence of hyper-local events like open waste burning, dust, or smog traps."
        : "Wananchi wanapiga picha za matukio ya mitaani kama uchomaji taka wazi, vumbi, au moshi.",
      icon: "📸",
    },
    {
      title: language === "en" ? "2. AI Risk Inference" : "2. Tathmini ya Hatari ya AI",
      description: language === "en"
        ? "Gemma AI analyzes the image severity and fuses it with environmental data to forecast the 24h AQI impact."
        : "Gemma AI inachanganua ukali wa picha na kuiunganisha na data za kimazingira ili kutabiri athari za AQI kwa saa 24.",
      icon: "🧠",
    },
    {
      title: language === "en" ? "3. Sector Grouping" : "3. Upangaji wa Sekta",
      description: language === "en"
        ? "Individual reports are mapped and clustered into actionable neighborhood containers via reverse-geocoding."
        : "Ripoti za kibinafsi zinachorwa na kuwekwa kwenye makundi ya mitaa kupitia utambuzi wa maeneo.",
      icon: "🗺️",
    },
    {
      title: language === "en" ? "4. Targeted Dispatch" : "4. Usambazaji Maalum",
      description: language === "en"
        ? "Municipal operators expand sectors in the dashboard to deploy specific units directly to the exact coordinates."
        : "Waendeshaji wa manispaa wanapanua sekta kwenye dashibodi na kusambaza vikosi kwenye maeneo kamili.",
      icon: "🚒",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold text-slate-900">
          {language === "en" ? "The Operational Loop" : "Mzunguko wa Uendeshaji"}
        </h2>
        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-slate-100 bg-slate-50 p-6 shadow-sm relative overflow-hidden"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-slate-800">
                {step.title}
              </h3>
              <p className="mt-3 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}