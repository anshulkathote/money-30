import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "motion/react";
import StoryOverlay from "./StoryOverlay";
import FloatingNav from "./components/FloatingNav";
import FinancialPulse from "./components/FinancialPulse";
import MoneyMap from "./components/MoneyMap";
import DecisionSimulator from "./components/DecisionSimulator";
import CommitmentsSection from "./components/CommitmentsSection";
import FinancialHealthSection from "./components/FinancialHealthSection";
import { useFinancialState } from "./state/financialState";
import AmbientBackground from "./components/AmbientBackground";

const TOTAL_FRAMES = 169;

/** Build the URL for a 1-indexed frame number. */
function frameUrl(index: number): string {
  const padded = String(index).padStart(4, "0");
  return `/frames/frame-${padded}.jpg`;
}

export default function App() {
  const cinematicRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [activeNavSection, setActiveNavSection] = useState("PULSE");

  // Central financial state & derived structures
  const {
    state,
    metrics,
    landmarks,
    trajectory,
    events,
    commitmentsList,
    healthReport,
    toggleCommitment,
    addCommitment,
    removeCommitment,
    applyDecisionState,
    resetToBaseline,
  } = useFinancialState();

  // Robust MotionValue mapped directly in onScroll
  const cinematicProgress = useMotionValue(0);

  // ── Preload all frames ──────────────────────────────────────────────
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameUrl(i + 1);
      img.onload = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
      images[i] = img;
    }
  }, []);

  // ── Canvas render loop & scroll sync ────────────────────────────────
  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawFrame() {
      const img = imagesRef.current[currentFrameRef.current];
      if (!img) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Cover-fit: fill viewport while preserving 16:9 aspect ratio
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    function onScroll() {
      if (!cinematicRef.current) return;
      const rect = cinematicRef.current.getBoundingClientRect();
      const totalTravel = rect.height - window.innerHeight;
      const currentScroll = -rect.top;
      const fraction =
        totalTravel > 0
          ? Math.max(0, Math.min(1, currentScroll / totalTravel))
          : 0;

      currentFrameRef.current = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(fraction * TOTAL_FRAMES),
      );

      // Synchronize cinematic progress motion value
      cinematicProgress.set(fraction);

      // Trigger minimal floating nav when approaching end of cinematic intro
      setIsNavVisible(fraction >= 0.92);

      // Track active section for floating nav
      const focalY = window.innerHeight * 0.55;
      const healthEl = document.getElementById("health");
      const commEl = document.getElementById("commitments");
      const simEl = document.getElementById("simulator");
      const simGatewayEl = document.getElementById("gateway-simulator");
      const mapEl = document.getElementById("map");

      if (healthEl && healthEl.getBoundingClientRect().top <= focalY) {
        setActiveNavSection("HEALTH");
      } else if (commEl && commEl.getBoundingClientRect().top <= focalY) {
        setActiveNavSection("COMMITMENTS");
      } else if (
        (simEl && simEl.getBoundingClientRect().top <= focalY) ||
        (simGatewayEl && simGatewayEl.getBoundingClientRect().top <= focalY)
      ) {
        setActiveNavSection("SIMULATOR");
      } else if (mapEl && mapEl.getBoundingClientRect().top <= focalY) {
        setActiveNavSection("TIMELINE");
      } else {
        setActiveNavSection("PULSE");
      }
    }

    function tick() {
      drawFrame();
      rafRef.current = requestAnimationFrame(tick);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Set initial frame
    onScroll();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", onScroll);
    };
  }, [loaded]);

  // ── Preload loader ──────────────────────────────────────────────────
  if (!loaded) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-mono text-xs font-medium tracking-[0.4em] text-white/70 uppercase">
            MONEY//30
          </span>
        </div>

        <div className="h-[2px] w-64 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400/80 to-white transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between w-64 font-mono text-[11px] text-white/30">
          <span>INITIALIZING BUFFER</span>
          <span>{progress}%</span>
        </div>
      </div>
    );
  }

  // ── Main Experience ─────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen text-white selection:bg-amber-400/20 selection:text-amber-200">
      {/* ── AMBIENT BACKGROUND — post-cinematic sections (fixed, z-1) ── */}
      <AmbientBackground isPostCinematic={isNavVisible} />

      {/* Persistent Minimal Floating Navigation */}
      <FloatingNav
        isVisible={isNavVisible}
        activeSection={activeNavSection}
        onSelectSection={setActiveNavSection}
      />

      {/* ── CINEMATIC SCROLL TRACK (600vh) ─────────────────────────── */}
      <div
        ref={cinematicRef}
        className="relative z-10"
        style={{ height: "600vh" }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          {/* LAYER 0: Canvas (z-0) */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 h-screen w-screen block"
            style={{
              width: "100vw",
              height: "100vh",
            }}
          />

          {/* LAYER 1: Dedicated Fullscreen Dark Cinematic Overlay (z-10) */}
          <div
            className="absolute inset-0 z-10 pointer-events-none select-none"
            aria-hidden="true"
          >
            {/* Baseline Black tint: calibrated to rgba(0,0,0,0.38) */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.38)" }}
            />

            {/* Softened edge vignette */}
            <div className="absolute inset-0 vignette-edges" />

            {/* Watermark mitigation in bottom right */}
            <div className="absolute inset-0 vignette-corner-watermark" />

            {/* Subtle high-end film grain texture */}
            <div className="absolute inset-0 film-grain opacity-25" />
          </div>

          {/* LAYER 2: Editorial Typography & Story UI (z-20) */}
          <StoryOverlay progress={cinematicProgress} />
        </div>
      </div>

      {/* ── SEAMLESS AMBIENT BRIDGE INTO THE APP ─────────────────────── */}
      <div className="relative z-30 h-28 -mt-28 bg-gradient-to-b from-transparent via-[#07080b]/80 to-[#07080b] pointer-events-none" />

      {/* ── SECTION 01: FINANCIAL PULSE (z-30) ──────────────────────── */}
      <div className="relative z-30">
        <FinancialPulse state={state} metrics={metrics} />
      </div>

      {/* ── SECTION 02: MONEY MAP (z-30) ───────────────────────────── */}
      <div className="relative z-30">
        <MoneyMap
          state={state}
          landmarks={landmarks}
          trajectory={trajectory}
          events={events}
        />
      </div>

      {/* ── SECTION 03: WHAT IF? DECISION SIMULATOR (z-30) ─────────── */}
      <div className="relative z-30">
        <DecisionSimulator
          currentState={state}
          onApplyDecision={applyDecisionState}
          onResetBaseline={resetToBaseline}
        />
      </div>

      {/* ── SECTION 04: COMMITMENTS (z-30) ─────────────────────────── */}
      <div className="relative z-30">
        <CommitmentsSection
          state={state}
          metrics={metrics}
          commitments={commitmentsList}
          onToggleCommitment={toggleCommitment}
          onAddCommitment={addCommitment}
          onRemoveCommitment={removeCommitment}
        />
      </div>

      {/* ── SECTION 05: FINANCIAL HEALTH (z-30) ───────────────────────── */}
      <div className="relative z-30">
        <FinancialHealthSection
          state={state}
          metrics={metrics}
          healthReport={healthReport}
          onResetMonth={resetToBaseline}
        />
      </div>
    </div>
  );
}
