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
        className="min-h-[46px] border border-gray-200 rounded-lg bg-white px-3 py-2 flex flex-wrap items-center gap-1.5 cursor-text focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition"
        onClick={(e) => e.currentTarget.querySelector("input").focus()}
      >
        {skills.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full"
          >
            {s}
            <button
              type="button"
              onClick={() => removeSkill(s)}
              className="text-green-400 hover:text-green-700 transition leading-none ml-0.5"
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
          className="flex-1 min-w-[120px] sm:min-w-[140px] border-none outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Press Enter, comma, or Tab to add
      </p>
    </div>
  );
}