export default function SkeletonRow() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 animate-pulse">
      <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 w-1/3 rounded-lg bg-slate-200" />
        <div className="h-3 w-1/4 rounded-lg bg-slate-200" />
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-20 rounded-full bg-slate-200" />
          <div className="h-6 w-16 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}