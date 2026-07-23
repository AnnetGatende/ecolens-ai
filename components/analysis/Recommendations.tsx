"use client";

import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

type Props = {
  recommendationText: string;
};

export default function Recommendations({ recommendationText }: Props) {
  const { language } = useLanguage();

  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">
        {language === "en" ? "Recommended Actions" : "Hatua Zilizopendekezwa"}
      </h2>
      
      <div className="flex items-start gap-4">
        <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" />
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {recommendationText || (language === "en" ? "No recommendations provided." : "Hakuna mapendekezo yaliyotolewa.")}
        </p>
      </div>
    </div>
  );
}