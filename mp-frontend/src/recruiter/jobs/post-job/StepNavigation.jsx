import { FiArrowLeft, FiArrowRight, FiSend, FiLoader } from "react-icons/fi";
import { STEPS } from "./postJobConstants";

export default function StepNavigation({ step, loading, onPrev, onNext, onSubmit }) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-mist gap-2">

      {/* Back */}
      <button
        type="button"
        onClick={onPrev}
        disabled={step === 0}
        className="flex items-center gap-1.5 px-4 md:px-5 py-2.5 rounded-lg border border-mist bg-white text-sm font-semibold text-ink/50 hover:text-ink hover:bg-ink/5 disabled:opacity-40 disabled:cursor-default transition"
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
              ${i === step ? "w-5 bg-pine" : i < step ? "w-1.5 bg-pine" : "w-1.5 bg-mist"}`}
          />
        ))}
      </div>

      {/* Continue / Publish */}
      {step < 3 ? (
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-1.5 px-4 md:px-6 py-2.5 rounded-lg bg-pine hover:bg-moss text-white text-sm font-bold transition-colors shadow-sm shadow-pine/25"
        >
          Continue <FiArrowRight size={14} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-5 md:px-7 py-2.5 rounded-lg bg-pine hover:bg-moss disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors shadow-sm shadow-pine/25"
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