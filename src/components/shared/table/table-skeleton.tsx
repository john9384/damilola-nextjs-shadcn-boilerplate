"use client";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 10,
  columns = 5,
  className,
}: TableSkeletonProps) {
  // Generate deterministic widths for skeleton bars to make it look more realistic
  // Uses row and column indices to create a pattern
  const getWidth = (rowIdx: number, colIdx: number) => {
    const widths = [60, 70, 80, 85, 90, 95];
    const index = (rowIdx * columns + colIdx) % widths.length;
    return widths[index];
  };

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className={className}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td
              key={colIdx}
              className="px-6 py-4 whitespace-nowrap"
            >
              <div
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{ width: `${getWidth(rowIdx, colIdx)}%` }}
                aria-hidden="true"
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

