import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-slate-900 py-24 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        
        <ShieldCheck className="mx-auto h-16 w-16 text-emerald-400 mb-6" />
        
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Ready to Secure Your Airspace?
        </h2>
        
        <p className="mt-6 text-xl text-slate-300 max-w-2xl mx-auto">
          Equip your municipal teams with the intelligence they need to detect, predict, and eliminate hyper-local pollution hotspots before they escalate.
        </p>
        
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-emerald-500 text-slate-900 hover:bg-emerald-400 font-bold"
            >
              Enter Command Center
            </Button>
          </Link>
          <Link href="/report">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Submit Test Report
            </Button>
          </Link>
        </div>
        
      </div>
    </section>
  );
}