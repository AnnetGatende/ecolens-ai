"use client";

import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Camera,
  BadgeCheck,
} from "lucide-react";

type Props = {
  report: {
    imageUrl: string |null;
    description: string;
    latitude: number;
    longitude: number;
    status: string;
    createdAt: string;
  };
};

export default function UploadedReport({ report }: Props) {
  const statusColor =
    report.status === "RESOLVED"
      ? "bg-green-100 text-green-700"
      : report.status === "PENDING"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700";

  return (
    <section className="overflow-hidden rounded-3xl border bg-white shadow-lg">

      {/* Header */}

      <div className="border-b bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold">
              Uploaded Pollution Report
            </h1>

            <p className="mt-2 text-emerald-100">
              Original evidence submitted by the community.
            </p>

          </div>

          <span
            className={`rounded-full px-5 py-2 text-sm font-semibold ${statusColor} bg-white`}
          >
            {report.status}
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
                sizes="(max-width:768px) 100vw,
                       (max-width:1200px) 50vw,
                       40vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">

                <div className="text-center">

                  <Camera className="mx-auto mb-4 h-14 w-14 text-gray-400" />

                  <p className="text-gray-500">
                    No uploaded image
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
              Incident Description
            </h2>

            <p className="leading-8 text-gray-700">
              {report.description}
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border p-5">

              <div className="mb-2 flex items-center gap-2">

                <MapPin className="h-5 w-5 text-emerald-600" />

                <span className="font-semibold">
                  Location
                </span>

              </div>

              <p className="text-gray-600">
                {report.latitude.toFixed(6)}
              </p>

              <p className="text-gray-600">
                {report.longitude.toFixed(6)}
              </p>

            </div>

            <div className="rounded-2xl border p-5">

              <div className="mb-2 flex items-center gap-2">

                <CalendarDays className="h-5 w-5 text-blue-600" />

                <span className="font-semibold">
                  Reported
                </span>

              </div>

              <p className="text-gray-600">
                {new Date(report.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(report.createdAt).toLocaleTimeString()}
              </p>

            </div>

          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

            <div className="flex items-center gap-3">

              <BadgeCheck className="h-6 w-6 text-emerald-600" />

              <div>

                <p className="font-semibold text-emerald-700">
                  Submission Status
                </p>

                <p className="mt-1 text-xl font-bold text-emerald-900">
                  {report.status}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}