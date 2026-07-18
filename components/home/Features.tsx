import {
    Camera,
    MapPinned,
    Brain,
    BarChart3,
  } from "lucide-react";
  
  export default function Features() {
  
    const features = [
      {
        icon: Camera,
        title: "AI Image Analysis",
        description: "Analyze pollution photos using Gemma AI.",
      },
      {
        icon: MapPinned,
        title: "Interactive Map",
        description: "Locate environmental pollution hotspots.",
      },
      {
        icon: Brain,
        title: "Gemma Assistant",
        description: "Receive AI-powered environmental insights.",
      },
      {
        icon: BarChart3,
        title: "Live Dashboard",
        description: "Track reports and environmental trends.",
      },
    ];
  
    return (
      <section className="bg-slate-50 py-24">
  
        <div className="mx-auto max-w-7xl px-6">
  
          <h2 className="text-center text-4xl font-bold">
            Powerful Features
          </h2>
  
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
  
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl bg-white p-8 shadow"
              >
                <feature.icon className="h-10 w-10 text-green-600" />
  
                <h3 className="mt-6 text-xl font-bold">
                  {feature.title}
                </h3>
  
                <p className="mt-4 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
  
          </div>
  
        </div>
  
      </section>
    );
  }