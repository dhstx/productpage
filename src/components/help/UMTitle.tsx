"use client";

import { useEffect, useRef, type ReactNode } from "react";

type UMTitleProps = {
  children: ReactNode;
  className?: string;
};

export function UMTitle({ children, className }: UMTitleProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const color = getComputedStyle(el).color;
    if (color) {
      document.documentElement.style.setProperty("--um-title-color", color);
    }
  }, []);

  return (
    <h1 ref={ref} className={`text-3xl font-extrabold text-amber-300 ${className ?? ""}`.trim()}>
      {children}
    </h1>
  );
}
