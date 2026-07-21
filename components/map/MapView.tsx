"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useEffect, useRef, useState } from "react";

import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  MapRef,
} from "react-map-gl/maplibre";

import MapLegend from "./MapLegend";
import PollutionPopup from "./PollutionPopup";

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

export default function MapView() {
  const mapRef = useRef<MapRef>(null);

  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await fetch("/api/map");

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const data: Report[] = await response.json();

        console.log("Loaded Reports:", data);

        setReports(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadReports();
  }, []);

  function markerColor(severity: string) {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-600";

      case "high":
        return "bg-orange-500";

      case "medium":
        return "bg-yellow-400";

      default:
        return "bg-green-500";
    }
  }

  return (
    <div className="relative h-[700px] overflow-hidden rounded-3xl shadow-xl">

      <MapLegend />

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 39.6682,
          latitude: -4.0435,
          zoom: 11,
        }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
      >
        <NavigationControl position="top-right" />

        <FullscreenControl position="top-right" />

        {reports.map((report) => (
          <Marker
            key={report.id}
            longitude={report.longitude}
            latitude={report.latitude}
            anchor="bottom"
            onClick={(event) => {
              event.originalEvent.stopPropagation();

              console.log(report);

              setSelected(report);
            }}
          >
            <button
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg transition hover:scale-110 ${markerColor(
                report.severity
              )}`}
            >
              📍
            </button>
          </Marker>
        ))}

        {selected && (
          <PollutionPopup
            report={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </Map>
    </div>
  );
}