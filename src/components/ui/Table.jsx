import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

export function Table({ children, className, ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }) {
  return (
    <thead className={cn("bg-gray-50", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }) {
  return (
    <tbody className={cn("", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, ...props }) {
  return (
    <tr
      className={cn(
        "border-b border-gray-50 hover:bg-gray-50/50 transition-colors",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className,
  sortable,
  sortKey,
  sortBy,
  sortOrder,
  onSort,
  ...props
}) {
  const isActive = sortable && sortBy === sortKey;

  const handleClick = () => {
    if (sortable && onSort) {
      onSort(sortKey);
    }
  };

  return (
    <th
      className={cn(
        "px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide",
        sortable && "cursor-pointer select-none hover:text-gray-600",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <span className="inline-flex items-center">
            {isActive ? (
              sortOrder === "asc" ? (
                <ArrowUp className="w-3 h-3 text-primary" />
              ) : (
                <ArrowDown className="w-3 h-3 text-primary" />
              )
            ) : (
              <ArrowUp className="w-3 h-3 text-gray-300" />
            )}
          </span>
        )}
      </div>
    </th>
  );
}

export function TableCell({ children, className, ...props }) {
  return (
    <td className={cn("px-5 py-4", className)} {...props}>
      {children}
    </td>
  );
}
