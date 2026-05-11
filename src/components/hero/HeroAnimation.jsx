import { motion } from "framer-motion";
import { useMemo } from "react";

/* ─── Expanded Node Data with Orbit Assignment ─── */
const nodes = [
  // Orbit 1 (Inner)
  { label: "Register", orbit: 120, angle: -60, icon: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M14 3.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM19 8v6M22 11h-6" stroke="currentColor" strokeWidth="1.8" fill="none" /> },
  { label: "Trust", orbit: 120, angle: 120, icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" fill="none" /> },
  
  // Orbit 2 (Middle)
  { label: "Verify", orbit: 160, angle: 30, icon: <g stroke="currentColor" strokeWidth="1.8" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></g> },
  { label: "Secure", orbit: 160, angle: 210, icon: <g stroke="currentColor" strokeWidth="1.8" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></g> },
  
  // Orbit 3 (Outer)
  { label: "Vote", orbit: 210, angle: -130, icon: <g stroke="currentColor" strokeWidth="1.8" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></g> },
  { label: "Results", orbit: 210, angle: 80, icon: <g stroke="currentColor" strokeWidth="1.8" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" /></g> },
  { label: "Fast", orbit: 210, angle: 10, icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" fill="none" /> },
  { label: "Global", orbit: 210, angle: -10, icon: <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" fill="none" /> },
];

export default function HeroAnimation() {
  const CENTER = 250;
  const orbits = [80, 120, 160, 210];

  const nodePositions = useMemo(() => {
    return nodes.map((node, i) => {
      const angleRad = (node.angle * Math.PI) / 180;
      return {
        ...node,
        x: CENTER + node.orbit * Math.cos(angleRad),
        y: CENTER + node.orbit * Math.sin(angleRad),
      };
    });
  }, []);

  return (
    <div className="relative w-full max-w-[540px] mx-auto aspect-square">
      <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          
          <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
            <stop offset="70%" stopColor="#22c55e" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ─── Background Glows ─── */}
        <circle cx={CENTER} cy={CENTER} r="250" fill="url(#bg-glow)" />
        <motion.circle
          cx={CENTER} cy={CENTER} r="150"
          fill="url(#center-glow)"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orbits */}
        {orbits.map((r, i) => (
          <circle key={i} cx={CENTER} cy={CENTER} r={r} stroke="#e5e7eb" strokeWidth="1" fill="none" opacity="0.6" />
        ))}

        {/* Green Animated Lines */}
        <motion.circle
          cx={CENTER} cy={CENTER} r={orbits[2]}
          stroke="#22c55e" strokeWidth="1.5" strokeDasharray="30 200" strokeLinecap="round"
          filter="url(#glow)"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "250px 250px" }}
        />
        <motion.circle
          cx={CENTER} cy={CENTER} r={orbits[3]}
          stroke="#16a34a" strokeWidth="1" strokeDasharray="50 300" strokeLinecap="round"
          opacity="0.3"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "250px 250px" }}
        />

        {/* Central Badge */}
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <text x={CENTER} y={CENTER - 5} textAnchor="middle" className="text-[32px] font-black fill-neutral-900 tracking-tighter">100k+</text>
          <text x={CENTER} y={CENTER + 20} textAnchor="middle" className="text-[12px] font-bold fill-neutral-400 uppercase tracking-widest">Votes Secured</text>
        </motion.g>

        {/* Nodes */}
        {nodePositions.map((node, i) => (
          <motion.g 
            key={i} 
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            {/* Glow below specific node */}
            <circle cx={node.x} cy={node.y} r="25" fill="#22c55e" opacity="0.1" filter="url(#glow)" />

            {/* Node Background - All White Circles now, no black */}
            <circle cx={node.x} cy={node.y} r="22" fill="white" stroke="#e5e7eb" strokeWidth="1" className="shadow-md group-hover:border-votex-400 transition-colors" />

            {/* Icon - All Light Green now */}
            <svg x={node.x - 10} y={node.y - 10} width="20" height="20" viewBox="0 0 24 24" className="text-votex-500 group-hover:text-votex-600 transition-colors">
              {node.icon}
            </svg>

            {/* Subtle Label */}
            <text x={node.x} y={node.y + 35} textAnchor="middle" className="text-[8px] font-bold fill-neutral-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{node.label}</text>
          </motion.g>
        ))}

      </svg>
    </div>
  );
}
