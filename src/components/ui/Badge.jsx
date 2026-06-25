const STATUS_STYLES = {
  InStock: "bg-green-100 text-green-700",
  LowStock: "bg-amber-100 text-amber-700",
  OutOfStock: "bg-red-100 text-red-600",
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-600",
};

export default function Badge({ status, className, children, ...props }) {
  const styleClass = STATUS_STYLES[status] || "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styleClass} ${className || ""}`}
      {...props}
    >
      {children || status}
    </span>
  );
}
