import { FiTrash2, FiLoader } from "react-icons/fi";

export default function WithdrawModal({ app, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full border border-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
          <FiTrash2 size={22} className="text-red-500" />
        </div>
        <h3 className="text-lg font-black text-slate-800 text-center mb-2">
          Withdraw Application?
        </h3>
        <p className="text-sm text-slate-500 text-center leading-relaxed mb-6">
          Your application for{" "}
          <strong className="text-slate-700">{app?.job?.title}</strong> will be
          permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all duration-200"
          >
            Keep It
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-black transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <FiLoader size={15} className="animate-spin" />
            ) : (
              <FiTrash2 size={15} />
            )}
            {loading ? "Withdrawing…" : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}