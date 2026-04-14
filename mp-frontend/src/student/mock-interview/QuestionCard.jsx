export default function QuestionCard({ question, index }) {
  return (
    <div style={{
      background: "#f0fdf4", borderRadius: 14, border: "1px solid #d1fae5",
      padding: "20px 24px"
    }}>
      <p style={{
        fontSize: 11, fontWeight: 700, color: "#10b981",
        textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px"
      }}>
        Question {index + 1}
      </p>
      <p style={{ fontSize: 18, fontWeight: 600, color: "#064e35", margin: 0, lineHeight: 1.6 }}>
        {question}
      </p>
    </div>
  );
}