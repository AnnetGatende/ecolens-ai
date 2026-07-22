"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Mail } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function CTA() {
  const { language } = useLanguage();

  return (
    <section className="bg-slate-900 py-24 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <ShieldCheck className="mx-auto h-16 w-16 text-emerald-400 mb-6" />
        
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {language === "en" ? "Ready to Secure Your Airspace?" : "Uko Tayari Kulinda Anga Lako?"}
        </h2>
        
        <p className="mt-6 text-xl text-slate-300 max-w-2xl mx-auto">
          {language === "en"
            ? "Equip your municipal teams with the intelligence they need to detect, predict, and eliminate hyper-local pollution hotspots before they escalate."
            : "Wezesha timu zako za manispaa na ujasusi wanaohitaji ili kugundua, kutabiri, na kuondoa maeneo hatari ya uchafuzi kabla hayajawa makubwa."}
        </p>
        
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-emerald-500 text-slate-900 hover:bg-emerald-400 font-bold"
              >
                {language === "en" ? "Enter Command Center" : "Ingia Kituo cha Amri"}
              </Button>
            </Link>
            <Link href="/report">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
              >
                {language === "en" ? "Submit Test Report" : "Wasilisha Ripoti ya Majaribio"}
              </Button>
            </Link>
          </div>

          <a href="mailto:contact@annetdev.dpdns.org?subject=EcoLens%20Hackathon%20Inquiry">
            <Button
              size="lg"
              className="bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700"
            >
              <Mail className="mr-2 h-5 w-5 text-emerald-400" />
              {language === "en" ? "Contact Us" : "Wasiliana Nasi"}
            </Button>
          </a>
        </div>
        
        <p className="mt-10 text-sm text-slate-400">
          {language === "en" ? "Have questions? Email us directly at" : "Una maswali? Tutumie barua pepe moja kwa moja kupitia"}{" "}
          <a 
            href="mailto:contact@annetdev.dpdns.org" 
            className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-4"
          >
            contact@annetdev.dpdns.org
          </a>
        </p>
      </div>
    </section>
  );
}