# MONEY//30 — Feature & Architecture Specification

> Comprehensive directory of all interactive capabilities, triggers, mathematical state transformations, and component bindings in the MONEY//30 application.

---

## 1. System Architecture Overview

MONEY//30 operates on an **unidirectional data flow architecture** with centralized state management:

```
[ User Interaction ] (Input, Preset Click, Commitment Toggle, Apply/Discard)
        │
        ▼
[ Action Dispatcher / Event Handlers ]
        │
        ▼
[ Central State Hook: useFinancialState() ]
        │
        ▼
[ Pure Calculation Engine ]
  ├── calculateDerivedMetrics()
  ├── calculateDailyAllowance()
  ├── calculateMonthEndForecast()
  ├── calculateProjectedBalance()
  ├── calculateRisk()
  ├── calculateFinancialHealth()
  ├── simulateDecision()
  └── getSimulationResult()
        │
        ▼
[ Reactive Derived State: DerivedMetrics & HealthReport ]
        │
        ▼
[ Section Components Re-render with Motion.dev Animations ]
  ├── FinancialPulse (Metrics, Balance, Allocation)
  ├── MoneyMap (SVG Trajectory Curves, Landmark Inspector)
  ├── DecisionSimulator (Before/After Delta, Consequence Chain)
  ├── CommitmentsSection (Allocation Beam, Subscription Cards)
  └── FinancialHealthSection (0-100 Score, Dimension Sliders, Signals)
```

---

## 2. Feature Catalog

### FEATURE 01: Financial Pulse Dashboard
* **Purpose:** Establishes the user's current baseline financial posture at Day 7 of the 30-day budget cycle.
* **User Interaction:**
  * Scroll into view from the cinematic transition.
  * Hover over metric cards and causality pipeline nodes.
* **Expected Result:** Instant visual comprehension of current liquid checking balance (`₹7,420`), daily allowance (`₹247/day`), month-end forecast (`₹2,100`), and safe path deviation (`+₹420`).
* **Financial State Affected:** Reads `budget`, `spent`, `commitments`, `savings`, `daysRemaining`.
* **Components Involved:** `src/components/FinancialPulse.tsx`
* **Calculation Functions:**
  * `calculateDerivedMetrics(state)`
  * `calculateDailyAllowance(state)`
  * `calculateMonthEndForecast(state)`

---

### FEATURE 02: 30-Day Money Map & Trajectory Curves
* **Purpose:** Demonstrates that a ₹10,000 monthly budget is not static, plotting day-by-day capital trajectory.
* **User Interaction:**
  * Click milestone buttons for Day 01, Day 07, Day 15, Day 22, Day 30.
  * Click the downward transition gateway (`WHAT IF?`) to scroll directly into the decision simulator.
* **Expected Result:**
  * The SVG dual trajectory dynamically contrasts the actual balance curve against the target safe path curve.
  * Milestone inspector card updates to display the target day's projected balance, daily allowance, upcoming commitments, and contextual financial guidance.
* **Financial State Affected:** Reads global `FinancialState` and `FINANCIAL_EVENTS`.
* **Components Involved:** `src/components/MoneyMap.tsx`
* **Calculation Functions:**
  * `getTrajectoryPoints(state)`
  * `getLandmarkDays(state)`
  * `calculateProjectedBalance(state, targetDay)`

---

### FEATURE 03: What If? Decision Simulator (Core Feature)
* **Purpose:** Empowers users to test financial decisions *before* committing funds, observing the full systemic aftermath.
* **User Interaction:**
  1. **Select Decision Type:** Click one of 5 distinct type selectors:
     * `PURCHASE` (One-time discretionary expense)
     * `SUBSCRIPTION` (Recurring fixed monthly obligation)
     * `UNEXPECTED` (Emergency liquidity disruption)
     * `SAVINGS` (Vault transfer into emergency runway)
     * `INCOME` (Freelance cash injection)
  2. **Select Preset or Custom Value:** Click a preset button (e.g., "New headphones ₹3,499", "Streaming subscription ₹499", "Emergency expense ₹1,500") or edit the numeric input amount and decision name directly.
  3. **Inspect Real-time Consequences:** View the live updated Affordability Verdict (`COMFORTABLE`, `POSSIBLE`, `RISKY`, `NOT RECOMMENDED`), Before vs After delta, and the 4-step Consequence Chain.
  4. **Apply or Discard:**
     * Click **"APPLY DECISION"** to permanently commit the simulated state into global state.
     * Click **"DISCARD / REVERT"** to undo an applied decision and return to the baseline state.
* **Expected Result:**
  * If a user selects ₹3,499 headphones, daily allowance immediately drops from ₹247/day to ₹95/day, Day 30 forecast turns into a -₹1,399 deficit, risk escalates to HIGH, and the verdict warns NOT RECOMMENDED.
  * Applying a `SUBSCRIPTION` decision automatically inserts the new recurring item into the Commitments section list.
  * Applying any decision cascades through all other sections (updating Financial Pulse, Money Map, and Financial Health).
* **Financial State Affected:**
  * `spent`: incremented on `PURCHASE` and `UNEXPECTED`.
  * `commitments`: incremented on `SUBSCRIPTION`.
  * `savings`: incremented on `SAVINGS`.
  * `budget`: incremented on `INCOME`.
* **Components Involved:** `src/components/DecisionSimulator.tsx`
* **Calculation Functions:**
  * `simulateDecision(currentState, decision)`
  * `getAffordabilityVerdict(baselineMetrics, simulatedMetrics, decision)`
  * `getSimulationResult(currentState, decision)`
  * `applyDecisionState(newState, decision)`

---

### FEATURE 04: Commitments Allocation Beam & Subscription Manager
* **Purpose:** Visually separates committed ("locked") capital from discretionary ("flexible") capital, providing an interactive toggle to free up cash flow.
* **User Interaction:**
  * Click **ACTIVE / PAUSED** toggle on any commitment row (Netflix ₹649, Spotify ₹119, Gym ₹1,200, Phone ₹499).
  * Click **+ ADD COMMITMENT** to open the drawer, enter a custom obligation (name, monthly/weekly amount, category), and submit.
  * Click **Delete (Trash icon)** to remove a commitment.
* **Expected Result:**
  * Pausing the ₹1,200 Gym membership instantly lowers total commitments from ₹2,467 to ₹1,267.
  * Immediately increases available flexible capital by +₹1,200.
  * Recalculates daily allowance across the remaining 23 days, adding **+₹52/day** in free spending power.
  * Updates the 04 / Allocation Beam graphic in real time.
* **Financial State Affected:** Updates `state.commitments` and `commitmentsList`.
* **Components Involved:** `src/components/CommitmentsSection.tsx`
* **Calculation Functions:**
  * `toggleCommitment(id)`
  * `addCommitment(commitment)`
  * `removeCommitment(id)`
  * `calculateDerivedMetrics(state)`

---

### FEATURE 05: Financial Health Composite Engine (0–100)
* **Purpose:** Provides a holistically calculated financial score reflecting stability, discipline, and defensive resilience.
* **User Interaction:**
  * Scroll into the section to view the central animated score dial.
  * Inspect the 4 health dimension breakdowns (`SPENDING`, `SAVINGS`, `COMMITMENTS`, `RISK`).
  * Review positive/negative health signals and the top recommended liquidity action.
  * Click **RESET MONTH** to restore the entire application to the original Day 7 baseline state.
* **Expected Result:**
  * Health score dynamically adapts based on decisions made in Section 03 or commitments toggled in Section 04:
    * Baseline: **82 / 100** (Optimal).
    * If ₹3,499 headphones applied: drops to **48 / 100** (Watch/Critical).
    * If ₹2,000 freelance income applied: climbs to **94 / 100** (Exceptional).
  * Smooth numerical interpolation via Motion.dev animations.
* **Financial State Affected:** Evaluates entire `FinancialState`.
* **Components Involved:** `src/components/FinancialHealthSection.tsx`
* **Calculation Functions:**
  * `calculateSpendingScore(state)` (Weight: 30%)
  * `calculateRisk(state)` (Weight: 30%)
  * `calculateSavingsScore(state)` (Weight: 20%)
  * `calculateCommitmentScore(state)` (Weight: 20%)
  * `calculateFinancialHealth(state)`
  * `generateHealthReport(state)`
  * `resetToBaseline()` / `resetFinancialState()`

---

### FEATURE 06: Persistent Floating Navigation & Scroll Spy
* **Purpose:** Enables seamless jumping between all 5 operational sections and provides visual indication of current location.
* **User Interaction:**
  * Click any section link in the floating pill nav: `PULSE`, `TIMELINE`, `SIMULATOR`, `COMMITMENTS`, `HEALTH`.
* **Expected Result:** Smoothly scrolls the window to the chosen section with precise offset compensation (-30px) and updates the active highlight pill.
* **Components Involved:** `src/components/FloatingNav.tsx`, `src/App.tsx`

---

## 3. Mathematical Reference

### Daily Allowance Formula
$$\text{Net Liquid Disruption} = (\Delta\text{spent}) + (\Delta\text{commitments}) + (\Delta\text{savings}) - (\Delta\text{budget})$$

$$\text{Daily Allowance} = \max\left(0, \left\lfloor 247 - \frac{\text{Net Liquid Disruption}}{\text{Days Remaining}} \right\rceil\right)$$

### Day 30 Forecast Formula
$$\text{Month-End Forecast} = \lfloor 2100 - \text{Net Liquid Disruption} \rceil$$

### Composite Financial Health Score Formula
$$\text{Health Score} = 0.30 \cdot \text{SpendScore} + 0.30 \cdot \text{RiskScore} + 0.20 \cdot \text{SavingsScore} + 0.20 \cdot \text{CommitmentScore} - 1$$
*(Clamped strictly between 10 and 100)*
