"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function AssistantPage() {
  const { language } = useLanguage();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 flex flex-col items-center gap-8">
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          {language === "en" ? "System User Guide" : "Mwongozo wa Kutumia Mfumo"}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          {language === "en" 
            ? "Watch this complete tutorial to learn how to effectively report incidents, monitor pollution levels, and utilize the EcoLens AI dashboard." 
            : "Tazama mafunzo haya kamili ili kujifunza jinsi ya kuripoti matukio kwa ufanisi, kufuatilia viwango vya uchafuzi, na kutumia dashibodi ya EcoLens AI."}
        </p>
      </div>

      {/* Responsive YouTube Embed Container */}
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 shadow-2xl relative aspect-video bg-slate-100">
        <iframe 
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE" 
          title={language === "en" ? "EcoLens User Guide" : "Mwongozo wa EcoLens"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>

    </main>
  );
}