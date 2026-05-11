import Navbar from "./components/ui/Navbar";
import HeroSection from "./components/hero/HeroSection";
import FeaturesSection from "./components/features/FeaturesSection";
import HowItWorksSection from "./components/how-it-works/HowItWorksSection";
import TrustedSection from "./components/trusted/TrustedSection";
import Footer from "./components/ui/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white">
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

export default App;
