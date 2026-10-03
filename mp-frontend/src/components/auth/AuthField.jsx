import { Eye, EyeOff } from "lucide-react";

export default function AuthField({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  showToggle,
  visible,
  onToggleVisible,
  labelAction,
  minLength,
  hint,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-ink/60">{label}</label>
        {labelAction}
      </div>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/35" />
        <input
          type={showToggle ? (visible ? "text" : "password") : type}
          required={required}
          minLength={minLength}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-mist bg-paper/40 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-pine/30 focus:border-pine transition-colors"
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggleVisible}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink/60 transition-colors"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-ink/40">{hint}</p>}
    </div>
  );
}
