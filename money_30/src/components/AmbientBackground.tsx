/**
 * AmbientBackground — post-cinematic sections ambient visual system
 *
 * Sits at z-index 1 (below section content at z-30, below floating nav).
 * Uses only CSS transforms + opacity — no canvas, no heavy JS loops.
 * Respects prefers-reduced-motion and reduces complexity on mobile.
 */

import { useEffect, useRef } from "react";

interface Props {
  /** True once the user has scrolled past the cinematic intro */
  isPostCinematic: boolean;
}

export default function AmbientBackground({ isPostCinematic }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Inject keyframes once into the document head
  useEffect(() => {
    const id = "ambient-bg-keyframes";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes orbDrift1 {
        0%   { transform: translate(0px, 0px) scale(1); }
        33%  { transform: translate(40px, -30px) scale(1.06); }
        66%  { transform: translate(-25px, 45px) scale(0.96); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      @keyframes orbDrift2 {
        0%   { transform: translate(0px, 0px) scale(1); }
        25%  { transform: translate(-50px, 30px) scale(1.04); }
        60%  { transform: translate(35px, -40px) scale(0.97); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      @keyframes orbDrift3 {
        0%   { transform: translate(0px, 0px) scale(1); }
        40%  { transform: translate(30px, 50px) scale(1.05); }
        75%  { transform: translate(-40px, -20px) scale(0.95); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      @keyframes gridPulse {
        0%, 100% { opacity: 0.4; }
        50%       { opacity: 0.7; }
      }
      @media (prefers-reduced-motion: reduce) {
        @keyframes orbDrift1  { 0%, 100% { transform: none; } }
        @keyframes orbDrift2  { 0%, 100% { transform: none; } }
        @keyframes orbDrift3  { 0%, 100% { transform: none; } }
        @keyframes gridPulse  { 0%, 100% { opacity: 0.4; } }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        userSelect: "none",
        backgroundColor: "#0a0a0a",
        overflow: "hidden",
        // Fade in once cinematic ends — smooth 1.2s transition
        opacity: isPostCinematic ? 1 : 0,
        transition: "opacity 1.2s ease",
      }}
    >
      {/* ── LAYER A: Subtle technical grid ──────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          animation: "gridPulse 8s ease-in-out infinite",
        }}
      />

      {/* Slightly brighter horizontal accent line — centre of viewport */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "45%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(245,208,97,0.06) 30%, rgba(245,208,97,0.10) 50%, rgba(245,208,97,0.06) 70%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── LAYER B: Gold / Amber radial orbs ───────────────────────── */}

      {/* ORB 1 — upper-left, largest, warmest */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-8%",
          width: "70vw",
          height: "70vw",
          maxWidth: "900px",
          maxHeight: "900px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(220,170,70,0.09) 0%, rgba(220,170,70,0.035) 35%, transparent 65%)",
          animation: "orbDrift1 38s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* ORB 2 — lower-right, warm amber */}
      <div
        style={{
          position: "absolute",
          bottom: "-5%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          maxWidth: "800px",
          maxHeight: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,178,50,0.07) 0%, rgba(245,178,50,0.025) 40%, transparent 65%)",
          animation: "orbDrift2 45s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* ORB 3 — centre, very diffuse, gives the 'data heartbeat' feel */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "35%",
          width: "55vw",
          height: "55vw",
          maxWidth: "700px",
          maxHeight: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(200,155,55,0.055) 0%, rgba(200,155,55,0.018) 45%, transparent 68%)",
          animation: "orbDrift3 55s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* ── LAYER C: Radial edge vignette — keeps edges dark/premium ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(
              ellipse 80% 70% at 50% 50%,
              transparent 40%,
              rgba(0,0,0,0.35) 75%,
              rgba(0,0,0,0.65) 100%
            )
          `,
        }}
      />

      {/* ── LAYER D: Top fade — helps cinematic → app seam ─────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "180px",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
