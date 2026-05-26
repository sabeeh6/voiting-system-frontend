import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

import { Link } from "react-router-dom";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "Trusted By", href: "#trusted" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-white/70 backdrop-blur-2xl border-b border-votex-100/50 shadow-[0_8px_32px_rgba(11,138,76,0.05)]"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo with interactive hover */}
          <motion.a 
            href="#" 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-votex-600 flex items-center justify-center shadow-lg shadow-votex-600/20 overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter text-neutral-900 group-hover:text-votex-600 transition-colors">
              Vot<span className="text-votex-600">ex</span>
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-100/50 p-1.5 rounded-2xl border border-neutral-200/50">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-5 py-2 text-[13px] font-bold text-neutral-600 hover:text-votex-600 transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-1 left-5 right-5 h-0.5 bg-votex-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-[13px] font-black text-neutral-600 hover:text-votex-600 transition-colors">
              Sign In
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="px-6 py-3 bg-votex-600 text-white text-[13px] font-black rounded-xl premium-shadow flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-900"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-t border-neutral-100 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-xl font-black text-neutral-800 hover:text-votex-600"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <Link to="/login" className="py-4 text-center font-black text-neutral-600 bg-neutral-50 rounded-2xl">Sign In</Link>
                <Link to="/register" className="py-4 text-center font-black text-white bg-votex-600 rounded-2xl premium-shadow">Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
