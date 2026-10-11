# MONEY//30

> **Personal Finance Simulator — Simulate Before You Spend.**
> An interactive 30-day financial planning experience built on a ₹10,000 budget.

---

## 1. Problem Statement

Most personal finance apps suffer from a fundamental temporal flaw: they track expenses **after** money has already been spent. 

For young adults and Gen Z navigating limited monthly cash flows (such as a ₹10,000 monthly allowance or first stipend):
* **Retrospective tracking is too late:** Learning on Day 20 that you overspent on Day 5 does not undo the deficit.
* **Isolated decision fallacy:** Young spenders evaluate individual purchases in isolation (e.g., *"It's only ₹3,499 for headphones"*), without understanding how that decision drains their daily discretionary margin for the subsequent 23 days.
* **Hidden compounding consequences:** Fixed obligations (subscriptions, gym memberships) quietly lock up capital, leaving zero elasticity to absorb surprise disruptions (medical emergencies, device repairs).

Users do not need another retrospective spreadsheet. They need a tool to **simulate decisions before executing them**.

---

## 2. Solution: The MONEY//30 System

**MONEY//30** transforms financial planning from passive bookkeeping into an interactive financial flight simulator.

Starting from Day 7 with a baseline ₹10,000 monthly budget:
1. **Financial Pulse:** Instant visibility into liquid checking balance, active commitments, dedicated savings, and daily allowable burn rate.
2. **Money Map (30-Day Trajectory):** A dynamic dual-curve trajectory modeling the baseline safe path against simulated real-time drift across Days 01 through 30.
3. **What If? Simulator (Core Engine):** Test hypothetical purchases, subscriptions, unexpected expenses, savings deposits, or freelance income inflows.
4. **Interconnected Consequence Pipeline:** Instantly recalculates remaining balance, daily allowance, Day 30 forecast, risk exposure, and overall financial health score.
5. **Commitments Matrix:** Visualize locked capital vs. flexible capital, and toggle or add recurring obligations to immediately see reclaimed cash flow.
6. **Financial Health Composite:** Dynamic 0–100 health scoring across four weighted dimensions (Spending, Savings, Commitments, Risk).

---

## 3. Core Features

| Feature | Description | State Impact |
|---|---|---|
| **₹10,000 / 30-Day Budget** | Complete monthly operating baseline calibrated to realistic young-adult economics. | Central financial baseline |
| **Financial Pulse (01)** | Hero balance (₹7,420 remaining), 4 core metrics, budget allocation matrix, and causality pipeline. | Visualizes `budget`, `spent`, `commitments`, `savings` |
| **Remaining Balance & Daily Allowance** | Dynamic daily burn rate calculation (`₹247/day` baseline across 23 days remaining). | Derived from `calculateDailyAllowance()` |
| **Month-End Forecast** | Predictive projection of Day 30 cushion (`₹2,100` baseline surplus). | Derived from `calculateMonthEndForecast()` |
| **30-Day Financial Trajectory (02)** | Interactive SVG dual trajectory comparing current expenditure trajectory to optimal path. | Modeled via `getTrajectoryPoints()` |
| **Landmark Days Inspector** | Deep-dive telemetry into critical financial milestones (Days 01, 07, 15, 22, 30). | Dynamic inspection via `getLandmarkDays()` |
| **What If? Decision Simulator (03)** | Core interactive simulator testing 5 decision types before committing capital. | Pure functional simulation via `simulateDecision()` |
| **Decision Presets & Custom Inputs** | Real-world presets (Headphones ₹3,499, Streaming ₹499, Emergency ₹1,500, Savings ₹1,000, Inflow ₹2,000) or custom amounts. | Validated input modeling |
| **Before / After Comparison** | Side-by-side delta visualization across Balance, Daily Allowance, Day 30 Forecast, and Risk. | Side-by-side metric comparison |
| **Evidence-Based Affordability Verdict** | Automated classification: `COMFORTABLE`, `POSSIBLE`, `RISKY`, or `NOT RECOMMENDED`. | Evaluated via `getAffordabilityVerdict()` |
| **4-Step Consequence Engine** | Multi-step causality chain: Liquidity Adjustment → Daily Runway → Day 30 Buffer → Defensive Posture. | Generated via `getSimulationResult()` |
| **Commitments Allocation Beam (04)** | Visually communicates "locked" money (₹2,467) vs "flexible" capital (₹7,533). | Driven by active commitment aggregation |
| **Subscription Management** | Toggle status (Active / Paused) on recurring services (Netflix, Spotify, Gym, Phone) or add custom commitments. | Recalculates total monthly fixed load |
| **Financial Health Score (05)** | Algorithmic 0–100 composite index (82 at baseline) dynamically recalculated across 4 dimensions. | Computed via `calculateFinancialHealth()` |
| **Health Signals & Recommendations** | Proactive guidance surfacing top risks and biggest liquidity recovery opportunities. | Generated via `generateHealthReport()` |
| **Apply / Discard & Reset Month** | Commit simulated decisions into living state, revert simulations, or reset to Day 7 baseline. | Mutation via `applyDecision()` and `resetFinancialState()` |

---

## 4. Core Innovation: Interconnected Consequence Modeling

Conventional financial apps treat budget categories as independent columns. 

**MONEY//30 treats finance as an interconnected dynamic system.** A single financial decision triggers an immediate ripple effect across four mathematical layers:

```
                      [ User Considers Decision ]
                        (e.g., Headphones ₹3,499)
                                   │
                                   ▼
             ┌───────────────────────────────────────────┐
             │       SIMULATOR ENGINE (Zero-Risk)        │
             │           simulateDecision()              │
             └─────────────────────┬─────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Immediate Float  │     │  Daily Allowance │     │ Day 30 Forecast  │
│  ₹7,420 → ₹3,921 │     │  ₹247/d → ₹95/d  │     │ ₹2,100 → -₹1,399 │
│  (-47% liquid)   │     │  (-62% daily)    │     │ (Deficit Crisis) │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   ▼
             ┌───────────────────────────────────────────┐
             │            SYSTEMIC EVALUATION            │
             │  • Risk Level:        LOW ──► HIGH        │
             │  • Health Score:      82  ──► 48 pts      │
             │  • Affordability:     NOT RECOMMENDED     │
             └─────────────────────┬─────────────────────┘
                                   │
                                   ▼
                      [ User Discards or Reconsiders ]
                     (Avoids catastrophic overspending)
```

### The ₹3,499 Headphone Purchase Example:
* In a traditional app: The user sees `₹7,420 - ₹3,499 = ₹3,921 remaining balance` and assumes they can afford it because they still have money in checking.
* In **MONEY//30**: The simulator exposes that across the 23 remaining days:
  * Daily safe allowance collapses from **₹247/day to ₹95/day** (a **62% reduction**).
  * Day 30 forecast plunges from a **₹2,100 buffer into a -₹1,399 debt deficit**.
  * Financial Risk elevates from **LOW to HIGH**.
  * Health Score drops from **82 to 48**.
  * Affordability Verdict warns: **NOT RECOMMENDED**.

The user learns the true systemic cost **before** touching their debit card.

---

## 5. Complete User Journey

```
┌────────────────────────────────────────────────────────────────────────┐
│  00 / CINEMATIC INTRODUCTION (Canvas Frame Scrub Engine)               │
│  169 high-resolution frames synchronized to 600vh scroll travel.      │
│  Editorial narrative introducing the ₹10,000 monthly baseline.        │
│  Climax: "SIMULATE BEFORE YOU SPEND."                                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Seamless scroll transition
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  01 / FINANCIAL PULSE                                                  │
│  Status assessment: ₹7,420 active balance, metrics, budget matrix.     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  02 / MONEY MAP (Trajectory & Landmark Days)                           │
│  Visualizes 30-day dual curves (Safe Path vs Current Path).            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  03 / WHAT IF? DECISION SIMULATOR (Core Interaction)                   │
│  Select decision type, input amount, inspect Before vs After delta,   │
│  read 4-step consequence chain, then Apply or Discard.                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  04 / COMMITMENTS (Recurring Overhead Management)                      │
│  Allocation beam: Locked (₹2,467) vs Flexible (₹7,533).               │
│  Toggle or add subscriptions to immediately restore daily allowance.  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  05 / FINANCIAL HEALTH (Composite Score & Strategic Synthesis)         │
│  Central dynamic 0-100 score, 4 dimensions, signals, and reset button. │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Technical Architecture

MONEY//30 is designed as a **high-performance, zero-backend, client-side financial operating system**:

* **Framework:** React 19 + TypeScript (Strict Mode)
* **Build System:** Vite 8 (sub-second HMR and optimized production rollup)
* **Styling:** Tailwind CSS v4 (modern `@theme` token architecture)
* **Motion & Animation:** Motion.dev (hardware-accelerated transforms, clamped `useTransform`)
* **State Architecture:** Centralized reactive financial store (`useFinancialState`) delivering pure unidirectional data flow.
* **Pure Financial Calculation Layer:** Decoupled, fully testable mathematical calculation functions:
  * `calculateFinancialHealth(state)`
  * `calculateRisk(state)`
  * `calculateDailyAllowance(state)`
  * `calculateMonthEndForecast(state)`
  * `calculateProjectedBalance(state, day)`
  * `calculateSpendingScore(state)`
  * `calculateSavingsScore(state)`
  * `calculateCommitmentScore(state)`
  * `simulateDecision(state, decision)`
  * `getAffordabilityVerdict(baseline, simulated, decision)`
  * `getSimulationResult(state, decision)`
  * `applyDecision(state, decision)`
  * `resetFinancialState()`

### Component Hierarchy

```
src/
├── App.tsx                     # Master orchestrator, scroll synchronization, nav spy
├── StoryOverlay.tsx            # Cinematic narrative layer (z-20, clamped progress fades)
├── components/
│   ├── AmbientBackground.tsx   # Hardware-accelerated CSS ambient glow & technical grid
│   ├── FloatingNav.tsx         # Minimal floating navigation with offset scroll anchoring
│   ├── FinancialPulse.tsx      # Section 01: Core balance, metrics, causality pipeline
│   ├── MoneyMap.tsx            # Section 02: 30-day SVG trajectory curve & landmark inspector
│   ├── DecisionSimulator.tsx   # Section 03: What If? interactive decision simulator
│   ├── CommitmentsSection.tsx  # Section 04: Locked capital allocation & subscription manager
│   └── FinancialHealthSection.tsx # Section 05: 0-100 composite health score & recommendations
├── state/
│   └── financialState.ts       # Central financial store, calibration formulas, presets
└── types/
    └── financial.ts            # Canonical TypeScript interfaces & domain types
```

---

## 7. Performance & Optimization

* **Zero Backend Latency:** 100% client-side computation means simulations execute with **zero network latency** (< 1ms recalculation time).
* **Frame Scrub Engine:** Preloaded 169-frame image buffer rendered via direct HTML5 Canvas `drawImage()` and `requestAnimationFrame()`, avoiding DOM thrashing.
* **Hardware-Accelerated CSS Ambient System:** Ambient background orbs and grid pulse run on native CSS keyframes (`transform` and `opacity` only) without CPU overhead.
* **Clamped Motion Transforms:** All Motion.dev transformations use `{ clamp: true }` to guarantee bounds safety and eliminate extrapolation jitter.
* **Zero Layout Shift:** Rigid dimensional constraints and font clamping (`clamp()`) prevent layout repositioning during scroll transitions.

---

## 8. Accessibility & Engineering Quality

* **Semantic HTML:** Proper landmark elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`).
* **Interactive Affordance:** Explicit ARIA attributes, keyboard-focusable buttons, high contrast indicators.
* **Reduced Motion Support:** `@media (prefers-reduced-motion: reduce)` rules disable heavy orbital translations for sensitive users.
* **Type Safety:** 100% strict TypeScript with zero `any` types across the entire application.
* **Clean Code Standards:** Zero lint errors across Oxlint and ESLint checks.

---

## 9. Hackathon Challenge Alignment Matrix

| Evaluation Criterion | How MONEY//30 Addresses It |
|---|---|
| **Problem Alignment (30 pts)** | Directly solves the Gen Z "retrospective expense tracking" trap by providing proactive, pre-decision financial simulation on a realistic ₹10,000 monthly budget. |
| **Functionality & Interactivity (25 pts)** | Features 5 comprehensive, deeply interconnected sections: Cinematic Intro, Financial Pulse, Money Map, What If Simulator, Commitments Manager, and Financial Health Score. All interactive controls immediately update global state. |
| **Innovation & Creativity (5 pts)** | Introduces the **Interconnected Consequence Model**—demonstrating that discretionary spending is never an isolated event, but a systemic shift in runway, daily burn allowance, and risk exposure. |
| **Code Quality & Architecture** | Strict TypeScript interfaces, decoupled functional calculation utilities, unidirectional state flow, modular component hierarchy, and zero lint warnings. |
| **Performance** | Instantaneous client-side simulation, HTML5 Canvas frame scrubbing, GPU-accelerated CSS animations, and optimized bundle size (< 140 kB gzip JS). |
| **Documentation** | Comprehensive README, architectural diagrams, feature documentation (`docs/FEATURES.md`), and inline algorithmic explanations. |

---

## 10. Local Setup & Verification

```bash
# Clone the repository
git clone https://github.com/your-username/money-30.git
cd money_30

# Install dependencies
npm install

# Start development server
npm run dev
# Live at http://localhost:5173

# Run type checker
npx tsc --noEmit

# Run linter
npm run lint

# Build for production
npm run build
```

---

*MONEY//30 — Simulate Before You Spend.*
