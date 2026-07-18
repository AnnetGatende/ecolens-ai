export default function Stats() {

    const stats = [
      { label: "Pollution Reports", value: "1,248+" },
      { label: "Hotspots Identified", value: "42" },
      { label: "Cities Covered", value: "12" },
      { label: "AI Accuracy", value: "94%" },
    ];
  
    return (
      <section className="py-24">
  
        <div className="mx-auto max-w-6xl px-6">
  
          <div className="grid gap-8 md:grid-cols-4">
  
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-green-600 p-8 text-center text-white"
              >
                <div className="text-4xl font-bold">
                  {stat.value}
                </div>
  
                <div className="mt-3">
                  {stat.label}
                </div>
  
              </div>
            ))}
  
          </div>
  
        </div>
  
      </section>
    );
  }