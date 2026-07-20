import { prisma } from "@/lib/prisma";
import AnalysisCenter from "@/components/analysis/AnalysisCenter";

export default async function AnalysisPage() {
  console.log("THIS PAGE IS RUNNING");

  const reports = await prisma.pollutionReport.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const stats = {
    totalReports: reports.length,
    pendingReports: reports.filter(
      (r) => r.status === "PENDING"
    ).length,
    resolvedReports: reports.filter(
      (r) => r.status === "RESOLVED"
    ).length,
    criticalReports: reports.filter(
      (r) => r.severity === "High"
    ).length,
  };

  console.log(stats);

  return (
    <AnalysisCenter
      reports={reports}
      stats={stats}
    />
  );
}