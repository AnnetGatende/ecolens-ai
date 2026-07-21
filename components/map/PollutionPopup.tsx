"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Wind,
  MapPin,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

type Props = {
  report: {
    id: string;
    pollutionType: string;
    severity: string;
    predictedAQI: number;
    imageUrl: string | null;
    createdAt: string;
    latitude: number;
    longitude: number;
  };
};

export default function PollutionPopup({ report }: Props) {
  return (
    <div className="w-[320px] overflow-hidden rounded-xl">

      {report.imageUrl && (
        <div className="relative h-40 w-full">
          <Image
            src={report.imageUrl}
            alt={report.pollutionType}
            fill
            loading="eager"
            sizes="320px"
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <div className="mt-4 space-y-4">

        <div>
          <h2 className="text-lg font-bold">
            {report.pollutionType}
          </h2>

          <p className="text-sm text-gray-500">
            AI Detected Pollution
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">

          <div className="rounded-xl bg-red-50 p-3">
            <AlertTriangle
              className="mb-1 text-red-600"
              size={18}
            />

            <p className="text-xs text-gray-500">
              Severity
            </p>

            <p className="font-bold">
              {report.severity}
            </p>
          </div>

          <div className="rounded-xl bg-yellow-50 p-3">
            <Wind
              className="mb-1 text-yellow-600"
              size={18}
            />

            <p className="text-xs text-gray-500">
              AQI
            </p>

            <p className="font-bold">
              {report.predictedAQI}
            </p>
          </div>

        </div>

        <div className="flex items-start gap-2 text-sm">

          <MapPin
            size={16}
            className="mt-0.5 text-emerald-600"
          />

          <span>
            {report.latitude.toFixed(5)},{" "}
            {report.longitude.toFixed(5)}
          </span>

        </div>

        <div className="flex items-start gap-2 text-sm">

          <CalendarDays
            size={16}
            className="mt-0.5 text-blue-600"
          />

          <span>
            {new Date(report.createdAt).toLocaleString()}
          </span>

        </div>

        <Link
          href={`/analysis/${report.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          View Full AI Report
          <ArrowRight size={18} />
        </Link>

      </div>
    </div>
  );
}