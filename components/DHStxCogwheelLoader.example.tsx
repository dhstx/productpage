/**
 * DHStxCogwheelLoader Usage Examples
 * 
 * This file demonstrates various usage patterns for the DHStxCogwheelLoader component.
 * DO NOT import this file - it's for reference only.
 */

import { DHStxCogwheelLoader } from './DHStxCogwheelLoader';

// Example 1: Full-page loading placeholder
export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C]">
      <DHStxCogwheelLoader />
    </div>
  );
}

// Example 2: Inline content loader
export function InlineLoader() {
  return (
    <div className="panel-system p-8">
      <DHStxCogwheelLoader size="sm" text="Loading data..." />
    </div>
  );
}

// Example 3: Button disabled state loader (no text)
export function ButtonWithLoader({ loading }: { loading: boolean }) {
  return (
    <button 
      disabled={loading}
      className="btn-system flex items-center gap-2"
    >
      {loading ? (
        <DHStxCogwheelLoader size="sm" text="" speed="fast" />
      ) : (
        "Submit"
      )}
    </button>
  );
}

// Example 4: Card loading context
export function LoadingCard() {
  return (
    <div className="panel-system p-12 flex flex-col items-center justify-center min-h-[400px]">
      <DHStxCogwheelLoader size="lg" text="Processing request..." speed="slow" />
    </div>
  );
}

// Example 5: Conditional loading state
export function DataView({ isLoading, data }: { isLoading: boolean; data: any }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <DHStxCogwheelLoader text="Fetching data..." />
      </div>
    );
  }
  
  return <div>{/* render data */}</div>;
}
