"use client";

import { useAnalysis } from "@/hooks/useAnalysis";
import AnalysisSummary from "./AnalysisSummary";
import AnalysisMetrics from "./AnalysisMetrics";
import UploadedReport from "./UploadedReport";
import Recommendations from "./Recommendations";

export default function AnalysisProvider() {
  const analysis = useAnalysis();

  if (!analysis) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <h2 className="text-2xl font-bold">
          No Analysis Available
        </h2>

        <p className="mt-3 text-gray-500">
          Submit a pollution report first to generate an AI analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <AnalysisSummary analysis={analysis} />
      <AnalysisMetrics analysis={analysis} />
      <UploadedReport analysis={analysis} />
      <Recommendations analysis={analysis} />
    </div>
  );
}