import StatsCards from "@/components/dashboard/StatsCards";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import AIInsights from "@/components/dashboard/AIInsights";
import RecentReports from "@/components/dashboard/RecentReports";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-10">

          <h1 className="text-5xl font-extrabold tracking-tight">
            EcoLens Intelligence Dashboard
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Monitor real-time pollution reports, neighbourhood hotspots,
            predicted air quality, and AI-powered environmental insights
            generated from citizen reports.
          </p>

        </div>

        <StatsCards />
        <AlertsPanel />
        <AIInsights />
        <RecentReports />

      </section>

    </main>
  );
}