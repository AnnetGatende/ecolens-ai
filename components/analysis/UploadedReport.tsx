"use client";

import Image from "next/image";
import { CalendarDays, MapPin, Camera, BadgeCheck } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

type Props = {
  report: {
    imageUrl: string | null;
    description: string;
    latitude: number;
    longitude: number;
    
    // Location fields
    displayLocation?: string | null;
    area?: string | null;
    ward?: string | null;
    subCounty?: string | null;
    county?: string | null;

    status: string;
    createdAt: string;
  };
};

export default function UploadedReport({ report }: Props) {
  const { language } = useLanguage();

  const statusColor =
    report.status === "RESOLVED"
      ? "bg-green-100 text-green-700"
      : report.status === "PENDING"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700";

  const getStatusTranslation = (status: string) => {
    if (language === "en") return status;
    return status === "RESOLVED" ? "IMETATULIWA" : "INASUBIRI";
  };

  return (
    <section className="overflow-hidden rounded-3xl border bg-white shadow-lg">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {language === "en" ? "Uploaded Pollution Report" : "Ripoti ya Uchafuzi Iliyopakiwa"}
            </h1>
            <p className="mt-2 text-emerald-100">
              {language === "en" 
                ? "Original evidence submitted by the community." 
                : "Ushahidi asili uliowasilishwa na jamii."}
            </p>
          </div>
          <span
            className={`rounded-full px-5 py-2 text-sm font-semibold ${statusColor} bg-white`}
          >
            {getStatusTranslation(report.status)}
          </span>
        </div>
      </div>

      <div className="grid gap-10 p-8 lg:grid-cols-2">
        {/* Image */}
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-gray-100 shadow">
            {report.imageUrl ? (
              <Image
                src={report.imageUrl}
                alt="Pollution Report"
                fill
                priority
                sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 40vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Camera className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                  <p className="text-gray-500">
                    {language === "en" ? "No uploaded image" : "Hakuna picha iliyopakiwa"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-gray-50 p-6">
            <h2 className="mb-3 text-lg font-semibold">
              {language === "en" ? "Incident Description" : "Maelezo ya Tukio"}
            </h2>
            <p className="leading-8 text-gray-700">
              {report.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border p-5 flex flex-col justify-center">
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold">
                  {language === "en" ? "Location" : "Eneo"}
                </span>
              </div>
              
              {report.displayLocation ? (
                <p className="text-gray-700 font-medium">
                  {report.displayLocation}
                </p>
              ) : (
                <div className="text-sm text-gray-500 space-y-1 mt-1">
                  <p>Lat: {report.latitude.toFixed(6)}</p>
                  <p>Lng: {report.longitude.toFixed(6)}</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border p-5 flex flex-col justify-center">
              <div className="mb-2 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">
                  {language === "en" ? "Reported" : "Imeripotiwa"}
                </span>
              </div>
              <p className="text-gray-700 font-medium">
                {new Date(report.createdAt).toLocaleDateString(
                  language === "en" ? "en-GB" : "sw-KE", 
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(report.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-700">
                  {language === "en" ? "Submission Status" : "Hali ya Uwasilishaji"}
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-900">
                  {getStatusTranslation(report.status)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}