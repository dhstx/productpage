import { useEffect, useRef } from 'react';

export default function UpfadeOnMount({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current; if (!node) return;
    // Use rAF to ensure initial styles are applied before toggling
    requestAnimationFrame(() => node.classList.add('is-live'));
  }, []);
  return <div ref={ref} className="upfade-on-mount">{children}</div>;
}
