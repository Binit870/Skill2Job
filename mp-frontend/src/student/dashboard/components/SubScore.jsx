export default function SubScore({ label, value }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-ink/50">{label}</span>
        <span className="text-xs font-semibold text-ink/75">{value}%</span>
      </div>
      <div className="h-1.5 bg-mist rounded-full overflow-hidden">
        <div
          className="h-full bg-pine rounded-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
