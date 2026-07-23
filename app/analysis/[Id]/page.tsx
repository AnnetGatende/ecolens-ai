"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";

import UploadedReport from "@/components/analysis/UploadedReport";
import AIResultCard from "@/components/report/AIResultCard";
import { useLanguage } from "@/components/LanguageContext"; // Added Language Hook

export const dynamic = "force-dynamic";

type Report = {
  id: string;
  imageUrl: string | null;
  description: string;
  latitude: number;
  longitude: number;
  
  displayLocation?: string | null;
  area?: string | null;
  ward?: string | null;
  subCounty?: string | null;
  county?: string | null;

  status: string;
  createdAt: string;
  pollutionType: string;
  confidence: number;
  severity: string;
  predictedAQI: number;
  likelySource: string;
  healthRisk: string;
  recommendation: string;
  summary: string;
  
  // Added Swahili fields to the type
  recommendation_sw?: string;
  summary_sw?: string;
};

export default function AnalysisPage() {
  const params = useParams();
  const Id = params.Id as string;
  const { language } = useLanguage(); // Grab the active language

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPdf = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `EcoLens_Report_${report?.id.substring(0, 6) || 'Export'}`,
  });

  if (loading) {
    return (
      <div className="p-20 text-center text-xl font-medium text-gray-600">
        {language === "en" ? "Loading AI Analysis..." : "Inapakia Uchanganuzi wa AI..."}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
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

  // Determine which text to show based on the toggle
  const displayRecommendation = language === "en" 
    ? report.recommendation 
    : (report.recommendation_sw || report.recommendation); // Fallback to English if Swahili is missing

  const displaySummary = language === "en" 
    ? report.summary 
    : (report.summary_sw || report.summary);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/analysis"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          {language === "en" ? "Back to Analysis Center" : "Rudi kwenye Kituo cha Uchanganuzi"}
        </Link>

        <button
          onClick={() => handleDownloadPdf()}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Download size={18} />
          {language === "en" ? "Download Official Report" : "Pakua Ripoti Rasmi"}
        </button>
      </div>

      <div 
        ref={contentRef} 
        className="space-y-8 pb-4 print:p-8 print:bg-white"
      >
        <UploadedReport report={report} />

        <AIResultCard
          result={{
            pollution_type: report.pollutionType,
            confidence: report.confidence,
            severity: report.severity,
            aqi_prediction: report.predictedAQI,
            likely_source: report.likelySource,
            health_risk: report.healthRisk,
            recommended_action: displayRecommendation, // Passes the correct translated text
            summary: displaySummary,                   // Passes the correct translated text
          }}
        />
      </div>
      
    </main>
  );
}