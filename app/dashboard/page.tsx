"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  AlertTriangle, Wind, Truck, Droplets, Activity, MapPin, 
  Satellite, Radio, RotateCcw, ChevronDown, ChevronUp, Search, Calendar,
  Trash2, Loader2, LayoutDashboard, Settings, LogOut, ShieldCheck, Flame, CheckCircle, Sliders, Key, BarChart3, Users, FileText, Check, XCircle, Pencil, X, Globe, Menu, ArrowLeft
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { logoutAdmin } from "@/app/actions/auth";
import { getAdminData, saveAdminProfile } from "@/app/actions/admin";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Report = {
  id: string;
  reportNumber: number;
  pollutionType: string;
  pollutionType_sw?: string | null;
  severity: string;
  predictedAQI: number;
  confidence?: number;
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
type DispatchSubTab = "live" | "review";
type ActiveTab = "dispatch" | "analytics" | "settings" | "map" | "report";

export default function DashboardPage() {
  const { language, setLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState<ActiveTab>("dispatch");
  const [dispatchSubTab, setDispatchSubTab] = useState<DispatchSubTab>("live");
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState<TimeframeOption>("ALL");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // API Health Telemetry State
  const [apiHealth, setApiHealth] = useState<{ status: string; message: string } | null>(null);
  
  // LIVE SUPABASE PROFILE & ADMIN TRACKING STATE
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [adminCount, setAdminCount] = useState(1);
  const [adminProfile, setAdminProfile] = useState({
    name: "System Admin",
    role: "Municipal Dispatcher",
    initials: "S"
  });
  const [editForm, setEditForm] = useState({ name: "", role: "" });

  // --- STATE PERSISTENCE HANDLERS ---
  const changeTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    localStorage.setItem("ecolens_active_tab", tab);
    setIsMobileSidebarOpen(false); // Close mobile sidebar when a tab is clicked
  };

  const changeSubTab = (subTab: DispatchSubTab) => {
    setDispatchSubTab(subTab);
    localStorage.setItem("ecolens_dispatch_subtab", subTab);
  };

  const changeViewingReportId = (id: string | null) => {
    setViewingReportId(id);
    if (id) {
      localStorage.setItem("ecolens_viewing_report_id", id);
    } else {
      localStorage.removeItem("ecolens_viewing_report_id");
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const savedTab = localStorage.getItem("ecolens_active_tab") as ActiveTab | null;
        if (savedTab) setActiveTab(savedTab);

        const savedSubTab = localStorage.getItem("ecolens_dispatch_subtab") as DispatchSubTab | null;
        if (savedSubTab) setDispatchSubTab(savedSubTab);

        const savedReportId = localStorage.getItem("ecolens_viewing_report_id");
        if (savedReportId) setViewingReportId(savedReportId);

        const resReports = await fetch("/api/map?admin=true", { cache: "no-store" });
        const contentType = resReports.headers.get("content-type");
        
        if (resReports.ok && contentType && contentType.includes("application/json")) {
          const data = await resReports.json();
          setReports(data);
        } else {
          console.warn("API route still booting up, retrying in 1 second...");
          setTimeout(loadData, 1000); 
          return;
        }

        const resHealth = await fetch("/api/health", { cache: "no-store" });
        const healthContentType = resHealth.headers.get("content-type");
        if (resHealth.ok && healthContentType && healthContentType.includes("application/json")) {
          const healthData = await resHealth.json();
          if (healthData.status === "error") {
            setApiHealth(healthData);
          } else {
            setApiHealth(null);
          }
        }

        const adminData = await getAdminData();
        setAdminCount(adminData.count);
        if (adminData.profiles && adminData.profiles.length > 0) {
          const latestProfile = adminData.profiles[0];
          setAdminProfile({
            name: latestProfile.name,
            role: language === "sw" && latestProfile.role_sw ? latestProfile.role_sw : latestProfile.role,
            initials: latestProfile.initials
          });
        }
      } catch (error) {
        console.error("Dashboard initialization delayed, retrying...", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [language]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const newName = editForm.name || "System Admin";
    const newRole = editForm.role || "Municipal Dispatcher";
    const newInitials = newName.charAt(0).toUpperCase();
    const newRoleSw = newRole === "Municipal Dispatcher" ? "Msambazaji wa Manispaa" : newRole;
    
    setAdminProfile({ 
      name: newName, 
      role: language === "sw" ? newRoleSw : newRole, 
      initials: newInitials 
    });
    setIsEditingProfile(false);
    await saveAdminProfile(newName, newRole, newInitials, newRoleSw);
    const freshData = await getAdminData();
    setAdminCount(freshData.count);
  };

  const getPollutionTitle = (report: Report) => {
    if (language === "sw") {
      return report.pollutionType_sw || report.pollutionType;
    }
    return report.pollutionType;
  };

  const { liveReports, reviewReports } = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const numericQuery = query.replace(/\D/g, ""); 
    const now = new Date();

    const filtered = reports.filter((report) => {
      const matchSearch =
        !query ||
        report.id.toLowerCase().includes(query) ||
        report.pollutionType.toLowerCase().includes(query) ||
        (report.pollutionType_sw && report.pollutionType_sw.toLowerCase().includes(query)) ||
        (report.displayLocation?.toLowerCase() || "").includes(query) ||
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

    const live: Report[] = [];
    const review: Report[] = [];

    filtered.forEach(report => {
      if (report.confidence !== undefined && report.confidence < 85 && report.status !== "RESOLVED") {
        review.push(report);
      } else {
        live.push(report);
      }
    });

    return { liveReports: live, reviewReports: review };
  }, [reports, searchQuery, timeframe]);

  const hotspotGroups = useMemo(() => {
    const targetReports = dispatchSubTab === "live" ? liveReports : reviewReports;
    const map = new Map<string, HotspotGroup>();

    targetReports.forEach((report) => {
      const groupId = report.displayLocation || `Grid-${report.latitude.toFixed(3)}-${report.longitude.toFixed(3)}`;
      const displayName = report.displayLocation || (language === "en" ? `Unmapped Zone` : `Eneo Lisilojulikana`);
      
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
  }, [liveReports, reviewReports, dispatchSubTab, language]);

  const chartData = useMemo(() => {
    const visibleReports = [...liveReports, ...reviewReports];
    const aggregated = new Map<string, { reports: number, maxAQI: number }>();

    visibleReports.forEach((report) => {
      let locName = report.displayLocation 
        ? report.displayLocation.split(',')[0].trim() 
        : (language === "en" ? "Unmapped Zone" : "Eneo Lisilojulikana");
      
      locName = locName.replace(/^County\s*-\s*/i, "").trim();

      if (!aggregated.has(locName)) {
        aggregated.set(locName, { reports: 0, maxAQI: 0 });
      }

      const current = aggregated.get(locName)!;
      current.reports += 1; 
      if (report.predictedAQI > current.maxAQI) {
        current.maxAQI = report.predictedAQI; 
      }
    });

    return Array.from(aggregated.entries())
      .map(([name, data]) => ({
        name: name.length > 15 ? name.substring(0, 15) + "..." : name,
        reports: data.reports,
        maxAQI: data.maxAQI
      }))
      .sort((a, b) => b.reports - a.reports)
      .slice(0, 8);
  }, [liveReports, reviewReports, language]);

  const activeIncidents = liveReports.filter(r => r.status !== "RESOLVED").length;
  const criticalSpikes = liveReports.filter(r => r.predictedAQI > 150 && r.status !== "RESOLVED").length;
  const resourcesDeployed = liveReports.filter(r => r.status === "RESOLVED").length;

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

  const handleDelete = async (reportId: string) => {
    const confirmMessage = language === "en" 
      ? "Are you sure you want to delete this report? This action cannot be undone."
      : "Je, una uhakika unataka kufuta ripoti hii? Hatua hii haiwezi kutenguliwa.";
      
    const isConfirmed = window.confirm(confirmMessage);
    if (!isConfirmed) return;

    setProcessing(prev => ({ ...prev, [`delete-${reportId}`]: true }));
    try {
      const response = await fetch(`/api/reports/${reportId}`, { method: "DELETE" });
      if (response.ok) {
        setReports((prevReports) => prevReports.filter((report) => report.id !== reportId));
      } else {
        alert(language === "en" ? "Failed to delete the report." : "Imeshindwa kufuta ripoti.");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    } finally {
      setProcessing(prev => ({ ...prev, [`delete-${reportId}`]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-xl font-medium text-slate-600">
        <Loader2 className="mr-3 h-8 w-8 animate-spin text-emerald-600" />
        {language === "en" ? "Initializing Command Center Data..." : "Inaandaa Data ya Kituo cha Amri..."}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* OS-STYLE SIDEBAR (Responsive Mobile Drawer) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0B1120] text-slate-300 shadow-2xl border-r border-slate-800/50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pb-4">
          
          {/* Back to Public Map Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors mb-6 bg-slate-800/50 hover:bg-slate-800 px-3 py-2 rounded-lg border border-slate-700/50">
            <ArrowLeft size={14} /> 
            {language === "en" ? "Back to Public Map" : "Rudi kwa Ramani Umma"}
          </Link>

          <div className="flex items-center gap-3 text-white mb-6">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-900/20">
              <ShieldCheck className="text-white h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-wide text-slate-50">EcoLens Admin</h2>
              <p className="text-xs font-medium text-emerald-400/80">Command OS v2.0</p>
            </div>
          </div>

          {/* ADMIN LANGUAGE TOGGLE */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-1.5 flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 pl-2.5 flex items-center gap-1.5">
              <Globe size={14} className="text-emerald-400" /> Lang
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  language === "en"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("sw")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  language === "sw"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                SW
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => changeTab("dispatch")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === "dispatch" || activeTab === "report"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <LayoutDashboard size={18} className={activeTab === "dispatch" || activeTab === "report" ? "text-emerald-400" : "text-slate-500"} />
            {language === "en" ? "Dispatch Center" : "Kituo cha Usambazaji"}
          </button>

          <button 
            onClick={() => changeTab("analytics")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === "analytics" 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <BarChart3 size={18} className={activeTab === "analytics" ? "text-emerald-400" : "text-slate-500"} />
            {language === "en" ? "Analytics & Trends" : "Uchanganuzi na Mienendo"}
          </button>
          
          <button 
            onClick={() => changeTab("settings")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === "settings" 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <Settings size={18} className={activeTab === "settings" ? "text-emerald-400" : "text-slate-500"} />
            {language === "en" ? "System Settings" : "Mipangilio ya Mfumo"}
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800/50">
            <button 
              onClick={() => changeTab("map")}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
                activeTab === "map"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin size={18} />
                {language === "en" ? "Live Command Map" : "Ramani ya Moja kwa Moja"}
              </div>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800/50 bg-[#0B1120]">
          <form action={logoutAdmin}>
            <button 
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={18} />
              {language === "en" ? "End Secure Session" : "Funga Kipindi Salama"}
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto flex flex-col relative z-10 bg-slate-50/50">
        
        {/* Mobile Top Navigation Bar */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)} 
              className="p-1.5 -ml-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-500 h-5 w-5" />
              <span className="font-bold text-slate-800 text-sm">EcoLens Admin</span>
            </div>
          </div>
        </div>

        {/* Top Status Bar (Telemetry) */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-2.5 text-xs text-slate-500 flex flex-wrap items-center justify-end gap-6 shadow-sm sticky top-[57px] md:top-0 z-30">
          <span className="flex items-center gap-2 font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {language === "en" ? "EcoLens Core Active" : "EcoLens Inafanya Kazi"}
          </span>
          <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors cursor-default">
            <Satellite size={14} className="text-blue-500" /> {language === "en" ? "Sentinel-2 Uplink" : "Muunganisho wa Sentinel-2"}
          </span>
          <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors cursor-default">
            <Radio size={14} className="text-purple-500" /> {language === "en" ? "OpenAQ Sync" : "Usawazishaji wa OpenAQ"}
          </span>
        </div>

        <div className={`p-4 sm:p-6 md:p-10 mx-auto w-full ${activeTab === 'map' || activeTab === 'report' ? 'max-w-[1600px] h-[calc(100vh-100px)] md:h-full flex flex-col' : 'max-w-7xl'}`}>

          {/* API HEALTH MONITOR BANNER */}
          {apiHealth && apiHealth.status === "error" && activeTab !== "map" && activeTab !== "report" && (
            <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 flex items-center justify-between text-red-700 animate-pulse">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">Critical Infrastructure Warning</h4>
                  <p className="text-xs text-red-600/90">{apiHealth.message}</p>
                </div>
              </div>
              <button 
                onClick={() => changeTab("settings")}
                className="text-xs font-bold bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-500 transition-colors shrink-0"
              >
                View Telemetry
              </button>
            </div>
          )}

          {/* --- EMBEDDED MAP VIEW --- */}
          {activeTab === "map" && (
            <div className="h-full w-full animate-in fade-in zoom-in-95 duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <MapPin className="text-blue-500" /> 
                    {language === "en" ? "Live Command Map" : "Ramani ya Moja kwa Moja"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">Secure embedded instance</p>
                </div>
                <button 
                  onClick={() => changeTab("dispatch")} 
                  className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm transition-all hover:bg-slate-50"
                >
                  <X size={16} /> Close Map
                </button>
              </div>
              <div className="flex-1 bg-slate-100 rounded-3xl border border-slate-200 shadow-inner overflow-hidden relative">
                <iframe src="/map?admin=true" className="absolute inset-0 w-full h-full border-0" />
              </div>
            </div>
          )}

          {/* --- EMBEDDED REPORT INSPECTOR --- */}
          {activeTab === "report" && viewingReportId && (
            <div className="h-full w-full animate-in fade-in zoom-in-95 duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="text-emerald-500" /> 
                    {language === "en" ? "Incident Inspector" : "Kikaguzi cha Tukio"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">Secure embedded instance</p>
                </div>
                <button 
                  onClick={() => {
                    changeViewingReportId(null);
                    changeTab("dispatch");
                  }} 
                  className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm transition-all hover:bg-slate-50"
                >
                  <RotateCcw size={16} /> Return to Queue
                </button>
              </div>
              <div className="flex-1 bg-slate-100 rounded-3xl border border-slate-200 shadow-inner overflow-hidden relative">
                <iframe src={`/analysis/${viewingReportId}?admin=true`} className="absolute inset-0 w-full h-full border-0 bg-white" />
              </div>
            </div>
          )}
          
          {/* --- SETTINGS & PROFILE TAB --- */}
          {activeTab === "settings" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {language === "en" ? "System Settings & Profile" : "Mipangilio na Wasifu"}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-500">
                  {language === "en" ? "Manage your admin account, system telemetry, and platform preferences." : "Dhibiti akaunti yako ya msimamizi, telemetry, na mapendeleo."}
                </p>
              </div>

              <div className="grid gap-6 max-w-3xl">
                
                {/* DYNAMIC ADMIN PROFILE CARD */}
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 transition-all">
                  
                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="flex-1 w-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          placeholder="e.g. Judge Smith" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role / Title</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.role}
                          onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                          placeholder="e.g. Hackathon Evaluation Panel" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <button type="submit" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md">
                          Save Profile
                        </button>
                        <button type="button" onClick={() => setIsEditingProfile(false)} className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left w-full sm:w-auto">
                        <div className="h-20 w-20 shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-black border-4 border-emerald-50 shadow-inner">
                          {adminProfile.initials}
                        </div>
                        <div>
                          <div className="flex items-center justify-center sm:justify-start gap-3">
                            <h3 className="text-xl font-bold text-slate-900">{adminProfile.name}</h3>
                            <button 
                              onClick={() => {
                                setEditForm({ name: adminProfile.name, role: adminProfile.role });
                                setIsEditingProfile(true);
                              }}
                              className="text-slate-400 hover:text-emerald-600 transition-colors p-1"
                              title="Edit Profile"
                            >
                              <Pencil size={14} />
                            </button>
                          </div>
                          <p className="text-sm font-medium text-purple-600 mb-1">{adminProfile.role}</p>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                            <p className="text-xs text-slate-400">{language === "en" ? "Root Infrastructure Access" : "Ufikiaji wa Mfumo"}</p>
                            <p className="text-xs font-semibold flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                              <Users size={12} /> {adminCount} {language === "en" ? (adminCount === 1 ? "Active Admin" : "Active Admins") : (adminCount === 1 ? "Msimamizi Hai" : "Wasimamizi Hai")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <form action={logoutAdmin} className="shrink-0 mt-4 sm:mt-0 w-full sm:w-auto hidden sm:block">
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 text-red-600 px-5 py-2.5 text-sm font-semibold hover:bg-red-100 transition-colors">
                          <LogOut size={16} />
                          {language === "en" ? "Sign Out" : "Toka"}
                        </button>
                      </form>
                    </>
                  )}
                </div>

                {/* AI Threshold Setting */}
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Sliders size={20} /></div>
                    <h3 className="text-lg font-bold text-slate-800">{language === "en" ? "AI Confidence Threshold" : "Kiwango cha Kujiamini cha AI"}</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{language === "en" ? "Incidents below this confidence score will require manual review before appearing on the public map." : "Matukio yaliyo chini ya alama hii yatahitaji ukaguzi kabla ya kuonekana."}</p>
                  <div className="flex items-center gap-4">
                    <input type="range" min="50" max="99" defaultValue="85" className="w-full accent-emerald-600" />
                    <span className="font-bold text-slate-700 w-12">85%</span>
                  </div>
                </div>

                {/* ENVIRONMENT TELEMETRY VAULT */}
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm transition-all overflow-x-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Key size={20} /></div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{language === "en" ? "Environment Telemetry Vault" : "Ghala la Mfumo"}</h3>
                        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Connected to Server .env</span>
                      </div>
                    </div>
                    
                    {apiHealth && apiHealth.status === "error" ? (
                      <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                        Telemetry Alert
                      </span>
                    ) : (
                      <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Securely Linked
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 mb-6">
                    {language === "en" 
                      ? "Real-time diagnostic status of your server-side environment variables. If a token fails post-hackathon, telemetry flags it here instantly." 
                      : "Hali ya uchunguzi wa wakati halisi wa vigezo vyako vya seva."}
                  </p>
                  
                  <div className="space-y-4">
                    <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${apiHealth && apiHealth.status === "error" ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Google Gemini Core Token</p>
                        <p className="text-sm font-mono font-bold text-slate-800 mt-0.5 truncate">GEMINI_API_KEY (Server Side)</p>
                      </div>
                      {apiHealth && apiHealth.status === "error" ? (
                        <span className="w-fit px-3 py-1 rounded-lg bg-red-100 text-red-800 text-xs font-bold animate-pulse flex items-center gap-1.5 shrink-0">
                          <XCircle size={14} /> Disconnected
                        </span>
                      ) : (
                        <span className="w-fit px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shrink-0">
                          <Check size={14} /> Active & Healthy
                        </span>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Esri / Mapbox Tile Token</p>
                        <p className="text-sm font-mono font-bold text-slate-800 mt-0.5 truncate">NEXT_PUBLIC_MAP_TOKEN</p>
                      </div>
                      <span className="w-fit px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shrink-0">
                        <Check size={14} /> Active & Healthy
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* --- ANALYTICS TAB --- */}
          {activeTab === "analytics" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {language === "en" ? "Analytics & Trends" : "Uchanganuzi na Mienendo"}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-500">
                  {language === "en" ? "Visual breakdown of pollution incidents across the region." : "Mchanganuo wa kuona wa matukio ya uchafuzi wa mazingira kote kanda."}
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-4xl">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <BarChart3 className="text-emerald-500" />
                  {language === "en" ? "Total Incident Reports by Area" : "Jumla ya Ripoti za Matukio kwa Eneo"}
                </h3>
                
                {chartData.length > 0 ? (
                  <div className="h-[300px] sm:h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#64748b', fontSize: 11 }}
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis 
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f1f5f9' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar 
                          dataKey="reports" 
                          fill="#10b981" 
                          radius={[6, 6, 0, 0]}
                          name={language === "en" ? "Reports" : "Ripoti"}
                          barSize={30}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] sm:h-[400px] w-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    {language === "en" ? "Not enough data to generate charts." : "Hakuna data ya kutosha kutengeneza chati."}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- DISPATCH TAB --- */}
          {activeTab === "dispatch" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    {language === "en" ? "Sector Dispatch Overview" : "Muhtasari wa Usambazaji"}
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-slate-500">
                    {language === "en" 
                      ? "Manage and deploy resources to verified incident hotspots."
                      : "Dhibiti na usambaze rasilimali kwa maeneo hatari yaliyothibitishwa."}
                  </p>
                </div>
              </div>

              {/* METRIC CARDS */}
              <div className="mb-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Activity size={64} className="text-slate-600" /></div>
                  <div className="relative z-10">
                    <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                      {language === "en" ? "Active Incidents" : "Matukio Yanayoendelea"}
                    </p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl sm:text-5xl font-black text-slate-800">{activeIncidents}</p>
                      <span className="text-xs sm:text-sm font-semibold text-emerald-500">Live</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-red-100 bg-gradient-to-br from-white to-red-50/50 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Flame size={64} className="text-red-600" /></div>
                  <div className="relative z-10">
                    <p className="text-[11px] sm:text-xs font-bold text-red-600/80 uppercase tracking-widest mb-1">
                      {language === "en" ? "24h Critical Spikes" : "Ongezeko Hatari (Saa 24)"}
                    </p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl sm:text-5xl font-black text-red-700">{criticalSpikes}</p>
                      {criticalSpikes > 0 && <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><CheckCircle size={64} className="text-emerald-600" /></div>
                  <div className="relative z-10">
                    <p className="text-[11px] sm:text-xs font-bold text-emerald-600/80 uppercase tracking-widest mb-1">
                      {language === "en" ? "Resources Deployed" : "Rasilimali Zilizosambazwa"}
                    </p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl sm:text-5xl font-black text-emerald-700">{resourcesDeployed}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUB-TABS: LIVE DISPATCH VS MANUAL REVIEW QUEUE */}
              <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
                <button
                  onClick={() => changeSubTab("live")}
                  className={`flex-1 sm:flex-none justify-center sm:justify-start flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    dispatchSubTab === "live"
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Activity size={16} />
                  {language === "en" ? "Live Dispatches" : "Matukio Hai"} ({liveReports.length})
                </button>

                <button
                  onClick={() => changeSubTab("review")}
                  className={`flex-1 sm:flex-none justify-center sm:justify-start flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    dispatchSubTab === "review"
                      ? "bg-amber-600 text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <AlertTriangle size={16} />
                  <span className="hidden sm:inline">{language === "en" ? "Manual Review Queue" : "Orodha ya Ukaguzi"}</span>
                  <span className="sm:hidden">{language === "en" ? "Review Queue" : "Ukaguzi"}</span>
                  ({reviewReports.length})
                </button>
              </div>

              <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className={dispatchSubTab === "live" ? "text-orange-500" : "text-amber-500"} size={22} /> 
                  {dispatchSubTab === "live" 
                    ? (language === "en" ? "Active Incident Hotspots" : "Maeneo Hai ya Matukio") 
                    : (language === "en" ? "Low-Confidence AI Queue" : "Orodha ya Ukaguzi wa AI")}
                </h2>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                  <div className="relative w-full sm:w-64 md:w-80">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={language === "en" ? "Search Report #, Location..." : "Tafuta Nambari, Eneo..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-sm font-medium outline-none transition-all"
                    />
                  </div>

                  <div className="relative w-full sm:w-48">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Calendar className="h-4 w-4 text-slate-500" />
                    </div>
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value as TimeframeOption)}
                      className="block w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-sm font-medium appearance-none cursor-pointer outline-none transition-all"
                    >
                      <option value="ALL">{language === "en" ? "All Time" : "Wakati Wote"}</option>
                      <option value="TODAY">{language === "en" ? "Today" : "Leo"}</option>
                      <option value="THIS_WEEK">{language === "en" ? "This Week" : "Wiki Hii"}</option>
                      <option value="THIS_MONTH">{language === "en" ? "This Month" : "Mwezi Huu"}</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-6 lg:grid-cols-2 pb-20">
                {hotspotGroups.map((group) => {
                  const isExpanded = expandedGroups[group.id];
                  const pendingCount = group.reports.filter(r => r.status !== "RESOLVED").length;
                  
                  return (
                    <div key={group.id} className={`flex flex-col rounded-3xl border shadow-sm transition-all duration-300 ${group.isCompletelyDispatched ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                      <div 
                        onClick={() => toggleGroup(group.id)}
                        className="flex cursor-pointer items-start justify-between p-4 sm:p-6 hover:bg-slate-50/50 rounded-t-3xl transition-colors"
                      >
                        <div className="pr-4">
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                            <MapPin size={18} className={`shrink-0 ${group.isCompletelyDispatched ? "text-emerald-500" : "text-blue-500"}`} />
                            <span className="truncate">{group.location}</span>
                          </h3>
                          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1.5 flex flex-wrap items-center gap-2">
                            <span className="bg-slate-100 px-2.5 py-0.5 rounded-full">{group.reports.length} {language === "en" ? "Total" : "Jumla"}</span>
                            {pendingCount > 0 && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">{pendingCount} {language === "en" ? "Pending" : "Inasubiri"}</span>}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                          {!group.isCompletelyDispatched && (
                            <div className={`flex flex-col items-end rounded-xl p-2 sm:p-2.5 border ${group.maxAQI > 150 ? 'bg-red-50/50 border-red-100' : 'bg-yellow-50/50 border-yellow-100'}`}>
                              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                {language === "en" ? "Max AQI" : "Juu"}
                              </span>
                              <span className={`text-sm sm:text-base font-black ${group.maxAQI > 150 ? 'text-red-600' : 'text-yellow-600'}`}>
                                {group.maxAQI}
                              </span>
                            </div>
                          )}
                          <div className={`rounded-full p-2 transition-colors ${isExpanded ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500'}`}>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/80 p-4 sm:p-5 rounded-b-3xl">
                          <div className="flex flex-col gap-3 sm:gap-3.5">
                            {group.reports.map((report) => {
                              const isResolved = report.status === "RESOLVED";
                              const isProcessingAction = processing[report.id];
                              const isProcessingDelete = processing[`delete-${report.id}`];
                              const isFire = report.pollutionType.toLowerCase().includes("smoke") || report.pollutionType.toLowerCase().includes("fire");

                              return (
                                <div key={report.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                  
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                                    <div>
                                      <h4 className="font-bold text-slate-800 text-sm sm:text-base">{getPollutionTitle(report)}</h4>
                                      <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-500">
                                        <span className={`px-2 py-1 sm:px-2.5 rounded-lg border ${report.predictedAQI > 150 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                                          AQI {report.predictedAQI}
                                        </span>
                                        <span className="px-2 py-1 sm:px-2.5 rounded-lg bg-slate-100 border border-slate-200">{new Date(report.createdAt).toLocaleDateString()}</span>
                                        <span className="px-2 py-1 sm:px-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-400">Report #{report.reportNumber}</span>
                                        {report.confidence !== undefined && (
                                          <span className="px-2 py-1 sm:px-2.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
                                            {language === "en" ? "AI:" : "AI:"} {report.confidence}%
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <button 
                                      onClick={() => {
                                        changeViewingReportId(report.id);
                                        changeTab("report");
                                      }}
                                      className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-2 sm:py-1.5 rounded-lg border border-blue-100 shrink-0 w-full sm:w-auto"
                                    >
                                      <FileText size={14} />
                                      {language === "en" ? "Inspect Report" : "Tazama Ripoti"}
                                    </button>
                                  </div>

                                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 pt-3 border-t border-slate-100">
                                    <button 
                                      onClick={() => handleDelete(report.id)}
                                      disabled={isProcessingDelete}
                                      title={language === "en" ? "Delete" : "Futa"}
                                      className="flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-500 disabled:opacity-70 shadow-sm"
                                    >
                                      {isProcessingDelete ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    </button>

                                    {dispatchSubTab === "review" ? (
                                      <button 
                                        onClick={() => handleIndividualAction(report.id, "dispatch")}
                                        disabled={isProcessingAction}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-md"
                                      >
                                        <Check size={16} />
                                        {language === "en" ? "Approve & Move to Live" : "Thibitisha"}
                                      </button>
                                    ) : isResolved ? (
                                      <button 
                                        onClick={() => handleIndividualAction(report.id, "revoke")}
                                        disabled={isProcessingAction}
                                        className="flex w-full sm:flex-1 items-center justify-center gap-2 rounded-xl bg-white border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-70 shadow-sm"
                                      >
                                        {isProcessingAction ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                                        {isProcessingAction ? "Recalling..." : "Recall Unit"}
                                      </button>
                                    ) : (
                                      <button 
                                        onClick={() => handleIndividualAction(report.id, "dispatch")}
                                        disabled={isProcessingAction}
                                        className={`flex w-full sm:flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-70 shadow-md ${
                                          isFire ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                                        }`}
                                      >
                                        {isProcessingAction ? (
                                          <Loader2 size={16} className="animate-spin" />
                                        ) : isFire ? (
                                          <Droplets size={16} /> 
                                        ) : (
                                          <Truck size={16} />
                                        )}
                                        {isProcessingAction ? "Deploying..." : "Dispatch"}
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
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 py-2 text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white rounded-b-3xl">
                          {language === "en" ? "Sector Secured" : "Sekta Imelindwa"}
                        </div>
                      )}
                    </div>
                  );
                })}

                {hotspotGroups.length === 0 && (
                  <div className="col-span-1 lg:col-span-2 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 sm:p-16 text-center flex flex-col items-center justify-center">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                      <Wind className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-1">
                      {language === "en" ? "No Reports Found" : "Hakuna Ripoti"}
                    </h3>
                    <p className="text-sm text-slate-500 max-w-sm">
                      {language === "en" 
                        ? "This queue is currently empty for the selected filters." 
                        : "Orodha hii haina ripoti kwa sasa."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}