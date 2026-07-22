"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function Stats() {
  const { language } = useLanguage();

  const stats = [
    { label: language === "en" ? "Data Sources Fused" : "Vyanzo vya Data Vilivyounganishwa", value: "3" },
    { label: language === "en" ? "AI Forecast Accuracy" : "Usahihi wa Utabiri wa AI", value: "94%" },
    { label: language === "en" ? "Dispatch Response Time" : "Muda wa Kujibu Matukio", value: "-40%" },
    { label: language === "en" ? "Neighborhoods Mapped" : "Mitaa Iliyochorwa Kwenye Ramani", value: "100%" },
  ];

  return (
    <section className="pt-24 pb-8 bg-slate-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-3xl border border-slate-800 bg-slate-800/40 p-8 text-center backdrop-blur-md transition-all duration-300 hover:border-emerald-500/30 hover:bg-slate-800/80"
            >
              <div className="text-5xl font-black tracking-tight bg-gradient-to-br from-emerald-400 to-teal-300 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105">
                {stat.value}
              </div>
              
              <div className="mt-4 text-xs font-bold tracking-widest text-slate-400 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}