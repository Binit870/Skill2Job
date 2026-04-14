import { ArrowLeft, Briefcase } from "lucide-react";

export default function EditJobTopBar({ onBack }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 md:px-8">
      <div className="max-w-3xl mx-auto flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <Briefcase size={16} className="text-[#7cdb16]" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Edit Job
          </h1>
        </div>
      </div>
    </div>
  );
}