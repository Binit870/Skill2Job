export default function SkeletonCard() {
  return (
    <div className="bg-white border border-mist rounded-2xl p-5 animate-pulse shadow-card">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-mist shrink-0" />
        <div className="flex-1 flex flex-col gap-2.5">
          <div className="h-4 w-2/5 rounded-lg bg-mist" />
          <div className="h-3 w-1/4 rounded-lg bg-mist" />
          <div className="flex gap-2 mt-1">
            <div className="h-6 w-20 rounded-full bg-mist" />
            <div className="h-6 w-24 rounded-full bg-mist" />
          </div>
        </div>
      </div>
    </div>
  );
}
