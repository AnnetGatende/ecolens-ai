"use client";

const metrics = [
  {
    label: "Confidence",
    value: "97%",
    color: "bg-emerald-500",
  },
  {
    label: "Predicted AQI",
    value: "184",
    color: "bg-red-500",
  },
  {
    label: "Risk Level",
    value: "Critical",
    color: "bg-orange-500",
  },
  {
    label: "Pollution Type",
    value: "Smoke",
    color: "bg-sky-500",
  },
];

export default function AnalysisMetrics() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

      {metrics.map((metric) => (

        <div
          key={metric.label}
          className="rounded-3xl border bg-white p-6 shadow-sm"
        >

          <p className="text-gray-500">
            {metric.label}
          </p>

          <div
            className={`${metric.color} text-white rounded-xl mt-4 p-4 text-center`}
          >

            <h2 className="text-3xl font-bold">

              {metric.value}

            </h2>

          </div>

        </div>

      ))}

    </div>
  );
}