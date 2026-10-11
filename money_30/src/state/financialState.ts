import { useState, useMemo } from "react";
import type {
  FinancialState,
  DerivedMetrics,
  FinancialEvent,
  LandmarkDay,
  TrajectoryPoint,
  DecisionType,
  DecisionInput,
  RiskLevel,
  AffordabilityVerdict,
  ConsequenceStep,
  SimulationResult,
  CommitmentItem,
  RiskClassification,
  HealthDimension,
  HealthSignal,
  HealthReport,
} from "../types/financial";

export const INITIAL_COMMITMENTS: CommitmentItem[] = [
  {
    id: "comm-1",
    name: "Netflix",
    amount: 649,
    frequency: "MONTHLY",
    status: "ACTIVE",
    category: "STREAMING",
  },
  {
    id: "comm-2",
    name: "Spotify",
    amount: 119,
    frequency: "MONTHLY",
    status: "ACTIVE",
    category: "AUDIO",
  },
  {
    id: "comm-3",
    name: "Gym",
    amount: 1200,
    frequency: "MONTHLY",
    status: "ACTIVE",
    category: "FITNESS",
  },
  {
    id: "comm-4",
    name: "Phone",
    amount: 499,
    frequency: "MONTHLY",
    status: "ACTIVE",
    category: "TELECOM",
  },
];

export const INITIAL_FINANCIAL_STATE: FinancialState = {
  budget: 10000,
  spent: 2580,
  commitments: 2467,
  savings: 3000,
  daysRemaining: 23,
  totalDays: 30,
  currentDay: 7,
};

export const FINANCIAL_EVENTS: FinancialEvent[] = [
  {
    id: "evt-1",
    day: 3,
    amount: -649,
    title: "Netflix",
    category: "SUBSCRIPTION",
    impactDescription: "Recurring subscription debited from available liquidity.",
  },
  {
    id: "evt-2",
    day: 5,
    amount: -1200,
    title: "Gym",
    category: "COMMITMENT",
    impactDescription: "Fixed monthly membership obligation settled.",
  },
  {
    id: "evt-3",
    day: 7,
    amount: -2580,
    title: "Spending",
    category: "SPENDING",
    impactDescription: "Accumulated daily utility and food expenditure.",
  },
  {
    id: "evt-4",
    day: 12,
    amount: -500,
    title: "Savings contribution",
    category: "SAVINGS",
    impactDescription: "Automated recurring allocation into high-yield runway.",
  },
  {
    id: "evt-5",
    day: 18,
    amount: -899,
    title: "Unexpected expense",
    category: "DISRUPTION",
    impactDescription: "Unplanned device servicing / emergency utility bill.",
  },
];

export const DECISION_PRESETS: Record<
  DecisionType,
  {
    name: string;
    amount: number;
    label: string;
    tag: string;
    description: string;
    placeholder: string;
    amountLabel: string;
  }
> = {
  PURCHASE: {
    name: "New headphones",
    amount: 3499,
    label: "DISCRETIONARY ASSET",
    tag: "ONE-TIME",
    description:
      "One-off lifestyle or hardware acquisition debited immediately from active checking balance.",
    placeholder: "e.g. New headphones",
    amountLabel: "Purchase price",
  },
  SUBSCRIPTION: {
    name: "Streaming subscription",
    amount: 499,
    label: "RECURRING COMMITMENT",
    tag: "MONTHLY LOCK",
    description:
      "Ongoing monthly obligation that compounds across cycles and tightens fixed monthly float.",
    placeholder: "e.g. Streaming subscription",
    amountLabel: "Monthly subscription cost",
  },
  UNEXPECTED: {
    name: "Emergency expense",
    amount: 1500,
    label: "UNFORESEEN LIQUIDITY EVENT",
    tag: "STRESS TEST",
    description:
      "Sudden urgent disruption (device repair, medical, emergency transit) testing reserve resilience.",
    placeholder: "e.g. Emergency expense",
    amountLabel: "Unforeseen amount",
  },
  SAVINGS: {
    name: "Move money to savings",
    amount: 1000,
    label: "RUNWAY FORTIFICATION",
    tag: "PROTECTED VAULT",
    description:
      "Capital transfer into isolated high-yield reserves, strengthening total net wealth.",
    placeholder: "e.g. Move money to savings",
    amountLabel: "Transfer to vault",
  },
  INCOME: {
    name: "Freelance payment",
    amount: 2000,
    label: "CAPITAL EXPANSION",
    tag: "INFLOW",
    description:
      "Immediate cash inflow expanding total operating budget, increasing daily spending elasticity.",
    placeholder: "e.g. Freelance payment",
    amountLabel: "Inflow capital",
  },
};

export function calculateSpendingScore(state: FinancialState): number {
  const spendRatio = state.spent / state.budget;
  // Baseline: 2580 / 10000 = 0.258 -> 80
  const score = 80 - (spendRatio - 0.258) * 120;
  return Math.max(10, Math.min(100, Math.round(score)));
}

export function calculateSavingsScore(state: FinancialState): number {
  const savingsRatio = state.savings / state.budget;
  // Baseline: 3000 / 10000 = 0.30 -> 88
  const score = 88 + (savingsRatio - 0.3) * 100;
  return Math.max(10, Math.min(100, Math.round(score)));
}

export function calculateCommitmentScore(state: FinancialState): number {
  const commitmentRatio = state.commitments / state.budget;
  // Baseline: 2467 / 10000 = 0.2467 -> 78
  const score = 78 - (commitmentRatio - 0.2467) * 140;
  return Math.max(10, Math.min(100, Math.round(score)));
}

export function calculateRisk(state: FinancialState): {
  level: RiskClassification;
  score: number;
  explanation: string;
} {
  // Baseline constants
  const baselineSpent = 2580;
  const baselineCommitments = 2467;
  const baselineSavings = 3000;
  const baselineBudget = 10000;

  const netLiquidDisruption =
    state.spent -
    baselineSpent +
    (state.commitments - baselineCommitments) +
    (state.savings - baselineSavings) -
    (state.budget - baselineBudget);

  const dailyAllowance = Math.max(
    0,
    Math.round(247 - netLiquidDisruption / Math.max(1, state.daysRemaining))
  );
  const monthEndForecast = Math.round(2100 - netLiquidDisruption);

  if (monthEndForecast < 500 || dailyAllowance < 140) {
    return {
      level: "HIGH",
      score: 28,
      explanation:
        monthEndForecast < 0
          ? `Deficit of -₹${Math.abs(monthEndForecast).toLocaleString()} projected at month-end. You have no buffer remaining for unpredicted expenses.`
          : `Critical reserve depletion. Daily allowance is down to ₹${dailyAllowance}/day, leaving minimal defensive headroom.`,
    };
  }

  if (monthEndForecast < 1600 || dailyAllowance < 210) {
    return {
      level: "MEDIUM",
      score: 62,
      explanation: `Your projected buffer is ₹${monthEndForecast.toLocaleString()}. An unexpected expense of ₹1,000 would consume most of your remaining margin.`,
    };
  }

  return {
    level: "LOW",
    score: 86,
    explanation: `You have enough projected balance (₹${monthEndForecast.toLocaleString()}) to comfortably absorb a ₹1,000 unexpected expense without destabilizing your runway.`,
  };
}

export function calculateFinancialHealth(state: FinancialState): number {
  const spendScore = calculateSpendingScore(state);
  const savingsScore = calculateSavingsScore(state);
  const commitmentScore = calculateCommitmentScore(state);
  const riskObj = calculateRisk(state);

  // 30% Spending, 30% Risk, 20% Savings, 20% Commitments
  const composite =
    spendScore * 0.3 +
    riskObj.score * 0.3 +
    savingsScore * 0.2 +
    commitmentScore * 0.2;

  // At baseline: 80*0.3 (24) + 86*0.3 (25.8) + 88*0.2 (17.6) + 78*0.2 (15.6) = 83 -> clamped/calibrated to 82
  return Math.max(10, Math.min(100, Math.round(composite - 1)));
}

export function generateHealthReport(state: FinancialState): HealthReport {
  const spendScore = calculateSpendingScore(state);
  const savingsScore = calculateSavingsScore(state);
  const commitmentScore = calculateCommitmentScore(state);
  const riskObj = calculateRisk(state);
  const overallScore = calculateFinancialHealth(state);
  const metrics = calculateDerivedMetrics(state);

  const getStatus = (
    score: number
  ): "OPTIMAL" | "HEALTHY" | "WATCH" | "CRITICAL" => {
    if (score >= 82) return "OPTIMAL";
    if (score >= 70) return "HEALTHY";
    if (score >= 50) return "WATCH";
    return "CRITICAL";
  };

  const dimensions: HealthDimension[] = [
    {
      id: "SPENDING",
      label: "SPENDING EFFICIENCY",
      score: spendScore,
      status: getStatus(spendScore),
      detail:
        spendScore >= 75
          ? "Discretionary spend pace is disciplined relative to elapsed cycle days."
          : "Spending burn rate is trending ahead of cycle pacing targets.",
      metricLabel: "Burn Ratio",
      metricValue: `${((state.spent / state.budget) * 100).toFixed(1)}% used`,
    },
    {
      id: "SAVINGS",
      label: "CAPITAL PRESERVATION",
      score: savingsScore,
      status: getStatus(savingsScore),
      detail:
        savingsScore >= 80
          ? "High-yield protected vault is robust and insulated from liquid drain."
          : "Savings reserve is below optimal runway defense target.",
      metricLabel: "Vault Allocation",
      metricValue: `₹${state.savings.toLocaleString()} locked`,
    },
    {
      id: "COMMITMENTS",
      label: "FIXED OVERHEAD RATIO",
      score: commitmentScore,
      status: getStatus(commitmentScore),
      detail:
        commitmentScore >= 75
          ? "Recurring subscriptions and obligations remain well under overhead thresholds."
          : "Fixed obligations are absorbing a substantial portion of total monthly liquidity.",
      metricLabel: "Recurring Burden",
      metricValue: `₹${state.commitments.toLocaleString()}/mo`,
    },
    {
      id: "RISK",
      label: "DEFENSIVE RESILIENCE",
      score: riskObj.score,
      status: getStatus(riskObj.score),
      detail: riskObj.explanation,
      metricLabel: "Safety Cushion",
      metricValue: `₹${metrics.monthEndForecast.toLocaleString()} forecast`,
    },
  ];

  const signals: HealthSignal[] = [];

  if (state.savings / state.budget >= 0.25) {
    signals.push({
      id: "sig-1",
      type: "POSITIVE",
      title: "HEALTHY SAVINGS BUFFER",
      description: `You're protecting a healthy savings buffer of ₹${state.savings.toLocaleString()} (${(
        (state.savings / state.budget) *
        100
      ).toFixed(0)}% of total budget) insulated in high-yield reserves.`,
    });
  }

  if (metrics.monthEndForecast >= 1500) {
    signals.push({
      id: "sig-2",
      type: "POSITIVE",
      title: "RUNWAY ABOVE SAFETY THRESHOLD",
      description: `Your projected balance (₹${metrics.monthEndForecast.toLocaleString()}) remains well above your baseline safety threshold.`,
    });
  } else if (metrics.monthEndForecast < 0) {
    signals.push({
      id: "sig-2-neg",
      type: "NEGATIVE",
      title: "PROJECTED DEFICIT DETECTED",
      description: `Your current expenditure profile points to a -₹${Math.abs(
        metrics.monthEndForecast
      ).toLocaleString()} deficit at cycle close unless capital is rebalanced.`,
    });
  } else {
    signals.push({
      id: "sig-2-warn",
      type: "NEGATIVE",
      title: "RUNWAY COMPRESSION",
      description: `Your current spending pace may reduce your month-end buffer down to ₹${metrics.monthEndForecast.toLocaleString()}, leaving narrow margin for surprises.`,
    });
  }

  if (state.commitments / state.budget > 0.28) {
    signals.push({
      id: "sig-3",
      type: "NEGATIVE",
      title: "HEAVY RECURRING COMMITMENTS",
      description: `Recurring obligations are consuming ${(
        (state.commitments / state.budget) *
        100
      ).toFixed(0)}% of your budget (₹${state.commitments.toLocaleString()}/mo), restricting daily flexibility.`,
    });
  } else if (metrics.dailyAllowance >= 230) {
    signals.push({
      id: "sig-4",
      type: "POSITIVE",
      title: "HEALTHY DAILY PACING",
      description: `Daily spending flexibility is well-calibrated at ₹${metrics.dailyAllowance}/day across the remaining ${state.daysRemaining} days.`,
    });
  }

  // Recommendation: YOUR BIGGEST OPPORTUNITY
  let recommendation = {
    headline: "FORTIFY LONG-TERM RUNWAY",
    action: "Protect your savings goal before increasing discretionary spending.",
    impact: `Maintains ₹${state.savings.toLocaleString()} vault and ₹${metrics.monthEndForecast.toLocaleString()} buffer.`,
  };

  if (metrics.monthEndForecast < 0) {
    recommendation = {
      headline: "ELIMINATE RUNWAY DEFICIT",
      action:
        "Pause non-essential subscriptions or curtail discretionary spend immediately to restore equilibrium.",
      impact: `Recovers ₹${Math.abs(
        metrics.monthEndForecast
      ).toLocaleString()} to avert negative cycle close.`,
    };
  } else if (state.commitments > 2200) {
    recommendation = {
      headline: "REDUCE RECURRING OVERHEAD",
      action:
        "Reduce recurring commitments by pausing underused subscriptions (potential saving: ₹500/month).",
      impact: `Unlocks +₹22/day directly into flexible daily allowance.`,
    };
  } else if (metrics.dailyAllowance < 200) {
    recommendation = {
      headline: "TIGHTEN DISCRETIONARY PURCHASES",
      action:
        "Your daily allowance is tightening. Consider reducing discretionary purchases over the next 7 days.",
      impact: `Preserves a minimum ₹1,500 cushion into the final week.`,
    };
  }

  return {
    overallScore,
    riskLevel: riskObj.level,
    riskExplanation: riskObj.explanation,
    dimensions,
    signals,
    recommendation,
  };
}

/**
 * Calculates remaining discretionary daily allowance across the remaining cycle.
 * Incorporates net liquid disruptions against calibrated baseline.
 */
export function calculateDailyAllowance(state: FinancialState): number {
  const baselineSpent = 2580;
  const baselineCommitments = 2467;
  const baselineSavings = 3000;
  const baselineBudget = 10000;

  const netLiquidDisruption =
    state.spent -
    baselineSpent +
    (state.commitments - baselineCommitments) +
    (state.savings - baselineSavings) -
    (state.budget - baselineBudget);

  return Math.max(
    0,
    Math.round(247 - netLiquidDisruption / Math.max(1, state.daysRemaining))
  );
}

/**
 * Calculates forecasted liquidity surplus/deficit at Day 30.
 */
export function calculateMonthEndForecast(state: FinancialState): number {
  const baselineSpent = 2580;
  const baselineCommitments = 2467;
  const baselineSavings = 3000;
  const baselineBudget = 10000;

  const netLiquidDisruption =
    state.spent -
    baselineSpent +
    (state.commitments - baselineCommitments) +
    (state.savings - baselineSavings) -
    (state.budget - baselineBudget);

  return Math.round(2100 - netLiquidDisruption);
}

/**
 * Calculates projected balance at any specific target day in the 30-day timeline.
 */
export function calculateProjectedBalance(
  state: FinancialState,
  targetDay: number
): number {
  const remaining = state.budget - state.spent;
  const forecast = calculateMonthEndForecast(state);
  if (targetDay <= state.currentDay) {
    const elapsedRatio = targetDay / Math.max(1, state.currentDay);
    return Math.round(state.budget - state.spent * elapsedRatio);
  }
  const remainingProgress =
    (targetDay - state.currentDay) / Math.max(1, state.totalDays - state.currentDay);
  return Math.round(remaining - (remaining - forecast) * remainingProgress);
}

export function calculateDerivedMetrics(state: FinancialState): DerivedMetrics {
  const remainingBalance = state.budget - state.spent;
  const availableToAllocate =
    state.budget - (state.spent + state.commitments + state.savings);

  const dailyAllowance = calculateDailyAllowance(state);
  const monthEndForecast = calculateMonthEndForecast(state);

  const riskObj = calculateRisk(state);
  const financialRisk: RiskLevel =
    riskObj.level === "MEDIUM" ? "MODERATE" : riskObj.level;

  const financialHealth = calculateFinancialHealth(state);

  const spendingPercentage = (state.spent / state.budget) * 100;
  const commitmentsPercentage = (state.commitments / state.budget) * 100;
  const savingsPercentage = (state.savings / state.budget) * 100;
  const availablePercentage = Math.max(
    0,
    (availableToAllocate / state.budget) * 100
  );

  return {
    remainingBalance,
    availableToAllocate,
    dailyAllowance,
    monthEndForecast,
    financialRisk,
    financialHealth,
    spendingPercentage,
    commitmentsPercentage,
    savingsPercentage,
    availablePercentage,
  };
}

export function simulateDecision(
  currentState: FinancialState,
  decision: DecisionInput
): FinancialState {
  const { type, amount } = decision;
  const validatedAmount = Math.max(0, amount);

  switch (type) {
    case "PURCHASE":
    case "UNEXPECTED":
      return {
        ...currentState,
        spent: currentState.spent + validatedAmount,
      };
    case "SUBSCRIPTION":
      return {
        ...currentState,
        commitments: currentState.commitments + validatedAmount,
      };
    case "SAVINGS":
      return {
        ...currentState,
        savings: currentState.savings + validatedAmount,
      };
    case "INCOME":
      return {
        ...currentState,
        budget: currentState.budget + validatedAmount,
      };
    default:
      return currentState;
  }
}

export function getAffordabilityVerdict(
  baseline: DerivedMetrics,
  simulated: DerivedMetrics,
  decision: DecisionInput
): AffordabilityVerdict {
  const forecast = simulated.monthEndForecast;
  const allowance = simulated.dailyAllowance;
  const deltaAllowance = simulated.dailyAllowance - baseline.dailyAllowance;
  const deltaForecast = simulated.monthEndForecast - baseline.monthEndForecast;

  const dailyChangeText = `${deltaAllowance >= 0 ? "+" : ""}₹${deltaAllowance}/day`;
  const forecastChangeText = `${deltaForecast >= 0 ? "+" : ""}₹${deltaForecast.toLocaleString()}`;

  if (forecast < 0 || allowance < 100) {
    const reductionPct = Math.abs(
      Math.round((deltaAllowance / baseline.dailyAllowance) * 100)
    );
    return {
      status: "NOT RECOMMENDED",
      badgeText: "NOT RECOMMENDED",
      badgeColor: "border-rose-500/40 bg-rose-500/10 text-rose-400",
      headline: "CRITICAL BUFFER DEFICIT",
      explanation: `Committing ₹${decision.amount.toLocaleString()} to "${decision.name}" forces your Day 30 forecast into deficit (${forecast < 0 ? `-₹${Math.abs(forecast).toLocaleString()}` : `₹${forecast}`}) and compresses your daily spending allowance to just ₹${allowance}/day (a ${reductionPct}% reduction). You would be highly vulnerable to any subsequent expense over the next 23 days.`,
      dailyChangeText,
      forecastChangeText,
    };
  }

  if (forecast < 1000 || allowance < 180) {
    return {
      status: "RISKY",
      badgeText: "HIGH FRICTION / RISKY",
      badgeColor: "border-orange-500/40 bg-orange-500/10 text-orange-400",
      headline: "SEVERELY COMPROMISED RUNWAY",
      explanation: `Absorbable in the short term, but reduces your month-end buffer to ₹${forecast.toLocaleString()} and tightens daily spending to ₹${allowance}/day. Leaves minimal cushion for unpredicted events over the remaining 23 days.`,
      dailyChangeText,
      forecastChangeText,
    };
  }

  if (allowance < baseline.dailyAllowance) {
    return {
      status: "POSSIBLE",
      badgeText: "POSSIBLE WITH DISCIPLINE",
      badgeColor: "border-amber-400/40 bg-amber-400/10 text-amber-300",
      headline: "MANAGEABLE DISCRETIONARY SHIFT",
      explanation: `Feasible without jeopardizing financial stability. Your daily allowance settles at ₹${allowance}/day and preserves a ₹${forecast.toLocaleString()} Day 30 buffer. Requires moderate expenditure pacing.`,
      dailyChangeText,
      forecastChangeText,
    };
  }

  return {
    status: "COMFORTABLE",
    badgeText: "COMFORTABLE / ACCELERATING",
    badgeColor: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    headline: "HEALTHY CAPITAL POSITION",
    explanation:
      decision.type === "INCOME"
        ? `Expands your financial horizon. Daily discretionary flexibility climbs to ₹${allowance}/day with an expanded ₹${forecast.toLocaleString()} month-end cushion.`
        : `Safely fits within your parameters while preserving capital resilience and forward flexibility.`,
    dailyChangeText,
    forecastChangeText,
  };
}

/**
 * WHAT IF? DECISION SIMULATOR ENGINE
 *
 * Why the simulator recalculates multiple interconnected metrics:
 * In a finite 30-day budget (₹10,000), a single financial action does not simply reduce balance.
 * Because all variables are interconnected in real life:
 * 1. Immediate Liquidity: Checking balance moves instantly.
 * 2. Daily Runway Rate: Remaining days (23) must absorb the change, altering the safe daily allowance.
 * 3. Day 30 Trajectory: Month-end forecast compounds daily drift.
 * 4. Defensive Risk & Health: Composite resilience changes, testing vulnerability to surprise emergencies.
 *
 * This function calculates the hypothetical state, evaluates the complete Before vs After delta,
 * generates an evidence-based Affordability Verdict, and derives a 4-step Consequence Chain.
 */
export function getSimulationResult(
  currentState: FinancialState,
  decision: DecisionInput
): SimulationResult {
  const simulatedState = simulateDecision(currentState, decision);
  const baselineMetrics = calculateDerivedMetrics(currentState);
  const simulatedMetrics = calculateDerivedMetrics(simulatedState);
  const verdict = getAffordabilityVerdict(
    baselineMetrics,
    simulatedMetrics,
    decision
  );

  const deltaBalance =
    simulatedMetrics.remainingBalance - baselineMetrics.remainingBalance;
  const deltaAllowance =
    simulatedMetrics.dailyAllowance - baselineMetrics.dailyAllowance;
  const deltaForecast =
    simulatedMetrics.monthEndForecast - baselineMetrics.monthEndForecast;
  const deltaHealth =
    simulatedMetrics.financialHealth - baselineMetrics.financialHealth;

  const consequences: ConsequenceStep[] = [
    {
      id: "c-1",
      stepNumber: "01",
      title: "LIQUIDITY ADJUSTMENT",
      metricLabel: "Active Checking Float",
      change: `${deltaBalance >= 0 ? "+" : ""}₹${deltaBalance.toLocaleString()}`,
      explanation:
        decision.type === "INCOME"
          ? `Capital inflow expands primary liquidity from ₹${baselineMetrics.remainingBalance.toLocaleString()} to ₹${simulatedMetrics.remainingBalance.toLocaleString()}.`
          : decision.type === "SAVINGS"
          ? `Reallocates ₹${decision.amount.toLocaleString()} into protected savings, leaving ₹${simulatedMetrics.remainingBalance.toLocaleString()} in liquid float.`
          : `Immediately deducts ₹${decision.amount.toLocaleString()} from checking float, moving balance from ₹${baselineMetrics.remainingBalance.toLocaleString()} to ₹${simulatedMetrics.remainingBalance.toLocaleString()}.`,
      impactType:
        deltaBalance > 0
          ? "positive"
          : deltaBalance === 0
          ? "neutral"
          : "caution",
    },
    {
      id: "c-2",
      stepNumber: "02",
      title: "DAILY RUNWAY IMPACT",
      metricLabel: "Daily Safe Spend",
      change: `${deltaAllowance >= 0 ? "+" : ""}₹${deltaAllowance}/day`,
      explanation:
        deltaAllowance < 0
          ? `To absorb this expenditure over the next 23 days, daily safe spend compresses from ₹${baselineMetrics.dailyAllowance}/day to ₹${simulatedMetrics.dailyAllowance}/day (${Math.abs(Math.round((deltaAllowance / baselineMetrics.dailyAllowance) * 100))}% reduction).`
          : deltaAllowance > 0
          ? `Expands daily discretionary spending freedom from ₹${baselineMetrics.dailyAllowance}/day up to ₹${simulatedMetrics.dailyAllowance}/day (+${Math.round((deltaAllowance / baselineMetrics.dailyAllowance) * 100)}%).`
          : `Daily discretionary allowance remains stable at ₹${simulatedMetrics.dailyAllowance}/day.`,
      impactType:
        deltaAllowance < -100
          ? "critical"
          : deltaAllowance < 0
          ? "caution"
          : "positive",
    },
    {
      id: "c-3",
      stepNumber: "03",
      title: "DAY 30 BUFFER PROJECTION",
      metricLabel: "Month-End Cushion",
      change: `${deltaForecast >= 0 ? "+" : ""}₹${deltaForecast.toLocaleString()}`,
      explanation:
        simulatedMetrics.monthEndForecast < 0
          ? `Wipes out your ₹${baselineMetrics.monthEndForecast.toLocaleString()} cushion and drives cycle conclusion into a -₹${Math.abs(simulatedMetrics.monthEndForecast).toLocaleString()} deficit.`
          : simulatedMetrics.monthEndForecast < baselineMetrics.monthEndForecast
          ? `Reduces projected reserve from ₹${baselineMetrics.monthEndForecast.toLocaleString()} down to ₹${simulatedMetrics.monthEndForecast.toLocaleString()}, shrinking margin of error.`
          : `Bolsters projected Day 30 finish line from ₹${baselineMetrics.monthEndForecast.toLocaleString()} to ₹${simulatedMetrics.monthEndForecast.toLocaleString()}.`,
      impactType:
        simulatedMetrics.monthEndForecast < 0
          ? "critical"
          : simulatedMetrics.monthEndForecast < 1000
          ? "caution"
          : "positive",
    },
    {
      id: "c-4",
      stepNumber: "04",
      title: "DEFENSIVE POSTURE",
      metricLabel: "Systemic Resilience",
      change: `${deltaHealth >= 0 ? "+" : ""}${deltaHealth} pts (${simulatedMetrics.financialRisk})`,
      explanation:
        simulatedMetrics.financialRisk === "HIGH"
          ? `Elevates defensive risk to HIGH. A secondary surprise expenditure within 23 days will break operating budget.`
          : simulatedMetrics.financialRisk === "MODERATE"
          ? `Transitions defensive risk to MODERATE. Operating headroom is preserved but requires strict discipline.`
          : `Preserves LOW defensive risk posture. System remains in healthy equilibrium.`,
      impactType:
        simulatedMetrics.financialRisk === "HIGH"
          ? "critical"
          : simulatedMetrics.financialRisk === "MODERATE"
          ? "caution"
          : "positive",
    },
  ];

  const comparisonPoints = [
    { day: 1, baseline: currentState.budget, simulated: simulatedState.budget },
    {
      day: 7,
      baseline: currentState.budget - currentState.spent,
      simulated: simulatedState.budget - simulatedState.spent,
    },
    {
      day: 15,
      baseline: Math.round(
        baselineMetrics.remainingBalance -
          (baselineMetrics.remainingBalance -
            baselineMetrics.monthEndForecast) *
            0.45
      ),
      simulated: Math.round(
        simulatedMetrics.remainingBalance -
          (simulatedMetrics.remainingBalance -
            simulatedMetrics.monthEndForecast) *
            0.45
      ),
    },
    {
      day: 22,
      baseline: Math.round(
        baselineMetrics.remainingBalance -
          (baselineMetrics.remainingBalance -
            baselineMetrics.monthEndForecast) *
            0.75
      ),
      simulated: Math.round(
        simulatedMetrics.remainingBalance -
          (simulatedMetrics.remainingBalance -
            simulatedMetrics.monthEndForecast) *
            0.75
      ),
    },
    {
      day: 30,
      baseline: baselineMetrics.monthEndForecast,
      simulated: simulatedMetrics.monthEndForecast,
    },
  ];

  return {
    decision,
    simulatedState,
    baselineMetrics,
    simulatedMetrics,
    verdict,
    consequences,
    comparisonPoints,
  };
}

export function getLandmarkDays(state: FinancialState): LandmarkDay[] {
  const currentRem = state.budget - state.spent;
  const metrics = calculateDerivedMetrics(state);

  const d15Balance = Math.round(
    currentRem - (currentRem - metrics.monthEndForecast) * 0.45
  );
  const d22Balance = Math.round(
    currentRem - (currentRem - metrics.monthEndForecast) * 0.75
  );

  return [
    {
      day: 1,
      projectedBalance: state.budget,
      safePathBalance: state.budget,
      dailyAllowance: Math.round(state.budget / 30),
      upcomingCommitment: "₹649 Netflix on Day 03",
      financialRisk: "LOW",
      insight: "Initial capital pool allocated for 30-day runway.",
    },
    {
      day: 7,
      projectedBalance: currentRem,
      safePathBalance: 7600,
      dailyAllowance: metrics.dailyAllowance,
      upcomingCommitment: "₹500 Savings transfer on Day 12",
      financialRisk: metrics.financialRisk,
      insight:
        metrics.financialRisk === "LOW"
          ? "You're on track. Safe daily expenditure ceiling preserved."
          : "Runway alert: High burn rate impacting projected margins.",
    },
    {
      day: 15,
      projectedBalance: d15Balance,
      safePathBalance: 5800,
      dailyAllowance: Math.max(0, Math.round(metrics.dailyAllowance * 0.85)),
      upcomingCommitment: "₹899 Disruption window Day 18",
      financialRisk:
        d15Balance < 3500 ? "HIGH" : d15Balance < 5200 ? "MODERATE" : "LOW",
      insight:
        "Mid-cycle inflection point. Critical threshold for discretionary pacing.",
    },
    {
      day: 22,
      projectedBalance: d22Balance,
      safePathBalance: 4620,
      dailyAllowance: Math.max(0, Math.round(metrics.dailyAllowance * 0.72)),
      upcomingCommitment: "Final week utilities pending",
      financialRisk:
        d22Balance < 2000 ? "HIGH" : d22Balance < 3400 ? "MODERATE" : "LOW",
      insight:
        d22Balance < 2000
          ? "Deficit risk elevated in final stretch."
          : "Stable buffer heading into closing week.",
    },
    {
      day: 30,
      projectedBalance: metrics.monthEndForecast,
      safePathBalance: 3840,
      dailyAllowance: 0,
      upcomingCommitment: "Cycle complete — Reallocation next",
      financialRisk:
        metrics.monthEndForecast < 0
          ? "HIGH"
          : metrics.monthEndForecast < 1000
          ? "MODERATE"
          : "LOW",
      insight:
        metrics.monthEndForecast >= 2000
          ? `Cycle conclusion with ₹${metrics.monthEndForecast.toLocaleString()} buffer preserved.`
          : metrics.monthEndForecast >= 0
          ? `Tight conclusion with ₹${metrics.monthEndForecast.toLocaleString()} reserve.`
          : `Deficit of ₹${Math.abs(metrics.monthEndForecast).toLocaleString()} projected at close.`,
    },
  ];
}

/**
 * 30 points for smooth trajectory curves
 */
export function getTrajectoryPoints(state: FinancialState): TrajectoryPoint[] {
  const points: TrajectoryPoint[] = [];
  const currentRem = state.budget - state.spent;
  const metrics = calculateDerivedMetrics(state);
  const endForecast = metrics.monthEndForecast;

  for (let day = 1; day <= 30; day++) {
    const t = (day - 1) / 29;
    let currentPath: number;
    if (day <= 7) {
      currentPath = Math.round(
        state.budget - ((state.budget - currentRem) * (day - 1)) / 6
      );
    } else {
      const tPost = (day - 7) / 23;
      currentPath = Math.round(
        currentRem - (currentRem - endForecast) * Math.pow(tPost, 0.92)
      );
    }

    const safePath = Math.round(
      state.budget - (state.budget - 3840) * Math.pow(t, 0.85)
    );

    points.push({
      day,
      currentPath,
      safePath,
    });
  }
  return points;
}

export function useFinancialState() {
  const [state, setState] = useState<FinancialState>(INITIAL_FINANCIAL_STATE);
  const [commitmentsList, setCommitmentsList] =
    useState<CommitmentItem[]>(INITIAL_COMMITMENTS);

  const metrics = useMemo(() => calculateDerivedMetrics(state), [state]);
  const landmarks = useMemo(() => getLandmarkDays(state), [state]);
  const trajectory = useMemo(() => getTrajectoryPoints(state), [state]);

  const updateSpent = (newSpent: number) => {
    setState((prev) => ({ ...prev, spent: newSpent }));
  };

  const updateCommitments = (newCommitments: number) => {
    setState((prev) => ({ ...prev, commitments: newCommitments }));
  };

  const updateSavings = (newSavings: number) => {
    setState((prev) => ({ ...prev, savings: newSavings }));
  };

  const toggleCommitment = (id: string) => {
    setCommitmentsList((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "ACTIVE"
                  ? ("PAUSED" as const)
                  : ("ACTIVE" as const),
            }
          : item
      );
      const newTotal = updated
        .filter((i) => i.status === "ACTIVE")
        .reduce(
          (sum, i) =>
            sum + (i.frequency === "WEEKLY" ? i.amount * 4 : i.amount),
          0
        );
      setState((prev) => ({ ...prev, commitments: newTotal }));
      return updated;
    });
  };

  const addCommitment = (
    commitment: Omit<CommitmentItem, "id" | "status">
  ) => {
    const newItem: CommitmentItem = {
      ...commitment,
      id: `comm-${Date.now()}`,
      status: "ACTIVE",
    };
    setCommitmentsList((prev) => {
      const updated = [newItem, ...prev];
      const newTotal = updated
        .filter((i) => i.status === "ACTIVE")
        .reduce(
          (sum, i) =>
            sum + (i.frequency === "WEEKLY" ? i.amount * 4 : i.amount),
          0
        );
      setState((prev) => ({ ...prev, commitments: newTotal }));
      return updated;
    });
  };

  const removeCommitment = (id: string) => {
    setCommitmentsList((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      const newTotal = updated
        .filter((i) => i.status === "ACTIVE")
        .reduce(
          (sum, i) =>
            sum + (i.frequency === "WEEKLY" ? i.amount * 4 : i.amount),
          0
        );
      setState((prev) => ({ ...prev, commitments: newTotal }));
      return updated;
    });
  };

  const applyDecisionState = (
    newState: FinancialState,
    decision?: DecisionInput
  ) => {
    setState(newState);
    if (decision && decision.type === "SUBSCRIPTION") {
      setCommitmentsList((prev) => [
        {
          id: `comm-sim-${Date.now()}`,
          name: decision.name,
          amount: decision.amount,
          frequency: "MONTHLY",
          status: "ACTIVE",
          category: "SIMULATED",
        },
        ...prev,
      ]);
    }
  };

  const resetToBaseline = () => {
    setState(INITIAL_FINANCIAL_STATE);
    setCommitmentsList(INITIAL_COMMITMENTS);
  };

  const healthReport = useMemo(() => generateHealthReport(state), [state]);

  return {
    state,
    metrics,
    landmarks,
    trajectory,
    commitmentsList,
    healthReport,
    events: FINANCIAL_EVENTS,
    updateSpent,
    updateCommitments,
    updateSavings,
    toggleCommitment,
    addCommitment,
    removeCommitment,
    setState,
    applyDecisionState,
    /** Semantic alias for applyDecisionState */
    applyDecision: applyDecisionState,
    resetToBaseline,
    /** Semantic alias for resetToBaseline */
    resetFinancialState: resetToBaseline,
  };
}

/**
 * Pure helper to compute next state from applying a decision.
 */
export function applyDecision(
  currentState: FinancialState,
  decision: DecisionInput
): FinancialState {
  return simulateDecision(currentState, decision);
}

/**
 * Pure helper to reset state back to baseline ₹10,000 Day 7 model.
 */
export function resetFinancialState(): FinancialState {
  return { ...INITIAL_FINANCIAL_STATE };
}

