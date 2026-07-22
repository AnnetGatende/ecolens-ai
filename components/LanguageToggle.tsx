"use client";

import { useLanguage } from "@/components/LanguageContext"; // Adjust import path if needed
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-100"
    >
      <Globe className="h-4 w-4 text-emerald-500" />
      <span className="font-bold">{language === "en" ? "EN" : "SW"}</span>
    </Button>
  );
}