import { FiArrowLeft, FiArrowRight, FiSend, FiLoader } from "react-icons/fi";
import { STEPS } from "./postJobConstants";

export default function StepNavigation({ step, loading, onPrev, onNext, onSubmit }) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-2">

      {/* Back */}
      <button
        type="button"
        onClick={onPrev}
        disabled={step === 0}
        className="flex items-center gap-1.5 px-4 md:px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-default transition"
      >
        <FiArrowLeft size={14} />
        <span className="hidden xs:inline sm:inline">Back</span>
      </button>

      {/* Step dots */}
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300
              ${i === step ? "w-5 bg-green-500" : i < step ? "w-1.5 bg-green-600" : "w-1.5 bg-gray-200"}`}
          />
        ))}
      </div>

      {/* Continue / Publish */}
      {step < 3 ? (
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-1.5 px-4 md:px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition shadow-sm shadow-green-200"
        >
          Continue <FiArrowRight size={14} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-5 md:px-7 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition shadow-sm shadow-green-200"
        >
          {loading ? (
            <>
              <FiLoader size={14} className="animate-spin" /> Publishing…
            </>
          ) : (
            <>
              <FiSend size={14} /> Publish Job
            </>
          )}
        </button>
      )}

    </div>
  );
}