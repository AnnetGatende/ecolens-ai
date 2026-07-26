"use client";

import { Rnd } from "react-rnd";
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
  X,
  GripHorizontal,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

type Report = {
  id: string;
  pollutionType: string;
  pollutionType_sw?: string;
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

  const getSeverityTranslation = (severity: string) => {
    if (language === "en") return severity;
    const lower = severity.toLowerCase();
    if (lower === "critical") return "Hatari";
    if (lower === "severe") return "Vikali";
    if (lower === "high") return "Juu";
    if (lower === "moderate" || lower === "medium") return "Wastani";
    if (lower === "low") return "Chini";
    return severity;
  };

  const getPollutionTitle = (report: Report) => {
    if (language === "sw") {
      return report.pollutionType_sw || report.pollutionType;
    }
    return report.pollutionType;
  };

  return (
    <Rnd
      default={{
        x: 10, 
        y: 80,
        width: 350, // slightly narrower default for better mobile fit
        height: "auto",
      }}
      minWidth={320}
      maxWidth={480}
      bounds="parent"
      dragHandleClassName="drag-handle" 
      enableUserSelectHack={false} 
      className="z-50 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200 overflow-hidden"
    >
      <div className="w-full p-4">
        {/* FIXED: The close button is now isolated from the drag-handle */}
        <div className="mb-4 border-b pb-3 flex items-start justify-between">
          
          <div className="drag-handle flex-1 pr-2 cursor-grab active:cursor-grabbing select-none">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-1">
              <GripHorizontal size={16} className="text-gray-400 shrink-0" />
              <span>{language === "en" ? "Drag to Move" : "Sogeza Hapa"}</span>
            </div>
            
            <h2 className="text-lg font-bold text-gray-900 flex items-start gap-2 leading-snug">
              <MapPin className="text-blue-600 mt-0.5 shrink-0" size={20} />
              <span>{hotspot.displayLocation}</span>
            </h2>
            
            <p className="text-xs text-gray-500 font-medium mt-1 ml-7">
              {language === "en" ? "Neighborhood Hotspot" : "Eneo Hatari la Mtaa"} • {hotspot.reports.length} {language === "en" ? "Reports" : "Ripoti"}
            </p>
          </div>

          <button
            onClick={onClose}
            onTouchStart={(e) => e.stopPropagation()} // Prevents the drag library from stealing the tap
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-800 transition-colors z-50 relative"
            title={language === "en" ? "Close" : "Funga"}
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1 custom-scrollbar">
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
                  {getPollutionTitle(report)}
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
    </Rnd>
  );
}