"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Loader2 } from "lucide-react";

import UploadedReport from "@/components/analysis/UploadedReport";
import AIResultCard from "@/components/report/AIResultCard";
import { useLanguage } from "@/components/LanguageContext";

export const dynamic = "force-dynamic";

type Report = {
  id: string;
  reportNumber: number;
  imageUrl: string | null;
  
  description: string;
  description_en?: string | null; 
  description_sw?: string | null; 
  
  latitude: number;
  longitude: number;
  displayLocation?: string | null;
  area?: string | null;
  ward?: string | null;
  subCounty?: string | null;
  county?: string | null;
  status: string;
  createdAt: string;
  confidence: number;
  predictedAQI: number;
  
  pollutionType: string;
  likelySource: string;
  healthRisk: string;
  recommendation: string;
  summary: string;
  severity: string;
  
  pollutionType_sw?: string | null;
  likelySource_sw?: string | null;
  healthRisk_sw?: string | null;
  recommendation_sw?: string | null;
  summary_sw?: string | null;
  severity_sw?: string | null;
};

export default function AnalysisPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const Id = params.Id as string;
  const isAdmin = searchParams.get("admin") === "true";
  const { language } = useLanguage(); 

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      if (!Id) return; 

      try {
        const response = await fetch(`/api/reports/${Id}`);
        if (!response.ok) {
          setLoading(false);
          return;
        }
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (Id) {
      loadReport();
    }
  }, [Id]);

  // --- 100% RELIABLE NATIVE PDF / PRINT GENERATOR ---
  const handleDownloadPdf = () => {
    // This triggers the device's native "Save as PDF" dialog.
    // It is crash-proof on mobile and creates crisp, selectable text.
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4 text-xl font-medium text-emerald-700 print:hidden">
        <Loader2 className="animate-spin w-8 h-8" />
        {language === "en" ? "Loading AI Analysis..." : "Inapakia Uchanganuzi wa AI..."}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 print:hidden">
        <h2 className="text-2xl font-bold text-gray-800">Report not found.</h2>
        <Link
          href="/analysis"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-white transition hover:bg-emerald-700"
        >
          <ArrowLeft size={18} />
          Go Back
        </Link>
      </div>
    );
  }

  const isSwahili = language === "sw";

  const displayPollutionType = isSwahili ? (report.pollutionType_sw || report.pollutionType) : report.pollutionType;
  const displayLikelySource = isSwahili ? (report.likelySource_sw || report.likelySource) : report.likelySource;
  const displayHealthRisk = isSwahili ? (report.healthRisk_sw || report.healthRisk) : report.healthRisk;
  const displayRecommendation = isSwahili ? (report.recommendation_sw || report.recommendation) : report.recommendation;
  const displaySummary = isSwahili ? (report.summary_sw || report.summary) : report.summary;
  const displaySeverity = isSwahili ? (report.severity_sw || report.severity) : report.severity;

  const displayDescription = isSwahili 
    ? (report.description_sw || report.description) 
    : (report.description_en || report.description);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-12 print:px-0 print:py-4 print:space-y-4 print:m-0">
      
      {/* HEADER SECTION - Hidden entirely when saving as PDF */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        
        {!isAdmin ? (
          <Link
            href="/analysis"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
            {language === "en" ? "Back to Analysis Center" : "Rudi kwenye Kituo cha Uchanganuzi"}
          </Link>
        ) : (
          <div></div> 
        )}

        <h1 className="text-xl font-bold text-slate-800">
          {language === "en" ? `Incident Report #${report.reportNumber || 'N/A'}` : `Ripoti ya Tukio #${report.reportNumber || 'N/A'}`}
        </h1>

        {isAdmin ? (
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Download size={18} />
            {language === "en" ? "Save Official PDF" : "Pakua Ripoti Rasmi"}
          </button>
        ) : (
          <div></div> 
        )}
      </div>

      {/* REPORT CONTENT - Formatted cleanly for both screen and PDF */}
      <div className="space-y-8 bg-slate-50 p-6 sm:p-10 rounded-3xl print:space-y-6 print:bg-white print:p-0 print:rounded-none print:shadow-none border-none">
        
        {/* We add a print-only header so the PDF still looks official */}
        <div className="hidden print:block border-b-2 border-emerald-600 pb-4 mb-6">
          <h1 className="text-3xl font-black text-slate-900">EcoLens AI Command Center</h1>
          <p className="text-slate-500 font-bold mt-1">
            {language === "en" ? `Official Incident Report #${report.reportNumber || 'N/A'}` : `Ripoti Rasmi ya Tukio #${report.reportNumber || 'N/A'}`}
          </p>
        </div>

        <UploadedReport report={{ ...report, description: displayDescription }} />

        <AIResultCard
          result={{
            pollution_type: displayPollutionType,
            confidence: report.confidence,
            severity: displaySeverity,
            aqi_prediction: report.predictedAQI,
            likely_source: displayLikelySource,
            health_risk: displayHealthRisk,
            recommended_action: displayRecommendation, 
            summary: displaySummary,                  
          }}
        />
        
        {/* Print-only footer */}
        <div className="hidden print:block mt-12 pt-4 border-t border-slate-200 text-xs text-slate-400 text-center">
          Generated automatically by EcoLens AI Neural Network | Confidence Score: {report.confidence}%
        </div>
      </div>
      
    </main>
  );
}