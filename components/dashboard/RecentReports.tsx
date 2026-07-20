"use client";

import { Camera, MapPin, Clock, CheckCircle2 } from "lucide-react";

const reports = [
  {
    id: 1,
    image: "🔥",
    type: "Open Waste Burning",
    location: "Likoni Ferry",
    time: "5 mins ago",
    status: "Verified by Gemma AI",
    severity: "Critical",
  },
  {
    id: 2,
    image: "🏭",
    type: "Industrial Smoke",
    location: "Changamwe",
    time: "20 mins ago",
    status: "Analysis Complete",
    severity: "High",
  },
  {
    id: 3,
    image: "🚛",
    type: "Dust Pollution",
    location: "Nyali",
    time: "40 mins ago",
    status: "Municipality Notified",
    severity: "Medium",
  },
];

export default function RecentReports() {
  return (
    <section className="mt-10">

      <div className="flex items-center gap-3 mb-6">
        <Camera className="text-emerald-600" />
        <h2 className="text-3xl font-bold">
          Recent Citizen Reports
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

                <div className="text-6xl">
                  {report.image}
                </div>

                <div>

                  <h3 className="text-2xl font-bold">
                    {report.type}
                  </h3>

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

                <span className={`rounded-full px-4 py-2 text-white text-sm font-semibold ${
                  report.severity === "Critical"
                    ? "bg-red-600"
                    : report.severity === "High"
                    ? "bg-orange-500"
                    : "bg-yellow-500"
                }`}>
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