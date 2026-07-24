"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  AlertTriangle, Wind, Truck, Droplets, Activity, MapPin, 
  Satellite, Radio, CheckCircle2, Clock, Loader2, RotateCcw, 
  ChevronDown, ChevronUp, Lock, ShieldCheck, ArrowRight, Search, Calendar,
  Trash2 // Added Trash2 import
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

type Report = {
  id: string;
  pollutionType: string;
  severity: string;
  predictedAQI: number;
  displayLocation?: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
  status: string;
};

type HotspotGroup = {
  id: string;
  location: string;
  reports: Report[];
  maxAQI: number;
  dominantType: string;
  isCompletelyDispatched: boolean; 
};

type TimeframeOption = "ALL" | "TODAY" | "THIS_WEEK" | "THIS_MONTH";

export default function DashboardPage() {
  const { language } = useLanguage();

  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [authError, setAuthError] = useState(false);

  // --- DASHBOARD & FILTER STATE ---
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState<TimeframeOption>("ALL");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadReports() {
      try {
        const response = await fetch("/api/map", { cache: "no-store" }); 
        
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [isAuthenticated]);

  // --- ADVANCED FILTERING (Search + Timeframe) ---
  const filteredReports = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const now = new Date();

    return reports.filter((report) => {
      // 1. Text Search Filter
      const matchSearch =
        !query ||
        report.id.toLowerCase().includes(query) ||
        report.pollutionType.toLowerCase().includes(query) ||
        (report.displayLocation?.toLowerCase() || "").includes(query);

      // 2. Timeframe Filter
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

  // --- HOTSPOT GROUPING ---
  const hotspotGroups = useMemo(() => {
    const map = new Map<string, HotspotGroup>();

    filteredReports.forEach((report) => {
      const groupId = report.displayLocation || `Grid-${report.latitude.toFixed(3)}-${report.longitude.toFixed(3)}`;
      const displayName = report.displayLocation || 
        (language === "en" 
          ? `Unmapped Zone (${report.latitude.toFixed(3)}, ${report.longitude.toFixed(3)})`
          : `Eneo Lisilojulikana (${report.latitude.toFixed(3)}, ${report.longitude.toFixed(3)})`);
      
      if (!map.has(groupId)) {
        map.set(groupId, {
          id: groupId,
          location: displayName,
          reports: [],
          maxAQI: 0,
          dominantType: report.pollutionType,
          isCompletelyDispatched: true, 
        });
      }

      const group = map.get(groupId)!;
      group.reports.push(report);
      
      if (report.status !== "RESOLVED") {
        group.isCompletelyDispatched = false;
      }

      if (report.predictedAQI > group.maxAQI) {
        group.maxAQI = report.predictedAQI;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.maxAQI - a.maxAQI);
  }, [filteredReports, language]);

  // Dynamic Metrics
  const activeIncidents = filteredReports.filter(r => r.status !== "RESOLVED").length;
  const criticalSpikes = filteredReports.filter(r => r.predictedAQI > 150 && r.status !== "RESOLVED").length;
  const resourcesDeployed = filteredReports.filter(r => r.status === "RESOLVED").length;

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleIndividualAction = async (reportId: string, action: "dispatch" | "revoke") => {
    setProcessing(prev => ({ ...prev, [reportId]: true }));
    try {
      const res = await fetch("/api/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportIds: [reportId], action }), 
      });
      
      if (res.ok) {
        setReports(prevReports => 
          prevReports.map(report => {
            if (report.id === reportId) {
              return { ...report, status: action === "dispatch" ? "RESOLVED" : "PENDING" };
            }
            return report;
          })
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(prev => ({ ...prev, [reportId]: false }));
    }
  };

  // --- DELETE FUNCTIONALITY ---
  const handleDelete = async (reportId: string) => {
    const confirmMessage = language === "en" 
      ? "Are you sure you want to delete this report? This action cannot be undone."
      : "Je, una uhakika unataka kufuta ripoti hii? Hatua hii haiwezi kutenguliwa.";
      
    const isConfirmed = window.confirm(confirmMessage);
    
    if (!isConfirmed) return;

    setProcessing(prev => ({ ...prev, [`delete-${reportId}`]: true }));
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReports((prevReports) => prevReports.filter((report) => report.id !== reportId));
      } else {
        alert(language === "en" ? "Failed to delete the report. Please try again." : "Imeshindwa kufuta ripoti. Tafadhali jaribu tena.");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert(language === "en" ? "An error occurred while deleting." : "Hitilafu imetokea wakati wa kufuta.");
    } finally {
      setProcessing(prev => ({ ...prev, [`delete-${reportId}`]: false }));
    }
  };

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pinCode === "2026") {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setPinCode("");
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900 px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-800/50 p-10 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-emerald-500/20 p-4 mb-6">
              <ShieldCheck className="h-10 w-10 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {language === "en" ? "Municipal Command Center" : "Kituo cha Amri cha Manispaa"}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {language === "en" 
                ? "Restricted Access. Please enter the dispatch authorization PIN to manage city resources."
                : "Ufikiaji Umezuiwa. Tafadhali weka nenosiri la idhini ya usambazaji ili kudhibiti rasilimali za jiji."}
            </p>

            {/* HACKATHON JUDGE HINT */}
            <div className="mt-6 w-full rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
              <p className="text-sm font-semibold text-emerald-400 tracking-wide flex items-center justify-center gap-2">
                🛠️ {language === "en" ? "Demo PIN:" : "PIN ya Majaji:"} <span className="text-lg font-bold text-white">2026</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <label htmlFor="pin" className="sr-only">Authorization PIN</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="pin"
                  name="pin"
                  type="password"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500 sm:text-lg text-center tracking-[1em]"
                  placeholder="••••"
                  maxLength={4}
                />
              </div>
              {authError && (
                <p className="mt-3 text-sm text-red-400 text-center animate-pulse">
                  {language === "en" ? "Invalid authorization code. Please try again." : "Nambari ya idhini si sahihi. Tafadhali jaribu tena."}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-500"
            >
              {language === "en" ? "Authenticate & Access" : "Thibitisha na Ufikie"} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-xl font-medium text-slate-600">
        <Loader2 className="mr-3 h-8 w-8 animate-spin text-emerald-600" />
        {language === "en" ? "Initializing Command Center Data..." : "Inaandaa Data ya Kituo cha Amri..."}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-slate-900 px-6 py-3 text-sm text-slate-300 flex flex-wrap items-center justify-center gap-6">
        <span className="flex items-center gap-2 font-medium text-emerald-400">
          <Activity size={16} /> {language === "en" ? "EcoLens Core Active" : "EcoLens Core Inafanya Kazi"}
        </span>
        <span className="flex items-center gap-2">
          <Satellite size={16} /> {language === "en" ? "Simulated Sentinel-2 Uplink" : "Muunganisho wa Sentinel-2 Umeigwa"}
        </span>
        <span className="flex items-center gap-2">
          <Radio size={16} /> {language === "en" ? "OpenAQ Sensor Sync" : "Usawazishaji wa OpenAQ"}
        </span>
        <span className="flex items-center gap-2">
          <MapPin size={16} /> {language === "en" ? "Citizen Crowdsource Live" : "Ripoti za Wananchi Moja kwa Moja"}
        </span>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-8">
        
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              {language === "en" ? "Municipal Dispatch Center" : "Kituo cha Usambazaji cha Manispaa"}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              {language === "en" 
                ? "Expand neighborhood containers to deploy targeted resources to exact incident reports."
                : "Panua sehemu za mitaa ili kusambaza rasilimali maalum kwa ripoti kamili za matukio."}
            </p>
          </div>
          
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 shrink-0"
          >
            {language === "en" ? "End Session" : "Funga Kipindi"}
          </button>
        </div>

        {/* Refined Metrics Row */}
        <div className="mb-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {language === "en" ? "Active Incidents" : "Matukio Yanayoendelea"}
            </p>
            <p className="mt-2 text-4xl font-bold text-slate-800">{activeIncidents}</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-semibold text-red-600 uppercase tracking-wider">
              {language === "en" ? "24h Critical Spikes" : "Ongezeko Hatari (Saa 24)"}
            </p>
            <p className="mt-2 text-4xl font-bold text-red-700">{criticalSpikes}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
              {language === "en" ? "Resources Deployed" : "Rasilimali Zilizosambazwa"}
            </p>
            <p className="mt-2 text-4xl font-bold text-emerald-700">{resourcesDeployed}</p>
          </div>
        </div>

        {/* Search Bar & Date Filter Controls */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="text-orange-500" /> 
              {language === "en" ? "Sector Incident Reports" : "Ripoti za Matukio ya Sekta"}
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              {/* Search Input */}
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder={language === "en" ? "Search ID, Location, or Hazard..." : "Tafuta Kitambulisho, Eneo, au Hatari..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 sm:text-sm font-medium"
                />
              </div>

              {/* Timeframe Select Dropdown */}
              <div className="relative w-full sm:w-48">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-500" />
                </div>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as TimeframeOption)}
                  className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-8 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 sm:text-sm font-semibold appearance-none cursor-pointer"
                >
                  <option value="ALL">{language === "en" ? "All Time" : "Wakati Wote"}</option>
                  <option value="TODAY">{language === "en" ? "Today" : "Leo"}</option>
                  <option value="THIS_WEEK">{language === "en" ? "This Week" : "Wiki Hii"}</option>
                  <option value="THIS_MONTH">{language === "en" ? "This Month" : "Mwezi Huu"}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {hotspotGroups.map((group) => {
              const isExpanded = expandedGroups[group.id];
              const pendingCount = group.reports.filter(r => r.status !== "RESOLVED").length;
              
              return (
                <div key={group.id} className={`flex flex-col rounded-3xl border shadow-sm transition-all ${group.isCompletelyDispatched ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 bg-white'}`}>
                  
                  <div 
                    onClick={() => toggleGroup(group.id)}
                    className="flex cursor-pointer items-start justify-between p-6 hover:bg-slate-50/50 rounded-t-3xl"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <MapPin size={20} className={group.isCompletelyDispatched ? "text-emerald-600" : "text-blue-600"} />
                        {group.location}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 mt-1">
                        {group.reports.length} {language === "en" ? "Total Reports" : "Jumla ya Ripoti"} • {pendingCount} {language === "en" ? "Pending Action" : "Inasubiri Hatua"}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {!group.isCompletelyDispatched && (
                        <div className={`flex flex-col items-end rounded-xl p-2 ${group.maxAQI > 150 ? 'bg-red-50' : 'bg-yellow-50'}`}>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {language === "en" ? "Max Forecast" : "Utabiri wa Juu"}
                          </span>
                          <span className={`text-lg font-black ${group.maxAQI > 150 ? 'text-red-700' : 'text-yellow-700'}`}>
                            AQI {group.maxAQI}
                          </span>
                        </div>
                      )}
                      <div className="rounded-full bg-slate-100 p-2 text-slate-500">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50 p-4 rounded-b-3xl">
                      <div className="flex flex-col gap-3">
                        {group.reports.map((report) => {
                          const isResolved = report.status === "RESOLVED";
                          const isProcessingAction = processing[report.id];
                          const isProcessingDelete = processing[`delete-${report.id}`];
                          const isFire = report.pollutionType.toLowerCase().includes("smoke") || report.pollutionType.toLowerCase().includes("fire");

                          return (
                            <div key={report.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                              <div>
                                <h4 className="font-bold text-slate-800">{report.pollutionType}</h4>
                                <div className="mt-1 flex items-center gap-3 text-xs font-medium text-slate-500">
                                  <span className={`px-2 py-1 rounded-md ${report.predictedAQI > 150 ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                    AQI {report.predictedAQI}
                                  </span>
                                  <span>
                                    {new Date(report.createdAt).toLocaleString(
                                      language === "en" ? "en-GB" : "sw-KE"
                                    )}
                                  </span>
                                  <span className="text-slate-400">ID: {report.id.slice(0,8)}...</span>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                                {/* DELETE BUTTON */}
                                <button 
                                  onClick={() => handleDelete(report.id)}
                                  disabled={isProcessingDelete}
                                  title={language === "en" ? "Delete Report" : "Futa Ripoti"}
                                  className="flex items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-70"
                                >
                                  {isProcessingDelete ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                </button>

                                {/* DISPATCH/REVOKE BUTTON */}
                                {isResolved ? (
                                  <button 
                                    onClick={() => handleIndividualAction(report.id, "revoke")}
                                    disabled={isProcessingAction}
                                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-70"
                                  >
                                    {isProcessingAction ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                                    {isProcessingAction 
                                      ? (language === "en" ? "Recalling..." : "Inarudisha...") 
                                      : (language === "en" ? "Recall Unit" : "Rudisha Kikosi")}
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleIndividualAction(report.id, "dispatch")}
                                    disabled={isProcessingAction}
                                    className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-70 ${
                                      isFire ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
                                    }`}
                                  >
                                    {isProcessingAction ? (
                                      <Loader2 size={16} className="animate-spin" />
                                    ) : isFire ? (
                                      <Droplets size={16} /> 
                                    ) : (
                                      <Truck size={16} />
                                    )}
                                    {isProcessingAction 
                                      ? (language === "en" ? "Deploying..." : "Inasambaza...") 
                                      : isFire 
                                        ? (language === "en" ? "Send Water Cannon" : "Tuma Gari la Maji") 
                                        : (language === "en" ? "Send Cleanup Crew" : "Tuma Timu ya Usafi")}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {!isExpanded && group.isCompletelyDispatched && (
                    <div className="bg-emerald-500 py-1.5 text-center text-xs font-bold uppercase tracking-wider text-white rounded-b-2xl">
                      {language === "en" ? "Sector Secured" : "Sekta Imelindwa"}
                    </div>
                  )}
                </div>
              );
            })}

            {hotspotGroups.length === 0 && (
              <div className="col-span-2 rounded-3xl border border-dashed border-slate-300 p-12 text-center">
                <Wind className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">
                  {language === "en" ? "Airspace Clear" : "Anga Safi"}
                </h3>
                <p className="text-slate-500">
                  {searchQuery || timeframe !== "ALL"
                    ? (language === "en" 
                        ? "No reports match your search and timeframe filters." 
                        : "Hakuna ripoti zinazolingana na utafutaji wako na vichungi vya muda.")
                    : (language === "en" 
                        ? "No active hotspots detected by EcoLens." 
                        : "Hakuna maeneo hatari yanayoendelea yaliyotambuliwa na EcoLens.")}
                </p>
              </div>
            )}
          </div>
        </div>

      </section>
    </main>
  );
}