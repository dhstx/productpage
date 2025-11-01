'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { agents as agentData } from '../../lib/agents-enhanced';
import './AgentsPopup.css';

const TILE_GAP = 28;
const ENTER_DELAY_STEP = 60;
const EXIT_DELAY_STEP = 60;
const EXIT_DURATION = 420;

function computeRows(data) {
  const rows = [];
  let index = 0;
  let rowSize = 1;

  while (index < data.length) {
    const slice = data.slice(index, index + rowSize);
    rows.push(slice);
    index += rowSize;
    rowSize += 1;
  }

  return rows;
}

export default function AgentsPopup({ open, onClose, triggerRef }) {
  const [closing, setClosing] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const focusableElementsRef = useRef([]);
  const closeTimeoutRef = useRef(null);

  const rows = useMemo(() => computeRows(agentData), []);
  const totalRows = rows.length;

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event) => setPrefersReducedMotion(event.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;

    previouslyFocusedRef.current = triggerRef?.current ?? document.activeElement;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const updateFocusable = () => {
      if (!panelRef.current) return;
      const possible = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElementsRef.current = Array.from(possible);
    };

    updateFocusable();

    const keyHandler = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        startClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = focusableElementsRef.current;
        if (!focusable.length) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const current = document.activeElement;

        if (event.shiftKey) {
          if (current === first || !panelRef.current.contains(current)) {
            event.preventDefault();
            last.focus();
          }
        } else if (current === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const focusTimer = window.requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    document.addEventListener('keydown', keyHandler);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.removeEventListener('keydown', keyHandler);
      focusableElementsRef.current = [];
      document.body.style.overflow = originalOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open, triggerRef, prefersReducedMotion]);

  useEffect(() => () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if ((!open && !closing) || !panelRef.current || typeof window === 'undefined') {
      return undefined;
    }

    const target = panelRef.current;

    const computeTileSize = () => {
      const containerWidth = target.clientWidth;
      if (!containerWidth) return;

      const maxColumns = rows.reduce((max, row) => Math.max(max, row.length), 1);
      if (maxColumns <= 0) return;

      const available = containerWidth - (maxColumns - 1) * TILE_GAP;
      const tileSize = Math.floor(Math.min(160, Math.max(120, available / maxColumns)));
      target.style.setProperty('--tile-size', `${tileSize}px`);
    };

    computeTileSize();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => computeTileSize());
      observer.observe(target);
      return () => observer.disconnect();
    }

    return undefined;
  }, [open, closing, rows]);

  const startClose = () => {
    if (!open || closing) {
      if (!open) onClose?.();
      return;
    }

    if (prefersReducedMotion) {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      setClosing(false);
      onClose?.();
      return;
    }

    setClosing(true);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setClosing(false);
      closeTimeoutRef.current = null;
      onClose?.();
    }, EXIT_DURATION);
  };

  const handleBackdropClick = (event) => {
    event.stopPropagation();
    startClose();
  };

  const handlePanelClick = (event) => {
    event.stopPropagation();
  };

  const renderIcon = (agent) => {
    if (typeof agent.icon === 'string') {
      return (
        <span className="agent-symbol" style={{ color: agent.color }} aria-hidden="true">
          {agent.icon}
        </span>
      );
    }

    return (
      <span className="agent-symbol" style={{ color: agent.color }} aria-hidden="true">
        {agent.icon}
      </span>
    );
  };

  const rootClasses = [
    'agents-popup-root',
    open && !closing ? 'is-open' : '',
    closing ? 'is-closing' : '',
    prefersReducedMotion ? 'reduce-motion' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const panelClasses = [
    'agents-panel',
    'bg-white/95',
    'text-slate-900',
    'dark:bg-neutral-900/95',
    'dark:text-neutral-100',
    'border',
    'border-black/10',
    'dark:border-white/10',
    'shadow-2xl',
    'rounded-3xl',
    'w-[min(95vw,1180px)]',
    'max-w-[1180px]',
    'max-h-[80vh]',
    'sm:max-h-[82vh]',
    'overflow-hidden',
    'p-6',
    'sm:p-8',
    'flex',
    'flex-col',
    'gap-6',
    'sm:gap-8',
    'relative',
  ].join(' ');

  const headerClasses = [
    'agents-panel-header',
    'flex',
    'items-center',
    'justify-between',
    'gap-4',
    'pb-4',
    'border-b',
    'border-black/10',
    'dark:border-white/10',
  ].join(' ');

  if (!open && !closing) {
    return null;
  }

  return (
    <div className={rootClasses} role="dialog" aria-modal="true" aria-labelledby="agents-popup-title">
      <div
        ref={backdropRef}
        className="agents-backdrop"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={`${panelClasses} max-sm:h-full max-sm:w-full max-sm:rounded-none max-sm:border-0 max-sm:p-6`}
        onClick={handlePanelClick}
      >
        <div className={`${headerClasses} max-sm:pt-4 max-sm:pb-5`}>
          <h2 id="agents-popup-title" className="text-lg font-semibold sm:text-xl">
            All Agents
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="agents-close inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-sm font-medium text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC96C] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:border-white/10 dark:text-neutral-300 dark:hover:text-neutral-100"
            aria-label="Close"
            onClick={startClose}
          >
            <span aria-hidden="true">X</span>
          </button>
        </div>
        <div className="agents-body flex-1 overflow-hidden">
          <div className="agents-pyramid">
            {rows.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="agents-row">
                {row.map((agent, columnIndex) => {
                  const enterDelay = (rowIndex * 6 + columnIndex) * ENTER_DELAY_STEP;
                  const exitDelay = ((totalRows - rowIndex - 1) * 6 + (row.length - columnIndex - 1)) * EXIT_DELAY_STEP;

                  return (
                    <div
                      key={agent.id}
                      className="agent-tile"
                      tabIndex={0}
                      style={{
                        '--agent-enter-delay': `${enterDelay}ms`,
                        '--agent-exit-delay': `${exitDelay}ms`,
                      }}
                    >
                      {renderIcon(agent)}
                      <div className="agent-name">{agent.name}</div>
                      <div className="agent-tagline">{agent.tagline}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
