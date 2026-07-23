"use client";

import { BrainCircuit } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

type Props = {
  summaryText: string;
};

export default function AnalysisSummary({ summaryText }: Props) {
  const { language } = useLanguage();

  return (
    <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-8">
      <div className="flex items-center gap-3 mb-4">
        <BrainCircuit size={35} />
        <h2 className="text-3xl font-bold">
          {language === "en" ? "Gemma AI Analysis" : "Uchanganuzi wa Gemma AI"}
        </h2>
      </div>

      <p className="text-lg leading-relaxed">
        {summaryText || (language === "en" ? "No summary provided." : "Hakuna maelezo yaliyotolewa.")}
      </p>
    </div>
  );
}