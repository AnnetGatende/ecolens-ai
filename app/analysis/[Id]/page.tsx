"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import UploadedReport from "@/components/analysis/UploadedReport";
import AIResultCard from "@/components/report/AIResultCard";

type Report = {
  id: string;
  imageUrl: string | null;
  description: string;
  latitude: number;
  longitude: number;
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

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await fetch(`/api/reports/${Id}`);

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();

        console.log("Route Param:", Id);
        console.log("Fetched Data:", data);

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

  if (loading) {
    return (
      <div className="p-20 text-center text-xl">
        Loading AI Analysis...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-20 text-center">
        Report not found.
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
      <Link
        href="/analysis"
        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100"
      >
        <ArrowLeft size={18} />
        Back to AI Analysis Center
      </Link>

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
    </main>
  );
}