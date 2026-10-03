export function QuestionCard({ question, index }) {
  return (
    <div className="bg-gradient-to-br from-pine/8 to-pine/5 rounded-2xl border border-pine/15 px-4 sm:px-6 py-3.5 sm:py-5 w-full box-border">
      <p className="text-[10px] font-extrabold text-pine uppercase tracking-widest mb-2.5">
        Question {index + 1}
      </p>
      <p className="text-[15px] sm:text-lg font-semibold text-moss leading-relaxed">
        {question}
      </p>
    </div>
  );
}
