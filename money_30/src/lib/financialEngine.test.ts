/**
 * MONEY//30 — Automated Unit Verification Test Suite
 *
 * Verifies core mathematical invariants and interconnected consequences of the financialEngine:
 * 1. Initial Day 7 baseline state (₹10,000 budget, ₹7,420 remaining, ₹247/day, 82 health)
 * 2. Purchase simulation (₹3,499 headphones -> daily allowance down to ₹95/day, Day 30 deficit, NOT RECOMMENDED)
 * 3. Subscription simulation (₹499 streaming -> recurring overhead increase, allowance down)
 * 4. Unexpected expense simulation (₹1,500 emergency -> stress test, buffer compression)
 * 5. Savings simulation (₹1,000 transfer to vault -> protected capital increase)
 * 6. Income simulation (₹2,000 freelance -> capital expansion, allowance increase)
 * 7. Apply decision & Revert to baseline
 */

import {
  BASELINE,
  calculateRemainingBalance,
  calculateDailyAllowance,
  calculateMonthEndForecast,
  calculateFinancialHealth,
  calculateRisk,
  simulateDecision,
  getSimulationResult,
  applyDecision,
  resetFinancialState,
} from "./financialEngine";
import type { FinancialState, DecisionInput } from "../types/financial";

export interface TestResult {
  name: string;
  passed: boolean;
  actual?: unknown;
  expected?: unknown;
  error?: string;
}

export function runFinancialEngineTests(): {
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
} {
  const results: TestResult[] = [];

  function assert(name: string, condition: boolean, actual?: unknown, expected?: unknown) {
    results.push({
      name,
      passed: condition,
      actual,
      expected,
    });
  }

  const baselineState: FinancialState = {
    budget: BASELINE.budget,
    spent: BASELINE.spent,
    commitments: BASELINE.commitments,
    savings: BASELINE.savings,
    daysRemaining: BASELINE.daysRemaining,
    totalDays: BASELINE.totalDays,
    currentDay: BASELINE.currentDay,
  };

  // Test 1: Initial Baseline Calculations
  const remBal = calculateRemainingBalance(baselineState);
  assert("Initial remaining balance is ₹7,420", remBal === 7420, remBal, 7420);

  const dailyAllowance = calculateDailyAllowance(baselineState);
  assert("Initial daily allowance is ₹247/day", dailyAllowance === 247, dailyAllowance, 247);

  const forecast = calculateMonthEndForecast(baselineState);
  assert("Initial month-end forecast is ₹2,100", forecast === 2100, forecast, 2100);

  const healthScore = calculateFinancialHealth(baselineState);
  assert("Initial financial health score is 82", healthScore === 82, healthScore, 82);

  const risk = calculateRisk(baselineState);
  assert("Initial risk is LOW", risk.level === "LOW", risk.level, "LOW");

  // Test 2: Purchase ₹3,499 (Headphones) Simulation
  const purchaseDecision: DecisionInput = {
    type: "PURCHASE",
    name: "New headphones",
    amount: 3499,
  };
  const purchaseResult = getSimulationResult(baselineState, purchaseDecision);
  assert(
    "Purchase ₹3,499 reduces checking balance to ₹3,921",
    purchaseResult.simulatedMetrics.remainingBalance === 3921,
    purchaseResult.simulatedMetrics.remainingBalance,
    3921
  );
  assert(
    "Purchase ₹3,499 compresses daily allowance to ₹95/day",
    purchaseResult.simulatedMetrics.dailyAllowance === 95,
    purchaseResult.simulatedMetrics.dailyAllowance,
    95
  );
  assert(
    "Purchase ₹3,499 drives month-end forecast into deficit (-₹1,399)",
    purchaseResult.simulatedMetrics.monthEndForecast === -1399,
    purchaseResult.simulatedMetrics.monthEndForecast,
    -1399
  );
  assert(
    "Purchase ₹3,499 verdict is NOT RECOMMENDED",
    purchaseResult.verdict.status === "NOT RECOMMENDED",
    purchaseResult.verdict.status,
    "NOT RECOMMENDED"
  );
  assert(
    "Purchase ₹3,499 escalates risk to HIGH",
    purchaseResult.simulatedMetrics.financialRisk === "HIGH",
    purchaseResult.simulatedMetrics.financialRisk,
    "HIGH"
  );

  // Test 3: Subscription ₹499 Simulation
  const subDecision: DecisionInput = {
    type: "SUBSCRIPTION",
    name: "Streaming subscription",
    amount: 499,
  };
  const subSimState = simulateDecision(baselineState, subDecision);
  assert(
    "Subscription ₹499 increases commitments from ₹2,467 to ₹2,966",
    subSimState.commitments === 2966,
    subSimState.commitments,
    2966
  );

  // Test 4: Unexpected Expense ₹1,500 Simulation
  const unexpDecision: DecisionInput = {
    type: "UNEXPECTED",
    name: "Emergency expense",
    amount: 1500,
  };
  const unexpResult = getSimulationResult(baselineState, unexpDecision);
  assert(
    "Unexpected ₹1,500 reduces daily allowance",
    unexpResult.simulatedMetrics.dailyAllowance < 247,
    unexpResult.simulatedMetrics.dailyAllowance,
    "< 247"
  );

  // Test 5: Savings Transfer ₹1,000 Simulation
  const savDecision: DecisionInput = {
    type: "SAVINGS",
    name: "Move money to savings",
    amount: 1000,
  };
  const savSimState = simulateDecision(baselineState, savDecision);
  assert(
    "Savings transfer ₹1,000 increases savings to ₹4,000",
    savSimState.savings === 4000,
    savSimState.savings,
    4000
  );

  // Test 6: Freelance Income ₹2,000 Simulation
  const incDecision: DecisionInput = {
    type: "INCOME",
    name: "Freelance payment",
    amount: 2000,
  };
  const incResult = getSimulationResult(baselineState, incDecision);
  assert(
    "Income ₹2,000 expands budget to ₹12,000",
    incResult.simulatedState.budget === 12000,
    incResult.simulatedState.budget,
    12000
  );
  assert(
    "Income ₹2,000 expands daily allowance beyond baseline",
    incResult.simulatedMetrics.dailyAllowance > 247,
    incResult.simulatedMetrics.dailyAllowance,
    "> 247"
  );

  // Test 7: Apply Decision & Reset State
  const appliedState = applyDecision(baselineState, purchaseDecision);
  assert(
    "Applying decision mutates spent balance to ₹6,079",
    appliedState.spent === 6079,
    appliedState.spent,
    6079
  );

  const resetState = resetFinancialState();
  assert(
    "Reset state restores budget to ₹10,000",
    resetState.budget === 10000 && resetState.spent === 2580,
    resetState.spent,
    2580
  );

  const passedCount = results.filter((r) => r.passed).length;
  return {
    total: results.length,
    passed: passedCount,
    failed: results.length - passedCount,
    results,
  };
}
