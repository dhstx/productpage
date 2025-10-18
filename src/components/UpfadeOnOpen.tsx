import { useEffect, useRef } from "react";

export default function UpfadeOnOpen({
  trigger,
  children,
}: {
  trigger: string | number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const n = ref.current;
    if (!n) return;
    n.classList.remove("is-live");
    // next frame to let the class removal flush
    requestAnimationFrame(() => n.classList.add("is-live"));
  }, [trigger]);

  return (
    <div ref={ref} className="upfade-on-mount">
      {children}
    </div>
  );
}
