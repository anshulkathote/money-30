import React from "react";

interface MetricCardProps {
  label: string;
  category: string;
  baselineValue: string | number;
  simulatedValue: string | number;
  deltaText: string;
  isPositive: boolean;
  valueColorClass?: string;
  subLabel?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  category,
  baselineValue,
  simulatedValue,
  deltaText,
  isPositive,
  valueColorClass = "text-white",
  subLabel,
}) => {
  return (
    <div className="p-5 rounded-sm border border-white/10 bg-[#0c0d14]/70 flex flex-col justify-between gap-4">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase text-white/40 tracking-wider">
        <span>{label}</span>
        <span>{category}</span>
      </div>

      <div className="flex flex-col">
        <div className="font-mono text-xs text-white/30 line-through">
          {baselineValue}
        </div>
        <div className={`font-display text-3xl sm:text-4xl tracking-tight mt-1 ${valueColorClass}`}>
          {simulatedValue}
          {subLabel && <span className="font-mono text-xs text-white/40 font-normal ml-1">{subLabel}</span>}
        </div>
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
        <span className="text-white/40">DELTA</span>
        <span className={isPositive ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
          {deltaText}
        </span>
      </div>
    </div>
  );
};

export const FinancialMetric = MetricCard;
