"use client";

import { BrainCircuit } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function AnalysisSummary() {
  const { language } = useLanguage();

  return (
    <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-8">
      <div className="flex items-center gap-3 mb-4">
        <BrainCircuit size={35} />
        <h2 className="text-3xl font-bold">
          {language === "en" ? "Gemma AI Analysis" : "Uchanganuzi wa Gemma AI"}
        </h2>
      </div>

      <p className="text-lg">
        {language === "en"
          ? "Open waste burning detected with very high confidence. Immediate intervention is recommended due to elevated health risks for nearby residents."
          : "Uchomaji wa taka wazi umegunduliwa kwa uhakika wa hali ya juu. Uingiliaji kati wa haraka unapendekezwa kutokana na kuongezeka kwa hatari za kiafya kwa wakazi wa karibu."}
      </p>
    </div>
  );
}