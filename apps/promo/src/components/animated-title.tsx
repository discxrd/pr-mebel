"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimatedTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "p";
  dangerouslySetInnerHTML?: { __html: string };
}

export const AnimatedTitle = ({
  children,
  className,
  as: Component = "h2",
  dangerouslySetInnerHTML,
  ...props
}: AnimatedTitleProps & React.HTMLAttributes<HTMLHeadingElement>) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "-65px 0px -65px 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.96)",
        transitionProperty: "opacity, transform",
        transitionDuration: "1500ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "opacity, transform",
      }}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      {...props}
    >
      {children}
    </Component>
  );
};
