/* Field wrapper */
export const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-ink/50 uppercase tracking-wider">
      {label}{" "}
      {required && <span className="text-red-400 normal-case font-black">*</span>}
    </label>
    {children}
  </div>
);

/* Section card with pine header */
export const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-mist shadow-card overflow-hidden">
    <div className="flex items-center gap-2 px-5 md:px-6 py-4 border-b border-mist bg-pine/8">
      <span className="w-1 h-5 rounded-full bg-pine" />
      <h2 className="text-sm font-bold text-pine uppercase tracking-wider">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

/* Full-page loading spinner */
export const LoadingScreen = () => (
  <div className="min-h-screen bg-paper/60 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-pine border-t-transparent rounded-full animate-spin" />
      <p className="text-ink/50 font-medium">Loading job details...</p>
    </div>
  </div>
);
