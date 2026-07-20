"use client";

import { CalendarDays, MapPin, Camera } from "lucide-react";

type Props = {
  report: {
    imageUrl: string | null;
    description: string;
    latitude: number;
    longitude: number;
    status: string;
    createdAt: string;
  };
};

export default function UploadedReport({ report }: Props) {
  return (
    <section className="rounded-3xl border bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-3xl font-bold">
        Uploaded Pollution Report
      </h2>

      <div className="grid gap-8 lg:grid-cols-2">

        {/* Uploaded Image */}

        <div className="overflow-hidden rounded-2xl border bg-gray-100">

          {report.imageUrl ? (
            <img
              src={report.imageUrl}
              alt="Pollution Report"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center">
              <div className="text-center">
                <Camera className="mx-auto mb-3 h-14 w-14 text-gray-400" />
                <p className="text-gray-500">
                  No image available
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Report Details */}

        <div className="space-y-6">

          <div>
            <p className="text-sm text-gray-500">
              Description
            </p>

            <p className="mt-2 text-lg leading-8">
              {report.description}
            </p>
          </div>

          <div className="flex items-center gap-3">

            <MapPin className="h-5 w-5 text-emerald-600" />

            <span>
              {report.latitude.toFixed(6)},
              {" "}
              {report.longitude.toFixed(6)}
            </span>

          </div>

          <div className="flex items-center gap-3">

            <CalendarDays className="h-5 w-5 text-blue-600" />

            <span>
              {new Date(report.createdAt).toLocaleString()}
            </span>

          </div>

          <div className="rounded-xl bg-emerald-50 p-5">

            <p className="font-semibold text-emerald-700">
              Submission Status
            </p>

            <p className="mt-2 text-lg font-medium">
              {report.status}
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}