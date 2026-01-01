interface StatusBadgeProps {
  status: "available" | "unavailable" | "active" | "inactive";
  className?: string;
}

const statusConfig = {
  available: { bg: "bg-green3", color: "cgreen1", label: "Available" },
  unavailable: { bg: "bg-orange3", color: "corange2", label: "Unavailable" },
  active: { bg: "bg-green3", color: "cgreen1", label: "Active" },
  inactive: { bg: "bg-orange3", color: "corange2", label: "Inactive" },
};

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`px-3 py-1 br30 fs-12 fw-medium ${config?.bg} ${config?.color} ${className}`}
    >
      {config?.label}
    </span>
  );
}
