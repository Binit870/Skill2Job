import { SectionCard } from "./SharedUI";
import { inputCls } from "./editJobConstants";

export default function SkillsSection({
  skills,
  skillInput,
  setSkillInput,
  addSkill,
  removeSkill,
}) {
  return (
    <SectionCard title="Required Skills">
      <div className="px-5 md:px-6 py-5 flex flex-col gap-3">

        {/* Tag display */}
        <div className="flex flex-wrap gap-2 min-h-[36px]">
          {skills.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 bg-green-50 text-[#498a04] border border-green-200 text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {s}
              <button
                type="button"
                onClick={() => removeSkill(s)}
                className="text-green-800 hover:text-[#498a04] transition leading-none text-base"
                aria-label={`Remove ${s}`}
              >
                ×
              </button>
            </span>
          ))}
          {skills.length === 0 && (
            <p className="text-gray-700 text-sm">No skills added yet</p>
          )}
        </div>

        {/* Input row */}
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (["Enter", ",", "Tab"].includes(e.key)) {
                e.preventDefault();
                addSkill(skillInput);
              }
              if (e.key === "Backspace" && !skillInput && skills.length) {
                removeSkill(skills[skills.length - 1]);
              }
            }}
            placeholder="Type a skill and press Enter…"
            className={`${inputCls} flex-1`}
          />
          <button
            type="button"
            onClick={() => addSkill(skillInput)}
            className="bg-[#1e9d02] hover:bg-[#1b7d05] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Add
          </button>
        </div>

        <p className="text-xs text-gray-600">
          Press Enter, comma, or Tab to add each skill
        </p>

      </div>
    </SectionCard>
  );
}