import { type MotionValue, motion, useTransform } from "motion/react";
import { PRODUCT } from "./config/product";

/* ─────────────────────────────────────────────────────────────────────
 * StoryOverlay — Layer 2 (z-20)
 *
 * Sits directly above the dedicated dark canvas overlay (z-10).
 * Features:
 *   - Oversized editorial typography (Anton, Space Grotesk, JetBrains Mono)
 *   - Fluid CSS clamp() responsive scaling
 *   - Extended scroll-progress plateaus (10-15% of scroll travel per beat)
 *   - Smooth bi-directional Motion transitions (fade + slide + blur)
 *   - Subdued gold/amber accents matching the physical coin tones
 *   - Watermark camouflage HUD in bottom-right corner
 * ───────────────────────────────────────────────────────────────────── */

interface Props {
  progress: MotionValue<number>;
}

/**
 * Transition for Scene 1 which must start 100% visible and razor-sharp at progress = 0.
 */
function useScene1Transition(
  p: MotionValue<number>,
  visibleEnd: number,
  fadeOutEnd: number,
  yOffset = 24,
) {
  const opacity = useTransform(p, [0.0, visibleEnd, fadeOutEnd], [1, 1, 0], {
    clamp: true,
  });
  const y = useTransform(p, [0.0, visibleEnd, fadeOutEnd], [0, 0, -yOffset * 0.5], {
    clamp: true,
  });
  return { opacity, y };
}

/**
 * Creates smooth scroll-linked transition with an extended reading plateau.
 * Pure crisp opacity and subtle slide translation — no blur filters, strictly clamped.
 */
function useStoryTransition(
  p: MotionValue<number>,
  fadeInStart: number,
  visibleStart: number,
  visibleEnd: number,
  fadeOutEnd: number,
  yOffset = 28,
) {
  const opacity = useTransform(
    p,
    [fadeInStart, visibleStart, visibleEnd, fadeOutEnd],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const y = useTransform(
    p,
    [fadeInStart, visibleStart, visibleEnd, fadeOutEnd],
    [yOffset, 0, 0, -yOffset * 0.5],
    { clamp: true },
  );

  return { opacity, y };
}

/** Variant for terminal climax elements that remain on screen through the bottom. */
function usePersistTransition(
  p: MotionValue<number>,
  fadeInStart: number,
  visibleStart: number,
  yOffset = 28,
) {
  const opacity = useTransform(p, [fadeInStart, visibleStart], [0, 1], {
    clamp: true,
  });
  const y = useTransform(p, [fadeInStart, visibleStart], [yOffset, 0], {
    clamp: true,
  });

  return { opacity, y };
}

export default function StoryOverlay({ progress }: Props) {
  /* ═══════════════════════════════════════════════════════════════════
   * SCENE 1 — ONE STARTING POINT  (progress: 0.00 → 0.16)
   * ═══════════════════════════════════════════════════════════════════ */
  const s1Tag = useScene1Transition(progress, 0.12, 0.16, 20);
  const s1Hero = useScene1Transition(progress, 0.13, 0.17, 30);
  const s1Sub = useScene1Transition(progress, 0.12, 0.16, 24);

  /* ═══════════════════════════════════════════════════════════════════
   * SCENE 2 — THE MONEY RISES AND SEPARATES  (progress: 0.19 → 0.40)
   * ═══════════════════════════════════════════════════════════════════ */
  const s2Heading = useStoryTransition(progress, 0.19, 0.23, 0.35, 0.39, 32);
  const s2Labels = useStoryTransition(progress, 0.24, 0.28, 0.37, 0.41, 20);

  /* ═══════════════════════════════════════════════════════════════════
   * SCENE 3 — THE THREE GROUPS MOVE TOWARD CONTAINERS (progress: 0.43 → 0.65)
   * ═══════════════════════════════════════════════════════════════════ */
  const s3Heading = useStoryTransition(progress, 0.43, 0.47, 0.58, 0.62, 32);
  const s3Cards = useStoryTransition(progress, 0.48, 0.52, 0.61, 0.65, 24);

  /* ═══════════════════════════════════════════════════════════════════
   * SCENE 4 — THE COINS SETTLE (progress: 0.67 → 0.89)
   * ═══════════════════════════════════════════════════════════════════ */
  const s4Part1 = useStoryTransition(progress, 0.67, 0.70, 0.76, 0.79, 30);
  const s4Part2 = useStoryTransition(progress, 0.78, 0.81, 0.86, 0.89, 32);

  /* ═══════════════════════════════════════════════════════════════════
   * FINAL SCENE — CLIMAX & CTA (progress: 0.90 → 1.00)
   * ═══════════════════════════════════════════════════════════════════ */
  const s5Climax = usePersistTransition(progress, 0.90, 0.93, 36);
  const s5Sub = usePersistTransition(progress, 0.92, 0.95, 20);
  const s5Scale = useTransform(progress, [0.94, 1.0], [1.0, 0.92]);

  // Fade the ENTIRE overlay to invisible once the cinematic scroll track ends
  // progress = 1.0 means the user has fully scrolled past all 600vh
  const overlayOpacity = useTransform(progress, [0.96, 1.0], [1, 0], {
    clamp: true,
  });

  return (
    <motion.div
      style={{ opacity: overlayOpacity }}
      className="fixed inset-0 z-20 pointer-events-none select-none"
    >
    <div className="w-full h-full flex flex-col justify-between overflow-hidden p-6 sm:p-10 md:p-16">
      {/* ── TOP HEADER / PROTOCOL WATERMARK ───────────────────────────── */}
      <header className="relative z-30 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
          <span className="font-mono text-xs tracking-[0.35em] uppercase text-white/70">
            MONEY<span className="text-amber-400/80 font-bold">{"//"}</span>30
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 font-mono text-[10px] tracking-[0.25em] text-white/30 uppercase">
          <span>FRAME SCRUB ENGINE</span>
          <span>•</span>
          <span>FPS SYNC 60</span>
        </div>
      </header>

      {/* ── CENTER STAGE: STORYTELLING BEATS ──────────────────────────── */}
      <div className="relative w-full my-auto flex items-center justify-center min-h-[60vh]">
        {/* ══════════════════ SCENE 1: ONE STARTING POINT ═══════════════ */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {/* Technical Label */}
          <motion.div style={s1Tag} className="mb-4 sm:mb-6">
            <span className="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase px-3 py-1 rounded-sm border border-white/10 bg-black/40 text-amber-200/90 backdrop-blur-sm">
              MONEY//30 — PERSONAL FINANCE EXPERIMENT
            </span>
          </motion.div>

          {/* Dominant Hero Amount */}
          <motion.div style={s1Hero} className="leading-none tracking-tight">
            <h1 className="font-display text-[clamp(5.5rem,15vw,13rem)] leading-[0.88] text-white tracking-tighter drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
              {PRODUCT.currencySymbol}{PRODUCT.budget.toLocaleString()}<span className="text-amber-400">.</span>
            </h1>
          </motion.div>

          {/* Supporting Text */}
          <motion.div style={s1Sub} className="mt-5 sm:mt-8 max-w-lg">
            <p className="font-heading text-[clamp(1.2rem,2.4vw,1.8rem)] font-light text-white/75 tracking-wide">
              Your entire month starts here.
            </p>
          </motion.div>
        </div>

        {/* ══════════════════ SCENE 2: THE MONEY RISES ══════════════════ */}
        <div className="absolute inset-0 flex flex-col justify-between py-4">
          {/* Top Big Statement */}
          <motion.div
            style={s2Heading}
            className="text-left md:max-w-3xl self-start"
          >
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/40 mb-2">
              ALLOCATION PHASE
            </p>
            <h2 className="font-display text-[clamp(3.5rem,8.5vw,7.5rem)] leading-[0.86] text-white uppercase tracking-tight">
              ONE BUDGET.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
                THREE PRIORITIES.
              </span>
            </h2>
          </motion.div>

          {/* Three Group Labels across horizontal lanes */}
          <motion.div
            style={s2Labels}
            className="w-full grid grid-cols-3 gap-4 pt-12 self-end border-t border-white/10"
          >
            <div className="flex flex-col">
              <span className="font-mono text-[clamp(0.75rem,1.2vw,0.95rem)] font-semibold tracking-[0.25em] text-amber-300">
                01 / SPEND
              </span>
              <span className="font-mono text-[11px] text-white/40 tracking-wider hidden sm:inline">
                IMMEDIATE UTILITY
              </span>
            </div>

            <div className="flex flex-col text-center">
              <span className="font-mono text-[clamp(0.75rem,1.2vw,0.95rem)] font-semibold tracking-[0.25em] text-amber-300">
                02 / COMMIT
              </span>
              <span className="font-mono text-[11px] text-white/40 tracking-wider hidden sm:inline">
                FIXED OBLIGATIONS
              </span>
            </div>

            <div className="flex flex-col text-right">
              <span className="font-mono text-[clamp(0.75rem,1.2vw,0.95rem)] font-semibold tracking-[0.25em] text-amber-300">
                03 / SAVE
              </span>
              <span className="font-mono text-[11px] text-white/40 tracking-wider hidden sm:inline">
                FUTURE CAPITAL
              </span>
            </div>
          </motion.div>
        </div>

        {/* ══════════════════ SCENE 3: THREE GROUPS MOVE ════════════════ */}
        <div className="absolute inset-0 flex flex-col justify-between py-4">
          {/* Large Headline */}
          <motion.div
            style={s3Heading}
            className="text-right self-end max-w-2xl"
          >
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/40 mb-2">
              DISCIPLINE FORMULA
            </p>
            <h2 className="font-display text-[clamp(3.2rem,7.5vw,6.5rem)] leading-[0.88] text-white uppercase tracking-tight">
              EVERY RUPEE<br />
              <span className="text-amber-200">NEEDS A PURPOSE.</span>
            </h2>
          </motion.div>

          {/* Three Concise Labels positioned near corresponding lanes without covering coins */}
          <motion.div
            style={s3Cards}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 self-end"
          >
            {/* SPENDING */}
            <div className="relative p-4 rounded border border-white/10 bg-black/60 backdrop-blur-md text-center flex flex-col items-center justify-center">
              <span className="absolute top-3.5 right-3.5 font-mono text-[10px] text-white/30">01</span>
              <span className="font-mono text-xs font-bold tracking-[0.25em] text-amber-300 uppercase mb-1">
                SPENDING
              </span>
              <p className="font-heading text-[clamp(1.1rem,1.8vw,1.4rem)] font-normal text-white">
                What you use.
              </p>
              <p className="font-mono text-[11px] text-white/40 mt-1">
                Daily decisions, flexibility, lifestyle.
              </p>
            </div>

            {/* COMMITMENTS */}
            <div className="relative p-4 rounded border border-white/10 bg-black/60 backdrop-blur-md text-center flex flex-col items-center justify-center">
              <span className="absolute top-3.5 right-3.5 font-mono text-[10px] text-white/30">02</span>
              <span className="font-mono text-xs font-bold tracking-[0.25em] text-amber-300 uppercase mb-1">
                COMMITMENTS
              </span>
              <p className="font-heading text-[clamp(1.1rem,1.8vw,1.4rem)] font-normal text-white">
                What you owe.
              </p>
              <p className="font-mono text-[11px] text-white/40 mt-1">
                Rent, debts, recurring bills.
              </p>
            </div>

            {/* SAVINGS */}
            <div className="relative p-4 rounded border border-white/10 bg-black/60 backdrop-blur-md text-center flex flex-col items-center justify-center">
              <span className="absolute top-3.5 right-3.5 font-mono text-[10px] text-white/30">03</span>
              <span className="font-mono text-xs font-bold tracking-[0.25em] text-amber-300 uppercase mb-1">
                SAVINGS
              </span>
              <p className="font-heading text-[clamp(1.1rem,1.8vw,1.4rem)] font-normal text-white">
                What you protect.
              </p>
              <p className="font-mono text-[11px] text-white/40 mt-1">
                Emergency runway, future security.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ══════════════════ SCENE 4: THE COINS SETTLE ══════════════════ */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {/* Part A: SPENDING ISN'T AN ISOLATED DECISION */}
          <motion.div
            style={s4Part1}
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
          >
            <p className="font-mono text-xs tracking-[0.35em] uppercase text-amber-300/80 mb-4">
              CAUSALITY MATRIX
            </p>
            <h2 className="font-display text-[clamp(3.2rem,8vw,6.5rem)] leading-[0.88] text-white uppercase tracking-tight max-w-4xl">
              SPENDING ISN'T<br />
              <span className="text-white/60">AN ISOLATED DECISION.</span>
            </h2>
          </motion.div>

          {/* Part B: IT CHANGES EVERYTHING ELSE */}
          <motion.div
            style={s4Part2}
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
          >
            <p className="font-mono text-xs tracking-[0.35em] uppercase text-white/40 mb-4">
              SYSTEMIC IMPACT
            </p>
            <h2 className="font-display text-[clamp(3.8rem,9.5vw,8rem)] leading-[0.88] uppercase tracking-tight max-w-4xl">
              <span className="text-white">IT CHANGES</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-white drop-shadow-[0_10px_25px_rgba(251,191,36,0.3)]">
                EVERYTHING ELSE.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* ══════════════════ FINAL SCENE: THE CLIMAX ═══════════════════ */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            style={{ ...s5Climax, scale: s5Scale }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded border border-amber-400/30 bg-black/60 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-[11px] font-semibold tracking-[0.3em] uppercase text-amber-200">
                THE MONEY//30 PHILOSOPHY
              </span>
            </div>

            {/* Oversized Statement */}
            <h2 className="font-display text-[clamp(4.2rem,11.5vw,9.5rem)] leading-[0.85] text-white uppercase tracking-tighter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]">
              SIMULATE<br />
              <span className="text-white/60">BEFORE YOU</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-400">
                SPEND.
              </span>
            </h2>
          </motion.div>

          {/* Supporting Text */}
          <motion.div
            style={s5Sub}
            className="mt-6 sm:mt-8 max-w-xl"
          >
            <p className="font-mono text-[clamp(0.9rem,1.5vw,1.25rem)] text-white/70 tracking-wider">
              {PRODUCT.durationDays} days. {PRODUCT.currencySymbol}{PRODUCT.budget.toLocaleString()}. Every decision has a consequence.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── BOTTOM HUD BAR & WATERMARK TREATMENT ──────────────────────── */}
      <footer className="relative z-30 flex items-end justify-between w-full pt-4">
        {/* Left: Scroll cue */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
              SCRUB TO NAVIGATE
            </span>
            <span className="font-mono text-[10px] text-amber-300/80">
              FRAME // 001 — 169
            </span>
          </div>
        </div>

        {/* Center: Subtle animated scroll down indicator */}
        <div className="flex flex-col items-center gap-1.5 pb-1">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30">
            SCROLL TO ENTER PULSE
          </span>
          <svg
            className="w-3.5 h-3.5 text-amber-300/80 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Right: Technical watermark camouflage HUD tag */}
        <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded border border-white/10 shadow-2xl">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>MONEY//30 • SIMULATOR</span>
        </div>
      </footer>
    </div>
    </motion.div>
  );
}
