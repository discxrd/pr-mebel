"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // от 0 до 100
  className?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value: externalValue, ...props }, ref) => {
    const totalSections = 7;
    const sectionValue = 100 / totalSections;

    const safeValue = Math.max(
      0,
      Math.min(100, parseFloat(externalValue.toFixed(2))),
    );
    const filledSectionsCount = Math.floor(safeValue / sectionValue);
    const partialValue = ((safeValue % sectionValue) / sectionValue) * 100;

    const gap = 4; // в пикселях
    const totalGap = gap * (totalSections - 1);
    const sectionWidth = `calc((100% - ${totalGap}px) / ${totalSections})`;

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-1 w-full overflow-hidden bg-white px-5 md:h-2 md:px-1", // bg-dark-500 — цвет "разделителя"
          className,
        )}
        style={
          {
            // Добавляем паддинг по бокам, чтобы gap не обрезался
            // padding: `0 ${gap / 2}px`,
          }
        }
        {...props}
      >
        <div
          className="flex h-full"
          style={{
            gap: `${gap}px`,
            width: "100%",
          }}
        >
          {Array.from({ length: totalSections }).map((_, i) => {
            let fillWidth = "0%";
            if (i < filledSectionsCount) {
              fillWidth = "100%";
            } else if (i === filledSectionsCount) {
              fillWidth = `${partialValue}%`;
            }

            return (
              <div
                key={i}
                className="relative h-full rounded-sm bg-dark-300" // фон секции — светлее, чем разделитель
                style={{ width: sectionWidth }}
              >
                <div
                  className="absolute left-0 top-0 h-full origin-left rounded-sm bg-accent transition-all duration-700 ease-out"
                  style={{ width: fillWidth }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";

export { Progress };
