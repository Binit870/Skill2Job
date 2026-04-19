import { TABS, STATUS_CFG, TAB_COLORS } from "./constants";

export default function StatusTabs({ tab, setTab, counts }) {
  return (
    <div className="sticky top-[73px] z-10 bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {TABS.map((t) => {
        const cfg    = STATUS_CFG[t];
        const active = tab === t;
        const Icon   = cfg?.icon;

        return (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-200
              ${active
                ? TAB_COLORS[t]?.active
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
          >
            {Icon && <Icon size={11} />}
            {t}
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ml-0.5
                ${active ? "bg-black/10" : "bg-slate-100 text-slate-400"}`}
            >
              {counts[t] || 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}