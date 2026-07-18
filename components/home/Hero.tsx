import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">

        <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          🌿 Powered by Google Gemma AI
        </span>

        <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
          Detect Pollution.
          <br />
          Protect Communities.
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-slate-600">
          EcoLens AI empowers citizens to report pollution through photos,
          allowing Gemma AI to analyze environmental hazards, detect pollution
          hotspots, and help local authorities respond faster.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-5">

          <Link href="/report">
            <Button size="lg">
              Report Pollution
            </Button>
          </Link>

          <Link href="/map">
            <Button variant="outline" size="lg">
              View Live Map
            </Button>
          </Link>

        </div>

      </div>
    </section>
  );
}