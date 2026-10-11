import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import type {
  FinancialState,
  DecisionType,
  DecisionInput,
} from "../types/financial";
import {
  getSimulationResult,
  calculateDerivedMetrics,
} from "../lib/financialEngine";
import { DECISION_PRESETS } from "../state/financialState";
import { PRODUCT } from "../config/product";
import { ConsequenceChain } from "./ConsequenceChain";

interface Props {
  currentState: FinancialState;
  onApplyDecision: (newState: FinancialState, decision?: DecisionInput) => void;
  onResetBaseline: () => void;
  /** Explicit optional handler for discard simulation */
  onDiscardDecision?: () => void;
}

export default function DecisionSimulator({
  currentState,
  onApplyDecision,
  onResetBaseline,
  onDiscardDecision,
}: Props) {
  // Decision form state
  const [selectedType, setSelectedType] = useState<DecisionType>("PURCHASE");
  const [decisionName, setDecisionName] = useState("New headphones");
  const [amountStr, setAmountStr] = useState("3499");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Simulation execution state
  const [isSimulated, setIsSimulated] = useState(false);
  const [hasAppliedToSystem, setHasAppliedToSystem] = useState(false);
  const [activeConsequenceId, setActiveConsequenceId] = useState<string>("c-1");

  const parsedAmount = Math.max(0, parseFloat(amountStr) || 0);

  // Active decision input object
  const currentDecisionInput = useMemo<DecisionInput>(() => {
    return {
      type: selectedType,
      name: decisionName.trim() || DECISION_PRESETS[selectedType].name,
      amount: parsedAmount,
    };
  }, [selectedType, decisionName, parsedAmount]);

  // Derived simulation output
  const simulationResult = useMemo(() => {
    return getSimulationResult(currentState, currentDecisionInput);
  }, [currentState, currentDecisionInput]);

  const currentMetrics = useMemo(() => {
    return calculateDerivedMetrics(currentState);
  }, [currentState]);

  // Handle Preset Quick Click
  const handleSelectPreset = (type: DecisionType) => {
    const preset = DECISION_PRESETS[type];
    setSelectedType(type);
    setDecisionName(preset.name);
    setAmountStr(String(preset.amount));
    setValidationError(null);
    setIsSimulated(true);
    setHasAppliedToSystem(false);
  };

  // Handle Type Select
  const handleSelectType = (type: DecisionType) => {
    setSelectedType(type);
    const preset = DECISION_PRESETS[type];
    setDecisionName(preset.name);
    setAmountStr(String(preset.amount));
    setValidationError(null);
    setHasAppliedToSystem(false);
  };

  // Run Simulation
  const handleSimulate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!decisionName.trim()) {
      setValidationError("Please enter an identifier or title for this decision.");
      return;
    }
    if (parsedAmount <= 0) {
      setValidationError("Amount must be greater than ₹0.");
      return;
    }
    setValidationError(null);
    setIsSimulated(true);
    setHasAppliedToSystem(false);

    // Smooth scroll down slightly into the simulation results
    setTimeout(() => {
      document.getElementById("simulation-workbench")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  };

  // Apply to Central State
  const handleApply = () => {
    onApplyDecision(simulationResult.simulatedState, simulationResult.decision);
    setHasAppliedToSystem(true);
  };

  // Discard Simulation
  const handleDiscard = () => {
    setIsSimulated(false);
    setHasAppliedToSystem(false);
    setValidationError(null);
    if (onDiscardDecision) onDiscardDecision();
  };

  // Reset System to Baseline
  const handleResetToBaseline = () => {
    onResetBaseline();
    setHasAppliedToSystem(false);
    setIsSimulated(false);
    handleSelectType("PURCHASE");
  };

  const decisionTypes: {
    type: DecisionType;
    label: string;
    tag: string;
    glyph: string;
    hint: string;
  }[] = [
    {
      type: "PURCHASE",
      label: "PURCHASE",
      tag: "ONE-TIME",
      glyph: "▲",
      hint: "Discretionary asset debited immediately",
    },
    {
      type: "SUBSCRIPTION",
      label: "SUBSCRIPTION",
      tag: "RECURRING LOCK",
      glyph: "↻",
      hint: "Locked monthly recurring commitment",
    },
    {
      type: "UNEXPECTED",
      label: "UNEXPECTED",
      tag: "STRESS TEST",
      glyph: "⚡",
      hint: "Emergency expenditure shock",
    },
    {
      type: "SAVINGS",
      label: "SAVINGS",
      tag: "VAULT TRANSFER",
      glyph: "◆",
      hint: "Capital shifted to high-yield reserve",
    },
    {
      type: "INCOME",
      label: "INCOME",
      tag: "CAPITAL EXPANSION",
      glyph: "▼",
      hint: "Fresh liquid cash inflow",
    },
  ];

  const activePresetInfo = DECISION_PRESETS[selectedType];

  return (
    <section
      id="simulator"
      className="relative z-30 min-h-screen bg-transparent text-white pt-24 pb-36 px-6 sm:px-12 md:px-20 overflow-hidden"
    >
      {/* ── Ambient Radial Glow & Architectural Grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 20%, rgba(245, 208, 97, 0.07) 0%, transparent 75%)",
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
         * 1. EDITORIAL OPENING: 03 / DECISION SIMULATOR — WHAT IF?
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
                03 / DECISION SIMULATOR
              </span>
              <span className="font-mono text-[11px] text-white/30 tracking-widest hidden sm:inline">
                PREDICTIVE CAUSAL ENGINE
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-[clamp(4.8rem,14vw,11rem)] leading-[0.82] uppercase tracking-tight text-white"
            >
              WHAT<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                IF?
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
              Before you spend it,{" "}
              <span className="text-amber-300 font-normal">spend it here.</span>
            </p>
            <p>
              Every decision changes something else. Test commitments, unplanned
              expenses, and capital transfers in this zero-risk sandbox before
              depleting active liquidity.
            </p>
            <div className="flex items-center lg:justify-end gap-2 text-amber-300/90 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>SIMULATION CO-PROCESSOR ACTIVE</span>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 2. QUICK SCENARIO PRESETS BAR
         * ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40">
              QUICK TEST PRESETS
            </span>
            <span className="font-mono text-[10px] text-amber-300/70 tracking-widest hidden sm:inline">
              SELECT TO INSTANTLY LOAD & SIMULATE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(
              [
                { type: "PURCHASE", name: "New headphones", amount: "₹3,499" },
                {
                  type: "SUBSCRIPTION",
                  name: "Streaming subscription",
                  amount: "₹499/mo",
                },
                {
                  type: "UNEXPECTED",
                  name: "Emergency expense",
                  amount: "₹1,500",
                },
                {
                  type: "SAVINGS",
                  name: "Move money to savings",
                  amount: "₹1,000",
                },
                { type: "INCOME", name: "Freelance payment", amount: "₹2,000" },
              ] as const
            ).map((preset) => {
              const isSelected =
                selectedType === preset.type && decisionName === preset.name;
              return (
                <button
                  key={preset.type}
                  type="button"
                  onClick={() => handleSelectPreset(preset.type)}
                  className={`p-3.5 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? "border-amber-400/80 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
                      : "border-white/10 bg-[#0c0d14]/70 hover:border-white/30 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] tracking-widest uppercase text-white/40">
                      {preset.type}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-amber-400" : "bg-white/20"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-heading text-xs sm:text-sm font-medium text-white line-clamp-1">
                      {preset.name}
                    </div>
                    <div className="font-mono text-xs font-semibold text-amber-300 mt-0.5">
                      {preset.amount}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
         * 3. DECISION CONFIGURATION WORKBENCH (INPUT DECK)
         * ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Decision Type Selector (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40">
              SELECT DECISION CLASS
            </span>

            <div className="flex flex-col gap-2.5">
              {decisionTypes.map((item) => {
                const isSelected = selectedType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleSelectType(item.type)}
                    className={`relative p-4 rounded-sm border text-left transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? "border-amber-400 bg-amber-400/[0.08] shadow-[0_0_25px_rgba(251,191,36,0.1)]"
                        : "border-white/10 bg-[#0c0d14]/80 hover:border-white/25 hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-8 h-8 rounded-sm flex items-center justify-center font-mono text-sm border ${
                          isSelected
                            ? "border-amber-400/50 bg-amber-400/20 text-amber-300"
                            : "border-white/10 bg-white/5 text-white/40 group-hover:text-white"
                        }`}
                      >
                        {item.glyph}
                      </span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-display text-lg tracking-wide uppercase ${
                              isSelected ? "text-white" : "text-white/70"
                            }`}
                          >
                            {item.label}
                          </span>
                          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-xs uppercase tracking-wider bg-white/5 text-white/40 border border-white/10">
                            {item.tag}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-white/40">
                          {item.hint}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {isSelected ? (
                        <span className="font-mono text-xs text-amber-400 font-semibold tracking-widest">
                          SELECTED
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-white/20 group-hover:text-white/60">
                          →
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Decision Parameter Inputs (7 columns) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-sm border border-white/10 bg-[#0c0d14]/90 backdrop-blur-xl flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <span className="font-mono text-xs font-bold tracking-[0.25em] text-white uppercase">
                  SIMULATION PARAMETERS
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-amber-300/80 px-2 py-0.5 rounded-xs bg-amber-400/10 border border-amber-400/20">
                {activePresetInfo.label}
              </span>
            </div>

            <p className="font-mono text-xs text-white/50 leading-relaxed">
              {activePresetInfo.description}
            </p>

            <form onSubmit={handleSimulate} className="flex flex-col gap-5">
              {/* Parameter 1: Name */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] uppercase tracking-wider text-white/60">
                  DECISION IDENTIFIER / NAME
                </label>
                <input
                  type="text"
                  value={decisionName}
                  onChange={(e) => setDecisionName(e.target.value)}
                  placeholder={activePresetInfo.placeholder}
                  className="w-full px-4 py-3 rounded-sm bg-white/5 border border-white/15 text-white font-heading text-base placeholder-white/20 focus:outline-none focus:border-amber-400 focus:bg-white/[0.08] transition-all"
                />
              </div>

              {/* Parameter 2: Amount */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-white/60">
                    {activePresetInfo.amountLabel} (₹)
                  </label>
                  <span className="font-mono text-[10px] text-white/40">
                    CURRENT BALANCE: ₹{currentMetrics.remainingBalance.toLocaleString()}
                  </span>
                </div>

                <div className="relative flex items-center">
                  <span className="absolute left-4 font-display text-2xl text-amber-400 select-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-sm bg-white/5 border border-white/15 text-white font-display text-3xl tracking-tight focus:outline-none focus:border-amber-400 focus:bg-white/[0.08] transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Validation Warning */}
              {validationError && (
                <div className="p-3 rounded-sm border border-rose-500/40 bg-rose-500/10 text-rose-300 font-mono text-xs flex items-center gap-2">
                  <span>⚠</span>
                  <span>{validationError}</span>
                </div>
              )}

              {/* Big CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-4 px-6 rounded-sm bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-white text-black font-mono text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] cursor-pointer flex items-center justify-center gap-3"
                >
                  <span>SIMULATE DECISION</span>
                  <span className="text-base font-sans">→</span>
                </button>

                {isSimulated && (
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="w-full sm:w-auto py-4 px-6 rounded-sm border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer"
                  >
                    RESET FORM
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
         * 4. SIMULATION WORKBENCH (DYNAMIC REVEAL & CONTEXTUAL IMPACT)
         * ═══════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isSimulated && (
            <motion.div
              id="simulation-workbench"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-16 pt-8 border-t border-white/10"
            >
              {/* Simulation Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-sm border border-amber-400/30 bg-amber-400/[0.04]">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="font-mono text-xs font-semibold tracking-[0.25em] text-white uppercase">
                    SIMULATION RUNWAY ACTIVATED
                  </span>
                  <span className="font-mono text-[10px] text-white/40 border-l border-white/10 pl-3">
                    TARGET: {simulationResult.decision.name} (₹
                    {simulationResult.decision.amount.toLocaleString()})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-amber-300">
                    STATUS: UNCOMMITTED DRAFT
                  </span>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────
               * A. AFFORDABILITY VERDICT DECK
               * ───────────────────────────────────────────────────────── */}
              <div className="p-8 sm:p-10 rounded-sm border border-white/15 bg-[#0c0d14]/90 backdrop-blur-xl relative overflow-hidden flex flex-col gap-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                {/* Subtle verdict accent glow */}
                <div
                  className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
                    simulationResult.verdict.status === "NOT RECOMMENDED"
                      ? "bg-rose-500"
                      : simulationResult.verdict.status === "RISKY"
                      ? "bg-orange-500"
                      : simulationResult.verdict.status === "POSSIBLE"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  }`}
                />

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs tracking-[0.3em] uppercase text-white/40">
                      AFFORDABILITY VERDICT
                    </span>
                    <span
                      className={`font-mono text-xs px-3 py-1 rounded-sm border font-semibold tracking-widest uppercase ${simulationResult.verdict.badgeColor}`}
                    >
                      {simulationResult.verdict.badgeText}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40">DAILY SHIFT:</span>
                      <span
                        className={`font-semibold ${
                          simulationResult.verdict.dailyChangeText.startsWith("-")
                            ? "text-rose-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {simulationResult.verdict.dailyChangeText}
                      </span>
                    </div>
                    <div className="h-3 w-[1px] bg-white/15" />
                    <div className="flex items-center gap-2">
                      <span className="text-white/40">MONTH-END SHIFT:</span>
                      <span
                        className={`font-semibold ${
                          simulationResult.verdict.forecastChangeText.startsWith(
                            "-"
                          )
                            ? "text-rose-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {simulationResult.verdict.forecastChangeText}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase">
                    {simulationResult.verdict.headline}
                  </h3>
                  <p className="font-mono text-sm sm:text-base text-white/70 max-w-4xl leading-relaxed">
                    {simulationResult.verdict.explanation}
                  </p>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────
               * B. BEFORE VS AFTER COMPARISON MATRIX (5 KEY METRICS)
               * ───────────────────────────────────────────────────────── */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40">
                    METRIC DELTA MATRIX (BEFORE // AFTER)
                  </span>
                  <span className="font-mono text-[10px] text-white/30 tracking-widest hidden sm:inline">
                    23 DAYS REMAINING IN CYCLE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Metric 1: Remaining Balance */}
                  <div className="p-5 rounded-sm border border-white/10 bg-[#0c0d14]/70 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase text-white/40 tracking-wider">
                      <span>CHECKING BALANCE</span>
                      <span>LIQUIDITY</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="font-mono text-xs text-white/30 line-through">
                        ₹{simulationResult.baselineMetrics.remainingBalance.toLocaleString()}
                      </div>
                      <div className="font-display text-3xl sm:text-4xl text-white tracking-tight mt-1">
                        ₹{simulationResult.simulatedMetrics.remainingBalance.toLocaleString()}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                      <span className="text-white/40">DELTA</span>
                      <span
                        className={
                          simulationResult.simulatedMetrics.remainingBalance >=
                          simulationResult.baselineMetrics.remainingBalance
                            ? "text-emerald-400 font-semibold"
                            : "text-rose-400 font-semibold"
                        }
                      >
                        {simulationResult.simulatedMetrics.remainingBalance >=
                        simulationResult.baselineMetrics.remainingBalance
                          ? "+"
                          : ""}
                        ₹
                        {(
                          simulationResult.simulatedMetrics.remainingBalance -
                          simulationResult.baselineMetrics.remainingBalance
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Metric 2: Daily Allowance */}
                  <div className="p-5 rounded-sm border border-white/10 bg-[#0c0d14]/70 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase text-white/40 tracking-wider">
                      <span>DAILY ALLOWANCE</span>
                      <span>RUNWAY</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="font-mono text-xs text-white/30 line-through">
                        ₹{simulationResult.baselineMetrics.dailyAllowance}/day
                      </div>
                      <div className="font-display text-3xl sm:text-4xl text-amber-300 tracking-tight mt-1">
                        ₹{simulationResult.simulatedMetrics.dailyAllowance}
                        <span className="font-mono text-xs text-white/40 font-normal">
                          /day
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                      <span className="text-white/40">DELTA</span>
                      <span
                        className={
                          simulationResult.simulatedMetrics.dailyAllowance >=
                          simulationResult.baselineMetrics.dailyAllowance
                            ? "text-emerald-400 font-semibold"
                            : "text-rose-400 font-semibold"
                        }
                      >
                        {simulationResult.simulatedMetrics.dailyAllowance >=
                        simulationResult.baselineMetrics.dailyAllowance
                          ? "+"
                          : ""}
                        ₹
                        {simulationResult.simulatedMetrics.dailyAllowance -
                          simulationResult.baselineMetrics.dailyAllowance}
                        /day
                      </span>
                    </div>
                  </div>

                  {/* Metric 3: Month-End Forecast */}
                  <div className="p-5 rounded-sm border border-white/10 bg-[#0c0d14]/70 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase text-white/40 tracking-wider">
                      <span>DAY 30 FORECAST</span>
                      <span>RESERVE</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="font-mono text-xs text-white/30 line-through">
                        ₹{simulationResult.baselineMetrics.monthEndForecast.toLocaleString()}
                      </div>
                      <div
                        className={`font-display text-3xl sm:text-4xl tracking-tight mt-1 ${
                          simulationResult.simulatedMetrics.monthEndForecast < 0
                            ? "text-rose-400"
                            : "text-white"
                        }`}
                      >
                        {simulationResult.simulatedMetrics.monthEndForecast < 0
                          ? `-₹${Math.abs(
                              simulationResult.simulatedMetrics.monthEndForecast
                            ).toLocaleString()}`
                          : `₹${simulationResult.simulatedMetrics.monthEndForecast.toLocaleString()}`}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                      <span className="text-white/40">DELTA</span>
                      <span
                        className={
                          simulationResult.simulatedMetrics.monthEndForecast >=
                          simulationResult.baselineMetrics.monthEndForecast
                            ? "text-emerald-400 font-semibold"
                            : "text-rose-400 font-semibold"
                        }
                      >
                        {simulationResult.simulatedMetrics.monthEndForecast >=
                        simulationResult.baselineMetrics.monthEndForecast
                          ? "+"
                          : ""}
                        ₹
                        {(
                          simulationResult.simulatedMetrics.monthEndForecast -
                          simulationResult.baselineMetrics.monthEndForecast
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Metric 4: Financial Risk */}
                  <div className="p-5 rounded-sm border border-white/10 bg-[#0c0d14]/70 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase text-white/40 tracking-wider">
                      <span>DEFENSIVE RISK</span>
                      <span>EXPOSURE</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="font-mono text-xs text-white/30 line-through">
                        {simulationResult.baselineMetrics.financialRisk}
                      </div>
                      <div
                        className={`font-display text-3xl sm:text-4xl tracking-tight mt-1 ${
                          simulationResult.simulatedMetrics.financialRisk === "HIGH"
                            ? "text-rose-400"
                            : simulationResult.simulatedMetrics.financialRisk ===
                              "MODERATE"
                            ? "text-amber-300"
                            : "text-emerald-400"
                        }`}
                      >
                        {simulationResult.simulatedMetrics.financialRisk}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                      <span className="text-white/40">STANCE</span>
                      <span className="text-white/60">
                        {simulationResult.simulatedMetrics.financialRisk === "HIGH"
                          ? "VULNERABLE"
                          : simulationResult.simulatedMetrics.financialRisk ===
                            "MODERATE"
                          ? "WATCHLIST"
                          : "PROTECTED"}
                      </span>
                    </div>
                  </div>

                  {/* Metric 5: Health Score */}
                  <div className="p-5 rounded-sm border border-white/10 bg-[#0c0d14]/70 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase text-white/40 tracking-wider">
                      <span>HEALTH SCORE</span>
                      <span>COMPOSITE</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="font-mono text-xs text-white/30 line-through">
                        {simulationResult.baselineMetrics.financialHealth} / 100
                      </div>
                      <div className="font-display text-3xl sm:text-4xl text-white tracking-tight mt-1">
                        {simulationResult.simulatedMetrics.financialHealth}
                        <span className="font-mono text-xs text-white/40">/100</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                      <span className="text-white/40">DELTA</span>
                      <span
                        className={
                          simulationResult.simulatedMetrics.financialHealth >=
                          simulationResult.baselineMetrics.financialHealth
                            ? "text-emerald-400 font-semibold"
                            : "text-rose-400 font-semibold"
                        }
                      >
                        {simulationResult.simulatedMetrics.financialHealth >=
                        simulationResult.baselineMetrics.financialHealth
                          ? "+"
                          : ""}
                        {simulationResult.simulatedMetrics.financialHealth -
                          simulationResult.baselineMetrics.financialHealth}{" "}
                        pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────
               * C. CONSEQUENCE ENGINE: 4 CAUSAL RIPPLE STEPS
               * ───────────────────────────────────────────────────────── */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40">
                    CONSEQUENCE ENGINE (DOWNSTREAM CAUSAL PIPELINE)
                  </span>
                  <span className="font-mono text-[10px] text-amber-300/70 tracking-widest hidden sm:inline">
                    CLICK TO INSPECT MECHANISM
                  </span>
                </div>

                <ConsequenceChain
                  consequences={simulationResult.consequences}
                  activeId={activeConsequenceId}
                  onSelect={setActiveConsequenceId}
                />
              </div>

              {/* ─────────────────────────────────────────────────────────
               * D. PLAN TRAJECTORY COMPARISON (MILESTONE GAUGE)
               * ───────────────────────────────────────────────────────── */}
              <div className="p-8 rounded-sm border border-white/10 bg-[#0c0d14]/80 flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold tracking-[0.25em] text-white uppercase">
                      30-DAY TRAJECTORY COMPARISON
                    </span>
                    <span className="font-mono text-[11px] text-white/40">
                      BASELINE VS SIMULATED
                    </span>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
                      <span className="text-white/50">BASELINE PATH</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                      <span className="text-amber-300 font-semibold">
                        SIMULATED PATH
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {simulationResult.comparisonPoints.map((pt) => {
                    const diff = pt.simulated - pt.baseline;
                    return (
                      <div
                        key={pt.day}
                        className="p-4 rounded-sm border border-white/10 bg-white/[0.02] flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-amber-300 font-bold">
                            DAY {String(pt.day).padStart(2, "0")}
                          </span>
                          <span className="text-white/30 text-[10px]">
                            {pt.day === 7 ? "ACTIVE" : pt.day === 30 ? "TARGET" : "NODE"}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between font-mono text-xs">
                            <span className="text-white/40">Base:</span>
                            <span className="text-white/70">
                              ₹{pt.baseline.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-mono text-xs">
                            <span className="text-amber-300/80">Sim:</span>
                            <span
                              className={`font-semibold ${
                                pt.simulated < 0 ? "text-rose-400" : "text-amber-300"
                              }`}
                            >
                              {pt.simulated < 0
                                ? `-₹${Math.abs(pt.simulated).toLocaleString()}`
                                : `₹${pt.simulated.toLocaleString()}`}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[11px]">
                          <span className="text-white/30">Gap:</span>
                          <span
                            className={
                              diff >= 0
                                ? "text-emerald-400 font-semibold"
                                : "text-rose-400 font-semibold"
                            }
                          >
                            {diff >= 0 ? "+" : ""}₹{diff.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────
               * E. COMMITMENT ACTION CONTROLS (APPLY VS DISCARD)
               * ───────────────────────────────────────────────────────── */}
              <div className="p-8 sm:p-10 rounded-sm border border-white/20 bg-gradient-to-b from-[#0e1017] to-[#07080b] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        hasAppliedToSystem
                          ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                          : "bg-amber-400"
                      }`}
                    />
                    <span className="font-mono text-xs font-bold tracking-[0.25em] text-white uppercase">
                      {hasAppliedToSystem
                        ? "SIMULATION APPLIED TO RUNTIME"
                        : "COMMITMENT GATEWAY"}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-white/50 max-w-lg mt-1">
                    {hasAppliedToSystem
                      ? "This simulation has mutated central financial state. Financial Pulse (01) and Money Map (02) are now reflecting this decision."
                      : "Applying this decision will mutate your live central state across all MONEY//30 sections. Discarding keeps your current trajectory untouched."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  {!hasAppliedToSystem ? (
                    <>
                      <button
                        type="button"
                        onClick={handleApply}
                        className="py-4 px-8 rounded-sm bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_0_25px_rgba(251,191,36,0.3)] hover:shadow-[0_0_35px_rgba(251,191,36,0.6)] cursor-pointer flex items-center gap-3"
                      >
                        <span>APPLY DECISION</span>
                        <span className="font-sans text-base">✓</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDiscard}
                        className="py-4 px-6 rounded-sm border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer"
                      >
                        DISCARD
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 rounded-sm border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 font-mono text-xs font-semibold">
                        ✓ ACTIVE IN MONEY//30 ENGINE
                      </div>

                      <button
                        type="button"
                        onClick={handleResetToBaseline}
                        className="py-4 px-6 rounded-sm border border-amber-400/50 hover:border-amber-400 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all cursor-pointer"
                      >
                        REVERT TO BASELINE ({PRODUCT.currencySymbol}{PRODUCT.budget.toLocaleString()})
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
