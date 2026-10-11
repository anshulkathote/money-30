import { useState } from "react";
import { motion } from "motion/react";
import type {
  FinancialState,
  DerivedMetrics,
  HealthReport,
} from "../types/financial";

interface Props {
  state: FinancialState;
  metrics: DerivedMetrics;
  healthReport: HealthReport;
  onResetMonth: () => void;
}

export default function FinancialHealthSection({
  state,
  metrics,
  healthReport,
  onResetMonth,
}: Props) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    overallScore,
    riskLevel,
    riskExplanation,
    dimensions,
    signals,
    recommendation,
  } = healthReport;

  const handleConfirmReset = () => {
    onResetMonth();
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      document.getElementById("pulse")?.scrollIntoView({ behavior: "smooth" });
    }, 1200);
  };

  // Color scheme based on overall score
  const scoreColor =
    overallScore >= 80
      ? "text-emerald-400"
      : overallScore >= 65
      ? "text-amber-300"
      : overallScore >= 45
      ? "text-orange-400"
      : "text-rose-400";

  const scoreGlow =
    overallScore >= 80
      ? "shadow-[0_0_50px_rgba(52,211,153,0.25)]"
      : overallScore >= 65
      ? "shadow-[0_0_50px_rgba(251,191,36,0.25)]"
      : overallScore >= 45
      ? "shadow-[0_0_50px_rgba(251,146,60,0.25)]"
      : "shadow-[0_0_50px_rgba(244,63,94,0.3)]";

  const riskBadgeColor =
    riskLevel === "LOW"
      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
      : riskLevel === "MEDIUM"
      ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
      : "border-rose-500/40 bg-rose-500/10 text-rose-400";

  return (
    <section
      id="health"
      className="relative z-30 min-h-screen bg-transparent text-white pt-24 pb-44 px-6 sm:px-12 md:px-20 overflow-hidden"
    >
      {/* ── Ambient Radial Atmosphere & Technical Background Grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 25%, rgba(245, 208, 97, 0.08) 0%, transparent 75%)",
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

      <div className="relative max-w-7xl mx-auto flex flex-col gap-24">
        {/* ═══════════════════════════════════════════════════════════════
         * 1. EDITORIAL OPENING: 05 / FINANCIAL HEALTH
         * ═══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/10 pb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="font-mono text-xs tracking-[0.35em] text-amber-300 uppercase px-3 py-1 rounded-sm border border-amber-400/20 bg-amber-400/5">
                05 / FINANCIAL HEALTH
              </span>
              <span className="font-mono text-[11px] text-white/30 tracking-widest hidden sm:inline">
                COMPOSITE SYSTEMIC VITALITY
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-[clamp(4.2rem,12vw,9.5rem)] leading-[0.84] uppercase tracking-tight text-white"
            >
              HOW HEALTHY<br />
              <span className="text-white/60">IS YOUR</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                MONTH?
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-4 max-w-md lg:text-right font-mono text-xs text-white/50 tracking-wider"
          >
            <p className="font-heading text-xl sm:text-2xl text-white font-light tracking-normal leading-snug">
              A single balance number{" "}
              <span className="text-amber-300 font-normal">never tells the whole story.</span>
            </p>
            <p>
              Vitality is a delicate equilibrium between current spending pace,
              protected savings runway, recurring overhead lock, and defensive
              resilience against shocks.
            </p>
            <div className="flex items-center lg:justify-end gap-2 text-amber-300/90 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>DYNAMIC MULTI-DIMENSIONAL MODEL</span>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 2. CENTRAL HEALTH SCORE & DEFENSIVE RISK HERO
         * ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Central Health Score (7 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`lg:col-span-7 p-8 sm:p-12 rounded-sm border border-white/15 bg-[#0c0d14]/90 backdrop-blur-xl flex flex-col justify-between gap-8 relative overflow-hidden ${scoreGlow}`}
          >
            {/* Background geometric radar lines */}
            <div
              className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border border-white/5 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(251, 191, 36, 0.05) 0%, transparent 70%)",
              }}
            />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-amber-300 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <span>COMPOSITE HEALTH INDEX</span>
              </span>
              <span className="font-mono text-xs text-white/40">
                CYCLE DAY {String(state.currentDay).padStart(2, "0")} / {state.totalDays}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-6 my-2">
              {/* Dynamic Animated Number */}
              <motion.div
                key={overallScore}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`font-display text-[clamp(6.5rem,18vw,13rem)] leading-[0.8] tracking-tighter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] ${scoreColor}`}
              >
                {overallScore}
              </motion.div>

              <div className="flex flex-col">
                <span className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase">
                  FINANCIAL HEALTH
                </span>
                <span className="font-mono text-xs text-white/40 mt-1">
                  Weighted score across 4 systemic capital dimensions
                </span>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] px-2.5 py-0.5 rounded-xs font-semibold uppercase tracking-widest border ${
                      overallScore >= 80
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : overallScore >= 65
                        ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                        : overallScore >= 45
                        ? "border-orange-400/40 bg-orange-400/10 text-orange-300"
                        : "border-rose-500/40 bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {overallScore >= 80
                      ? "PRIME EQUILIBRIUM"
                      : overallScore >= 65
                      ? "RESILIENT RUNWAY"
                      : overallScore >= 45
                      ? "MODERATE STRESS"
                      : "CRITICAL VULNERABILITY"}
                  </span>
                </div>
              </div>
            </div>

            {/* Score progress bar */}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between font-mono text-[11px] text-white/40">
                <span>0 CRITICAL</span>
                <span>50 BUFFER</span>
                <span>100 RESILIENT</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallScore}%` }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full transition-all ${
                    overallScore >= 80
                      ? "bg-gradient-to-r from-amber-400 to-emerald-400"
                      : overallScore >= 65
                      ? "bg-gradient-to-r from-amber-500 to-amber-300"
                      : "bg-gradient-to-r from-rose-500 to-amber-400"
                  }`}
                />
              </div>
            </div>
          </motion.div>

          {/* Prominent Risk Card & Biggest Opportunity (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5 flex flex-col justify-between gap-6"
          >
            {/* Risk Card */}
            <div className="p-8 rounded-sm border border-white/15 bg-[#0c0d14]/85 backdrop-blur-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs tracking-[0.25em] uppercase text-white/40 font-semibold">
                  FINANCIAL RISK
                </span>
                <span
                  className={`font-mono text-xs px-3 py-0.5 rounded-xs border font-bold uppercase tracking-widest ${riskBadgeColor}`}
                >
                  {riskLevel} RISK
                </span>
              </div>

              <div className="font-display text-4xl sm:text-5xl text-white tracking-tight uppercase">
                {riskLevel === "LOW"
                  ? "LOW EXPOSURE"
                  : riskLevel === "MEDIUM"
                  ? "ELEVATED RISK"
                  : "CRITICAL VULNERABILITY"}
              </div>

              <p className="font-mono text-xs sm:text-sm text-white/70 leading-relaxed">
                {riskExplanation}
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-white/40">
                <span>BUFFER RESILIENCE</span>
                <span className="text-amber-300 font-semibold">
                  ₹{metrics.monthEndForecast.toLocaleString()} CUSHION
                </span>
              </div>
            </div>

            {/* Recommendation: Your Biggest Opportunity */}
            <div className="p-8 rounded-sm border border-amber-400/30 bg-amber-400/[0.04] backdrop-blur-xl flex flex-col gap-3 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono text-xs font-bold tracking-[0.25em] text-amber-300 uppercase">
                  YOUR BIGGEST OPPORTUNITY
                </span>
              </div>

              <h4 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-tight">
                {recommendation.headline}
              </h4>

              <p className="font-mono text-xs sm:text-sm text-white/70 leading-relaxed">
                {recommendation.action}
              </p>

              <div className="mt-1 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[11px]">
                <span className="text-white/40">EXPECTED GAIN:</span>
                <span className="text-emerald-300 font-semibold">
                  {recommendation.impact}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 3. FOUR HEALTH DIMENSIONS (ASYMMETRIC DATA ARCHITECTURE)
         * ═══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-white/40">
              HEALTH DIMENSION BREAKDOWN (0–100)
            </span>
            <span className="font-mono text-[10px] text-amber-300/80 tracking-widest">
              DETERMINISTIC FORMULAS TIED TO OPERATING STATE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dimensions.map((dim) => {
              const dimScoreColor =
                dim.score >= 80
                  ? "text-emerald-400"
                  : dim.score >= 65
                  ? "text-amber-300"
                  : dim.score >= 50
                  ? "text-orange-400"
                  : "text-rose-400";

              return (
                <div
                  key={dim.id}
                  className="p-6 sm:p-7 rounded-sm border border-white/10 bg-[#0c0d14]/70 hover:border-white/20 transition-all flex flex-col justify-between gap-5"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono text-[11px] font-bold tracking-widest text-amber-300 uppercase">
                      {dim.id}
                    </span>
                    <span
                      className={`font-mono text-[9px] px-2 py-0.5 rounded-xs uppercase tracking-wider font-semibold border ${
                        dim.status === "OPTIMAL"
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                          : dim.status === "HEALTHY"
                          ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                          : dim.status === "WATCH"
                          ? "border-orange-400/40 bg-orange-400/10 text-orange-300"
                          : "border-rose-500/40 bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {dim.status}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-baseline justify-between">
                      <span className={`font-display text-5xl sm:text-6xl tracking-tight ${dimScoreColor}`}>
                        {dim.score}
                      </span>
                      <span className="font-mono text-xs text-white/30">/ 100</span>
                    </div>

                    <span className="font-mono text-[11px] text-white/40 uppercase tracking-wider mt-1">
                      {dim.label}
                    </span>
                  </div>

                  {/* Horizontal gauge bar */}
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.score}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${
                        dim.score >= 80
                          ? "bg-emerald-400"
                          : dim.score >= 65
                          ? "bg-amber-400"
                          : dim.score >= 50
                          ? "bg-orange-400"
                          : "bg-rose-500"
                      }`}
                    />
                  </div>

                  <p className="font-mono text-xs text-white/60 leading-relaxed border-t border-white/10 pt-3">
                    {dim.detail}
                  </p>

                  <div className="flex items-center justify-between font-mono text-[10px] text-white/40 pt-1">
                    <span>{dim.metricLabel}</span>
                    <span className="text-white/80 font-semibold">{dim.metricValue}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 4. DYNAMIC HEALTH SIGNALS (INSIGHTS)
         * ═══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-white/40 border-b border-white/10 pb-3">
            SYSTEMIC OBSERVATIONS & SIGNALS ({signals.length})
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signals.map((sig) => {
              const isPositive = sig.type === "POSITIVE";
              return (
                <div
                  key={sig.id}
                  className={`p-6 rounded-sm border transition-all flex items-start gap-4 ${
                    isPositive
                      ? "border-emerald-400/20 bg-emerald-400/[0.03]"
                      : "border-amber-400/20 bg-amber-400/[0.03]"
                  }`}
                >
                  <span
                    className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                      isPositive
                        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                        : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                    }`}
                  />

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold tracking-wider text-white uppercase">
                        {sig.title}
                      </span>
                      <span
                        className={`font-mono text-[9px] px-1.5 py-0.2 rounded-xs uppercase ${
                          isPositive ? "text-emerald-400" : "text-amber-300"
                        }`}
                      >
                        {sig.type}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-white/60 leading-relaxed">
                      {sig.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 5. FINAL SUMMARY: YOUR MONTH / AT A GLANCE
         * ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 sm:p-12 rounded-sm border border-white/15 bg-[#0c0d14]/90 backdrop-blur-xl flex flex-col gap-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-xs tracking-[0.35em] uppercase text-amber-300 font-semibold">
                YOUR MONTH / AT A GLANCE
              </span>
              <p className="font-mono text-xs text-white/40 mt-1">
                Cumulative capital trajectory snapshot across the 30-day operating horizon.
              </p>
            </div>
            <div className="font-mono text-xs text-white/50 tracking-wider">
              CYCLE COMPLETION: <span className="text-white font-semibold">23.3%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* 1. Starting Budget */}
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
                STARTING BUDGET
              </span>
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight mt-1">
                ₹{state.budget.toLocaleString()}
              </div>
              <span className="font-mono text-[11px] text-white/30 mt-1">
                Initialized capital
              </span>
            </div>

            {/* 2. Remaining Balance */}
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
                REMAINING
              </span>
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-amber-300 tracking-tight mt-1">
                ₹{(state.budget - state.spent).toLocaleString()}
              </div>
              <span className="font-mono text-[11px] text-white/30 mt-1">
                Active checking float
              </span>
            </div>

            {/* 3. Saved */}
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
                SAVED
              </span>
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight mt-1">
                ₹{state.savings.toLocaleString()}
              </div>
              <span className="font-mono text-[11px] text-white/30 mt-1">
                Protected high-yield vault
              </span>
            </div>

            {/* 4. Committed */}
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
                COMMITTED
              </span>
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight mt-1">
                ₹{state.commitments.toLocaleString()}
              </div>
              <span className="font-mono text-[11px] text-white/30 mt-1">
                Recurring monthly obligations
              </span>
            </div>

            {/* 5. Days Remaining */}
            <div className="flex flex-col col-span-2 md:col-span-1">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
                DAYS
              </span>
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight mt-1">
                {state.daysRemaining}
                <span className="font-mono text-2xl text-white/30 font-normal">
                  /{state.totalDays}
                </span>
              </div>
              <span className="font-mono text-[11px] text-white/30 mt-1">
                Days remaining in cycle
              </span>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
         * 6. FINAL MONUMENTAL STATEMENT (EXPERIENCE CLIMAX)
         * ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="pt-24 border-t border-white/10 flex flex-col items-center text-center select-none"
        >
          <span className="font-mono text-xs tracking-[0.5em] uppercase text-amber-300/80 mb-6 px-4 py-1.5 rounded-sm border border-amber-400/20 bg-amber-400/5">
            CYCLE PHILOSOPHY // CONCLUSION
          </span>

          {/* Strongest Typography in the Entire Application */}
          <h1 className="font-display text-[clamp(4.8rem,15vw,13.5rem)] leading-[0.82] uppercase tracking-tighter text-white drop-shadow-[0_30px_70px_rgba(0,0,0,0.95)] max-w-6xl">
            YOUR MONEY.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
              YOUR DECISIONS.
            </span>
          </h1>

          <p className="font-heading text-[clamp(1.4rem,3vw,2.5rem)] font-light text-white/70 max-w-3xl mt-8 mb-16 leading-snug">
            Make the decision before the decision makes itself.
          </p>

          {/* Minimal Brand Seal */}
          <div className="flex items-center gap-3 font-mono text-sm tracking-[0.3em] text-white/40 uppercase mb-12">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
            <span>MONEY<span className="text-amber-400">{"//"}</span>30</span>
            <span className="text-white/20">•</span>
            <span>FINANCIAL OPERATING SYSTEM</span>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
           * 7. SUBTLE RESET MONTH TRIGGER
           * ═══════════════════════════════════════════════════════════════ */}
          <div className="pt-6 border-t border-white/10 w-full max-w-md flex flex-col items-center gap-3">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="py-3 px-6 rounded-sm border border-white/15 hover:border-white/40 bg-white/[0.02] hover:bg-white/5 font-mono text-xs tracking-[0.25em] text-white/40 hover:text-white uppercase transition-colors cursor-pointer"
              >
                RESET MONTH (RESTORE INITIAL ₹10,000)
              </button>
            ) : (
              <div className="p-4 rounded-sm border border-amber-400/40 bg-[#0c0d14] flex flex-col items-center gap-3 w-full">
                <span className="font-mono text-xs text-amber-300 text-center">
                  Restore original ₹10,000 balance, baseline commitments, and discard all simulations?
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="py-2 px-5 rounded-sm bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    CONFIRM RESET
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="py-2 px-4 rounded-sm font-mono text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            {resetSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-xs text-emerald-400 flex items-center gap-2"
              >
                <span>✓</span>
                <span>SYSTEM RESET COMPLETED. RETURNING TO PULSE...</span>
              </motion.div>
            )}

            <span className="font-mono text-[10px] text-white/20 tracking-wider">
              MONEY//30 • ZERO BACKEND • 100% PRIVATE • FRONTEND RESILIENT
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
