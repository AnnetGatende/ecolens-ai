import {
  Satellite,
  MapPinned,
  BrainCircuit,
  Truck,
} from "lucide-react";

export default function Features() {

  const features = [
    {
      icon: Satellite,
      title: "Multi-Source Data Fusion",
      description: "Combines citizen-uploaded visual evidence with live OpenAQ sensor readings and Sentinel-2 satellite imagery.",
    },
    {
      icon: BrainCircuit,
      title: "24-Hour AI Forecasting",
      description: "Utilizes multimodal Gemma AI to analyze threats and predict localized Air Quality Index (AQI) spikes.",
    },
    {
      icon: MapPinned,
      title: "Actionable Hotspot Mapping",
      description: "Automatically groups isolated incident reports into distinct, prioritized neighborhood zones for intervention.",
    },
    {
      icon: Truck,
      title: "Rapid Resource Deployment",
      description: "A complete dispatch dashboard allowing officials to instantly deploy water-mist cannons and cleanup crews.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold text-slate-900">
          Enterprise Civic Infrastructure
        </h2>
        
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl bg-white p-8 shadow-sm border border-slate-100 hover:shadow-md transition"
            >
              <feature.icon className="h-10 w-10 text-emerald-600" />
              <h3 className="mt-6 text-xl font-bold text-slate-800">
                {feature.title}
              </h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}