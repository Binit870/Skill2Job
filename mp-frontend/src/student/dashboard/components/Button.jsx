export default function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary:
      "bg-[#0f4c35] text-white hover:bg-[#0a3525] shadow-sm hover:shadow-md",
    outline:
      "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}