"use client";

import { useEffect, useState } from "react";

export interface AnalysisResult {
  pollution: string;
  confidence: number;
  severity: string;
  aqi: number;
  recommendation: string;
  description?: string;
  category?: string;
}

export function useAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult");

    if (stored) {
      try {
        setAnalysis(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load analysis:", error);
      }
    }
  }, []);

  return analysis;
}