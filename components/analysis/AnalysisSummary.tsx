"use client";

import { BrainCircuit } from "lucide-react";

export default function AnalysisSummary() {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-8">

      <div className="flex items-center gap-3 mb-4">

        <BrainCircuit size={35} />

        <h2 className="text-3xl font-bold">
          Gemma AI Analysis
        </h2>

      </div>

      <p className="text-lg">

        Open waste burning detected with very high confidence.
        Immediate intervention is recommended due to elevated
        health risks for nearby residents.

      </p>

    </div>
  );
}