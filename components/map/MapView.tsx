"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useState } from "react";

import MapLegend from "./MapLegend";

import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  Popup,
} from "react-map-gl/maplibre";

const reports = [
  {
    id: 1,
    name: "Likoni",
    lng: 39.653,
    lat: -4.091,
    pollution: "Smoke",
    severity: "High",
    aqi: 172,
  },
  {
    id: 2,
    name: "Nyali",
    lng: 39.696,
    lat: -4.033,
    pollution: "Dust",
    severity: "Medium",
    aqi: 91,
  },
  {
    id: 3,
    name: "Mvita",
    lng: 39.668,
    lat: -4.043,
    pollution: "Waste Burning",
    severity: "Critical",
    aqi: 189,
  },
  {
    id: 4,
    name: "Bamburi",
    lng: 39.724,
    lat: -3.981,
    pollution: "Clean Air",
    severity: "Low",
    aqi: 35,
  },
];

export default function MapView() {
  const [selected, setSelected] = useState<
    (typeof reports)[number] | null
  >(null);

  return (
    <div className="relative h-[700px] rounded-3xl overflow-hidden shadow-xl">

      <MapLegend />

      <Map
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
            longitude={report.lng}
            latitude={report.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelected(report);
            }}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-125 ${
                report.severity === "Critical"
                  ? "bg-red-600 animate-pulse"
                  : report.severity === "High"
                  ? "bg-orange-500"
                  : report.severity === "Medium"
                  ? "bg-yellow-400"
                  : "bg-green-500"
              }`}
            />
          </Marker>
        ))}

        {selected && (
          <Popup
            longitude={selected.lng}
            latitude={selected.lat}
            closeOnClick={false}
            onClose={() => setSelected(null)}
          >
            <div className="min-w-[220px] space-y-2">
              <h2 className="font-bold text-lg">
                {selected.name}
              </h2>

              <p>
                <strong>Pollution:</strong>{" "}
                {selected.pollution}
              </p>

              <p>
                <strong>Severity:</strong>{" "}
                {selected.severity}
              </p>

              <p>
                <strong>AQI:</strong>{" "}
                {selected.aqi}
              </p>

              <div
                className={`mt-3 rounded-lg p-2 text-center font-semibold text-white ${
                  selected.severity === "Critical"
                    ? "bg-red-600"
                    : selected.severity === "High"
                    ? "bg-orange-500"
                    : selected.severity === "Medium"
                    ? "bg-yellow-500"
                    : "bg-green-600"
                }`}
              >
                {selected.severity} Pollution
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}