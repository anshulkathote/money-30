import { motion } from "motion/react";

interface Props {
  isVisible: boolean;
  activeSection?: string;
  onSelectSection?: (id: string) => void;
}

export default function FloatingNav({
  isVisible,
  activeSection = "PULSE",
  onSelectSection,
}: Props) {
  const navItems = [
    { id: "PULSE", label: "PULSE" },
    { id: "TIMELINE", label: "TIMELINE" },
    { id: "SIMULATOR", label: "SIMULATOR" },
    { id: "COMMITMENTS", label: "COMMITMENTS" },
    { id: "HEALTH", label: "HEALTH" },
  ];

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -40, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-5 inset-x-0 z-50 flex justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-2.5 rounded-full bg-[#0c0d14]/85 border border-white/10 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-xs">
        {/* Brand identity */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          <span className="font-mono text-xs font-semibold tracking-[0.25em] text-white uppercase">
            MONEY<span className="text-amber-400">{"//"}</span>30
          </span>
        </div>

        <div className="h-3 w-[1px] bg-white/15" />

        {/* Links */}
        <ul className="flex items-center gap-3 sm:gap-5 font-mono text-[11px] tracking-wider uppercase">
          {navItems.map((item) => {
            const isActive = item.id === activeSection;
            const handleClick = () => {
              if (onSelectSection) {
                onSelectSection(item.id);
              }
              const targetId =
                item.id === "PULSE"
                  ? "pulse"
                  : item.id === "TIMELINE"
                  ? "map"
                  : item.id === "SIMULATOR"
                  ? "simulator"
                  : item.id === "COMMITMENTS"
                  ? "commitments"
                  : item.id === "HEALTH"
                  ? "health"
                  : null;

              if (targetId) {
                const el = document.getElementById(targetId);
                if (el) {
                  const targetTop =
                    el.getBoundingClientRect().top + window.scrollY - 30;
                  window.scrollTo({ top: targetTop, behavior: "smooth" });
                }
              }
            };
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={handleClick}
                  className={`relative py-1 transition-colors ${
                    isActive
                      ? "text-white font-medium"
                      : "text-white/40 hover:text-white/80 cursor-pointer"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute -bottom-1 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/10 font-mono text-[10px] text-white/40 tracking-wider">
          <span className="text-amber-300">DAY 07</span>
          <span>/</span>
          <span>30</span>
        </div>
      </div>
    </motion.nav>
  );
}
