"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import UploadedReport from "@/components/analysis/UploadedReport";
import AIResultCard from "@/components/report/AIResultCard";
import { useLanguage } from "@/components/LanguageContext";

export const dynamic = "force-dynamic";

type Report = {
  id: string;
  reportNumber: number;
  imageUrl: string | null;
  
  description: string;
  description_en?: string | null; 
  description_sw?: string | null; 
  
  latitude: number;
  longitude: number;
  displayLocation?: string | null;
  area?: string | null;
  ward?: string | null;
  subCounty?: string | null;
  county?: string | null;
  status: string;
  createdAt: string;
  confidence: number;
  predictedAQI: number;
  
  pollutionType: string;
  likelySource: string;
  healthRisk: string;
  recommendation: string;
  summary: string;
  severity: string;
  
  pollutionType_sw?: string | null;
  likelySource_sw?: string | null;
  healthRisk_sw?: string | null;
  recommendation_sw?: string | null;
  summary_sw?: string | null;
  severity_sw?: string | null;
};

export default function AnalysisPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const Id = params.Id as string;
  const isAdmin = searchParams.get("admin") === "true";
  const { language } = useLanguage(); 

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadReport() {
      if (!Id) return; 

      try {
        const response = await fetch(`/api/reports/${Id}`);
        if (!response.ok) {
          setLoading(false);
          return;
        }
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (Id) {
      loadReport();
    }
  }, [Id]);

  // --- MODERN & STABLE PDF GENERATOR (MOBILE FULL-HEIGHT FIX) ---
  const handleDownloadPdf = async () => {
    if (!contentRef.current || !report) return;
    setDownloading(true);
    
    const ele = contentRef.current;
    
    // 1. Save original scroll position and styles
    const originalScrollY = window.scrollY;
    const originalStyles = {
      height: ele.style.height,
      overflow: ele.style.overflow,
    };

    try {
      // 2. Scroll to top to prevent rendering cut-offs on mobile
      window.scrollTo(0, 0);

      // 3. Force the container to expand to its absolute full height
      ele.style.height = `${ele.scrollHeight}px`;
      ele.style.overflow = "visible";

      // Allow a brief 100ms moment for the DOM to recalculate layouts
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 4. Capture the image using explicitly calculated dimensions
      const dataUrl = await toPng(ele, {
        quality: 1,
        pixelRatio: 2, 
        backgroundColor: '#f8fafc',
        width: ele.scrollWidth,
        height: ele.scrollHeight, 
        style: {
          margin: '0',
          transform: 'none', // Prevents CSS scaling issues
        },
      });

      // 5. Generate the PDF based on the captured aspect ratio
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (ele.scrollHeight * pdfWidth) / ele.scrollWidth;
      
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`EcoLens_Report_${report.reportNumber || report.id.substring(0,6)}.pdf`);
      
    } catch (error) {
      console.error("PDF generation failed:", error);
      setTimeout(() => alert(language === "en" ? "Failed to download PDF." : "Imeshindwa kupakua PDF."), 100);
    } finally {
      // 6. Instantly restore original styles and scroll position
      ele.style.height = originalStyles.height;
      ele.style.overflow = originalStyles.overflow;
      window.scrollTo(0, originalScrollY);
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4 text-xl font-medium text-emerald-700">
        <Loader2 className="animate-spin w-8 h-8" />
        {language === "en" ? "Loading AI Analysis..." : "Inapakia Uchanganuzi wa AI..."}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Report not found.</h2>
        <Link
          href="/analysis"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-white transition hover:bg-emerald-700"
        >
          <ArrowLeft size={18} />
          Go Back
        </Link>
      </div>
    );
  }

  const isSwahili = language === "sw";

  const displayPollutionType = isSwahili ? (report.pollutionType_sw || report.pollutionType) : report.pollutionType;
  const displayLikelySource = isSwahili ? (report.likelySource_sw || report.likelySource) : report.likelySource;
  const displayHealthRisk = isSwahili ? (report.healthRisk_sw || report.healthRisk) : report.healthRisk;
  const displayRecommendation = isSwahili ? (report.recommendation_sw || report.recommendation) : report.recommendation;
  const displaySummary = isSwahili ? (report.summary_sw || report.summary) : report.summary;
  const displaySeverity = isSwahili ? (report.severity_sw || report.severity) : report.severity;

  const displayDescription = isSwahili 
    ? (report.description_sw || report.description) 
    : (report.description_en || report.description);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Render Back Button ONLY for Public Users */}
        {!isAdmin ? (
          <Link
            href="/analysis"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
            {language === "en" ? "Back to Analysis Center" : "Rudi kwenye Kituo cha Uchanganuzi"}
          </Link>
        ) : (
          <div></div> // Empty div to maintain flex spacing when back button is hidden
        )}

        <h1 className="text-xl font-bold text-slate-800">
          {language === "en" ? `Incident Report #${report.reportNumber || 'N/A'}` : `Ripoti ya Tukio #${report.reportNumber || 'N/A'}`}
        </h1>

        {/* Render Download Button ONLY for Admins */}
        {isAdmin ? (
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70"
          >
            {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {downloading 
              ? (language === "en" ? "Generating PDF..." : "Inatengeneza PDF...") 
              : (language === "en" ? "Download Official Report" : "Pakua Ripoti Rasmi")}
          </button>
        ) : (
          <div></div> // Empty div to maintain flex spacing
        )}
      </div>

      <div 
        ref={contentRef} 
        className="space-y-8 pb-4 bg-slate-50 p-6 sm:p-10 rounded-3xl print:bg-white print:p-0"
      >
        <UploadedReport report={{ ...report, description: displayDescription }} />

        <AIResultCard
          result={{
            pollution_type: displayPollutionType,
            confidence: report.confidence,
            severity: displaySeverity,
            aqi_prediction: report.predictedAQI,
            likely_source: displayLikelySource,
            health_risk: displayHealthRisk,
            recommended_action: displayRecommendation, 
            summary: displaySummary,                  
          }}
        />
      </div>
      
    </main>
  );
}