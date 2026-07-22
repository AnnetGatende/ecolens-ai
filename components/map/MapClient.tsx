"use client";

import dynamic from "next/dynamic";
import { useLanguage } from "@/components/LanguageContext";

// Mini component to handle bilingual loading text
function LoadingState() {
  const { language } = useLanguage();
  return (
    <div className="h-[700px] flex items-center justify-center rounded-3xl border bg-slate-100">
      <p className="text-lg font-medium">
        {language === "en" ? "Loading map..." : "Inapakia ramani..."}
      </p>
    </div>
  );
}

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <LoadingState />,
});

export default function MapClient() {
  return <MapView />;
}