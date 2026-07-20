"use client";

import { AlertTriangle, MapPin, Clock, Siren } from "lucide-react";

const alerts = [
  {
    id: 1,
    location: "Likoni Ferry",
    pollution: "Heavy Smoke",
    aqi: 182,
    priority: "High",
    recommendation: "Dispatch cleanup team immediately.",
    time: "5 mins ago",
  },
  {
    id: 2,
    location: "Mikindani",
    pollution: "Illegal Waste Burning",
    aqi: 145,
    priority: "Medium",
    recommendation: "Send inspection officers.",
    time: "18 mins ago",
  },
  {
    id: 3,
    location: "Nyali",
    pollution: "Construction Dust",
    aqi: 96,
    priority: "Low",
    recommendation: "Monitor situation.",
    time: "45 mins ago",
  },
];

export default function AlertsPanel() {
  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <Siren className="text-red-500" />
        <h2 className="text-3xl font-bold">
          Municipal Alerts
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
                  alert.priority === "High"
                    ? "bg-red-500"
                    : alert.priority === "Medium"
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
              >
                {alert.priority} Priority
              </span>

              <AlertTriangle className="text-red-500" />
            </div>

            <h3 className="mt-5 text-2xl font-bold">
              {alert.pollution}
            </h3>

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
                Predicted AQI
              </p>

              <p className="text-4xl font-bold text-red-600">
                {alert.aqi}
              </p>

            </div>

            <div className="mt-5 rounded-xl bg-emerald-50 p-4">

              <p className="font-semibold">
                Recommended Action
              </p>

              <p className="text-gray-700">
                {alert.recommendation}
              </p>

            </div>

          </div>
        ))}
      </div>
    </section>
  );
}