"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function GlobalBackButton() {
  const pathname = usePathname();
  const { language } = useLanguage();

  // 1. Where should the button stay HIDDEN?
  const isHome = pathname === "/";
  const isSecureDashboard = pathname === "/dashboard";
  const isAnalysisDetails = pathname.startsWith("/analysis/"); // Hides it here to prevent overlapping!

  if (isHome || isSecureDashboard || isAnalysisDetails) {
    return null;
  }

  // 2. Are we on the Admin Login screen? (We need a dark-mode button here)
  const isAdminLogin = pathname.startsWith("/admin") || pathname === "/dashboard";

  return (
    <div className={`fixed z-50 ${isAdminLogin ? 'top-6 left-6' : 'top-20 left-4 sm:left-8'}`}>
      <Link
        href="/"
        className={`flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-md backdrop-blur-md border transition-all hover:scale-105 ${
          isAdminLogin 
            ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white' // Dark mode for Admin Login
            : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200' // Light mode for public pages
        }`}
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">
          {language === "en" ? "Back to Home" : "Rudi Mwanzo"}
        </span>
      </Link>
    </div>
  );
}