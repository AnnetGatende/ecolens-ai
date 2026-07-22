"use client";

import { useEffect, useState, useMemo } from "react";
import {
  AlertTriangle,
  MapPin,
  Flame,
  CheckCircle2,
  Loader2
} from "lucide-react";

type Report = {
  id: string;
  predictedAQI: number;
  displayLocation?: string | null;
  latitude: number;
  longitude: number;
  status: string;
};

export default function LiveStats() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from your database API
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

  // Calculate exact metrics
  const calculatedStats = useMemo(() => {
    // 1. Active Incidents: Only reports that are NOT resolved
    const activeIncidents = reports.filter((r) => r.status !== "RESOLVED").length;
    
    // 2. Total Reports Mapped: Every single incident reported in the system
    const totalMapped = reports.length;

    // 3. Critical Spikes: Unresolved reports with dangerous AQI
    const criticalSpikes = reports.filter(
      (r) => r.predictedAQI > 150 && r.status !== "RESOLVED"
    ).length;

    // 4. Resources Deployed: Reports that have been marked as resolved
    const resourcesDeployed = reports.filter((r) => r.status === "RESOLVED").length;

    return { activeIncidents, totalMapped, criticalSpikes, resourcesDeployed };
  }, [reports]);

  const stats = [
    {
      title: "Active Incidents",
      value: calculatedStats.activeIncidents,
      subtitle: "Pending verification",
      icon: AlertTriangle,
      color: "text-orange-500",
    },
    {
      title: "Total Reports Mapped",
      value: calculatedStats.totalMapped,
      subtitle: "Reflecting on live map",
      icon: MapPin,
      color: "text-blue-500",
    },
    {
      title: "Critical 24h Spikes",
      value: calculatedStats.criticalSpikes,
      subtitle: "Forecasted AQI > 150",
      icon: Flame,
      color: "text-red-500",
    },
    {
      title: "Resources Deployed",
      value: calculatedStats.resourcesDeployed,
      subtitle: "Crews currently active",
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-slate-900">
            Live Network Intelligence
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Real-time environmental monitoring across the municipality, powered by citizen crowdsourcing and Google AI.
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