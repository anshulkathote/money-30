import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type {
  FinancialState,
  FinancialEvent,
  LandmarkDay,
  TrajectoryPoint,
} from "../types/financial";

interface Props {
  state: FinancialState;
  landmarks: LandmarkDay[];
  trajectory: TrajectoryPoint[];
  events: FinancialEvent[];
}

export default function MoneyMap({
  state,
  landmarks,
  trajectory,
  events,
}: Props) {
  // Currently selected landmark day for deep inspection
  const [selectedDayNum, setSelectedDayNum] = useState<number>(7);
  // Hovered event
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const selectedLandmark =
    landmarks.find((l) => l.day === selectedDayNum) || landmarks[1];
  const activeEvent = events.find((e) => e.id === activeEventId);

  // SVG coordinate dimensions for the 30-day Trajectory Canvas
  const svgWidth = 1000;
  const svgHeight = 360;
  const paddingX = 60;
  const paddingY = 40;

  // Coordinate mapper: Day 1..30 -> X, Balance 0..10000 -> Y
  const getX = (day: number) =>
    paddingX + ((day - 1) / 29) * (svgWidth - paddingX * 2);
  const getY = (balance: number) =>
    svgHeight -
    paddingY -
    (balance / 10000) * (svgHeight - paddingY * 2);

  // Build SVG path strings for the two trajectories
  const currentPathD = trajectory.reduce((acc, pt, idx) => {
    const x = getX(pt.day);
    const y = getY(pt.currentPath);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  const safePathD = trajectory.reduce((acc, pt, idx) => {
    const x = getX(pt.day);
    const y = getY(pt.safePath);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  // Area under current path for subtle gradient fill
  const currentAreaD = `${currentPathD} L ${getX(30)} ${svgHeight - paddingY} L ${getX(1)} ${svgHeight - paddingY} Z`;

  return (
    <section
      id="map"
      className="relative z-30 min-h-screen bg-transparent text-white pt-24 pb-40 px-6 sm:px-12 md:px-20 overflow-hidden"
    >
      {/* ── AMBIENT ATMOSPHERE ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 20%, rgba(245, 208, 97, 0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative max-w-7xl mx-auto flex flex-col gap-28">
        {/* ═══════════════════════════════════════════════════════════════
         * 1. INTRO: 02 / MONEY MAP — YOUR MONEY HAS A TRAJECTORY
         * ═══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8 border-b border-white/10 pb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="font-mono text-xs tracking-[0.35em] text-amber-300 uppercase px-3 py-1 rounded-sm border border-amber-400/20 bg-amber-400/5">
                02 / MONEY MAP
              </span>
              <span className="font-mono text-[11px] text-white/30 tracking-widest hidden sm:inline">
                30-DAY TEMPORAL TRAJECTORY
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-[clamp(4.2rem,11vw,9.5rem)] leading-[0.84] uppercase tracking-tight text-white"
            >
              YOUR MONEY<br />
              <span className="text-white/60">HAS A</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-white">
                TRAJECTORY.
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-3 max-w-sm md:text-right"
          >
            <p className="font-heading text-lg sm:text-xl font-light text-white/70 leading-snug">
              Every decision today changes what you can afford tomorrow.
            </p>
            <div className="font-mono text-xs text-white/40 tracking-wider">
              A ₹10,000 monthly pool is dynamic. Small variances compound into
              radically different outcomes by Day 30.
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 2. TRAJECTORY VISUALIZATION (THE HERO GRAPHIC)
         * ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-6 sm:p-10 rounded-sm border border-white/10 bg-[#0a0b12]/80 backdrop-blur-xl relative flex flex-col gap-6"
        >
          {/* Header & Legend */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-amber-300">
                PROJECTION ENGINE
              </span>
              <h3 className="font-heading text-2xl font-medium text-white mt-1">
                Two Diverging Futures
              </h3>
            </div>

            {/* Trajectory Legend */}
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
              {/* CURRENT PATH */}
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                <div className="flex flex-col">
                  <span className="text-amber-200 font-semibold tracking-wider">
                    CURRENT PATH
                  </span>
                  <span className="text-[10px] text-white/40">
                    Pace leads to ₹2,100 buffer
                  </span>
                </div>
              </div>

              {/* SAFE PATH */}
              <div className="flex items-center gap-3">
                <span className="w-3 h-0.5 bg-emerald-400/90 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                <div className="flex flex-col">
                  <span className="text-emerald-300 font-semibold tracking-wider">
                    SAFE PATH
                  </span>
                  <span className="text-[10px] text-white/40">
                    Recommended pace preserves ₹3,840
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SVG Trajectory Canvas */}
          <div className="relative w-full overflow-x-auto pb-4">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[700px] select-none"
            >
              <defs>
                <linearGradient id="currentFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5D061" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#F5D061" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFF" />
                  <stop offset="30%" stopColor="#F5D061" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>

              {/* Background Guideline Grid */}
              {[10000, 7500, 5000, 2500, 0].map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.06)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 12}
                      y={y + 4}
                      fill="rgba(255, 255, 255, 0.3)"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      ₹{val.toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* Area under current path */}
              <motion.path
                d={currentAreaD}
                fill="url(#currentFill)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4 }}
              />

              {/* SAFE PATH CURVE */}
              <motion.path
                d={safePathD}
                fill="none"
                stroke="rgba(52, 211, 153, 0.85)"
                strokeWidth="2"
                strokeDasharray="6 4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* CURRENT PATH CURVE */}
              <motion.path
                d={currentPathD}
                fill="none"
                stroke="url(#goldStroke)"
                strokeWidth="3.5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Landmark vertical markers & dots */}
              {landmarks.map((l) => {
                const x = getX(l.day);
                const currentY = getY(l.projectedBalance);
                const isSelected = selectedDayNum === l.day;
                const isCurrent = l.day === 7;

                return (
                  <g
                    key={l.day}
                    className="cursor-pointer group"
                    onClick={() => setSelectedDayNum(l.day)}
                  >
                    {/* Vertical guideline */}
                    <line
                      x1={x}
                      y1={paddingY}
                      x2={x}
                      y2={svgHeight - paddingY}
                      stroke={
                        isSelected
                          ? "rgba(251, 191, 36, 0.6)"
                          : "rgba(255, 255, 255, 0.08)"
                      }
                      strokeWidth={isSelected ? 1.5 : 1}
                    />

                    {/* Node on current path */}
                    <circle
                      cx={x}
                      cy={currentY}
                      r={isSelected ? 6 : 4}
                      fill={isCurrent ? "#F5D061" : "#FFF"}
                      stroke="#000"
                      strokeWidth="2"
                      className="transition-all duration-200 group-hover:scale-125"
                    />

                    {/* Day label along bottom */}
                    <text
                      x={x}
                      y={svgHeight - paddingY + 22}
                      fill={isSelected ? "#F5D061" : "rgba(255, 255, 255, 0.5)"}
                      fontSize="11"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight={isSelected ? "bold" : "normal"}
                    >
                      D{String(l.day).padStart(2, "0")}
                    </text>

                    {/* Projected balance bubble on top of node */}
                    <text
                      x={x}
                      y={currentY - 12}
                      fill={isSelected ? "#F5D061" : "#FFF"}
                      fontSize="11"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      ₹{l.projectedBalance.toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* Endpoints callout */}
              <text
                x={getX(30) + 12}
                y={getY(3840) + 4}
                fill="#34D399"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                ₹3,840 (SAFE)
              </text>

              <text
                x={getX(30) + 12}
                y={getY(2100) + 4}
                fill="#F5D061"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                ₹2,100 (CURRENT)
              </text>
            </svg>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
         * 3. INTERACTIVE 30-DAY TIMELINE SCRUBBER & FINANCIAL EVENTS
         * ═══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-amber-300">
                TIMELINE SCRUBBER
              </span>
              <h3 className="font-heading text-2xl font-medium text-white mt-1">
                Day-by-Day Milestone Inspector
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-white/50">
              <span>SELECT LANDMARK:</span>
              <div className="flex gap-1">
                {landmarks.map((l) => (
                  <button
                    key={l.day}
                    type="button"
                    onClick={() => setSelectedDayNum(l.day)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      selectedDayNum === l.day
                        ? "bg-amber-400 text-black font-bold"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    D{String(l.day).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Inspector Deck (Selected Day Status) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Large Selected Day Metrics (7 cols) */}
            <motion.div
              key={selectedDayNum}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-7 p-6 sm:p-8 rounded-sm border border-white/10 bg-[#0c0d14]/70 backdrop-blur-md flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold tracking-[0.25em] text-amber-300 uppercase">
                    DAY {String(selectedDayNum).padStart(2, "0")} / {state.totalDays}
                  </span>
                  {selectedDayNum === 7 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold">
                      CURRENT ACTIVE
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-white/40">
                  {30 - selectedDayNum} DAYS REMAINING
                </span>
              </div>

              {/* Hero balance for selected day */}
              <div className="flex flex-col">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/50 mb-1">
                  PROJECTED BALANCE
                </span>
                <div className="font-display text-5xl sm:text-6xl text-white tracking-tight">
                  ₹{selectedLandmark.projectedBalance.toLocaleString()}
                  <span className="text-amber-400">.</span>
                </div>
              </div>

              {/* Data metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                    DAILY ALLOWANCE
                  </span>
                  <span className="font-display text-2xl sm:text-3xl text-white mt-1">
                    ₹{selectedLandmark.dailyAllowance}
                  </span>
                  <span className="font-mono text-[10px] text-white/30">/ day</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                    FINANCIAL RISK
                  </span>
                  <span
                    className={`font-display text-2xl sm:text-3xl mt-1 ${
                      selectedLandmark.financialRisk === "LOW"
                        ? "text-emerald-400"
                        : "text-amber-300"
                    }`}
                  >
                    {selectedLandmark.financialRisk}
                  </span>
                  <span className="font-mono text-[10px] text-white/30">
                    Defensive stance
                  </span>
                </div>

                <div className="flex flex-col col-span-2 sm:col-span-1">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                    SAFE PATH TARGET
                  </span>
                  <span className="font-display text-2xl sm:text-3xl text-emerald-300 mt-1">
                    ₹{selectedLandmark.safePathBalance.toLocaleString()}
                  </span>
                  <span className="font-mono text-[10px] text-white/30">
                    Preservation goal
                  </span>
                </div>
              </div>

              {/* Insight Callout */}
              <div className="p-4 rounded border border-white/10 bg-black/40 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                <div className="flex flex-col font-mono text-xs">
                  <span className="text-amber-200 font-semibold mb-0.5">
                    DIAGNOSTIC INSIGHT
                  </span>
                  <span className="text-white/70">
                    "{selectedLandmark.insight}"
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right: Meaningful Financial Events Along Timeline (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2">
                <span className="font-mono text-xs tracking-wider text-amber-300 uppercase">
                  TIMELINE EVENTS (05)
                </span>
                <span className="font-mono text-[10px] text-white/40">
                  HOVER TO INSPECT IMPACT
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {events.map((evt) => {
                  const isHovered = activeEventId === evt.id;
                  return (
                    <div
                      key={evt.id}
                      onMouseEnter={() => setActiveEventId(evt.id)}
                      onMouseLeave={() => setActiveEventId(null)}
                      className={`p-3.5 rounded border transition-all duration-200 cursor-pointer flex flex-col gap-1.5 ${
                        isHovered
                          ? "border-amber-400/80 bg-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                          : "border-white/10 bg-[#0c0d14]/60 hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-amber-300">
                            DAY {String(evt.day).padStart(2, "0")}
                          </span>
                          <span className="text-white/30">•</span>
                          <span className="font-heading text-sm font-medium text-white">
                            {evt.title}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-semibold text-rose-300">
                          {evt.amount < 0 ? `−₹${Math.abs(evt.amount).toLocaleString()}` : `+₹${evt.amount.toLocaleString()}`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between font-mono text-[10px] text-white/40">
                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase">
                          {evt.category}
                        </span>
                        <span className="text-white/50">{evt.impactDescription}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Event Impact Summary */}
              <AnimatePresence>
                {activeEvent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded border border-amber-400/30 bg-black/80 font-mono text-xs text-amber-200/90"
                  >
                    <span className="font-bold">IMPACT CONSEQUENCE: </span>
                    Day {activeEvent.day} expenditure directly lowered Day 30 runway by {Math.abs(activeEvent.amount)} rupees.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 4. TRANSITION TO THE SIMULATOR: "WHAT IF?"
         * ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          id="gateway-simulator"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="pt-20 border-t border-white/10 flex flex-col items-center text-center"
        >
          {/* Subtle Lead-In Statement */}
          <div className="mb-6 flex flex-col items-center">
            <span className="font-mono text-xs tracking-[0.4em] uppercase text-amber-300/80 mb-3 px-3 py-1 rounded-sm border border-amber-400/20 bg-amber-400/5">
              THE NEXT FRONTIER
            </span>
            <p className="font-heading text-[clamp(1.8rem,4vw,3.2rem)] font-light text-white/70 leading-tight">
              BUT WHAT<br />
              <span className="font-medium text-white">IF SOMETHING</span><br />
              CHANGES?
            </p>
          </div>

          {/* Huge Editorial Punchline */}
          <div className="my-8">
            <h2 className="font-display text-[clamp(6rem,18vw,15rem)] leading-[0.82] uppercase text-white tracking-tighter drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
              WHAT IF<span className="text-amber-400">?</span>
            </h2>
          </div>

          <p className="font-mono text-sm sm:text-base text-white/50 max-w-lg mb-10 tracking-wider">
            Simulate decisions before committing capital. Stress-test unexpected
            expenses, spending adjustments, and savings accelerations.
          </p>

          {/* Downward Scroll Cue */}
          <button
            type="button"
            onClick={() => document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-amber-300 group-hover:text-amber-200 transition-colors">
              DECISION SIMULATOR GATEWAY
            </span>
            <svg
              className="w-4 h-4 text-amber-300 animate-bounce group-hover:translate-y-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
