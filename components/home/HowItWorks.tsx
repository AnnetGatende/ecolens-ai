export default function HowItWorks() {

    const steps = [
      {
        title: "Upload a Photo",
        description:
          "Citizens capture smoke, illegal dumping, dust, or pollution incidents.",
        icon: "📸",
      },
      {
        title: "Gemma AI Analysis",
        description:
          "Gemma analyzes the image and classifies the pollution type.",
        icon: "🤖",
      },
      {
        title: "Hotspot Detection",
        description:
          "Reports are combined with nearby submissions to detect pollution hotspots.",
        icon: "📍",
      },
      {
        title: "Authorities Respond",
        description:
          "Municipal teams receive alerts and recommendations for action.",
        icon: "🚒",
      },
    ];
  
    return (
      <section className="py-24">
  
        <div className="mx-auto max-w-7xl px-6">
  
          <h2 className="text-center text-4xl font-bold">
            How EcoLens AI Works
          </h2>
  
          <div className="mt-16 grid gap-8 md:grid-cols-4">
  
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="text-5xl">{step.icon}</div>
  
                <h3 className="mt-6 text-xl font-bold">
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