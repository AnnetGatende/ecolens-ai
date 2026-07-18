import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import Stats from "@/components/home/Stats";
import CTA from "@/components/home/CTA";
import LiveStats from "@/components/home/LiveStats";


export default function HomePage() {
  return (
    <>
      <Hero />
      <LiveStats /> 
      <HowItWorks />
      <Features />
      <Stats />
      <CTA />
    </>
  );
}