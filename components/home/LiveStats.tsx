import {
    AlertTriangle,
    MapPin,
    Wind,
    ShieldAlert,
  } from "lucide-react";
  
  const stats = [
    {
      title: "Reports Today",
      value: "127",
      subtitle: "+18 since morning",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Active Hotspots",
      value: "12",
      subtitle: "Need attention",
      icon: MapPin,
      color: "text-orange-600",
    },
    {
      title: "Average AQI",
      value: "78",
      subtitle: "Moderate",
      icon: Wind,
      color: "text-green-600",
    },
    {
      title: "Municipal Alerts",
      value: "5",
      subtitle: "Dispatched",
      icon: ShieldAlert,
      color: "text-blue-600",
    },
  ];
  
  export default function LiveStats() {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
  
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold">
              Live Environmental Intelligence
            </h2>
  
            <p className="text-slate-600 mt-3">
              Real-time monitoring powered by citizen reports and Gemma AI.
            </p>
          </div>
  
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
  
            {stats.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border bg-white p-8 shadow-sm hover:shadow-lg transition"
              >
                <item.icon
                  className={`w-10 h-10 ${item.color}`}
                />
  
                <h3 className="mt-6 text-lg font-semibold">
                  {item.title}
                </h3>
  
                <p className="text-5xl font-bold mt-3">
                  {item.value}
                </p>
  
                <p className="text-slate-500 mt-2">
                  {item.subtitle}
                </p>
              </div>
            ))}
  
          </div>
        </div>
      </section>
    );
  }