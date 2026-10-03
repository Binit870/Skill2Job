import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function SkillsInput({ value, onChange }) {
  const [input, setInput] = useState("");
  const skills = value
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const addSkill = (raw) => {
    const skill = raw.trim();
    if (!skill || skills.includes(skill)) return;
    onChange([...skills, skill].join(", "));
    setInput("");
  };

  const removeSkill = (s) =>
    onChange(skills.filter((x) => x !== s).join(", "));

  return (
    <div>
      <div
        className="min-h-[46px] border border-mist rounded-lg bg-white px-3 py-2 flex flex-wrap items-center gap-1.5 cursor-text focus-within:border-pine focus-within:ring-2 focus-within:ring-pine/15 transition-colors"
        onClick={(e) => e.currentTarget.querySelector("input").focus()}
      >
        {skills.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 bg-pine/8 text-pine border border-pine/20 text-xs font-semibold px-2.5 py-1 rounded-full"
          >
            {s}
            <button
              type="button"
              onClick={() => removeSkill(s)}
              className="text-pine/50 hover:text-pine transition-colors leading-none ml-0.5"
              aria-label={`Remove ${s}`}
            >
              <FiX size={11} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (["Enter", ",", "Tab"].includes(e.key)) {
              e.preventDefault();
              addSkill(input);
            }
            if (e.key === "Backspace" && !input && skills.length)
              removeSkill(skills[skills.length - 1]);
          }}
          placeholder={skills.length ? "" : "Type a skill and press Enter…"}
          className="flex-1 min-w-[120px] sm:min-w-[140px] border-none outline-none text-sm text-ink bg-transparent placeholder:text-ink/35"
        />
      </div>
      <p className="text-xs text-ink/40 mt-1">
        Press Enter, comma, or Tab to add
      </p>
    </div>
  );
}