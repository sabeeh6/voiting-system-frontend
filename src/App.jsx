import { motion } from "framer-motion";
import { Shield, Zap, Lock, Users, ArrowRight } from "lucide-react";
import Navbar from "./components/Navbar";

const features = [
  {
    icon: <Lock className="w-6 h-6 text-blue-400" />,
    title: "Blockchain Secured",
    description: "Every vote is cryptographically secured and immutable on the ledger."
  },
  {
    icon: <Shield className="w-6 h-6 text-purple-400" />,
    title: "Anonymity Guaranteed",
    description: "Advanced zero-knowledge proofs ensure your vote remains private."
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "Real-time Results",
    description: "Watch the tally update instantly as votes are cast worldwide."
  }
];

function App() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
              The Future of Governance
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Decentralized Voting <br /> 
              <span className="text-blue-500">Made Simple.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10">
              Empower your community with a secure, transparent, and user-friendly 
              voting system built for the next generation of organizations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="group flex items-center gap-2 px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/40">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 text-lg font-bold text-slate-300 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-all">
                View Demo
              </button>
            </div>
          </motion.div>

          {/* Animated Illustration Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full -z-10" />
            <div className="max-w-4xl mx-auto p-2 bg-slate-800/30 rounded-[2.5rem] border border-slate-700/50 backdrop-blur-sm shadow-2xl">
              <div className="bg-slate-900 rounded-[2rem] h-[400px] flex items-center justify-center overflow-hidden">
                <div className="text-slate-500 flex flex-col items-center gap-4">
                   <Users className="w-16 h-16 opacity-20" />
                   <p className="font-medium opacity-40 italic">Interactive Dashboard Preview</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-colors group"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </section>
      </main>

      <footer className="py-12 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>© 2026 SecureVote. Built for the decentralized web.</p>
      </footer>
    </div>
  );
}

export default App;
