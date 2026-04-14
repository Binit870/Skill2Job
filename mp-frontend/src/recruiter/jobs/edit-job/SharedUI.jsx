/* ── Field wrapper ── */
export const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
      {label}{" "}
      {required && <span className="text-red-500 normal-case">*</span>}
    </label>
    {children}
  </div>
);

/* ── Section card with coloured header ── */
export const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 px-5 md:px-6 py-4 border-b border-gray-100 bg-green-50">
      <span className="w-1 h-5 rounded-full bg-[#498a04]" />
      <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

/* ── Full-page loading spinner ── */
export const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-[#78e728] border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 font-medium">Loading job details...</p>
    </div>
  </div>
);