import { useState } from "react";
import { motion } from "motion/react";
import type { FinancialState, DerivedMetrics } from "../types/financial";

interface Props {
  state: FinancialState;
  metrics: DerivedMetrics;
}

export default function FinancialPulse({ state, metrics }: Props) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Consequence pathway nodes
  const consequenceNodes = [
    {
      id: "balance",
      label: "BALANCE",
      val: `₹${metrics.remainingBalance.toLocaleString()}`,
      sub: "Base Liquidity",
    },
    {
      id: "allowance",
      label: "DAILY ALLOWANCE",
      val: `₹${metrics.dailyAllowance}`,
      sub: "/day Runway",
    },
    {
      id: "forecast",
      label: "FORECAST",
      val: `₹${metrics.monthEndForecast.toLocaleString()}`,
      sub: "Day 30 Target",
    },
    {
      id: "risk",
      label: "RISK",
      val: metrics.financialRisk,
      sub: "Defensive Health",
    },
    {
      id: "health",
      label: "HEALTH",
      val: `${metrics.financialHealth}/100`,
      sub: "Composite Score",
    },
  ];

  return (
    <section
      id="pulse"
      className="relative z-30 min-h-screen bg-transparent text-white pt-24 pb-32 px-6 sm:px-12 md:px-20 overflow-hidden"
    >
      {/* ── AMBIENT ENVIRONMENT: Charcoal interface with subtle gold warmth ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245, 208, 97, 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative max-w-7xl mx-auto flex flex-col gap-24">
        {/* ═══════════════════════════════════════════════════════════════
         * 1. EDITORIAL HERO: 01 / FINANCIAL PULSE — KNOW WHERE YOU STAND
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
                01 / FINANCIAL PULSE
              </span>
              <span className="font-mono text-[11px] text-white/30 tracking-widest hidden sm:inline">
                LIVE FINANCIAL OPERATING SYSTEM
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-[clamp(4.2rem,11vw,9.5rem)] leading-[0.84] uppercase tracking-tight text-white"
            >
              KNOW<br />
              <span className="text-white/60">WHERE YOU</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-300">
                STAND.
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-3 max-w-xs md:text-right font-mono text-xs text-white/50 tracking-wider"
          >
            <p>
              ₹10,000 initialized for 30 days. Active scrubbing of current liquidity,
              consequence pipelines, and systemic capital allocation.
            </p>
            <div className="flex items-center md:justify-end gap-2 text-amber-300/90 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>CYCLE STATE: IN EQUILIBRIUM</span>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 2. PRIMARY BALANCE & 4 INTERCONNECTED METRICS (ASYMMETRIC)
         * ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Dominant Instrument: Primary Balance (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] uppercase text-amber-300/80 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                <span>PRIMARY LIQUIDITY INSTRUMENT</span>
              </div>

              {/* Oversized Number Reveal */}
              <div className="font-display text-[clamp(6rem,16vw,12.5rem)] leading-[0.85] tracking-tighter text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                ₹{metrics.remainingBalance.toLocaleString()}
                <span className="text-amber-400">.</span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <span className="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-white/50">
                  REMAINING BALANCE
                </span>
                <span className="font-mono text-[11px] text-white/30 border-l border-white/10 pl-4">
                  ₹{state.spent.toLocaleString()} UTILIZED OF ₹{state.budget.toLocaleString()}
                </span>
              </div>
            </motion.div>
          </div>

          {/* 4 Interconnected Metrics (5 cols, Asymmetric Data Blocks) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
            {/* Metric 1: DAILY ALLOWANCE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="p-5 sm:p-6 rounded-sm border border-white/10 bg-[#0c0d14]/70 backdrop-blur-md flex flex-col justify-between hover:border-amber-400/40 transition-colors group"
            >
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-amber-300/80">
                DAILY ALLOWANCE
              </span>
              <div className="my-3 font-display text-4xl sm:text-5xl text-white tracking-tight group-hover:text-amber-200 transition-colors">
                ₹{metrics.dailyAllowance}
              </div>
              <span className="font-mono text-[10px] text-white/40 tracking-wider">
                Safe expenditure ceiling
              </span>
            </motion.div>

            {/* Metric 2: MONTH-END FORECAST */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="p-5 sm:p-6 rounded-sm border border-white/10 bg-[#0c0d14]/70 backdrop-blur-md flex flex-col justify-between hover:border-amber-400/40 transition-colors group"
            >
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/50">
                MONTH-END FORECAST
              </span>
              <div className="my-3 font-display text-4xl sm:text-5xl text-white tracking-tight group-hover:text-amber-200 transition-colors">
                ₹{metrics.monthEndForecast.toLocaleString()}
              </div>
              <span className="font-mono text-[10px] text-white/40 tracking-wider">
                Projected Day-30 buffer
              </span>
            </motion.div>

            {/* Metric 3: FINANCIAL RISK */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="p-5 sm:p-6 rounded-sm border border-white/10 bg-[#0c0d14]/70 backdrop-blur-md flex flex-col justify-between hover:border-emerald-400/40 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/50">
                  FINANCIAL RISK
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
              <div className="my-3 font-display text-4xl sm:text-5xl text-emerald-400 tracking-tight">
                {metrics.financialRisk}
              </div>
              <span className="font-mono text-[10px] text-white/40 tracking-wider">
                Volatilities suppressed
              </span>
            </motion.div>

            {/* Metric 4: FINANCIAL HEALTH */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="p-5 sm:p-6 rounded-sm border border-white/10 bg-[#0c0d14]/70 backdrop-blur-md flex flex-col justify-between hover:border-amber-400/40 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/50">
                  FINANCIAL HEALTH
                </span>
                <span className="font-mono text-[10px] text-amber-300">/ 100</span>
              </div>
              <div className="my-3 font-display text-4xl sm:text-5xl text-white tracking-tight">
                {metrics.financialHealth}
              </div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-white h-full rounded-full"
                  style={{ width: `${metrics.financialHealth}%` }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 3. BUDGET ALLOCATION: VISUAL SYSTEM DISTRIBUTION
         * ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-6 sm:p-10 rounded-sm border border-white/10 bg-[#0a0b11]/80 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-amber-300">
                SYSTEM DISTRIBUTION
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-medium text-white mt-1">
                Budget Allocation Matrix
              </h3>
            </div>
            <span className="font-mono text-xs text-white/40 tracking-wider">
              TOTAL POOL: ₹{state.budget.toLocaleString()} • 100% ACCOUNTED
            </span>
          </div>

          {/* Precision Multi-Segment Conduit Bar */}
          <div className="w-full h-3 rounded-full bg-black/60 border border-white/10 p-[2px] flex gap-[2px] mb-8 overflow-hidden">
            {/* SPENDING */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${metrics.spendingPercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-sm bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
            />
            {/* COMMITMENTS */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${metrics.commitmentsPercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-sm bg-white/70"
            />
            {/* SAVINGS */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${metrics.savingsPercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-sm bg-amber-100/90"
            />
            {/* AVAILABLE */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${metrics.availablePercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-sm bg-white/20 border border-dashed border-white/30"
            />
          </div>

          {/* Data breakdown columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/10">
            {/* SPENDING */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-mono text-xs font-semibold tracking-wider text-amber-300">
                  SPENDING
                </span>
              </div>
              <span className="font-display text-3xl sm:text-4xl text-white">
                ₹{state.spent.toLocaleString()}
              </span>
              <span className="font-mono text-[11px] text-white/40 mt-1">
                {metrics.spendingPercentage.toFixed(1)}% • Daily utilization
              </span>
            </div>

            {/* COMMITMENTS */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-white/80" />
                <span className="font-mono text-xs font-semibold tracking-wider text-white/70">
                  COMMITMENTS
                </span>
              </div>
              <span className="font-display text-3xl sm:text-4xl text-white">
                ₹{state.commitments.toLocaleString()}
              </span>
              <span className="font-mono text-[11px] text-white/40 mt-1">
                {metrics.commitmentsPercentage.toFixed(1)}% • Fixed obligations
              </span>
            </div>

            {/* SAVINGS */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-200" />
                <span className="font-mono text-xs font-semibold tracking-wider text-amber-200">
                  SAVINGS
                </span>
              </div>
              <span className="font-display text-3xl sm:text-4xl text-white">
                ₹{state.savings.toLocaleString()}
              </span>
              <span className="font-mono text-[11px] text-white/40 mt-1">
                {metrics.savingsPercentage.toFixed(1)}% • Protected buffer
              </span>
            </div>

            {/* AVAILABLE */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full border border-white/40 bg-transparent" />
                <span className="font-mono text-xs font-semibold tracking-wider text-white/50">
                  AVAILABLE
                </span>
              </div>
              <span className="font-display text-3xl sm:text-4xl text-white/90">
                ₹{metrics.availableToAllocate.toLocaleString()}
              </span>
              <span className="font-mono text-[11px] text-white/40 mt-1">
                {metrics.availablePercentage.toFixed(1)}% • Uncommitted capital
              </span>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
         * 4. INTERCONNECTED CONSEQUENCES: CAUSALITY PIPELINE
         * ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-amber-300">
                SYSTEM CAUSALITY
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-medium text-white mt-1">
                Interconnected Consequences
              </h3>
            </div>
            <span className="font-mono text-xs text-white/40 tracking-wider">
              ONE ACTION PROPAGATES ACROSS THE WHOLE SYSTEM
            </span>
          </div>

          {/* Elegant Interactive Pipeline Circuit */}
          <div className="p-6 sm:p-8 rounded-sm border border-white/10 bg-[#0c0d14]/70 backdrop-blur-md">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {consequenceNodes.map((node, index) => {
                const isHovered = activeNode === node.id;
                return (
                  <div
                    key={node.id}
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                    className={`relative p-4 rounded border transition-all duration-300 cursor-pointer ${
                      isHovered
                        ? "border-amber-400 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
                        : "border-white/10 bg-black/40 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] tracking-widest text-amber-300 uppercase">
                        {node.label}
                      </span>
                      <span className="font-mono text-[9px] text-white/30">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="font-display text-2xl text-white">
                      {node.val}
                    </div>

                    <span className="font-mono text-[10px] text-white/40 mt-1 block">
                      {node.sub}
                    </span>

                    {/* Connecting Chevron on desktop */}
                    {index < consequenceNodes.length - 1 && (
                      <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center text-white/20">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Connecting flow caption */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[11px] text-white/40">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>
                  BALANCE → DAILY ALLOWANCE → FORECAST → RISK → HEALTH
                </span>
              </div>
              <span className="text-amber-200/60">
                // Every simulated rupee dynamically alters runway & stability
              </span>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
         * 5. 30-DAY POSITION: DISCRETE TIMELINE INDICATOR
         * ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pt-8 border-t border-white/10 flex flex-col gap-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-amber-300">
                TEMPORAL CADENCE
              </span>
              <div className="font-display text-4xl sm:text-5xl text-white mt-1">
                DAY {String(state.currentDay).padStart(2, "0")}{" "}
                <span className="text-white/30">/</span> {state.totalDays}
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-amber-300 uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{state.daysRemaining} DAYS REMAINING IN RUNWAY</span>
            </div>
          </div>

          {/* Timeline Bar with 30 discrete tick nodes */}
          <div className="relative py-4">
            {/* Base line */}
            <div className="w-full h-[1px] bg-white/15 relative">
              {/* Completed line */}
              <div
                className="h-[2px] -top-[0.5px] absolute bg-gradient-to-r from-amber-500 to-amber-300"
                style={{
                  width: `${(state.currentDay / state.totalDays) * 100}%`,
                }}
              />

              {/* Start node */}
              <div className="absolute left-0 -top-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />

              {/* Current Day active pin */}
              <div
                className="absolute -top-2 flex flex-col items-center -translate-x-1/2"
                style={{
                  left: `${(state.currentDay / state.totalDays) * 100}%`,
                }}
              >
                <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-black shadow-[0_0_12px_rgba(251,191,36,1)] animate-ping" />
                <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-black absolute top-0" />
                <span className="font-mono text-[9px] text-amber-300 font-bold mt-2 uppercase whitespace-nowrap">
                  NOW
                </span>
              </div>

              {/* End node */}
              <div className="absolute right-0 -top-1 w-2.5 h-2.5 rounded-full bg-white/30" />
            </div>

            {/* 30 tick marks */}
            <div className="flex justify-between w-full pt-2">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-[1px] h-2 ${
                    i + 1 <= state.currentDay ? "bg-amber-400/60" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
