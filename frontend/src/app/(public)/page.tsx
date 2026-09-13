import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Benefits from "@/components/sections/Benefits";
import CTA from "@/components/sections/CTA";

export default function Page() {
  return (
    <div className="min-h-screen bg-white pt-[72px] text-slate-900">

      <Header />

      <Hero />

      <Features />

      <HowItWorks />

      <Benefits />

      <CTA />

      <Footer />
      
    </div>
  );
}
