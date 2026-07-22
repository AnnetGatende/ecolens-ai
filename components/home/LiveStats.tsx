"use client";

import { useEffect, useState, useMemo } from "react";
import { AlertTriangle, MapPin, Flame, CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

type Report = {
  id: string;
  predictedAQI: number;
  displayLocation?: string | null;
  latitude: number;
  longitude: number;
  status: string;
};

export default function LiveStats() {
  const { language } = useLanguage();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/map");
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error("Failed to load live stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const calculatedStats = useMemo(() => {
    const activeIncidents = reports.filter((r) => r.status !== "RESOLVED").length;
    const totalMapped = reports.length;
    const criticalSpikes = reports.filter((r) => r.predictedAQI > 150 && r.status !== "RESOLVED").length;
    const resourcesDeployed = reports.filter((r) => r.status === "RESOLVED").length;

    return { activeIncidents, totalMapped, criticalSpikes, resourcesDeployed };
  }, [reports]);

  const stats = [
    {
      title: language === "en" ? "Active Incidents" : "Matukio Yanayoendelea",
      value: calculatedStats.activeIncidents,
      subtitle: language === "en" ? "Pending verification" : "Inasubiri uthibitisho",
      icon: AlertTriangle,
      color: "text-orange-500",
    },
    {
      title: language === "en" ? "Total Reports Mapped" : "Jumla ya Ripoti Kwenye Ramani",
      value: calculatedStats.totalMapped,
      subtitle: language === "en" ? "Reflecting on live map" : "Inaonekana kwenye ramani ya moja kwa moja",
      icon: MapPin,
      color: "text-blue-500",
    },
    {
      title: language === "en" ? "Critical 24h Spikes" : "Ongezeko Hatari (Saa 24)",
      value: calculatedStats.criticalSpikes,
      subtitle: language === "en" ? "Forecasted AQI > 150" : "Makadirio ya AQI > 150",
      icon: Flame,
      color: "text-red-500",
    },
    {
      title: language === "en" ? "Resources Deployed" : "Rasilimali Zilizosambazwa",
      value: calculatedStats.resourcesDeployed,
      subtitle: language === "en" ? "Crews currently active" : "Timu zinafanya kazi sasa",
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-slate-900">
            {language === "en" ? "Live Network Intelligence" : "Ujasusi wa Mtandao wa Moja kwa Moja"}
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            {language === "en"
              ? "Real-time environmental monitoring across the municipality, powered by citizen crowdsourcing and Google AI."
              : "Ufuatiliaji wa mazingira wa wakati halisi katika manispaa nzima, unaoendeshwa na wananchi na Google AI."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md transition relative"
            >
              <item.icon className={`w-10 h-10 ${item.color}`} />
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-500">
                {item.title}
              </h3>
              
              <div className="mt-2 flex items-center h-12">
                {loading ? (
                  <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
                ) : (
                  <p className="text-5xl font-black text-slate-800">
                    {item.value}
                  </p>
                )}
              </div>
              
              <p className="text-sm font-medium text-slate-400 mt-2">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}