import React from "react";

export default function PageHeading({
  as: As = "h1",
  children,
  className = "",
}: { as?: any; children: React.ReactNode; className?: string }) {
  return (
    <As
      className={[
        "font-semibold tracking-tight",
        "text-[color:var(--accent-gold)]",
        "text-3xl md:text-4xl",
        className,
      ].join(" ")}
    >
      {children}
    </As>
  );
}
