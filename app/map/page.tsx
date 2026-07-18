export default function MapPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">
          Live Pollution Map
        </h1>

        <p className="text-muted-foreground max-w-2xl mx-auto">
          This page will visualize AI-detected pollution hotspots,
          citizen reports, satellite imagery, and sensor readings.
        </p>

        <div className="mt-10 rounded-2xl border border-dashed border-gray-400 p-20">
          <h2 className="text-2xl font-semibold">
            🚧 Map Module Under Construction
          </h2>

          <p className="mt-4 text-muted-foreground">
            The interactive pollution map will be connected after
            Gemma AI report analysis and the dashboard are completed.
          </p>
        </div>
      </div>
    </main>
  );
}