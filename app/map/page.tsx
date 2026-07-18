import { Badge } from "@/components/ui/badge";

export default function MapPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Live Pollution Map</h1>
      <p className="text-muted-foreground">
        Explore an interactive map showing live pollution levels and hotspots
        near you.
      </p>
      <Badge>Coming Soon</Badge>
    </main>
  );
}
