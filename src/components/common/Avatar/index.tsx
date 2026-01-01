interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  className?: string;
}

const sizeClassMap = {
  sm: "avatar-sm",
  md: "avatar-md",
  lg: "avatar-lg",
};

const variantClassMap = {
  primary: "avatar-primary",
  secondary: "avatar-secondary",
};

export default function Avatar({
  initials,
  size = "md",
  variant = "primary",
  className = "",
}: AvatarProps) {
  const sizeClass = sizeClassMap[size];
  const variantClass = variantClassMap[variant];

  return (
    <div
      className={`d-flex align-items-center justify-content-center fw-bold text-white avatar-base ${sizeClass} ${variantClass} ${className}`}
    >
      {initials}
    </div>
  );
}
