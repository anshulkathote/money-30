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
} from "../src/lib/financialEngine.ts";

const baselineState = {
  budget: BASELINE.budget,
  spent: BASELINE.spent,
  commitments: BASELINE.commitments,
  savings: BASELINE.savings,
  daysRemaining: BASELINE.daysRemaining,
  totalDays: BASELINE.totalDays,
  currentDay: BASELINE.currentDay,
};

let passed = 0;
let total = 0;

function test(description, assertion) {
  total++;
  if (assertion) {
    passed++;
    console.log(`[PASS] ${description}`);
  } else {
    console.error(`[FAIL] ${description}`);
  }
}

console.log("=== MONEY//30 FINANCIAL ENGINE UNIT TESTS ===");

// 1. Initial State
test("Baseline remaining balance is ₹7,420", calculateRemainingBalance(baselineState) === 7420);
test("Baseline daily allowance is ₹247/day", calculateDailyAllowance(baselineState) === 247);
test("Baseline month-end forecast is ₹2,100", calculateMonthEndForecast(baselineState) === 2100);
test("Baseline health score is 82", calculateFinancialHealth(baselineState) === 82);
test("Baseline risk level is LOW", calculateRisk(baselineState).level === "LOW");

// 2. Purchase Headphones ₹3,499
const headphones = { type: "PURCHASE", name: "New headphones", amount: 3499 };
const simHeadphones = getSimulationResult(baselineState, headphones);
test("Purchase ₹3,499 balance becomes ₹3,921", simHeadphones.simulatedMetrics.remainingBalance === 3921);
test("Purchase ₹3,499 compresses daily allowance to ₹95/day", simHeadphones.simulatedMetrics.dailyAllowance === 95);
test("Purchase ₹3,499 plunges forecast into deficit (-₹1,399)", simHeadphones.simulatedMetrics.monthEndForecast === -1399);
test("Purchase ₹3,499 verdict is NOT RECOMMENDED", simHeadphones.verdict.status === "NOT RECOMMENDED");
test("Purchase ₹3,499 risk elevates to HIGH", simHeadphones.simulatedMetrics.financialRisk === "HIGH");

// 3. Subscription ₹499
const streamSub = { type: "SUBSCRIPTION", name: "Streaming subscription", amount: 499 };
const simSub = simulateDecision(baselineState, streamSub);
test("Subscription ₹499 increases commitments to ₹2,966", simSub.commitments === 2966);

// 4. Unexpected Expense ₹1,500
const emergency = { type: "UNEXPECTED", name: "Emergency expense", amount: 1500 };
const simEmerg = getSimulationResult(baselineState, emergency);
test("Emergency ₹1,500 compresses daily allowance", simEmerg.simulatedMetrics.dailyAllowance < 247);

// 5. Savings ₹1,000
const savings = { type: "SAVINGS", name: "Move money to savings", amount: 1000 };
const simSavings = simulateDecision(baselineState, savings);
test("Savings ₹1,000 increases savings to ₹4,000", simSavings.savings === 4000);

// 6. Income ₹2,000
const income = { type: "INCOME", name: "Freelance payment", amount: 2000 };
const simIncome = getSimulationResult(baselineState, income);
test("Income ₹2,000 expands budget to ₹12,000", simIncome.simulatedState.budget === 12000);
test("Income ₹2,000 expands daily allowance (> ₹247)", simIncome.simulatedMetrics.dailyAllowance > 247);

// 7. Apply & Reset
const applied = applyDecision(baselineState, headphones);
test("Apply decision mutates spent to ₹6,079", applied.spent === 6079);
const reset = resetFinancialState();
test("Reset restores baseline budget ₹10,000 and spent ₹2,580", reset.budget === 10000 && reset.spent === 2580);

console.log(`\nResults: ${passed}/${total} passed`);
if (passed === total) {
  console.log("All unit verification tests PASSED! ✓\n");
} else {
  process.exit(1);
}
