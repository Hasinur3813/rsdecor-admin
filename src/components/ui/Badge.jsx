const STATUS_STYLES = {
  InStock: "bg-green-100 text-green-700",
  LowStock: "bg-amber-100 text-amber-700",
  OutOfStock: "bg-red-100 text-red-600",
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-600",
  Expired: "bg-red-100 text-red-700",
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
  New: "bg-blue-100 text-blue-700",
  Replied: "bg-green-100 text-green-700",
  Sent: "bg-green-100 text-green-700",
  Draft: "bg-amber-100 text-amber-700",
  Published: "bg-green-100 text-green-700",
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
