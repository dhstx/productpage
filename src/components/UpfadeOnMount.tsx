import { useEffect, useRef } from 'react';
export default function UpfadeOnMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current; if (!node) return;
    requestAnimationFrame(() => node.classList.add('is-live'));
  }, []);
  return <div ref={ref} className="upfade-on-mount">{children}</div>;
}
