"use client";

export default function MapLegend() {
  return (
    <div className="absolute left-5 bottom-8 z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-5 w-64 border border-gray-100">
      <h3 className="font-bold text-lg mb-4 text-gray-800">
        Pollution Levels
      </h3>
      
      <div className="space-y-3 text-sm text-gray-600 font-medium">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm" />
          <span>Low (AQI 0–50)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-sm" />
          <span>Moderate (51–100)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm" />
          <span>High (101–150)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-600 shadow-sm" />
          <span>Severe (151–200)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-900 shadow-sm" />
          <span>Critical (201+)</span>
        </div>
      </div>
    </div>
  );
}