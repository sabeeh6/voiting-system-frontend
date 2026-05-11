import { motion } from "framer-motion";
import { useMemo } from "react";

/* ─── Node Data ─── */
const nodes = [
  {
    label: "Register",
    icon: (
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M14 3.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM19 8v6M22 11h-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    label: "Verify",
    icon: (
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </g>
    ),
  },
  {
    label: "Vote",
    icon: (
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 15l2 2 4-4" />
      </g>
    ),
  },
  {
    label: "Secure",
    icon: (
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </g>
    ),
  },
  {
    label: "Results",
    icon: (
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </g>
    ),
  },
];

/* ─── SVG Hand (Stylized tap gesture) ─── */
function HandSVG() {
  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      className="w-[80px] h-[106px] md:w-[100px] md:h-[133px] lg:w-[120px] lg:h-[160px]"
      aria-hidden="true"
    >
      {/* Index finger */}
      <path
        d="M52 12C52 5.4 56 2 60 2s8 3.4 8 10v48H52V12z"
        stroke="#0B8A4C"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Middle finger */}
      <path
        d="M68 60V28c0-5 3-8 7-8s7 3 7 8v32"
        stroke="#0B8A4C"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ring finger */}
      <path
        d="M82 60V36c0-4.5 2.8-7.5 6.5-7.5S95 31.5 95 36v24"
        stroke="#0B8A4C"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pinky */}
      <path
        d="M95 60V44c0-4 2.5-6.5 5.5-6.5s5.5 2.5 5.5 6.5v16"
        stroke="#0B8A4C"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Palm */}
      <path
        d="M38 72h68c2 0 4 2 4 5v20c0 22-16 42-40 42h-4c-24 0-38-18-38-42V77c0-3 2-5 4-5h6z"
        stroke="#0B8A4C"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Thumb */}
      <path
        d="M38 76c-6 0-14 2-16 10-2 8 2 14 10 16h6"
        stroke="#0B8A4C"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tap ripple lines */}
      <circle cx="60" cy="2" r="4" stroke="#0B8A4C" strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx="60" cy="2" r="10" stroke="#0B8A4C" strokeWidth="0.8" fill="none" opacity="0.15" />
    </svg>
  );
}

/* ─── Main Hero Animation Component ─── */
export default function HeroAnimation() {
  const CENTER = 250;
  const ORBIT_RADIUS = 175;
  const ORBIT_CIRCUMFERENCE = 2 * Math.PI * ORBIT_RADIUS;

  /* Calculate pentagon positions */
  const nodePositions = useMemo(() => {
    return nodes.map((node, i) => {
      const angleDeg = -90 + i * 72; // start from top
      const angleRad = (angleDeg * Math.PI) / 180;
      return {
        ...node,
        x: CENTER + ORBIT_RADIUS * Math.cos(angleRad),
        y: CENTER + ORBIT_RADIUS * Math.sin(angleRad),
        angleDeg,
      };
    });
  }, []);

  return (
    <div
      className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[540px] mx-auto aspect-square"
      role="img"
      aria-label="Animated illustration showing the 5 steps of the Votex voting process: Register, Verify, Vote, Secure, Results"
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full"
        fill="none"
      >
        {/* ── Glow Filter Definitions ── */}
        <defs>
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="current-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
            </feMerge>
          </filter>

          <radialGradient id="center-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B8A4C" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0B8A4C" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Background glow ── */}
        <circle cx={CENTER} cy={CENTER} r="220" fill="url(#center-gradient)" />

        {/* ── Orbit Ring (base) ── */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={ORBIT_RADIUS}
          stroke="#0B8A4C"
          strokeWidth="1"
          strokeDasharray="6 6"
          fill="none"
          opacity="0.15"
        />

        {/* ── Animated Electric Current Arc ── */}
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={ORBIT_RADIUS}
          stroke="#10A050"
          strokeWidth="2.5"
          strokeDasharray={`${ORBIT_CIRCUMFERENCE * 0.15} ${ORBIT_CIRCUMFERENCE * 0.85}`}
          strokeLinecap="round"
          fill="none"
          filter="url(#current-glow)"
          initial={{ rotate: -90 }}
          animate={{ rotate: 270 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        />

        {/* ── Second Current Arc (offset) ── */}
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={ORBIT_RADIUS}
          stroke="#34d399"
          strokeWidth="1.5"
          strokeDasharray={`${ORBIT_CIRCUMFERENCE * 0.08} ${ORBIT_CIRCUMFERENCE * 0.92}`}
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
          filter="url(#current-glow)"
          initial={{ rotate: 90 }}
          animate={{ rotate: -270 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        />

        {/* ── Connection Lines (node to center) ── */}
        {nodePositions.map((node, i) => (
          <motion.line
            key={`line-${i}`}
            x1={CENTER}
            y1={CENTER}
            x2={node.x}
            y2={node.y}
            stroke="#0B8A4C"
            strokeWidth="0.5"
            opacity="0.1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
          />
        ))}

        {/* ── Nodes ── */}
        {nodePositions.map((node, i) => {
          const nodeRadius = 32;
          return (
            <motion.g
              key={`node-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.4 + i * 0.12,
              }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            >
              {/* Pulse ring */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius + 6}
                fill="none"
                stroke="#10A050"
                strokeWidth="1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0, 0.4, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1.2,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              />

              {/* Node background */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill="white"
                stroke="#0B8A4C"
                strokeWidth="1.5"
              />

              {/* Active highlight (sequential glow) */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill="#ecfdf5"
                stroke="#10A050"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: i * 1.2,
                  times: [0, 0.1, 0.3, 0.5],
                  ease: "easeInOut",
                }}
              />

              {/* Icon */}
              <svg
                x={node.x - 12}
                y={node.y - 12}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="text-votex-600"
              >
                {node.icon}
              </svg>
            </motion.g>
          );
        })}

        {/* ── Node Labels ── */}
        {nodePositions.map((node, i) => {
          const labelOffset = 48;
          const angleRad = (node.angleDeg * Math.PI) / 180;
          const lx = node.x + labelOffset * Math.cos(angleRad) * 0.3;
          const ly = node.y + labelOffset;
          return (
            <motion.text
              key={`label-${i}`}
              x={node.x}
              y={node.angleDeg < 0 ? node.y - 44 : node.y + 52}
              textAnchor="middle"
              className="text-[11px] font-semibold fill-neutral-500 select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              {node.label}
            </motion.text>
          );
        })}

        {/* ── Floating Hand (Center) ── */}
        <motion.g
          animate={{ y: [0, -6, 0, 6, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <foreignObject
            x={CENTER - 60}
            y={CENTER - 70}
            width="120"
            height="160"
          >
            <div className="w-full h-full flex items-center justify-center">
              <HandSVG />
            </div>
          </foreignObject>
        </motion.g>

        {/* ── Center dot ── */}
        <motion.circle
          cx={CENTER}
          cy={CENTER + 50}
          r="3"
          fill="#10A050"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${CENTER}px ${CENTER + 50}px` }}
        />
      </svg>
    </div>
  );
}
