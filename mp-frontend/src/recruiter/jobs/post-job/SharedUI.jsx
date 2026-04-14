/* ── Field wrapper ── */
export const Field = ({ label, required, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
      {Icon && <Icon size={11} className="text-green-500" />}
      {label}{" "}
      {required && (
        <span className="text-red-400 normal-case font-black">*</span>
      )}
    </label>
    {children}
  </div>
);

/* ── Section card with green header ── */
export const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 px-5 md:px-6 py-4 border-b border-gray-100 bg-green-50">
      <span className="w-1 h-5 rounded-full bg-green-500" />
      <span className="text-sm font-bold text-green-800 uppercase tracking-wider">
        {title}
      </span>
    </div>
    <div className="px-5 md:px-6 py-5 flex flex-col gap-5">{children}</div>
  </div>
);

/* ── Single review row ── */
export const ReviewRow = ({ label, value }) =>
  value ? (
    <div className="flex gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <span className="min-w-[120px] sm:min-w-[140px] text-xs font-bold uppercase tracking-wider text-gray-400 shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-800 break-words">{value}</span>
    </div>
  ) : null;