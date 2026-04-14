export default function FormActions({ saving, onCancel }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pb-8">
      <button
        type="submit"
        disabled={saving}
        className="flex-1 sm:flex-none bg-[#138808] hover:bg-[#0f6b06] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-sm text-sm"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving…
          </span>
        ) : (
          "Save Changes"
        )}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 font-semibold px-8 py-3 rounded-xl transition-colors text-sm"
      >
        Cancel
      </button>
    </div>
  );
}