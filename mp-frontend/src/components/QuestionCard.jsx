export default function QuestionCard({ question, index }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Question {index + 1}
      </h3>
      <p className="text-xl font-medium text-gray-900">
        {question}
      </p>
    </div>
  );
}