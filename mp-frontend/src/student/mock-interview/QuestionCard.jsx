export function QuestionCard({ question, index }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
      borderRadius: 16,
      border: "1px solid #d1fae5",
      padding: "clamp(14px,3vw,22px) clamp(14px,3vw,24px)",
      width: "100%",
      boxSizing: "border-box",
    }}>
      <p style={{
        fontSize: 10, fontWeight: 800, color: "#10b981",
        textTransform: "uppercase", letterSpacing: "0.1em",
        margin: "0 0 10px",
      }}>
        Question {index + 1}
      </p>
      <p style={{
        fontSize: "clamp(15px,2vw,18px)",
        fontWeight: 600,
        color: "#064e35",
        margin: 0,
        lineHeight: 1.65,
      }}>
        {question}
      </p>
    </div>
  );
}
