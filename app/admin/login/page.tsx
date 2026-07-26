"use client";

import { useState } from "react";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { loginAdmin } from "@/app/actions/auth";
import { useLanguage } from "@/components/LanguageContext";

export default function AdminLogin() {
  const { language } = useLanguage();
  const [error, setError] = useState(false);

  async function handleFormSubmit(formData: FormData) {
    const result = await loginAdmin(formData);
    if (result?.error) {
      setError(true);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-800/50 p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="rounded-full bg-emerald-500/20 p-4 mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {language === "en" ? "Municipal Command Center" : "Kituo cha Amri cha Manispaa"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {language === "en" 
              ? "Restricted Access. Please enter the dispatch authorization PIN to manage city resources."
              : "Ufikiaji Umezuiwa. Tafadhali weka nenosiri la idhini ya usambazaji ili kudhibiti rasilimali za jiji."}
          </p>

          <div className="mt-6 w-full rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
            <p className="text-sm font-semibold text-emerald-400 tracking-wide flex items-center justify-center gap-2">
              🛠️ {language === "en" ? "Demo PIN:" : "PIN ya Majaji:"} <span className="text-lg font-bold text-white">2026</span>
            </p>
          </div>
        </div>

        <form action={handleFormSubmit} className="mt-8 space-y-6 relative z-10">
          <div>
            <label htmlFor="pin" className="sr-only">Authorization PIN</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="pin"
                name="pin"
                type="password"
                required
                className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none sm:text-lg text-center tracking-[1em] transition-all"
                placeholder="••••"
                maxLength={4}
                onChange={() => setError(false)}
              />
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-400 text-center animate-pulse font-medium">
                {language === "en" ? "Invalid authorization code. Please try again." : "Nambari ya idhini si sahihi. Tafadhali jaribu tena."}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98]"
          >
            {language === "en" ? "Authenticate & Access" : "Thibitisha na Ufikie"} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </main>
  );
}