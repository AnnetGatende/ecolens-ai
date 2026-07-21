"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import MapGL, { Marker, NavigationControl, FullscreenControl, MapRef, ViewStateChangeEvent } from "react-map-gl/maplibre";
import Supercluster from "supercluster";
import { BBox } from "geojson";

import MapLegend from "./MapLegend";
import ClusterPopup from "./ClusterPopup";

type Report = {
  id: string;
  pollutionType: string;
  severity: string;
  predictedAQI: number;
  imageUrl: string | null;
  createdAt: string;
  latitude: number;
  longitude: number;
  displayLocation?: string | null;
  area?: string | null;
  ward?: string | null;
  subCounty?: string | null;
  county?: string | null;
};

type Hotspot = {
  id: string;
  displayLocation: string;
  latitude: number;
  longitude: number;
  severity: string;
  reports: Report[];
};

type CustomClusterProperties = {
  total_reports: number; 
};

type SuperclusterFeature = Supercluster.ClusterFeature<CustomClusterProperties> | Supercluster.PointFeature<Hotspot>;

export default function MapView() {
  const mapRef = useRef<MapRef>(null);

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const [viewState, setViewState] = useState({
    longitude: 39.6682,
    latitude: -4.0435,
    zoom: 11,
  });
  const [bounds, setBounds] = useState<BBox | null>(null);

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await fetch("/api/map");
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data: Report[] = await response.json();
        setReports(data);
      } catch (error) {
        console.error(error);
      }
    }
    loadReports();
  }, []);

  const hotspots = useMemo(() => {
    const map = new Map<string, { latSum: number; lonSum: number; reports: Report[]; displayLocation: string }>();

    reports.forEach((report) => {
      const key = report.displayLocation || `Grid-${report.latitude.toFixed(3)}-${report.longitude.toFixed(3)}`;
      const displayName = report.displayLocation || "Unknown Location";

      if (!map.has(key)) {
        map.set(key, { latSum: 0, lonSum: 0, reports: [], displayLocation: displayName });
      }

      const hs = map.get(key)!;
      hs.reports.push(report);
      hs.latSum += report.latitude;
      hs.lonSum += report.longitude;
    });

    const severityWeights: Record<string, number> = {
      low: 1, moderate: 2, medium: 2, high: 3, orange: 3, severe: 4, red: 4, critical: 5,
    };

    return Array.from(map.values()).map((hs, index) => {
      let maxSeverity = "Low";
      let maxWeight = 0;

      hs.reports.forEach((r) => {
        const weight = severityWeights[r.severity.toLowerCase()] || 0;
        if (weight > maxWeight) {
          maxWeight = weight;
          maxSeverity = r.severity;
        }
      });

      return {
        id: `hotspot-${index}`,
        displayLocation: hs.displayLocation,
        latitude: hs.latSum / hs.reports.length,
        longitude: hs.lonSum / hs.reports.length,
        severity: maxSeverity,
        reports: hs.reports,
      } as Hotspot;
    });
  }, [reports]);

  const supercluster = useMemo(() => {
    const sc = new Supercluster<Hotspot, CustomClusterProperties>({
      radius: 60,
      maxZoom: 20,
      map: (props) => ({ total_reports: props.reports.length }),
      reduce: (acc, props) => { acc.total_reports += props.total_reports; },
    });

    const points: Array<Supercluster.PointFeature<Hotspot>> = hotspots.map((hotspot) => ({
      type: "Feature",
      properties: hotspot,
      geometry: { type: "Point", coordinates: [hotspot.longitude, hotspot.latitude] },
    }));

    sc.load(points);
    return sc;
  }, [hotspots]);

  const updateBounds = useCallback(() => {
    if (mapRef.current) {
      const mapBounds = mapRef.current.getBounds();
      if (mapBounds) {
        setBounds([mapBounds.getWest(), mapBounds.getSouth(), mapBounds.getEast(), mapBounds.getNorth()]);
      }
    }
  }, []);

  const handleMapLoad = useCallback(() => updateBounds(), [updateBounds]);
  const handleMove = useCallback((e: ViewStateChangeEvent) => {
    setViewState(e.viewState);
    updateBounds();
  }, [updateBounds]);

  const clusters = useMemo(() => {
    if (!bounds || !supercluster) return [];
    return supercluster.getClusters(bounds, Math.round(viewState.zoom)) as SuperclusterFeature[];
  }, [bounds, viewState.zoom, supercluster]);

  const getMarkerColor = (severity: string) => {
    const lower = severity.toLowerCase();
    if (lower.includes("critical")) return "bg-red-900";
    if (lower.includes("severe") || lower === "red") return "bg-red-600";
    if (lower.includes("high") || lower === "orange") return "bg-orange-500";
    if (lower.includes("moderate") || lower === "medium" || lower === "yellow") return "bg-yellow-400";
    return "bg-green-500";
  };

  // Fixed: Changed from React.MouseEvent to the native DOM MouseEvent
  const handleClusterClick = (clusterId: number, longitude: number, latitude: number, e: MouseEvent) => {
    e.stopPropagation();
    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(clusterId), 20);
    mapRef.current?.flyTo({ center: [longitude, latitude], zoom: expansionZoom, duration: 700 });
  };

  return (
    <div className="relative h-[700px] overflow-hidden rounded-3xl shadow-xl border border-gray-200">
      <MapLegend />

      <MapGL
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onLoad={handleMapLoad}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
        maxZoom={20}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const isCluster = "cluster" in cluster.properties;

          if (isCluster) {
            const clusterProps = cluster.properties as Supercluster.ClusterProperties & CustomClusterProperties;
            const reportCount = clusterProps.total_reports;
            const size = 32 + (reportCount / (reports.length || 1)) * 40;

            return (
              <Marker
                key={`cluster-${clusterProps.cluster_id}`}
                longitude={longitude}
                latitude={latitude}
                anchor="center"
                onClick={(e) => handleClusterClick(clusterProps.cluster_id, longitude, latitude, e.originalEvent)}
              >
                <div
                  className="flex items-center justify-center rounded-full bg-blue-600/95 text-white font-bold shadow-lg shadow-blue-900/20 border-2 border-white cursor-pointer transition-transform hover:scale-110"
                  style={{ width: `${size}px`, height: `${size}px` }}
                >
                  {reportCount}
                </div>
              </Marker>
            );
          }

          const hotspot = cluster.properties as Hotspot;
          return (
            <Marker
              key={hotspot.id}
              longitude={hotspot.longitude}
              latitude={hotspot.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedHotspot(hotspot);
              }}
            >
              <div className="relative group cursor-pointer">
                <button
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white shadow-xl transition-transform group-hover:scale-125 ${getMarkerColor(
                    hotspot.severity
                  )}`}
                >
                  <span className="text-white text-sm font-bold">{hotspot.reports.length}</span>
                </button>
              </div>
            </Marker>
          );
        })}

        {selectedHotspot && (
          <ClusterPopup
            hotspot={selectedHotspot}
            onClose={() => setSelectedHotspot(null)}
          />
        )}
      </MapGL>
    </div>
  );
}