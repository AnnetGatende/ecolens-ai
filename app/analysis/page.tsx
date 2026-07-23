"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export const dynamic = "force-dynamic";

type Report = {
  id: string;
  imageUrl: string | null;
  pollutionType: string;
  severity: string;
  status: string;
  predictedAQI: number;
};

export default function AnalysisDashboard() {
  const { language } = useLanguage();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/reports", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  // --- FRONTEND TRANSLATION DICTIONARY ---
  // This intercepts the English database category and translates it for the UI
  const getTranslatedType = (type: string) => {
    if (language === "en") return type; // Keep English if toggle is EN
    
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes("wildfire smoke") || lowerType.includes("fire")) return "Moshi wa Moto wa Mwitu";
    if (lowerType.includes("air pollution")) return "Uchafuzi wa Hewa";
    if (lowerType.includes("plastic") || lowerType.includes("solid waste")) return "Taka za Plastiki na Ngumu";
    if (lowerType.includes("water")) return "Uchafuzi wa Maji";
    if (lowerType.includes("noise")) return "Uchafuzi wa Kelele";
    if (lowerType.includes("chemical") || lowerType.includes("toxic")) return "Taka za Kemikali";
    
    return type; // Fallback to original if it doesn't match the dictionary
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-emerald-600">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 font-medium">
          {language === "en" ? "Loading Analysis Data..." : "Inapakia Data ya Uchanganuzi..."}
        </span>
      </div>
    );
  }

  const total = reports.length;
  const pending = reports.filter(r => r.status !== "RESOLVED").length;
  const resolved = reports.filter(r => r.status === "RESOLVED").length;
  const critical = reports.filter(r => r.predictedAQI > 150 || r.severity.toLowerCase() === "high").length;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 space-y-12">
      
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{language === "en" ? "Total Reports" : "Jumla ya Ripoti"}</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">{total}</p>
        </div>
        <div className="rounded-2xl border bg-yellow-50 border-yellow-100 p-6 shadow-sm">
          <p className="text-sm font-medium text-yellow-700">{language === "en" ? "Pending Reports" : "Ripoti Zinazosubiri"}</p>
          <p className="mt-2 text-4xl font-bold text-yellow-800">{pending}</p>
        </div>
        <div className="rounded-2xl border bg-emerald-50 border-emerald-100 p-6 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">{language === "en" ? "Resolved Reports" : "Ripoti Zilizotatuliwa"}</p>
          <p className="mt-2 text-4xl font-bold text-emerald-800">{resolved}</p>
        </div>
        <div className="rounded-2xl border bg-red-50 border-red-100 p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">{language === "en" ? "Critical Reports" : "Ripoti Hatari"}</p>
          <p className="mt-2 text-4xl font-bold text-red-800">{critical}</p>
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          {language === "en" ? "Incident Reports" : "Ripoti za Matukio"}
        </h2>
        <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-bold text-emerald-800">
          {language === "en" ? `Total ${total}` : `Jumla ${total}`}
        </span>
      </div>

      {/* Image Cards Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Link key={report.id} href={`/analysis/${report.id}`} className="group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 shrink-0">
              {report.imageUrl ? (
                <img 
                  src={report.imageUrl} 
                  alt={report.pollutionType} 
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">No Image</div>
              )}
            </div>
            
            <div className="flex flex-col flex-grow p-5">
              <div className="flex justify-between items-center mb-3 text-xs font-bold uppercase tracking-wider">
                <span className={report.severity.toLowerCase() === "high" || report.severity.toLowerCase() === "juu" ? "text-red-500" : "text-emerald-500"}>
                  {language === "en" 
                    ? `Severity: ${report.severity}` 
                    : `Ukali: ${report.severity.toLowerCase() === "high" ? "Juu" : report.severity.toLowerCase() === "medium" ? "Kati" : "Chini"}`}
                </span>
                <span className={report.status === "RESOLVED" ? "text-emerald-500 bg-emerald-50 px-2 py-1 rounded" : "text-yellow-600 bg-yellow-50 px-2 py-1 rounded"}>
                  {report.status === "RESOLVED" 
                    ? (language === "en" ? "RESOLVED" : "IMETATULIWA") 
                    : (language === "en" ? "PENDING" : "INASUBIRI")}
                </span>
              </div>
              
              {/* Using the new translation function here! */}
              <h3 className="text-lg font-bold text-slate-800 truncate mb-4">
                {getTranslatedType(report.pollutionType)}
              </h3>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                  {language === "en" ? "View Report" : "Tazama Ripoti"}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
    </main>
  );
}