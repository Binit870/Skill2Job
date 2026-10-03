const ACCENT_STYLES = {
  pine: { bg: "bg-pine/10", text: "text-pine" },
  gold: { bg: "bg-gold/10", text: "text-gold" },
};

export default function Stat({ title, value, icon: Icon, accent = "pine" }) {
  const styles = ACCENT_STYLES[accent] || ACCENT_STYLES.pine;

  return (
    <div className="bg-white rounded-2xl border border-mist shadow-card p-3 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-card-hover transition-shadow duration-200">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${styles.bg}`}>
        <Icon className={`w-4.5 h-4.5 ${styles.text}`} size={18} />
      </div>
      <div className="min-w-0 overflow-hidden">
        <p className="text-xs text-ink/45 font-medium truncate">{title}</p>
        <p className="text-lg sm:text-xl font-bold text-ink leading-tight">{value}</p>
      </div>
    </div>
  );
}
