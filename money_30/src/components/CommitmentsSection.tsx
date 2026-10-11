import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type {
  FinancialState,
  DerivedMetrics,
  CommitmentItem,
  CommitmentFrequency,
} from "../types/financial";

interface Props {
  state: FinancialState;
  metrics: DerivedMetrics;
  commitments: CommitmentItem[];
  onToggleCommitment: (id: string) => void;
  onAddCommitment: (item: Omit<CommitmentItem, "id" | "status">) => void;
  onRemoveCommitment: (id: string) => void;
}

export default function CommitmentsSection({
  state,
  metrics,
  commitments,
  onToggleCommitment,
  onAddCommitment,
  onRemoveCommitment,
}: Props) {
  // Add commitment drawer state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newFrequency, setNewFrequency] = useState<CommitmentFrequency>("MONTHLY");
  const [newCategory, setNewCategory] = useState("UTILITY");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Recent interaction toast feedback
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Calculations
  const totalBudget = state.budget;
  const activeCommitmentsTotal = commitments
    .filter((c) => c.status === "ACTIVE")
    .reduce(
      (sum, c) => sum + (c.frequency === "WEEKLY" ? c.amount * 4 : c.amount),
      0
    );
  const flexibleBalance = Math.max(0, totalBudget - activeCommitmentsTotal);
  const committedPercentage =
    totalBudget > 0 ? (activeCommitmentsTotal / totalBudget) * 100 : 0;
  const flexiblePercentage =
    totalBudget > 0 ? (flexibleBalance / totalBudget) * 100 : 0;

  const activeCount = commitments.filter((c) => c.status === "ACTIVE").length;
  const pausedCount = commitments.filter((c) => c.status === "PAUSED").length;
  const pausedTotal = commitments
    .filter((c) => c.status === "PAUSED")
    .reduce(
      (sum, c) => sum + (c.frequency === "WEEKLY" ? c.amount * 4 : c.amount),
      0
    );

  const handleToggle = (item: CommitmentItem) => {
    onToggleCommitment(item.id);
    const effectiveMonthly =
      item.frequency === "WEEKLY" ? item.amount * 4 : item.amount;
    if (item.status === "ACTIVE") {
      setLastAction(
        `PAUSED "${item.name}": +₹${effectiveMonthly.toLocaleString()} freed into flexible balance. (+₹${Math.round(
          effectiveMonthly / 23
        )}/day added to daily allowance)`
      );
    } else {
      setLastAction(
        `ACTIVATED "${item.name}": ₹${effectiveMonthly.toLocaleString()} committed from flexible balance. (−₹${Math.round(
          effectiveMonthly / 23
        )}/day deducted from daily allowance)`
      );
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(newAmount);
    if (!newName.trim()) {
      setValidationError("Commitment name is required.");
      return;
    }
    if (isNaN(parsed) || parsed <= 0) {
      setValidationError("Enter a valid amount greater than ₹0.");
      return;
    }

    onAddCommitment({
      name: newName.trim(),
      amount: parsed,
      frequency: newFrequency,
      category: newCategory.toUpperCase(),
    });

    const monthlyCost = newFrequency === "WEEKLY" ? parsed * 4 : parsed;
    setLastAction(
      `ADDED "${newName.trim()}": ₹${monthlyCost.toLocaleString()}/mo locked as recurring obligation.`
    );

    setNewName("");
    setNewAmount("");
    setNewFrequency("MONTHLY");
    setValidationError(null);
    setIsAdding(false);
  };

  return (
    <section
      id="commitments"
      className="relative z-30 min-h-screen bg-transparent text-white pt-24 pb-36 px-6 sm:px-12 md:px-20 overflow-hidden"
    >
      {/* ── Ambient Radial Atmosphere & Technical Grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 10%, rgba(245, 208, 97, 0.06) 0%, transparent 70%)",
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

      <div className="relative max-w-7xl mx-auto flex flex-col gap-20">
        {/* ═══════════════════════════════════════════════════════════════
         * 1. EDITORIAL OPENING: 04 / COMMITMENTS
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
                04 / COMMITMENTS
              </span>
              <span className="font-mono text-[11px] text-white/30 tracking-widest hidden sm:inline">
                FIXED RECURRING CAPITAL OBLIGATIONS
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-[clamp(4.2rem,12vw,9.5rem)] leading-[0.84] uppercase tracking-tight text-white"
            >
              MONEY<br />
              <span className="text-white/60">ALREADY</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                SPOKEN FOR.
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
              Some money isn't really{" "}
              <span className="text-amber-300 font-normal">available to spend.</span>
            </p>
            <p>
              Fixed recurring subscriptions, gym passes, and utility obligations
              lock away liquidity before the month begins. Toggling or trimming
              commitments instantly frees discretionary runway.
            </p>
            <div className="flex items-center lg:justify-end gap-2 text-amber-300/90 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>
                {activeCount} ACTIVE ({pausedCount} PAUSED)
              </span>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 2. LOCKED MONEY VISUALIZATION (HORIZONTAL FINANCIAL ALLOCATION)
         * ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="p-8 sm:p-10 rounded-sm border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl flex flex-col gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {/* Header Metric Triad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-white/10 pb-8">
            {/* 1. TOTAL BUDGET */}
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-1">
                TOTAL BUDGET
              </span>
              <div className="font-display text-4xl sm:text-5xl text-white tracking-tight">
                ₹{totalBudget.toLocaleString()}
              </div>
              <span className="font-mono text-xs text-white/40 mt-1">
                30-Day Total Allocation
              </span>
            </div>

            {/* 2. COMMITTED (LOCKED) */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-amber-300 font-semibold">
                  COMMITTED (LOCKED)
                </span>
                <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {committedPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="font-display text-4xl sm:text-5xl text-amber-300 tracking-tight flex items-baseline gap-2">
                <span>₹{activeCommitmentsTotal.toLocaleString()}</span>
                {pausedTotal > 0 && (
                  <span className="font-mono text-xs text-emerald-400 font-normal">
                    (−₹{pausedTotal.toLocaleString()} freed)
                  </span>
                )}
              </div>
              <span className="font-mono text-xs text-white/40 mt-1">
                {activeCount} Active Recurring Obligations
              </span>
            </div>

            {/* 3. FLEXIBLE */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50">
                  FLEXIBLE RUNWAY
                </span>
                <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-mono uppercase bg-white/10 text-white/70 border border-white/15">
                  {flexiblePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="font-display text-4xl sm:text-5xl text-white tracking-tight">
                ₹{flexibleBalance.toLocaleString()}
              </div>
              <span className="font-mono text-xs text-white/40 mt-1">
                Discretionary Liquidity You Control
              </span>
            </div>
          </div>

          {/* Precision Architectural Allocation Bar */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between font-mono text-[11px] text-white/40">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-xs bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <span>LOCKED CAPITAL SLAB</span>
              </span>
              <span className="flex items-center gap-2">
                <span>FLEXIBLE CAPITAL SLAB</span>
                <span className="w-2 h-2 rounded-xs bg-white/40" />
              </span>
            </div>

            {/* The Horizontal Split Beam */}
            <div className="relative h-10 w-full rounded-sm overflow-hidden bg-white/5 border border-white/15 flex">
              {/* Segment 1: Locked (with animated width and custom hatch pattern) */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${committedPercentage}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full border-r-2 border-amber-400 flex items-center justify-between px-3 select-none overflow-hidden"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.15) 10px, rgba(251, 191, 36, 0.28) 10px, rgba(251, 191, 36, 0.28) 20px)",
                }}
              >
                <div className="flex items-center gap-2 z-10">
                  <svg
                    className="w-3.5 h-3.5 text-amber-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="font-mono text-xs font-bold text-amber-300 tracking-wider hidden sm:inline">
                    LOCKED ₹{activeCommitmentsTotal.toLocaleString()}
                  </span>
                </div>
                <span className="font-mono text-[10px] font-semibold text-amber-200 z-10">
                  {committedPercentage.toFixed(0)}%
                </span>
              </motion.div>

              {/* Segment 2: Flexible (remaining width) */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${flexiblePercentage}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full flex items-center justify-between px-3 select-none overflow-hidden bg-gradient-to-r from-white/[0.08] to-white/[0.03]"
              >
                <span className="font-mono text-xs font-medium text-white/70 tracking-wider hidden sm:inline">
                  FLEXIBLE ₹{flexibleBalance.toLocaleString()}
                </span>
                <span className="font-mono text-[10px] text-white/40 ml-auto">
                  {flexiblePercentage.toFixed(0)}%
                </span>
              </motion.div>
            </div>

            {/* Micro Caption */}
            <div className="flex items-center justify-between font-mono text-[10px] text-white/30 pt-1">
              <span>₹0</span>
              <span>₹{activeCommitmentsTotal.toLocaleString()} BOUND</span>
              <span>₹{totalBudget.toLocaleString()} CEILING</span>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
         * 3. INTERACTIVE RECURRING COMMITMENT LIST
         * ═══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40">
                ACTIVE CAPITAL COMMITMENTS ({commitments.length})
              </span>
              <p className="font-mono text-xs text-white/50 mt-0.5">
                Toggle to PAUSE commitments and instantly unlock flexible liquidity.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="self-start sm:self-auto py-2.5 px-5 rounded-sm border border-amber-400/40 hover:border-amber-400 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{isAdding ? "✕ CANCEL" : "+ ADD COMMITMENT"}</span>
            </button>
          </div>

          {/* Add Commitment Drawer */}
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <form
                  onSubmit={handleAddSubmit}
                  className="p-6 sm:p-8 rounded-sm border border-amber-400/30 bg-[#0c0d14]/90 backdrop-blur-xl flex flex-col gap-5 shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-amber-300">
                      NEW RECURRING COMMITMENT
                    </span>
                    <span className="font-mono text-[10px] text-white/40">
                      AUTO-CALCULATED INTO MONTHLY RUNWAY
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    {/* Name */}
                    <div className="sm:col-span-5 flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] uppercase text-white/50">
                        COMMITMENT NAME
                      </label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Claude Pro, Amazon Prime, WiFi"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-white/5 border border-white/15 text-white font-heading text-sm placeholder-white/20 focus:outline-none focus:border-amber-400"
                        autoFocus
                      />
                    </div>

                    {/* Amount */}
                    <div className="sm:col-span-4 flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] uppercase text-white/50">
                        AMOUNT (₹)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 font-display text-base text-amber-400 select-none">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={newAmount}
                          onChange={(e) => setNewAmount(e.target.value)}
                          placeholder="499"
                          className="w-full pl-8 pr-3 py-2.5 rounded-sm bg-white/5 border border-white/15 text-white font-display text-lg tracking-tight focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Frequency */}
                    <div className="sm:col-span-3 flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] uppercase text-white/50">
                        FREQUENCY
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setNewFrequency("MONTHLY")}
                          className={`py-2.5 rounded-sm font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors cursor-pointer border ${
                            newFrequency === "MONTHLY"
                              ? "bg-amber-400 text-black border-amber-400 font-bold"
                              : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          MONTHLY
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewFrequency("WEEKLY")}
                          className={`py-2.5 rounded-sm font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors cursor-pointer border ${
                            newFrequency === "WEEKLY"
                              ? "bg-amber-400 text-black border-amber-400 font-bold"
                              : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          WEEKLY
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] uppercase text-white/50">
                      CATEGORY CLASSIFICATION
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["UTILITY", "STREAMING", "FITNESS", "SUBSCRIPTION", "LIFESTYLE"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setNewCategory(cat)}
                          className={`px-3 py-1 rounded-xs font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border ${
                            newCategory === cat
                              ? "bg-amber-400/20 text-amber-300 border-amber-400/40 font-bold"
                              : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {newFrequency === "WEEKLY" && newAmount && (
                    <div className="font-mono text-[11px] text-amber-300/80">
                      ℹ Weekly cost translates to ₹
                      {(parseFloat(newAmount) * 4 || 0).toLocaleString()} / month (4
                      billing periods).
                    </div>
                  )}

                  {validationError && (
                    <div className="font-mono text-xs text-rose-400">
                      ⚠ {validationError}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="py-2 px-4 rounded-sm font-mono text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-sm bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)] cursor-pointer"
                    >
                      SAVE COMMITMENT
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toast Notification of Last Toggle / Addition */}
          <AnimatePresence>
            {lastAction && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 rounded-sm border border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-300 font-mono text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{lastAction}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLastAction(null)}
                  className="text-white/40 hover:text-white font-mono text-[11px] cursor-pointer"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compact Editorial Rows */}
          <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
            {commitments.map((item) => {
              const isPaused = item.status === "PAUSED";
              const monthlyEffective =
                item.frequency === "WEEKLY" ? item.amount * 4 : item.amount;

              return (
                <div
                  key={item.id}
                  className={`py-4 sm:py-5 px-3 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isPaused
                      ? "bg-white/[0.01] opacity-60 hover:opacity-90"
                      : "bg-[#0c0d14]/40 hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Left: Indicator, Category & Name */}
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-1.5 h-8 rounded-full transition-colors ${
                        isPaused ? "bg-white/15" : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                      }`}
                    />

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`font-heading text-lg sm:text-xl font-medium tracking-tight transition-colors ${
                            isPaused ? "text-white/40 line-through" : "text-white"
                          }`}
                        >
                          {item.name}
                        </span>

                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-xs uppercase tracking-wider bg-white/5 text-white/40 border border-white/10">
                          {item.category || "OBLIGATION"}
                        </span>

                        <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
                          / {item.frequency.toLowerCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-[11px] text-white/40 mt-0.5">
                        <span>
                          {item.frequency === "WEEKLY"
                            ? `₹${item.amount.toLocaleString()}/wk (effective ₹${monthlyEffective.toLocaleString()}/mo)`
                            : `Standard recurring monthly debit`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount, Status Toggle, and Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8">
                    {/* Effective Cost */}
                    <div className="flex flex-col sm:text-right">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`font-display text-2xl sm:text-3xl tracking-tight transition-colors ${
                            isPaused
                              ? "text-white/30 line-through"
                              : "text-white"
                          }`}
                        >
                          ₹{item.amount.toLocaleString()}
                        </span>
                        <span className="font-mono text-[10px] text-white/40">
                          /{item.frequency === "WEEKLY" ? "wk" : "mo"}
                        </span>
                      </div>

                      {isPaused ? (
                        <span className="font-mono text-[10px] font-semibold text-emerald-400">
                          +₹{monthlyEffective.toLocaleString()} UNLOCKED
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-amber-300/70">
                          ACTIVE OBLIGATION
                        </span>
                      )}
                    </div>

                    {/* Compact Precision Toggle Button */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggle(item)}
                        className={`px-3.5 py-1.5 rounded-sm font-mono text-[11px] font-bold tracking-[0.2em] uppercase transition-all cursor-pointer border flex items-center gap-2 ${
                          isPaused
                            ? "border-white/20 bg-white/5 text-white/50 hover:border-white/40 hover:text-white"
                            : "border-amber-400/80 bg-amber-400/10 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)] hover:bg-amber-400/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPaused ? "bg-white/30" : "bg-amber-400 animate-pulse"
                          }`}
                        />
                        <span>{item.status}</span>
                      </button>

                      {/* Remove custom commitment if desired */}
                      {item.id.startsWith("comm-") &&
                        !["comm-1", "comm-2", "comm-3", "comm-4"].includes(
                          item.id
                        ) && (
                          <button
                            type="button"
                            onClick={() => onRemoveCommitment(item.id)}
                            className="p-1.5 rounded-sm text-white/30 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove commitment"
                          >
                            ✕
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 4. LIVE CAUSALITY FEEDBACK: IMPACT ON DERIVED METRICS
         * ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-sm border border-white/10 bg-[#0c0d14]/60">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-white/40 tracking-wider">
              DAILY SAFE ALLOWANCE
            </span>
            <div className="font-display text-2xl sm:text-3xl text-amber-300 mt-1">
              ₹{metrics.dailyAllowance}
              <span className="font-mono text-xs text-white/40 font-normal">
                /day
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/30">
              Runway across remaining 23 days
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-white/40 tracking-wider">
              DAY 30 FORECAST BUFFER
            </span>
            <div
              className={`font-display text-2xl sm:text-3xl mt-1 ${
                metrics.monthEndForecast < 0 ? "text-rose-400" : "text-white"
              }`}
            >
              {metrics.monthEndForecast < 0
                ? `-₹${Math.abs(metrics.monthEndForecast).toLocaleString()}`
                : `₹${metrics.monthEndForecast.toLocaleString()}`}
            </div>
            <span className="font-mono text-[10px] text-white/30">
              Projected end-cycle reserve
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-white/40 tracking-wider">
              DEFENSIVE RISK POSTURE
            </span>
            <div
              className={`font-display text-2xl sm:text-3xl mt-1 ${
                metrics.financialRisk === "HIGH"
                  ? "text-rose-400"
                  : metrics.financialRisk === "MODERATE"
                  ? "text-amber-300"
                  : "text-emerald-400"
              }`}
            >
              {metrics.financialRisk}
            </div>
            <span className="font-mono text-[10px] text-white/30">
              System buffer resilience
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-white/40 tracking-wider">
              FINANCIAL HEALTH
            </span>
            <div className="font-display text-2xl sm:text-3xl text-white mt-1">
              {metrics.financialHealth}
              <span className="font-mono text-xs text-white/40 font-normal">
                /100
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/30">
              Composite vitality index
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 5. STRONG SECTION END & TRANSITION INTO 05 / FINANCIAL HEALTH
         * ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pt-16 border-t border-white/10 flex flex-col items-center text-center"
        >
          <span className="font-mono text-xs tracking-[0.4em] uppercase text-amber-300/80 mb-4 px-3 py-1 rounded-sm border border-amber-400/20 bg-amber-400/5">
            THE ARCHITECTURE OF CONTROL
          </span>

          <h3 className="font-display text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.88] uppercase text-white tracking-tight drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-w-4xl">
            YOUR FLEXIBLE<br />
            MONEY IS WHAT<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
              YOU CONTROL.
            </span>
          </h3>

          <p className="font-mono text-sm sm:text-base text-white/50 max-w-xl mt-6 mb-10 tracking-wider leading-relaxed">
            Commitments set the unnegotiable floor. Pacing sets the ceiling.
            Next, inspect the composite resilience score measuring systemic
            resilience across time.
          </p>

          {/* Transition Gateway into 05 / Financial Health */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-amber-300">
              NEXT // 05 / FINANCIAL HEALTH
            </span>
            <svg
              className="w-4 h-4 text-amber-300 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
