import { FiBriefcase } from "react-icons/fi";

export default function PostJobHeader({ companyLogo }) {
  return (
    <div className="bg-white border-b border-mist px-4 py-4 md:px-8 md:py-5 shadow-sm sticky top-0 z-10">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-pine flex items-center justify-center shadow-md shadow-pine/25 shrink-0">
            <FiBriefcase size={17} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-base md:text-lg font-black text-ink tracking-tight leading-none">
              Post a New Job
            </h1>
            <p className="text-ink/40 text-[10px] md:text-[11px] mt-0.5">
              Fill in the details to publish your listing
            </p>
          </div>
        </div>
        {companyLogo && (
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-xl border border-mist bg-white p-1.5 shadow-card"
          />
        )}
      </div>
    </div>
  );
}