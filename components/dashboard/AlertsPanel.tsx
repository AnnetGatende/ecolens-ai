"use client";

import { AlertTriangle, MapPin, Clock, Siren } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function AlertsPanel() {
  const { language } = useLanguage();

  const alerts = [
    {
      id: 1,
      location: "Likoni Ferry",
      pollution: language === "en" ? "Heavy Smoke" : "Moshi Mzito",
      aqi: 182,
      priority: language === "en" ? "High" : "Juu",
      priorityKey: "High",
      recommendation: language === "en" ? "Dispatch cleanup team immediately." : "Tuma timu ya usafi mara moja.",
      time: language === "en" ? "5 mins ago" : "Dakika 5 zilizopita",
    },
    {
      id: 2,
      location: "Mikindani",
      pollution: language === "en" ? "Illegal Waste Burning" : "Uchomaji Taka Kinyume cha Sheria",
      aqi: 145,
      priority: language === "en" ? "Medium" : "Kati",
      priorityKey: "Medium",
      recommendation: language === "en" ? "Send inspection officers." : "Tuma maafisa wa ukaguzi.",
      time: language === "en" ? "18 mins ago" : "Dakika 18 zilizopita",
    },
    {
      id: 3,
      location: "Nyali",
      pollution: language === "en" ? "Construction Dust" : "Vumbi la Ujenzi",
      aqi: 96,
      priority: language === "en" ? "Low" : "Chini",
      priorityKey: "Low",
      recommendation: language === "en" ? "Monitor situation." : "Fuatilia hali.",
      time: language === "en" ? "45 mins ago" : "Dakika 45 zilizopita",
    },
  ];

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <Siren className="text-red-500" />
        <h2 className="text-3xl font-bold">
          {language === "en" ? "Municipal Alerts" : "Arifa za Manispaa"}
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-3xl border bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                  alert.priorityKey === "High"
                    ? "bg-red-500"
                    : alert.priorityKey === "Medium"
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
              >
                {language === "en" ? `${alert.priority} Priority` : `Kipaumbele: ${alert.priority}`}
              </span>
              <AlertTriangle className="text-red-500" />
            </div>

            <h3 className="mt-5 text-2xl font-bold">{alert.pollution}</h3>

            <div className="mt-4 space-y-3 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                {alert.location}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                {alert.time}
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-red-50 p-4">
              <p className="font-semibold">
                {language === "en" ? "Predicted AQI" : "Makadirio ya AQI"}
              </p>
              <p className="text-4xl font-bold text-red-600">{alert.aqi}</p>
            </div>

            <div className="mt-5 rounded-xl bg-emerald-50 p-4">
              <p className="font-semibold">
                {language === "en" ? "Recommended Action" : "Hatua Inayopendekezwa"}
              </p>
              <p className="text-gray-700">{alert.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}