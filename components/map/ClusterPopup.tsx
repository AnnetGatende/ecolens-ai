"use client";

import { Popup } from "react-map-gl/maplibre";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Wind,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

type Report = {
  id: string;
  pollutionType: string;
  severity: string;
  predictedAQI: number;
  imageUrl: string | null;
  createdAt: string;
  latitude: number;
  longitude: number;
};

type Props = {
  reports: Report[];
  onClose: () => void;
};

export default function ClusterPopup({
  reports,
  onClose,
}: Props) {
  if (!reports.length) return null;

  const first = reports[0];

  return (
    <Popup
      longitude={first.longitude}
      latitude={first.latitude}
      anchor="top"
      closeOnClick={false}
      onClose={onClose}
      offset={25}
      maxWidth="420px"
    >
      <div className="w-[390px]">

        <div className="mb-4 border-b pb-3">
          <h2 className="text-xl font-bold">
            Pollution Hotspot
          </h2>

          <p className="text-sm text-gray-500">
            {reports.length} reports detected in this location
          </p>
        </div>

        <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">

          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md"
            >

              {report.imageUrl && (
                <div className="relative mb-3 h-36 w-full overflow-hidden rounded-xl">
                  <Image
                    src={report.imageUrl}
                    alt={report.pollutionType}
                    fill
                    sizes="390px"
                    className="object-cover"
                  />
                </div>
              )}

              <h3 className="font-bold">
                {report.pollutionType}
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-2">

                <div className="rounded-lg bg-red-50 p-2">
                  <AlertTriangle
                    size={16}
                    className="mb-1 text-red-600"
                  />

                  <p className="text-xs text-gray-500">
                    Severity
                  </p>

                  <p className="font-semibold">
                    {report.severity}
                  </p>
                </div>

                <div className="rounded-lg bg-yellow-50 p-2">
                  <Wind
                    size={16}
                    className="mb-1 text-yellow-600"
                  />

                  <p className="text-xs text-gray-500">
                    AQI
                  </p>

                  <p className="font-semibold">
                    {report.predictedAQI}
                  </p>
                </div>

              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={15} />

                {report.latitude.toFixed(5)},
                {" "}
                {report.longitude.toFixed(5)}
              </div>

              <div className="mt-2 text-sm text-gray-500">
                {new Date(report.createdAt).toLocaleString()}
              </div>

              <Link
                href={`/analysis/${report.id}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                View Full AI Report

                <ArrowRight size={18} />
              </Link>

            </div>
          ))}

        </div>

      </div>
    </Popup>
  );
}