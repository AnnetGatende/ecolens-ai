"use client";

export default function MapLegend() {
  return (
    <div className="absolute left-5 bottom-5 z-10 bg-white rounded-2xl shadow-xl p-5 w-64">

      <h3 className="font-bold text-lg mb-4">
        Pollution Levels
      </h3>

      <div className="space-y-3">

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span>Low (AQI 0–50)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-yellow-400" />
          <span>Moderate (51–100)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-orange-500" />
          <span>High (101–150)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-600" />
          <span>Critical (151+)</span>
        </div>

      </div>

    </div>
  );
}