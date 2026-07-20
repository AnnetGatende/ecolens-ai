import ReportCard from "./ReportCard";

type Report = {
  id: string;
  imageUrl: string | null;
  pollutionType: string;
  severity: string;
  predictedAQI: number;
  status: string;
  createdAt: Date;
};

type Props = {
  reports: Report[];

  stats: {
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    criticalReports: number;
  };
};

export default function AnalysisCenter({
  reports,
  stats,
}: Props) {
  return (
    <section className="space-y-10">

      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          AI Analysis Center
        </h1>

        <p className="mt-2 text-gray-500">
          Browse and manage every pollution incident analyzed by Gemma AI.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Reports
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {stats.totalReports}
          </h2>
        </div>

        <div className="rounded-2xl border bg-yellow-50 p-6 shadow-sm">
          <p className="text-sm text-yellow-700">
            Pending Reports
          </p>

          <h2 className="mt-3 text-4xl font-bold text-yellow-700">
            {stats.pendingReports}
          </h2>
        </div>

        <div className="rounded-2xl border bg-green-50 p-6 shadow-sm">
          <p className="text-sm text-green-700">
            Resolved Reports
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-700">
            {stats.resolvedReports}
          </h2>
        </div>

        <div className="rounded-2xl border bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-700">
            Critical Reports
          </p>

          <h2 className="mt-3 text-4xl font-bold text-red-700">
            {stats.criticalReports}
          </h2>
        </div>

      </div>

      {/* Reports */}

      <div>

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-semibold">
            Incident Reports
          </h2>

          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
            {reports.length} Total
          </span>

        </div>

        {reports.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">

            <h3 className="text-xl font-semibold">
              No Reports Found
            </h3>

            <p className="mt-2 text-gray-500">
              Upload a pollution incident to begin AI analysis.
            </p>

          </div>
        ) : (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
              />
            ))}

          </div>

        )}

      </div>

    </section>
  );
}