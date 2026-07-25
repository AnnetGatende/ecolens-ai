"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

type Props = {
  report: {
    id: string;
    imageUrl: string | null;
    pollutionType: string;
    pollutionType_sw?: string | null; // Added this field
    severity: string;
    predictedAQI: number;
    status: string;
    createdAt: Date;
  };
};

export default function ReportCard({ report }: Props) {
  const { language } = useLanguage();

  // Updated to support the new 5-tier AQI severity scale
  const getSeverityColor = (severity: string) => {
    const lower = severity.toLowerCase();
    if (lower === "critical") return "bg-red-900 text-white";
    if (lower === "severe") return "bg-red-200 text-red-800";
    if (lower === "high") return "bg-orange-100 text-orange-700";
    if (lower === "moderate" || lower === "medium") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700"; // Low
  };

  const statusColor =
    report.status === "RESOLVED"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  // --- FIXED: Translations strictly match the Map Legend ---
  const getSeverityTranslation = (severity: string) => {
    if (language === "en") return `${severity} Severity`;
    
    const lower = severity.toLowerCase();
    if (lower === "critical") return "Ukali: Hatari";
    if (lower === "severe") return "Ukali: Vikali";
    if (lower === "high") return "Ukali: Juu";
    if (lower === "moderate" || lower === "medium") return "Ukali: Wastani";
    return "Ukali: Chini"; // Low
  };

  const getStatusTranslation = (status: string) => {
    if (language === "en") return status;
    return status === "RESOLVED" ? "IMETATULIWA" : "INASUBIRI";
  };

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-60 w-full">
        {report.imageUrl ? (
          <Image
            src={report.imageUrl}
            alt={report.pollutionType}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
            {language === "en" ? "No Image" : "Hakuna Picha"}
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getSeverityColor(report.severity)}`}>
            {getSeverityTranslation(report.severity)}
          </span>

          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
            {getStatusTranslation(report.status)}
          </span>
        </div>

        {/* --- FIXED: Toggles title based on language state --- */}
        <h2 className="text-xl font-bold">
          {language === "sw" 
            ? (report.pollutionType_sw || report.pollutionType) 
            : report.pollutionType}
        </h2>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>{language === "en" ? "Predicted AQI" : "Makadirio ya AQI"}</span>
            <span className="font-bold">{report.predictedAQI}</span>
          </div>

          <div className="flex justify-between">
            <span>{language === "en" ? "Reported" : "Imeripotiwa"}</span>
            <span>
              {new Date(report.createdAt).toLocaleDateString(
                language === "en" ? "en-GB" : "sw-KE", 
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </span>
          </div>
        </div>

        <Link
          href={`/analysis/${report.id}`}
          className="block rounded-xl bg-emerald-600 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
        >
          {language === "en" ? "View Full Report →" : "Tazama Ripoti Kamili →"}
        </Link>
      </div>
    </div>
  );
}