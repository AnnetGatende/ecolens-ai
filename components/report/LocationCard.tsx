"use client";

import { MapPin } from "lucide-react";

type Props = {
  latitude: number | null;
  longitude: number | null;
  error?: string;
};

export default function LocationCard({
  latitude,
  longitude,
  error,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white shadow-lg p-6">

      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-red-500" />
        <h2 className="text-xl font-bold">
          GPS Location
        </h2>
      </div>

      {latitude && longitude ? (
        <>
          <p><strong>Latitude:</strong> {latitude.toFixed(6)}</p>
          <p><strong>Longitude:</strong> {longitude.toFixed(6)}</p>
        </>
      ) : (
        <p className="text-gray-500">
          Detecting location...
        </p>
      )}

      {error && (
        <p className="mt-3 text-red-600 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}