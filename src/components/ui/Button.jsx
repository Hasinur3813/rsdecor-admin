import { cn } from "@/lib/utils"; // We'll create this utility

export default function Button({
  children,
  variant = "default",
  size = "default",
  className,
  ...props
}) {
  const variants = {
    default: "bg-primary text-white hover:bg-primary-dark",
    outline: "border border-gray-200 text-gray-500 hover:border-primary hover:text-primary",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    ghost: "text-gray-500 hover:bg-gray-100",
    destructive: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  const sizes = {
    default: "px-4 py-2.5 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        "rounded-xl font-medium transition-all flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
