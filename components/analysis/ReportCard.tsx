"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  report: {
    id: string;
    imageUrl: string | null;
    pollutionType: string;
    severity: string;
    predictedAQI: number;
    status: string;
    createdAt: Date;
  };
};

export default function ReportCard({ report }: Props) {
  const severityColor =
    report.severity === "High"
      ? "bg-red-100 text-red-700"
      : report.severity === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  const statusColor =
    report.status === "RESOLVED"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="relative h-60 w-full">

        {report.imageUrl ? (
         <Image
         src={report.imageUrl}
         alt={report.pollutionType}
         fill
         sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 50vw,
         33vw"
         loading="eager"
         className="object-cover"
       />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
            No Image
          </div>
        )}

      </div>

      <div className="space-y-4 p-5">

        <div className="flex items-center justify-between">

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${severityColor}`}
          >
            {report.severity} Severity
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}
          >
            {report.status}
          </span>

        </div>

        <h2 className="text-xl font-bold">
          {report.pollutionType}
        </h2>

        <div className="space-y-2 text-sm text-gray-600">

          <div className="flex justify-between">
            <span>Predicted AQI</span>

            <span className="font-bold">
              {report.predictedAQI}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Reported</span>

            <span>
            {new Date(report.createdAt).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
            </span>
          </div>

        </div>

        <Link
          href={`/analysis/${report.id}`}
          className="block rounded-xl bg-emerald-600 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
        >
          View Full Report →
        </Link>

      </div>

    </div>
  );
}