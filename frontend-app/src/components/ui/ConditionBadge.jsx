const conditionConfig = {
  LIKE_NEW: {
    label: "Like New",
    color: "#22C55E",
    bgColor: "#E8F8EE",
    description: "Unread or crisp condition",
  },
  GOOD: {
    label: "Good",
    color: "#38BDF8",
    bgColor: "#E8F4FD",
    description: "Lightly used with minimal wear",
  },
  FAIR: {
    label: "Fair",
    color: "#FF8A3D",
    bgColor: "#FFF0E6",
    description: "Complete readable with some wear",
  },
  WORN: {
    label: "Worn",
    color: "#FF4F81",
    bgColor: "#FFE8EF",
    description: "Heavy usage, annotations",
  },
};

export default function ConditionBadge({ condition, size = "sm" }) {
  const config = conditionConfig[condition] || conditionConfig.GOOD;
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium font-[family-name:var(--font-body)] ${sizeClasses[size]}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.color}20`,
      }}
      title={config.description}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}

export { conditionConfig };
