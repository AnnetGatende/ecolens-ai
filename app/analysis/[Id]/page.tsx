"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";

import UploadedReport from "@/components/analysis/UploadedReport";
import AIResultCard from "@/components/report/AIResultCard";

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
};

export default function AnalysisPage() {
  const params = useParams();
  const Id = params.Id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  // Create a reference to the container we want to print
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

  // react-to-print hook bypasses CSS parsing errors by using the native browser engine
  const handleDownloadPdf = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `EcoLens_Report_${report?.id.substring(0, 6) || 'Export'}`,
  });

  if (loading) {
    return (
      <div className="p-20 text-center text-xl font-medium text-gray-600">
        Loading AI Analysis...
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

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
      
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/analysis"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Back to Analysis Center
        </Link>

        <button
          onClick={() => handleDownloadPdf()}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Download size={18} />
          Download Official Report
        </button>
      </div>

      {/* The container that gets converted to PDF */}
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
            recommended_action: report.recommendation,
            likely_source: report.likelySource,
            health_risk: report.healthRisk,
            summary: report.summary,
          }}
        />
      </div>
      
    </main>
  );
}