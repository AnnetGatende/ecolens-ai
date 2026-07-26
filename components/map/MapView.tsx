"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import MapGL, { Marker, NavigationControl, FullscreenControl, MapRef, ViewStateChangeEvent } from "react-map-gl/maplibre";
import Supercluster from "supercluster";
import { BBox } from "geojson";
import { Search, Calendar, ChevronDown } from "lucide-react";

import MapLegend from "./MapLegend";
import ClusterPopup from "./ClusterPopup";
import { useLanguage } from "@/components/LanguageContext";

type Report = {
  id: string;
  reportNumber: number; // ADDED: For numeric searching
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
  max_severity: string;
  max_weight: number;
};

type TimeframeOption = "ALL" | "TODAY" | "THIS_WEEK" | "THIS_MONTH";

type SuperclusterFeature = Supercluster.ClusterFeature<CustomClusterProperties> | Supercluster.PointFeature<Hotspot>;

const severityWeights: Record<string, number> = {
  low: 1, moderate: 2, medium: 2, high: 3, orange: 3, severe: 4, red: 4, critical: 5,
};

export default function MapView() {
  const { language } = useLanguage();
  const mapRef = useRef<MapRef>(null);

  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState<TimeframeOption>("ALL");
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
        const response = await fetch("/api/reports"); 
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data: Report[] = await response.json();
        setReports(data);
      } catch (error) {
        console.error(error);
      }
    }
    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    // ADDED: Extracts only the digits for exact report number matching
    const numericQuery = query.replace(/\D/g, ""); 
    const now = new Date();

    return reports.filter((report) => {
      const matchSearch =
        !query ||
        report.pollutionType.toLowerCase().includes(query) ||
        (report.displayLocation && report.displayLocation.toLowerCase().includes(query)) ||
        (report.area && report.area.toLowerCase().includes(query)) ||
        // Check if the extracted number exactly matches the report's DB number
        (report.reportNumber && numericQuery && report.reportNumber.toString() === numericQuery); 

      const reportDate = new Date(report.createdAt);
      let matchTimeframe = true;

      if (timeframe === "TODAY") {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        matchTimeframe = reportDate >= startOfToday;
      } else if (timeframe === "THIS_WEEK") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        matchTimeframe = reportDate >= sevenDaysAgo;
      } else if (timeframe === "THIS_MONTH") {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        matchTimeframe = reportDate >= thirtyDaysAgo;
      }

      return matchSearch && matchTimeframe;
    });
  }, [reports, searchQuery, timeframe]);

  const hotspots = useMemo(() => {
    const map = new Map<string, { latSum: number; lonSum: number; reports: Report[]; displayLocation: string }>();

    filteredReports.forEach((report) => {
      const key = `${report.latitude}-${report.longitude}`;
      const displayName = report.displayLocation || (language === "en" ? "Unknown Location" : "Eneo Lisilojulikana");

      if (!map.has(key)) {
        map.set(key, { latSum: 0, lonSum: 0, reports: [], displayLocation: displayName });
      }

      const hs = map.get(key)!;
      hs.reports.push(report);
      hs.latSum += report.latitude;
      hs.lonSum += report.longitude;
    });

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
  }, [filteredReports, language]);

  const supercluster = useMemo(() => {
    const sc = new Supercluster<Hotspot, CustomClusterProperties>({
      radius: 50,
      maxZoom: 20,
      map: (props) => {
        const weight = severityWeights[props.severity?.toLowerCase()] || 1;
        return {
          total_reports: props.reports.length,
          max_severity: props.severity || "Low",
          max_weight: weight,
        };
      },
      reduce: (acc, props) => {
        acc.total_reports += props.total_reports;
        if (props.max_weight > acc.max_weight) {
          acc.max_weight = props.max_weight;
          acc.max_severity = props.max_severity;
        }
      },
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

  const handleClusterClick = (clusterId: number, longitude: number, latitude: number, e: any) => {
    e.stopPropagation(); 

    const currentZoom = Math.round(viewState.zoom);
    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(clusterId), 18);

    if (expansionZoom > currentZoom && currentZoom < 18) {
      mapRef.current?.flyTo({ center: [longitude, latitude], zoom: expansionZoom, duration: 700 });
    } else {
      const leaves = supercluster.getLeaves(clusterId, Infinity);
      const allReports = leaves.flatMap((leaf) => leaf.properties.reports);

      let maxSeverity = "Low";
      let maxWeight = 0;

      allReports.forEach((r) => {
        const weight = severityWeights[r.severity.toLowerCase()] || 0;
        if (weight > maxWeight) {
          maxWeight = weight;
          maxSeverity = r.severity;
        }
      });

      setSelectedHotspot({
        id: `grouped-cluster-${clusterId}`,
        displayLocation: leaves[0].properties.displayLocation || (language === "en" ? "Clustered Area" : "Eneo Lililokusanywa"),
        latitude,
        longitude,
        severity: maxSeverity,
        reports: allReports,
      });
    }
  };

  return (
    <div className="relative h-[700px] overflow-hidden rounded-3xl shadow-xl border border-gray-200 bg-slate-50">
      
      <div className="absolute top-4 left-4 z-10 flex flex-col sm:flex-row items-center gap-2 w-full max-w-xs sm:max-w-md">
        <div className="relative shadow-lg rounded-xl w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            // ADDED: Updated placeholder to indicate Report Number searching
            placeholder={language === "en" ? "Search Report #, Location..." : "Tafuta Nambari, Eneo..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-xl border border-white/20 bg-white/90 backdrop-blur-md py-3 pl-9 pr-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-xs font-medium"
          />
        </div>

        <div className="relative shadow-lg rounded-xl w-full sm:w-36 shrink-0">
          <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as TimeframeOption)}
            className="block w-full rounded-xl border border-white/20 bg-white/90 backdrop-blur-md py-3 pl-8 pr-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-xs font-bold appearance-none cursor-pointer"
          >
            <option value="ALL">{language === "en" ? "All Time" : "Wakati Wote"}</option>
            <option value="TODAY">{language === "en" ? "Today" : "Leo"}</option>
            <option value="THIS_WEEK">{language === "en" ? "This Week" : "Wiki Hii"}</option>
            <option value="THIS_MONTH">{language === "en" ? "This Month" : "Mwezi Huu"}</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      <MapLegend />

      <MapGL
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onLoad={handleMapLoad}
        mapStyle={{
          version: 8,
          sources: {
            "satellite-imagery": {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              ],
              tileSize: 256,
              attribution: "Esri"
            },
            "satellite-labels": {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              ],
              tileSize: 256
            }
          },
          layers: [
            {
              id: "satellite-layer",
              type: "raster",
              source: "satellite-imagery",
              minzoom: 0,
              maxzoom: 19
            },
            {
              id: "labels-layer",
              type: "raster",
              source: "satellite-labels",
              minzoom: 0,
              maxzoom: 19
            }
          ]
        }}
        maxZoom={18} 
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
            
            const clusterColor = getMarkerColor(clusterProps.max_severity || "Low");

            return (
              <Marker
                key={`cluster-${clusterProps.cluster_id}`}
                longitude={longitude}
                latitude={latitude}
                anchor="center"
                onClick={(e) => handleClusterClick(clusterProps.cluster_id, longitude, latitude, e.originalEvent)}
              >
                <div
                  className={`flex items-center justify-center rounded-full text-white font-bold shadow-lg border-2 border-white cursor-pointer transition-transform hover:scale-110 ${clusterColor}`}
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