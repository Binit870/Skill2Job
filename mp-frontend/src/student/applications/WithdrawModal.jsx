import { Trash2, Loader2 } from "lucide-react";

export default function WithdrawModal({ app, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full border border-mist">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="font-display text-lg font-bold text-ink text-center mb-2">
          Withdraw Application?
        </h3>
        <p className="text-sm text-ink/55 text-center leading-relaxed mb-6">
          Your application for{" "}
          <strong className="text-ink/80">{app?.job?.title}</strong> will be
          permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-mist text-sm font-bold text-ink/65 hover:bg-ink/5 transition-colors"
          >
            Keep It
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
            {loading ? "Withdrawing…" : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}
