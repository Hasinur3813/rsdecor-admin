import { cn } from "@/lib/utils";

/**
 * Reusable skeleton shimmer block.
 * Renders a single animated placeholder bar.
 */
function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200/70",
        className,
      )}
    />
  );
}

/**
 * A reusable skeleton loader for table rows.
 *
 * @param {number}  rows     – How many skeleton rows to render (default 5)
 * @param {Array}   columns  – Column config. Each entry can be:
 *   • a string width class, e.g. "w-24"
 *   • an object { width: "w-24", type: "circle" | "image" | "badge" | "text" | "actions" }
 *     - "text"    (default) renders a single bar
 *     - "double"  renders two stacked bars (title + subtitle)
 *     - "image"   renders a small thumbnail placeholder
 *     - "circle"  renders a round placeholder
 *     - "badge"   renders a small pill
 *     - "actions" renders 2–3 small squares (icon buttons)
 * @param {number}  colSpan  – If provided, wraps each skeleton row in a single
 *                             <td colSpan={colSpan}> — handy for full-width loading.
 *
 * @example
 *   <TableSkeleton
 *     rows={5}
 *     columns={[
 *       { width: "w-8",  type: "text"    },
 *       { width: "w-40", type: "double"  },
 *       { width: "w-16", type: "image"   },
 *       { width: "w-16", type: "badge"   },
 *       { width: "w-20", type: "text"    },
 *       { width: "w-20", type: "actions" },
 *     ]}
 *   />
 */
export default function TableSkeleton({ rows = 5, columns = [] }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr
          key={rowIdx}
          className="border-b border-gray-50"
        >
          {columns.map((col, colIdx) => {
            const config =
              typeof col === "string" ? { width: col, type: "text" } : col;
            const { width = "w-24", type = "text" } = config;

            return (
              <td key={colIdx} className="px-5 py-4">
                {type === "double" ? (
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className={cn("h-3.5", width)} />
                    <Skeleton className={cn("h-3", width === "w-40" ? "w-28" : "w-20")} />
                  </div>
                ) : type === "image" ? (
                  <Skeleton className="w-16 h-10 rounded-lg" />
                ) : type === "circle" ? (
                  <Skeleton className="w-8 h-8 rounded-full" />
                ) : type === "badge" ? (
                  <Skeleton className="w-16 h-5 rounded-full" />
                ) : type === "actions" ? (
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="w-7 h-7 rounded-lg" />
                    <Skeleton className="w-7 h-7 rounded-lg" />
                    <Skeleton className="w-7 h-7 rounded-lg" />
                  </div>
                ) : (
                  <Skeleton className={cn("h-3.5", width)} />
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

export { Skeleton };
