"use client";

import {
  Sparkles,
  AlertTriangle,
  Wind,
  ShieldAlert,
  Activity,
  Factory,
  HeartPulse,
  ClipboardCheck,
  Brain,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext"; // Added the language hook

type Props = {
  result: {
    pollution_type: string;
    confidence: number;
    severity: string;
    aqi_prediction: number;
    recommended_action: string;
    likely_source: string;
    health_risk: string;
    summary: string;
  } | null;
};

export default function AIResultCard({ result }: Props) {
  const { language } = useLanguage(); // Initialize the hook

  if (!result) return null;

  // I added "extreme" here just in case Gemma generates "Extreme" as shown in your screenshot!
  const severityColor =
    result.severity.toLowerCase() === "high" || result.severity.toLowerCase() === "extreme"
      ? "bg-red-100 text-red-700"
      : result.severity.toLowerCase() === "medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  const aqiColor =
    result.aqi_prediction >= 200
      ? "text-red-600"
      : result.aqi_prediction >= 100
      ? "text-yellow-600"
      : "text-green-600";

  return (
    <section className="overflow-hidden rounded-3xl border bg-white shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8" />
          <div>
            <h2 className="text-3xl font-bold">
              {language === "en" ? "Gemma AI Environmental Analysis" : "Uchanganuzi wa Mazingira wa Gemma AI"}
            </h2>
            <p className="mt-1 text-emerald-100">
              {language === "en" 
                ? "AI-generated environmental assessment and recommendations." 
                : "Tathmini na mapendekezo ya mazingira yaliyotolewa na AI."}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-8">
        {/* Statistics */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border bg-emerald-50 p-6">
            <Wind className="mb-4 h-7 w-7 text-emerald-600" />
            <p className="text-sm text-gray-500">
              {language === "en" ? "Pollution Type" : "Aina ya Uchafuzi"}
            </p>
            <h3 className="mt-2 font-bold">{result.pollution_type}</h3>
          </div>

          <div className="rounded-2xl border bg-blue-50 p-6">
            <ShieldAlert className="mb-4 h-7 w-7 text-blue-600" />
            <p className="text-sm text-gray-500">
              {language === "en" ? "AI Confidence" : "Uhakika wa AI"}
            </p>
            <h3 className="mt-2 text-4xl font-bold text-blue-700">{result.confidence}%</h3>
          </div>

          <div className="rounded-2xl border bg-red-50 p-6">
            <AlertTriangle className="mb-4 h-7 w-7 text-red-600" />
            <p className="text-sm text-gray-500">
              {language === "en" ? "Severity" : "Ukali"}
            </p>
            <span className={`mt-3 inline-flex rounded-full px-4 py-2 font-semibold ${severityColor}`}>
              {result.severity}
            </span>
          </div>

          <div className="rounded-2xl border bg-yellow-50 p-6">
            <Activity className="mb-4 h-7 w-7 text-yellow-600" />
            <p className="text-sm text-gray-500">
              {language === "en" ? "Predicted AQI" : "AQI Inayotabiriwa"}
            </p>
            <h3 className={`mt-2 text-4xl font-bold ${aqiColor}`}>{result.aqi_prediction}</h3>
          </div>
        </div>

        {/* Analysis */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <Factory className="text-indigo-600" />
              <h3 className="text-xl font-bold">
                {language === "en" ? "Likely Source" : "Chanzo Kinachowezekana"}
              </h3>
            </div>
            <p className="leading-8 text-gray-700">{result.likely_source}</p>
          </div>

          <div className="rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <HeartPulse className="text-red-600" />
              <h3 className="text-xl font-bold">
                {language === "en" ? "Health Risk" : "Hatari kwa Afya"}
              </h3>
            </div>
            <p className="leading-8 text-gray-700">{result.health_risk}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <ClipboardCheck className="text-emerald-600" />
            <h3 className="text-xl font-bold text-emerald-800">
              {language === "en" ? "Recommended Action" : "Hatua Inayopendekezwa"}
            </h3>
          </div>
          <p className="leading-8 text-gray-700">{result.recommended_action}</p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Brain className="text-blue-700" />
            <h3 className="text-xl font-bold text-blue-800">
              {language === "en" ? "AI Summary" : "Muhtasari wa AI"}
            </h3>
          </div>
          <p className="leading-8 text-gray-700">{result.summary}</p>
        </div>
      </div>
    </section>
  );
}