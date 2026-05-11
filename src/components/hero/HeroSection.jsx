import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import HeroAnimation from "./HeroAnimation";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-[72px]"
      aria-label="Hero section"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {/* Top-right blob */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-votex-100/40 blur-[100px]" />
        {/* Bottom-left blob */}
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-votex-50/60 blur-[120px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #0B8A4C 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-votex-50 border border-votex-200 rounded-full"
            >
              <span className="w-2 h-2 rounded-full bg-votex-500 animate-pulse" />
              <span className="text-[13px] font-semibold text-votex-700 tracking-wide uppercase">
                Now in Public Beta
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight text-neutral-900 mb-6">
              Modern Voting{" "}
              <br className="hidden sm:block" />
              Made{" "}
              <span className="text-votex-600">Simple</span>,{" "}
              <span className="text-votex-600">Secure</span>{" "}
              <br className="hidden sm:block" />
              & <span className="text-votex-600">Reliable</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-neutral-500 leading-relaxed mb-10 max-w-xl">
              Empower every voice. Secure every vote. Build trust with a voting 
              system designed for the future.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2.5 px-7 py-4 text-[15px] font-bold text-white bg-votex-600 rounded-2xl hover:bg-votex-700 transition-all duration-200 shadow-xl shadow-votex-600/20 hover:shadow-votex-600/30"
              >
                Start Voting Now
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2.5 px-7 py-4 text-[15px] font-bold text-votex-700 bg-white border-2 border-votex-200 rounded-2xl hover:border-votex-400 hover:bg-votex-50 transition-all duration-200"
              >
                <Play size={16} className="text-votex-600" />
                Watch Demo
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-neutral-100">
              {[
                { value: "2M+", label: "Votes Cast" },
                { value: "99.99%", label: "Uptime" },
                { value: "150+", label: "Organizations" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-neutral-900">{stat.value}</p>
                  <p className="text-sm text-neutral-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <HeroAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
