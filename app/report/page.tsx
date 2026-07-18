import { Badge } from "@/components/ui/badge";

export default function ReportPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Report Pollution</h1>
      <p className="text-muted-foreground">
        Submit pollution reports to help track and address environmental issues
        in your community.
      </p>
      <Badge>Coming Soon</Badge>
    </main>
  );
}
