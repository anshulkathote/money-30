/**
 * MONEY//30 — Product & Challenge Alignment Specification
 *
 * Core definition file explicitly consumed by the application to define
 * problem constraints, duration, budget, and functional capabilities.
 */

export const PRODUCT = {
  name: "MONEY//30",
  tagline: "Simulate before you spend.",
  problem:
    "Young spenders and Gen Z track expenses retrospectively, leading to hidden compounding deficits. They lack a pre-decision simulation sandbox to assess systemic consequences before spending.",
  solution:
    "An interactive 30-day financial decision simulator calibrated to a ₹10,000 monthly allowance/stipend.",
  coreConcept: "Simulate before you spend.",
  budget: 10000,
  durationDays: 30,
  currency: "INR",
  currencySymbol: "₹",
  features: [
    "Financial Pulse",
    "Money Map",
    "What If financial simulator",
    "Financial commitments",
    "Savings goals",
    "Unexpected expense simulation",
    "Income simulation",
    "Financial risk",
    "Financial health",
    "Month-end forecast",
  ],
  sections: [
    { id: "pulse", index: "01", name: "Financial Pulse", label: "KNOW WHERE YOU STAND" },
    { id: "map", index: "02", name: "Money Map", label: "YOUR MONEY HAS A TRAJECTORY" },
    { id: "simulator", index: "03", name: "Decision Simulator", label: "WHAT IF?" },
    { id: "commitments", index: "04", name: "Commitments", label: "MONEY ALREADY SPOKEN FOR" },
    { id: "health", index: "05", name: "Financial Health", label: "HOW HEALTHY IS YOUR MONTH?" },
  ],
} as const;

export type ProductConfig = typeof PRODUCT;
