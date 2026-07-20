"use client";

import {
  Sparkles,
  AlertTriangle,
  Wind,
  ShieldAlert,
} from "lucide-react";

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
  if (!result) return null;

  return (
    <div className="rounded-2xl border bg-white shadow-xl p-6 animate-in fade-in duration-700">

      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-emerald-600" />
        <h2 className="text-2xl font-bold">
          Gemma AI Analysis
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <div className="rounded-xl bg-emerald-50 p-4">
          <Wind className="mb-2 text-emerald-600" />

          <p className="text-sm text-gray-500">
            Pollution Type
          </p>

          <h3 className="font-bold text-lg">
            {result.pollution_type}
          </h3>
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <ShieldAlert className="mb-2 text-blue-600" />

          <p className="text-sm text-gray-500">
            Confidence
          </p>

          <h3 className="font-bold text-lg">
  {result.confidence}%
</h3>
        </div>

        <div className="rounded-xl bg-red-50 p-4">
          <AlertTriangle className="mb-2 text-red-600" />

          <p className="text-sm text-gray-500">
            Severity
          </p>

          <h3 className="font-bold text-lg">
            {result.severity}
          </h3>
        </div>

        <div className="rounded-xl bg-yellow-50 p-4">
          <Wind className="mb-2 text-yellow-600" />

          <p className="text-sm text-gray-500">
            Predicted AQI
          </p>

          <h3 className="font-bold text-lg">
            {result.aqi_prediction}
          </h3>
        </div>

      </div>

      <div className="mt-6 rounded-xl bg-indigo-50 p-4">

        <p className="font-semibold text-indigo-700">
          Likely Source
        </p>

        <p className="mt-2">
          {result.likely_source}
        </p>

      </div>

      <div className="mt-4 rounded-xl bg-red-50 p-4">

        <p className="font-semibold text-red-700">
          Health Risk
        </p>

        <p className="mt-2">
          {result.health_risk}
        </p>

      </div>

      <div className="mt-4 rounded-xl bg-gray-100 p-4">

        <p className="font-semibold">
          Recommended Action
        </p>

        <p className="mt-2">
          {result.recommended_action}
        </p>

      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 p-4">

        <p className="font-semibold text-emerald-700">
          AI Summary
        </p>

        <p className="mt-2">
          {result.summary}
        </p>

      </div>

    </div>
  );
}