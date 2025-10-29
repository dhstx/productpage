import React from 'react';

type PageTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageTitle({ children, className = "" }: PageTitleProps) {
  return (
    <h1
      className={
        "font-semibold tracking-tight text-[color:var(--accent-gold)] " +
        "text-3xl md:text-4xl " +
        className
      }
    >
      {children}
    </h1>
  );
}
