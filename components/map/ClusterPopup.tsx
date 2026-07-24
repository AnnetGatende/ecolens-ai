"use client";

import { Popup } from "react-map-gl/maplibre";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Wind,
  AlertTriangle,
  ArrowRight,
  ImageOff,
  Clock,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

type Report = {
  id: string;
  pollutionType: string;
  pollutionType_sw?: string; // Added Swahili field
  severity: string;
  predictedAQI: number;
  imageUrl: string | null;
  createdAt: string;
  displayLocation?: string | null;
};

type Hotspot = {
  displayLocation: string;
  latitude: number;
  longitude: number;
  reports: Report[];
};

type Props = {
  hotspot: Hotspot;
  onClose: () => void;
};

export default function ClusterPopup({ hotspot, onClose }: Props) {
  const { language } = useLanguage();

  if (!hotspot.reports.length) return null;

  // Helper to translate severity if it comes raw from the database
  const getSeverityTranslation = (severity: string) => {
    if (language === "en") return severity;
    const lower = severity.toLowerCase();
    if (lower === "critical") return "Hatari Sana";
    if (lower === "severe") return "Vikali";
    if (lower === "high") return "Juu";
    if (lower === "medium" || lower === "moderate") return "Kati";
    if (lower === "low") return "Chini";
    return severity;
  };

  return (
    <Popup
      longitude={hotspot.longitude}
      latitude={hotspot.latitude}
      anchor="top"
      closeOnClick={false}
      onClose={onClose}
      offset={30}
      maxWidth="420px"
      className="z-50"
    >
      <div className="w-[390px] p-1">
        <div className="mb-4 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-start gap-2">
            <MapPin className="text-blue-600 mt-1 shrink-0" size={22} />
            <span>{hotspot.displayLocation}</span>
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1 ml-8">
            {language === "en" ? "Neighborhood Hotspot" : "Eneo Hatari la Mtaa"} • {hotspot.reports.length} {language === "en" ? "Reports" : "Ripoti"}
          </p>
        </div>

        <div className="max-h-[440px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {hotspot.reports.map((report) => {
            const reportDate = new Date(report.createdAt);
            
            return (
              <div
                key={report.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {report.imageUrl ? (
                  <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={report.imageUrl}
                      alt={report.pollutionType}
                      fill
                      sizes="390px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 border border-slate-100">
                    <ImageOff size={32} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">
                      {language === "en" ? "No Image Available" : "Hakuna Picha"}
                    </span>
                  </div>
                )}

                <h3 className="font-bold text-lg text-gray-800">
                  {/* Now pulling the correct language natively from the database */}
                  {language === "sw" 
                    ? (report.pollutionType_sw || report.pollutionType) 
                    : report.pollutionType}
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-red-50 p-2.5">
                    <AlertTriangle size={18} className="mb-1 text-red-600" />
                    <p className="text-xs text-gray-500 font-medium">
                      {language === "en" ? "Severity" : "Ukali"}
                    </p>
                    <p className="font-bold text-red-900">{getSeverityTranslation(report.severity)}</p>
                  </div>

                  <div className="rounded-xl bg-yellow-50 p-2.5">
                    <Wind size={18} className="mb-1 text-yellow-600" />
                    <p className="text-xs text-gray-500 font-medium">AQI</p>
                    <p className="font-bold text-yellow-900">{report.predictedAQI}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue-500" />
                    {reportDate.toLocaleDateString(language === "en" ? "en-GB" : "sw-KE")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-orange-500" />
                    {reportDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <Link
                  href={`/analysis/${report.id}`}
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 shadow-sm"
                >
                  {language === "en" ? "View AI Report" : "Tazama Ripoti ya AI"}
                  <ArrowRight size={18} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </Popup>
  );
}