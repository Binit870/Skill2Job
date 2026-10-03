export default function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-pine text-white hover:bg-moss shadow-sm hover:shadow-md",
    outline: "border border-mist text-ink/75 hover:bg-ink/5 hover:border-ink/20",
  };

  return (
    <button
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
