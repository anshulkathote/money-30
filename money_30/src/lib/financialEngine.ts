/**
 * MONEY//30 — Unified Financial Engine
 *
 * Exposes pure, fully testable mathematical calculation functions,
 * consequence derivation, and simulation algorithms used across MONEY//30.
 */

import type {
  FinancialState,
  DerivedMetrics,
  RiskClassification,
  RiskLevel,
  HealthReport,
  HealthDimension,
  HealthSignal,
  HealthRecommendation,
  DecisionInput,
  AffordabilityVerdict,
  SimulationResult,
  ConsequenceStep,
  LandmarkDay,
  TrajectoryPoint,
} from "../types/financial";

// ── Baseline Calibrations (Day 7 unperturbed ₹10,000 monthly cycle) ─────────
export const BASELINE = {
  budget: 10000,
  spent: 2580,
  commitments: 2467,
  savings: 3000,
  daysRemaining: 23,
  totalDays: 30,
  currentDay: 7,
  dailyAllowance: 247,
  monthEndForecast: 2100,
  healthScore: 82,
} as const;

/**
 * Calculates current liquid balance remaining in active checking float.
 */
export function calculateRemainingBalance(state: FinancialState): number {
  return state.budget - state.spent;
}

/**
 * Calculates discretionary liquid capital not yet spoken for by commitments or savings.
 */
export function calculateAvailableToAllocate(state: FinancialState): number {
  return state.budget - (state.spent + state.commitments + state.savings);
}

/**
 * Calculates safe daily allowance across remaining days in cycle.
 * Incorporates net liquid disruptions against calibrated baseline.
 */
export function calculateDailyAllowance(state: FinancialState): number {
  const netLiquidDisruption =
    state.spent -
    BASELINE.spent +
    (state.commitments - BASELINE.commitments) +
    (state.savings - BASELINE.savings) -
    (state.budget - BASELINE.budget);

  return Math.max(
    0,
    Math.round(
      BASELINE.dailyAllowance - netLiquidDisruption / Math.max(1, state.daysRemaining)
    )
  );
}

/**
 * Forecasts end-of-month (Day 30) cushion or deficit based on current burn rate.
 */
export function calculateMonthEndForecast(state: FinancialState): number {
  const netLiquidDisruption =
    state.spent -
    BASELINE.spent +
    (state.commitments - BASELINE.commitments) +
    (state.savings - BASELINE.savings) -
    (state.budget - BASELINE.budget);

  return Math.round(BASELINE.monthEndForecast - netLiquidDisruption);
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

/**
 * Scores spending discipline from 10 to 100 based on spent / budget ratio.
 */
export function calculateSpendingScore(state: FinancialState): number {
  const spendRatio = state.spent / state.budget;
  // Baseline: 2580 / 10000 = 0.258 -> 80
  const score = 80 - (spendRatio - 0.258) * 120;
  return Math.max(10, Math.min(100, Math.round(score)));
}

/**
 * Scores savings fortification from 10 to 100 based on savings / budget ratio.
 */
export function calculateSavingsScore(state: FinancialState): number {
  const savingsRatio = state.savings / state.budget;
  // Baseline: 3000 / 10000 = 0.30 -> 88
  const score = 88 + (savingsRatio - 0.3) * 100;
  return Math.max(10, Math.min(100, Math.round(score)));
}

/**
 * Scores recurring commitment load from 10 to 100 based on commitments / budget ratio.
 */
export function calculateCommitmentScore(state: FinancialState): number {
  const commitmentRatio = state.commitments / state.budget;
  // Baseline: 2467 / 10000 = 0.2467 -> 78
  const score = 78 - (commitmentRatio - 0.2467) * 140;
  return Math.max(10, Math.min(100, Math.round(score)));
}

/**
 * Calculates system risk posture (LOW, MEDIUM, HIGH) and quantitative score (0-100).
 */
export function calculateRisk(state: FinancialState): {
  level: RiskClassification;
  score: number;
  explanation: string;
} {
  const dailyAllowance = calculateDailyAllowance(state);
  const monthEndForecast = calculateMonthEndForecast(state);

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

/**
 * Weighted composite financial health score (0–100).
 * 30% Spending, 30% Risk, 20% Savings, 20% Commitments.
 */
export function calculateFinancialHealth(state: FinancialState): number {
  const spendScore = calculateSpendingScore(state);
  const savingsScore = calculateSavingsScore(state);
  const commitmentScore = calculateCommitmentScore(state);
  const riskObj = calculateRisk(state);

  const composite =
    spendScore * 0.3 +
    riskObj.score * 0.3 +
    savingsScore * 0.2 +
    commitmentScore * 0.2;

  // Calibrated so Day 7 unperturbed baseline equals 82
  return Math.max(10, Math.min(100, Math.round(composite - 1)));
}

/**
 * Bundles all derived financial indicators for a given state.
 */
export function calculateDerivedMetrics(state: FinancialState): DerivedMetrics {
  const remainingBalance = calculateRemainingBalance(state);
  const availableToAllocate = calculateAvailableToAllocate(state);
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

/**
 * Generates an end-to-end diagnostic health report across 4 dimensions.
 */
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
      label: "SPENDING PACE",
      score: spendScore,
      status: getStatus(spendScore),
      detail:
        spendScore >= 80
          ? "Within sustainable boundary. Discretionary pace is disciplined."
          : spendScore >= 65
          ? "Moderate acceleration. Daily spend is trending higher than optimal."
          : "Elevated burn rate. Capital depletion is outstripping cycle duration.",
      metricLabel: "Spent so far",
      metricValue: `₹${state.spent.toLocaleString()} / ₹${state.budget.toLocaleString()}`,
    },
    {
      id: "SAVINGS",
      label: "SAVINGS RETENTION",
      score: savingsScore,
      status: getStatus(savingsScore),
      detail:
        savingsScore >= 85
          ? "Strong reserve fortress. Emergency buffer is fully intact."
          : savingsScore >= 70
          ? "Adequate reserves. Capable of absorbing minor friction."
          : "Thin reserve runway. Highly sensitive to external shocks.",
      metricLabel: "Vaulted capital",
      metricValue: `₹${state.savings.toLocaleString()} (${Math.round((state.savings / state.budget) * 100)}%)`,
    },
    {
      id: "COMMITMENTS",
      label: "FIXED OVERHEAD",
      score: commitmentScore,
      status: getStatus(commitmentScore),
      detail:
        commitmentScore >= 75
          ? "Lean recurring profile. High flexibility retained in float."
          : commitmentScore >= 60
          ? "Moderate fixed load. Subscriptions require periodic audits."
          : "Heavy recurring commitments locking significant liquid capital.",
      metricLabel: "Locked capital",
      metricValue: `₹${state.commitments.toLocaleString()} / month`,
    },
    {
      id: "RISK",
      label: "DEFENSIVE POSTURE",
      score: riskObj.score,
      status: getStatus(riskObj.score),
      detail: riskObj.explanation,
      metricLabel: "Risk rating",
      metricValue: `${riskObj.level} RISK (${riskObj.score} PTS)`,
    },
  ];

  const signals: HealthSignal[] = [];

  if (metrics.dailyAllowance >= 230) {
    signals.push({
      id: "sig-1",
      type: "POSITIVE",
      title: "SUSTAINABLE DAILY VELOCITY",
      description: `Your ₹${metrics.dailyAllowance}/day allowance provides comfortable elasticity for discretionary food and daily transit.`,
    });
  } else {
    signals.push({
      id: "sig-1",
      type: "NEGATIVE",
      title: "COMPRESSED DAILY MARGIN",
      description: `Daily spend capacity is down to ₹${metrics.dailyAllowance}/day. Keep non-essential purchases strictly paced.`,
    });
  }

  if (metrics.monthEndForecast >= 1800) {
    signals.push({
      id: "sig-2",
      type: "POSITIVE",
      title: "ROBUST MONTH-END BUFFER",
      description: `You are projected to conclude Day 30 with ₹${metrics.monthEndForecast.toLocaleString()} in liquid surplus.`,
    });
  } else {
    signals.push({
      id: "sig-2",
      type: "NEGATIVE",
      title: "REDUCED CUSHION AT DAY 30",
      description: `Projected month-end buffer is ₹${metrics.monthEndForecast.toLocaleString()}. An unplanned expense could deplete reserves.`,
    });
  }

  let recommendation: HealthRecommendation = {
    headline: "PRESERVE STRATEGIC RUNWAY",
    action:
      "Maintain current spending pace. Your financial parameters are well-balanced for the remaining cycle.",
    impact: `Projects an untouched ₹${metrics.monthEndForecast.toLocaleString()} finish on Day 30.`,
  };

  if (riskObj.level === "HIGH") {
    recommendation = {
      headline: "STABILIZE LIQUID RESERVES IMMEDIATELY",
      action:
        "Pause non-essential subscriptions and avoid discretionary one-off purchases for the next 10 days.",
      impact: `Reclaims up to +₹45/day in daily allowance and restores emergency cushion.`,
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
 * Pure simulation function: applies a decision to a state without mutating the original.
 */
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

/**
 * Evaluates affordability of a decision and returns human & metric verdict.
 */
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
 * Core simulation orchestrator: takes input, simulates state,
 * calculates before & after metrics, evaluates verdict, and builds consequence chain.
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
  return {
    budget: BASELINE.budget,
    spent: BASELINE.spent,
    commitments: BASELINE.commitments,
    savings: BASELINE.savings,
    daysRemaining: BASELINE.daysRemaining,
    totalDays: BASELINE.totalDays,
    currentDay: BASELINE.currentDay,
  };
}

/**
 * Builds landmark milestone data for 30-day timeline analysis.
 */
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
      dailyAllowance: Math.round(state.budget / state.totalDays),
      upcomingCommitment: "None (Cycle Opening)",
      financialRisk: "LOW",
      insight:
        "Full capital allocation unlocked. Zero expenditure incurred.",
    },
    {
      day: 7,
      projectedBalance: currentRem,
      safePathBalance: 7000,
      dailyAllowance: metrics.dailyAllowance,
      upcomingCommitment: "Netflix (₹649), Gym (₹1,200) settled",
      financialRisk: metrics.financialRisk,
      insight: `Currently pacing at ₹${metrics.dailyAllowance}/day with ₹${currentRem.toLocaleString()} remaining liquid capital.`,
    },
    {
      day: 15,
      projectedBalance: d15Balance,
      safePathBalance: 5000,
      dailyAllowance: Math.max(10, Math.round(d15Balance / 15)),
      upcomingCommitment: "Savings Contribution scheduled (₹500)",
      financialRisk: d15Balance < 3500 ? "HIGH" : "LOW",
      insight:
        "Mid-month checkpoint. Discretionary spending rate determines buffer health.",
    },
    {
      day: 22,
      projectedBalance: d22Balance,
      safePathBalance: 3200,
      dailyAllowance: Math.max(10, Math.round(d22Balance / 8)),
      upcomingCommitment: "Mobile Plan auto-debit (₹499)",
      financialRisk: d22Balance < 2000 ? "HIGH" : "LOW",
      insight:
        "Penultimate week. Capital discipline here shields the month-end reserve.",
    },
    {
      day: 30,
      projectedBalance: metrics.monthEndForecast,
      safePathBalance: 2000,
      dailyAllowance: Math.max(0, metrics.monthEndForecast),
      upcomingCommitment: "Cycle Close & Roll-forward",
      financialRisk: metrics.monthEndForecast < 500 ? "HIGH" : "LOW",
      insight:
        metrics.monthEndForecast < 0
          ? `Projected deficit of -₹${Math.abs(metrics.monthEndForecast).toLocaleString()}. Runway depleted.`
          : `Projected surplus of ₹${metrics.monthEndForecast.toLocaleString()} available to roll into savings.`,
    },
  ];
}

/**
 * Builds 30 discrete points for dual SVG trajectory visualization.
 */
export function getTrajectoryPoints(state: FinancialState): TrajectoryPoint[] {
  const points: TrajectoryPoint[] = [];
  const metrics = calculateDerivedMetrics(state);
  const currentRem = state.budget - state.spent;

  for (let day = 1; day <= state.totalDays; day++) {
    const progress = (day - 1) / (state.totalDays - 1);
    const safePath = Math.round(
      state.budget - (state.budget - 2000) * progress
    );

    let currentPath: number;
    if (day <= state.currentDay) {
      const elapsedProgress = (day - 1) / (state.currentDay - 1);
      currentPath = Math.round(
        state.budget - (state.budget - currentRem) * elapsedProgress
      );
    } else {
      const futureProgress =
        (day - state.currentDay) / (state.totalDays - state.currentDay);
      currentPath = Math.round(
        currentRem - (currentRem - metrics.monthEndForecast) * futureProgress
      );
    }

    points.push({
      day,
      currentPath,
      safePath,
    });
  }
  return points;
}
