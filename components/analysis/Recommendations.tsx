"use client";

import {
  CheckCircle2,
} from "lucide-react";

const actions = [
  "Dispatch environmental officers immediately",
  "Extinguish burning waste",
  "Notify nearby residents",
  "Monitor AQI for the next 24 hours",
  "Schedule follow-up inspection",
];

export default function Recommendations() {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold mb-6">

        Recommended Actions

      </h2>

      <div className="space-y-5">

        {actions.map((action) => (

          <div
            key={action}
            className="flex items-center gap-4"
          >

            <CheckCircle2 className="text-emerald-500" />

            {action}

          </div>

        ))}

      </div>

    </div>
  );
}