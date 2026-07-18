import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Environmental Dashboard</h1>
      <p className="text-muted-foreground">
        View real-time environmental metrics and trends across monitored
        locations.
      </p>
      <Badge>Coming Soon</Badge>
    </main>
  );
}
