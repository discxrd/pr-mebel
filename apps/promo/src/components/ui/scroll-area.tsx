"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

type ScrollAreaProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
> & {
  orientation?: "vertical" | "horizontal";
  withControls?: boolean;
  scrollAmount?: number;
};

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      className,
      children,
      orientation = "vertical",
      withControls = false,
      scrollAmount = 120,
      ...props
    },
    ref,
  ) => {
    const viewportRef = React.useRef<HTMLDivElement | null>(null);

    const scrollBy = React.useCallback(
      (delta: number) => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        if (orientation === "vertical") {
          viewport.scrollBy({ top: delta, behavior: "smooth" });
        } else {
          viewport.scrollBy({ left: delta, behavior: "smooth" });
        }
      },
      [orientation],
    );

    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          className="h-full w-full rounded-[inherit]"
        >
          {children}
        </ScrollAreaPrimitive.Viewport>

        {withControls && (
          <div
            className={cn(
              "pointer-events-none absolute z-10 flex gap-2",
              orientation === "vertical"
                ? "right-2 top-2 flex-col"
                : "bottom-2 right-2 flex-row",
            )}
          >
            <button
              type="button"
              className={cn(
                "bg-background text-foreground hover:text-accent-foreground pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-md border shadow-sm transition-colors hover:bg-accent",
              )}
              aria-label={
                orientation === "vertical" ? "Scroll up" : "Scroll left"
              }
              onClick={() => scrollBy(-Math.abs(scrollAmount))}
            >
              {orientation === "vertical" ? "↑" : "←"}
            </button>
            <button
              type="button"
              className={cn(
                "bg-background text-foreground hover:text-accent-foreground pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-md border shadow-sm transition-colors hover:bg-accent",
              )}
              aria-label={
                orientation === "vertical" ? "Scroll down" : "Scroll right"
              }
              onClick={() => scrollBy(Math.abs(scrollAmount))}
            >
              {orientation === "vertical" ? "↓" : "→"}
            </button>
          </div>
        )}

        <ScrollBar orientation={orientation} />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  },
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="bg-border relative flex-1 rounded-full" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
