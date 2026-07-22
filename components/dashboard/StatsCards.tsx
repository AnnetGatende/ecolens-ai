"use client";

import { Activity, AlertTriangle, Wind, MapPinned } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function StatsCards() {
  const { language } = useLanguage();

  const stats = [
    {
      title: language === "en" ? "Reports Today" : "Ripoti za Leo",
      value: 28,
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
      change: "+12%",
    },
    {
      title: language === "en" ? "Active Hotspots" : "Maeneo Hatari Yanayoendelea",
      value: 7,
      icon: AlertTriangle,
      color: "from-red-500 to-orange-500",
      change: "+3",
    },
    {
      title: language === "en" ? "Average AQI" : "Wastani wa AQI",
      value: 81,
      icon: Wind,
      color: "from-yellow-500 to-orange-500",
      change: "-8%",
    },
    {
      title: language === "en" ? "Locations Covered" : "Maeneo Yaliyofikiwa",
      value: 15,
      icon: MapPinned,
      color: "from-emerald-500 to-green-600",
      change: "+2",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="group rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h2 className="mt-3 text-5xl font-extrabold">{stat.value}</h2>
                <p className="mt-3 text-sm font-medium text-emerald-600">
                  {stat.change} {language === "en" ? "this week" : "wiki hii"}
                </p>
              </div>

              <div
                className={`rounded-2xl bg-gradient-to-r ${stat.color} p-4 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon size={34} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}