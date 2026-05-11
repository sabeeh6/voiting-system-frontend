import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import HeroAnimation from "./HeroAnimation";

const words = ["Secure.", "Reliable.", "Simple.", "Transparent."];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative pt-24 pb-16 lg:pt-40 lg:pb-28 overflow-hidden bg-white">
      {/* Background Decor - Stronger Premium Glows */}
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[800px] h-[800px] bg-votex-100/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[800px] h-[800px] bg-votex-200/30 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Dynamic Mid Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-votex-50/60 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-votex-700 text-sm font-bold mb-6 border border-votex-100 uppercase tracking-widest shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-votex-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-votex-500"></span>
                </span>
                Trusted by 200+ Organizations
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-[900] text-gray-900 leading-[1.1] mb-6 tracking-tight">
                Modern Voting <br />
                <span className="block sm:inline">Made </span>
                <span className="inline-flex relative h-[1.1em] items-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={words[index]}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-votex-600"
                    >
                      {words[index]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
              
              <p className="text-lg text-gray-500 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8 font-medium font-sans">
                Empower every voice. Secure every vote. Build trust with a decentralized voting system designed for absolute integrity.
              </p>

              {/* Feature Points */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mb-10">
                {["Immutable Ledger", "End-to-End Encrypted", "Real-time Tally"].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-[13px] font-bold text-gray-600">
                    <CheckCircle2 size={14} className="text-votex-500" />
                    {point}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button className="group relative px-8 py-4 bg-votex-600 text-white font-black rounded-2xl premium-shadow hover:premium-shadow-hover hover:bg-votex-700 transition-all flex items-center gap-2 overflow-hidden">
                  Get Started Now
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white text-gray-900 font-black rounded-2xl border-2 border-gray-100 hover:border-votex-200 transition-all flex items-center gap-2">
                  <Play size={18} className="fill-votex-600 text-votex-600" />
                  View Demo
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Content (Animation) */}
          <div className="flex-1 w-full flex justify-center items-center">
            <div className="relative w-full max-w-[500px]">
              <HeroAnimation />
              {/* Premium Float Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 -right-2 sm:right-0 bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] premium-shadow border border-white/50 z-20 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-votex-100 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-votex-600" />
                </div>
                <div>
                  <div className="text-xl font-black text-gray-900 leading-none">100%</div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Tamper Proof</div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
