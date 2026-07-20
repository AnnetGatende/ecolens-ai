import MapClient from "@/components/map/MapClient";

export default function MapPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-5xl font-bold mb-4">
          Pollution Map
        </h1>

        <p className="text-gray-600 mb-8">
          Interactive visualization of citizen pollution reports across Mombasa.
        </p>

        <MapClient />
      </section>
    </main>
  );
}