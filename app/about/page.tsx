import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">About EcoLens AI</h1>
      <p className="text-muted-foreground">
        Learn about EcoLens AI and our mission to make environmental data
        accessible to everyone.
      </p>
      <Badge>Coming Soon</Badge>
    </main>
  );
}
