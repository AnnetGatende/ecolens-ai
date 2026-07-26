"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "sw";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Load saved language preference from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("ecolens_lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "sw")) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("ecolens_lang", lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const newLang = prev === "en" ? "sw" : "en";
      localStorage.setItem("ecolens_lang", newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}