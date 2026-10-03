/* Field wrapper */
export const Field = ({ label, required, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-ink/50 uppercase tracking-wider flex items-center gap-1.5">
      {Icon && <Icon size={11} className="text-pine" />}
      {label}{" "}
      {required && (
        <span className="text-red-400 normal-case font-black">*</span>
      )}
    </label>
    {children}
  </div>
);

/* Section card with pine header */
export const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-mist shadow-card overflow-hidden">
    <div className="flex items-center gap-2 px-5 md:px-6 py-4 border-b border-mist bg-pine/8">
      <span className="w-1 h-5 rounded-full bg-pine" />
      <span className="text-sm font-bold text-pine uppercase tracking-wider">
        {title}
      </span>
    </div>
    <div className="px-5 md:px-6 py-5 flex flex-col gap-5">{children}</div>
  </div>
);

/* Single review row */
export const ReviewRow = ({ label, value }) =>
  value ? (
    <div className="flex gap-3 py-2.5 border-b border-mist last:border-0">
      <span className="min-w-[120px] sm:min-w-[140px] text-xs font-bold uppercase tracking-wider text-ink/40 shrink-0">
        {label}
      </span>
      <span className="text-sm text-ink break-words">{value}</span>
    </div>
  ) : null;
