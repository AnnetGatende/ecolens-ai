"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function AnalysisMetrics() {
  const { language } = useLanguage();

  const metrics = [
    {
      label: language === "en" ? "Confidence" : "Uhakika",
      value: "97%",
      color: "bg-emerald-500",
    },
    {
      label: language === "en" ? "Predicted AQI" : "Makadirio ya AQI",
      value: "184",
      color: "bg-red-500",
    },
    {
      label: language === "en" ? "Risk Level" : "Kiwango cha Hatari",
      value: language === "en" ? "Critical" : "Hatari Sana",
      color: "bg-orange-500",
    },
    {
      label: language === "en" ? "Pollution Type" : "Aina ya Uchafuzi",
      value: language === "en" ? "Smoke" : "Moshi",
      color: "bg-sky-500",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-3xl border bg-white p-6 shadow-sm"
        >
          <p className="text-gray-500">{metric.label}</p>
          <div
            className={`${metric.color} text-white rounded-xl mt-4 p-4 text-center`}
          >
            <h2 className="text-3xl font-bold">{metric.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}