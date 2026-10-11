/**
 * MONEY//30 — Central Reactive State Hook & Presets
 *
 * Imports pure calculation algorithms from src/lib/financialEngine
 * and manages interactive React state across all sections.
 */

import { useState, useMemo } from "react";
import type {
  FinancialState,
  FinancialEvent,
  DecisionType,
  DecisionInput,
  CommitmentItem,
} from "../types/financial";
import {
  calculateDerivedMetrics,
  generateHealthReport,
  getLandmarkDays,
  getTrajectoryPoints,
  simulateDecision,
  BASELINE,
} from "../lib/financialEngine";

// Re-export pure calculation functions from financialEngine for seamless access
export * from "../lib/financialEngine";

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
  budget: BASELINE.budget,
  spent: BASELINE.spent,
  commitments: BASELINE.commitments,
  savings: BASELINE.savings,
  daysRemaining: BASELINE.daysRemaining,
  totalDays: BASELINE.totalDays,
  currentDay: BASELINE.currentDay,
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

/**
 * Primary React hook providing central reactive state and action handlers.
 */
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
