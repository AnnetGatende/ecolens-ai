export default function HowItWorks() {

  const steps = [
    {
      title: "1. Crowdsource Detect",
      description:
        "Citizens capture visual evidence of hyper-local events like open waste burning, dust, or smog traps.",
      icon: "📸",
    },
    {
      title: "2. AI Risk Inference",
      description:
        "Gemma AI analyzes the image severity and fuses it with environmental data to forecast the 24h AQI impact.",
      icon: "🧠",
    },
    {
      title: "3. Sector Grouping",
      description:
        "Individual reports are mapped and clustered into actionable neighborhood containers via reverse-geocoding.",
      icon: "🗺️",
    },
    {
      title: "4. Targeted Dispatch",
      description:
        "Municipal operators expand sectors in the dashboard to deploy specific units directly to the exact coordinates.",
      icon: "🚒",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold text-slate-900">
          The Operational Loop
        </h2>
        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-slate-100 bg-slate-50 p-6 shadow-sm relative overflow-hidden"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-slate-800">
                {step.title}
              </h3>
              <p className="mt-3 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}