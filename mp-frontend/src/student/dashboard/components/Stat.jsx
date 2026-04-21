export default function Stat({ title, value, icon: Icon, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow duration-200">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}14` }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color: accent }} size={18} />
      </div>
      <div className="min-w-0 overflow-hidden">
        <p className="text-xs text-gray-400 font-medium truncate">{title}</p>
        <p className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}