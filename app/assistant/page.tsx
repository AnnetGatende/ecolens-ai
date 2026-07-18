import { Badge } from "@/components/ui/badge";

export default function AssistantPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Gemma AI Assistant</h1>
      <p className="text-muted-foreground">
        Chat with Gemma to get insights and guidance on environmental data and
        pollution concerns.
      </p>
      <Badge>Coming Soon</Badge>
    </main>
  );
}
