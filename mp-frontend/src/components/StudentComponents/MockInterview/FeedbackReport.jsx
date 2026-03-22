export default function FeedbackReport({ feedback, setStep }) {
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Interview Feedback
      </h2>

      <p className="text-xl font-semibold mb-4">
        Overall Score: {feedback.overall_score}/10
      </p>

      <div className="space-y-4">
        {feedback.results.map((item, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-gray-50"
          >
            <p className="font-medium">{item.question}</p>
            <p className="text-sm text-gray-600">
              Score: {item.score}/10
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setStep("setup")}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Take Another Interview
      </button>
    </div>
  );
}