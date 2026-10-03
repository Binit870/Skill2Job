import { ArrowLeft, Briefcase } from "lucide-react";

export default function EditJobTopBar({ onBack }) {
  return (
    <div className="bg-white border-b border-mist px-4 py-4 md:px-8">
      <div className="max-w-3xl mx-auto flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-ink/5 text-ink/50 hover:text-ink transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pine/8 flex items-center justify-center">
            <Briefcase size={16} className="text-pine" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-ink">
            Edit Job
          </h1>
        </div>
      </div>
    </div>
  );
}