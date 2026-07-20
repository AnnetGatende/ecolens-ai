"use client";

import {
  BrainCircuit,
  ShieldAlert,
  Wind,
  Trees,
  Sparkles,
} from "lucide-react";

export default function AIInsights() {
  return (
    <section className="mt-10">

      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit className="text-emerald-600" size={30} />

        <h2 className="text-3xl font-bold">
          Gemma AI Environmental Analysis
        </h2>
      </div>

      <div className="rounded-3xl border bg-gradient-to-br from-emerald-50 to-cyan-50 p-8 shadow-lg">

        <div className="flex items-center gap-3 mb-6">

          <Sparkles className="text-yellow-500" />

          <p className="font-semibold text-lg">
            Latest AI Assessment
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl bg-white p-5 shadow">

            <div className="flex items-center gap-2 mb-3">
              <Wind className="text-red-500" />
              <h3 className="font-bold">
                Pollution Type
              </h3>
            </div>

            <p className="text-2xl font-bold">
              Open Waste Burning
            </p>

          </div>

          <div className="rounded-2xl bg-white p-5 shadow">

            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="text-orange-500" />
              <h3 className="font-bold">
                Health Risk
              </h3>
            </div>

            <p className="text-2xl font-bold text-red-600">
              HIGH
            </p>

          </div>

          <div className="rounded-2xl bg-white p-5 shadow">

            <h3 className="font-bold mb-3">
              AI Confidence
            </h3>

            <div className="w-full bg-gray-200 rounded-full h-4">

              <div
                className="bg-emerald-500 h-4 rounded-full"
                style={{ width: "96%" }}
              />

            </div>

            <p className="mt-3 font-bold">
              96%
            </p>

          </div>

          <div className="rounded-2xl bg-white p-5 shadow">

            <div className="flex items-center gap-2 mb-3">
              <Trees className="text-green-600" />
              <h3 className="font-bold">
                Recommended Action
              </h3>
            </div>

            <p>
              Dispatch environmental officers,
              extinguish the burning waste,
              inspect nearby residences and
              monitor air quality for the next
              24 hours.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}