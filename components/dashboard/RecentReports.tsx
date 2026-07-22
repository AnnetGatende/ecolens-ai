"use client";

import { Camera, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function RecentReports() {
  const { language } = useLanguage();

  const reports = [
    {
      id: 1,
      image: "🔥",
      type: language === "en" ? "Open Waste Burning" : "Uchomaji Taka Wazi",
      location: "Likoni Ferry",
      time: language === "en" ? "5 mins ago" : "Dakika 5 zilizopita",
      status: language === "en" ? "Verified by Gemma AI" : "Imethibitishwa na Gemma AI",
      severity: language === "en" ? "Critical" : "Hatari Sana",
      severityKey: "Critical",
    },
    {
      id: 2,
      image: "🏭",
      type: language === "en" ? "Industrial Smoke" : "Moshi wa Viwanda",
      location: "Changamwe",
      time: language === "en" ? "20 mins ago" : "Dakika 20 zilizopita",
      status: language === "en" ? "Analysis Complete" : "Uchanganuzi Umekamilika",
      severity: language === "en" ? "High" : "Juu",
      severityKey: "High",
    },
    {
      id: 3,
      image: "🚛",
      type: language === "en" ? "Dust Pollution" : "Uchafuzi wa Vumbi",
      location: "Nyali",
      time: language === "en" ? "40 mins ago" : "Dakika 40 zilizopita",
      status: language === "en" ? "Municipality Notified" : "Manispaa Imejulishwa",
      severity: language === "en" ? "Medium" : "Kati",
      severityKey: "Medium",
    },
  ];

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <Camera className="text-emerald-600" />
        <h2 className="text-3xl font-bold">
          {language === "en" ? "Recent Citizen Reports" : "Ripoti za Hivi Punde za Wananchi"}
        </h2>
      </div>

      <div className="space-y-5">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-3xl border bg-white p-6 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-6">
              <div className="flex gap-5">
                <div className="text-6xl">{report.image}</div>
                <div>
                  <h3 className="text-2xl font-bold">{report.type}</h3>
                  <div className="flex items-center gap-2 mt-2 text-gray-500">
                    <MapPin size={18} />
                    {report.location}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-gray-500">
                    <Clock size={18} />
                    {report.time}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <span
                  className={`rounded-full px-4 py-2 text-white text-sm font-semibold ${
                    report.severityKey === "Critical"
                      ? "bg-red-600"
                      : report.severityKey === "High"
                      ? "bg-orange-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {report.severity}
                </span>

                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <CheckCircle2 size={18} />
                  {report.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}