import React from "react";
import type { ConsequenceStep } from "../types/financial";

interface ConsequenceChainProps {
  consequences: ConsequenceStep[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const ConsequenceChain: React.FC<ConsequenceChainProps> = ({
  consequences,
  activeId,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {consequences.map((step) => {
        const isActive = activeId === step.id;
        return (
          <div
            key={step.id}
            onClick={() => onSelect(step.id)}
            className={`p-6 rounded-sm border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
              isActive
                ? "border-amber-400/80 bg-amber-400/[0.07] shadow-[0_0_25px_rgba(251,191,36,0.12)]"
                : "border-white/10 bg-[#0c0d14]/70 hover:border-white/25 hover:bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs font-bold text-amber-300">
                STEP {step.stepNumber}
              </span>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded-xs uppercase tracking-wider ${
                  step.impactType === "critical"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : step.impactType === "caution"
                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                    : "bg-emerald-400/20 text-emerald-300 border border-emerald-400/40"
                }`}
              >
                {step.impactType.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase text-white/40 tracking-wider">
                {step.metricLabel}
              </span>
              <h4 className="font-display text-xl text-white uppercase tracking-wide">
                {step.title}
              </h4>
              <div className="font-mono text-sm font-semibold text-amber-300 mt-1">
                {step.change}
              </div>
            </div>

            <p className="font-mono text-xs text-white/60 leading-relaxed border-t border-white/10 pt-3">
              {step.explanation}
            </p>
          </div>
        );
      })}
    </div>
  );
};
