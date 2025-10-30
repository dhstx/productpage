import React from 'react';

// Minimal dynamic() helper that mirrors Next.js API for client-only lazy components
export default function dynamic(loader, options = {}) {
  const Lazy = React.lazy(loader);
  const Loading = options.loading ?? null;
  // ssr option is ignored in SPA; retained for API compatibility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ssr = true } = options;

  return function DynamicComponent(props) {
    return (
      <React.Suspense fallback={Loading}>
        <Lazy {...props} />
      </React.Suspense>
    );
  };
}
