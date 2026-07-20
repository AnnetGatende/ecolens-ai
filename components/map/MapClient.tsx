"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] flex items-center justify-center rounded-3xl border bg-slate-100">
      <p className="text-lg font-medium">Loading map...</p>
    </div>
  ),
});

export default function MapClient() {
  return <MapView />;
}