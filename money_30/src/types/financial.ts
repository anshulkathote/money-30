export interface FinancialState {
  budget: number;
  spent: number;
  commitments: number;
  savings: number;
  daysRemaining: number;
  totalDays: number;
  currentDay: number;
}

export type RiskLevel = "LOW" | "MODERATE" | "HIGH";

export interface DerivedMetrics {
  remainingBalance: number;
  availableToAllocate: number;
  dailyAllowance: number;
  monthEndForecast: number;
  financialRisk: RiskLevel;
  financialHealth: number;
  spendingPercentage: number;
  commitmentsPercentage: number;
  savingsPercentage: number;
  availablePercentage: number;
}

export type EventCategory =
  | "SUBSCRIPTION"
  | "COMMITMENT"
  | "SPENDING"
  | "SAVINGS"
  | "DISRUPTION";

export interface FinancialEvent {
  id: string;
  day: number;
  amount: number;
  title: string;
  category: EventCategory;
  impactDescription: string;
}

export interface LandmarkDay {
  day: number;
  projectedBalance: number;
  safePathBalance: number;
  dailyAllowance: number;
  upcomingCommitment: string;
  financialRisk: RiskLevel;
  insight: string;
}

export interface TrajectoryPoint {
  day: number;
  currentPath: number;
  safePath: number;
}

export type DecisionType =
  | "PURCHASE"
  | "SUBSCRIPTION"
  | "UNEXPECTED"
  | "SAVINGS"
  | "INCOME";

export interface DecisionInput {
  type: DecisionType;
  name: string;
  amount: number;
}

export type VerdictStatus =
  | "COMFORTABLE"
  | "POSSIBLE"
  | "RISKY"
  | "NOT RECOMMENDED";

export interface AffordabilityVerdict {
  status: VerdictStatus;
  badgeText: string;
  badgeColor: string;
  headline: string;
  explanation: string;
  dailyChangeText: string;
  forecastChangeText: string;
}

export interface ConsequenceStep {
  id: string;
  stepNumber: string;
  title: string;
  change: string;
  explanation: string;
  impactType: "positive" | "neutral" | "caution" | "critical";
  metricLabel: string;
}

export interface SimulationResult {
  decision: DecisionInput;
  simulatedState: FinancialState;
  baselineMetrics: DerivedMetrics;
  simulatedMetrics: DerivedMetrics;
  verdict: AffordabilityVerdict;
  consequences: ConsequenceStep[];
  comparisonPoints: {
    day: number;
    baseline: number;
    simulated: number;
  }[];
}

export type CommitmentFrequency = "MONTHLY" | "WEEKLY";
export type CommitmentStatus = "ACTIVE" | "PAUSED";

export interface CommitmentItem {
  id: string;
  name: string;
  amount: number;
  frequency: CommitmentFrequency;
  status: CommitmentStatus;
  category?: string;
}

/** Canonical alias for CommitmentItem */
export type Commitment = CommitmentItem;

/** Canonical alias for DecisionInput */
export type FinancialDecision = DecisionInput;

export type RiskClassification = "LOW" | "MEDIUM" | "HIGH";

export interface HealthDimension {
  id: "SPENDING" | "SAVINGS" | "COMMITMENTS" | "RISK";
  label: string;
  score: number;
  status: "OPTIMAL" | "HEALTHY" | "WATCH" | "CRITICAL";
  detail: string;
  metricLabel: string;
  metricValue: string;
}

export interface HealthSignal {
  id: string;
  type: "POSITIVE" | "NEGATIVE";
  title: string;
  description: string;
}

export interface HealthRecommendation {
  headline: string;
  action: string;
  impact: string;
}

export interface HealthReport {
  overallScore: number;
  riskLevel: RiskClassification;
  riskExplanation: string;
  dimensions: HealthDimension[];
  signals: HealthSignal[];
  recommendation: HealthRecommendation;
}
