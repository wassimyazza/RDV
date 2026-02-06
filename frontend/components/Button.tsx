type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const baseStyle = "px-6 py-3 rounded-lg font-medium transition-colors";
  const primaryStyle = "bg-blue-600 text-white hover:bg-blue-700";
  const secondaryStyle = "bg-gray-200 text-gray-800 hover:bg-gray-300";

  const style = variant === "primary" ? primaryStyle : secondaryStyle;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${style} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}
