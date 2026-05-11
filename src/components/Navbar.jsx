import { motion } from "framer-motion";
import { Vote, Shield, Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-slate-900/50 backdrop-blur-md border-b border-slate-800">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ rotate: -20, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Vote className="w-8 h-8 text-blue-500" />
        </motion.div>
        <span className="text-xl font-bold tracking-tight text-white">
          Secure<span className="text-blue-500">Vote</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#" className="hover:text-blue-400 transition-colors">How it Works</a>
        <a href="#" className="hover:text-blue-400 transition-colors">Security</a>
        <a href="#" className="hover:text-blue-400 transition-colors">Elections</a>
      </div>

      <button className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
        Launch App
      </button>
    </nav>
  );
}
