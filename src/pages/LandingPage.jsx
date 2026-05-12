import React from "react";
import Navbar from "../components/ui/Navbar";
import HeroSection from "../components/hero/HeroSection";
import FeaturesSection from "../components/features/FeaturesSection";
import HowItWorksSection from "../components/how-it-works/HowItWorksSection";
import TrustedSection from "../components/trusted/TrustedSection";
import Footer from "../components/ui/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TrustedSection />
      </main>
      <Footer />
    </div>
  );
}
