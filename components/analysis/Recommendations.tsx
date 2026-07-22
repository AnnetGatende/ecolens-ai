"use client";

import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function Recommendations() {
  const { language } = useLanguage();

  const actions = language === "en" 
    ? [
        "Dispatch environmental officers immediately",
        "Extinguish burning waste",
        "Notify nearby residents",
        "Monitor AQI for the next 24 hours",
        "Schedule follow-up inspection",
      ]
    : [
        "Tuma maafisa wa mazingira mara moja",
        "Zima taka zinazowaka",
        "Wajulishe wakazi wa karibu",
        "Fuatilia AQI kwa saa 24 zijazo",
        "Panga ukaguzi wa kufuatilia",
      ];

  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">
        {language === "en" ? "Recommended Actions" : "Hatua Zilizopendekezwa"}
      </h2>
      <div className="space-y-5">
        {actions.map((action) => (
          <div key={action} className="flex items-center gap-4">
            <CheckCircle2 className="text-emerald-500" />
            {action}
          </div>
        ))}
      </div>
    </div>
  );
}