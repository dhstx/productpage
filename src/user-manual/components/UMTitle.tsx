'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

type UMTitleProps = {
  children: ReactNode;
};

export function UMTitle({ children }: UMTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const color = getComputedStyle(el).color;
    document.documentElement.style.setProperty('--um-title', color);
    return () => {
      document.documentElement.style.removeProperty('--um-title');
    };
  }, []);

  return (
    <h1 ref={ref} className="text-3xl font-extrabold tracking-tight text-amber-500 dark:text-amber-300">
      {children}
    </h1>
  );
}
