import React from "react";

export interface SpinnerProps {
  size?: number; // px
  color?: string; // Tailwind color class
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = "text-red-500",
  className = "",
}) => {
  return (
    <svg
      className={`animate-spin ${color} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      {/* Track */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
        fill="none"
      />

      {/* Arc */}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        d="M22 12a10 10 0 0 1-10 10"
        className="opacity-75"
      />
    </svg>
  );
};

export default Spinner;
