import { FiCheck } from "react-icons/fi";
import { STEPS } from "./postJobConstants";

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center mb-6 md:mb-8 overflow-x-auto pb-1">
      {STEPS.map((label, i) => (
        <div
          key={i}
          className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}
        >
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                ${
                  i < current
                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                    : i === current
                    ? "bg-green-500 text-white ring-4 ring-green-100 shadow-md shadow-green-200"
                    : "bg-gray-100 text-gray-400"
                }`}
            >
              {i < current ? <FiCheck size={15} /> : i + 1}
            </div>
            <span
              className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
                ${i <= current ? "text-green-600" : "text-gray-400"}`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-1.5 md:mx-2 mb-5 transition-all duration-500
                ${i < current ? "bg-green-500" : "bg-gray-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}