'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './AgentsPopup.css';

const EXIT_DURATION = 420;
const FOCUSABLE_SELECTORS = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const buildPyramid = (agents = []) => {
  const rows = [];
  let index = 0;
  let rowSize = 1;

  while (index < agents.length) {
    const nextIndex = Math.min(index + rowSize, agents.length);
    rows.push(agents.slice(index, nextIndex));
    index = nextIndex;
    rowSize += 1;
  }

  return rows;
};

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = (event) => setPrefers(event.matches);

    setPrefers(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updatePreference);
      return () => mediaQuery.removeEventListener('change', updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  return prefers;
}

export default function AgentsPopup({ open, onClose, agents = [] }) {
  const reduceMotion = usePrefersReducedMotion();
  const [shouldRender, setShouldRender] = useState(!!open);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef(null);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  const orderedAgents = useMemo(() => {
    if (!Array.isArray(agents)) return [];
    const commander = agents.find((agent) => agent.id === 'commander');
    const others = agents.filter((agent) => agent.id !== 'commander');
    return commander ? [commander, ...others] : [...agents];
  }, [agents]);

  const rows = useMemo(() => buildPyramid(orderedAgents), [orderedAgents]);
  const totalTiles = orderedAgents.length;

  const startClosing = useCallback(
    (invokeParent = false) => {
      if (!shouldRender) {
        if (invokeParent) onClose?.();
        return;
      }

      if (isClosing) {
        if (invokeParent) onClose?.();
        return;
      }

      if (reduceMotion) {
        setShouldRender(false);
        setIsClosing(false);
        if (invokeParent) onClose?.();
        return;
      }

      setIsClosing(true);
      if (invokeParent) onClose?.();

      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = window.setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
        closeTimeoutRef.current = null;
      }, EXIT_DURATION);
    },
    [isClosing, onClose, reduceMotion, shouldRender]
  );

  const handleRequestClose = useCallback(() => {
    startClosing(true);
  }, [startClosing]);

  const handleBackdropClick = useCallback(() => {
    handleRequestClose();
  }, [handleRequestClose]);

  useEffect(() => {
    if (open) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
      setShouldRender(true);
      setIsClosing(false);
      return;
    }

    if (shouldRender && !isClosing) {
      if (reduceMotion) {
        setShouldRender(false);
        setIsClosing(false);
      } else {
        startClosing(false);
      }
    }
  }, [open, reduceMotion, shouldRender, isClosing, startClosing]);

  useEffect(() => () => {
    clearTimeout(closeTimeoutRef.current);
  }, []);

  const trapFocus = useCallback((event) => {
    if (!panelRef.current) return;

    const focusableElements = Array.from(
      panelRef.current.querySelectorAll(FOCUSABLE_SELECTORS)
    ).filter((element) => element instanceof HTMLElement && !element.hasAttribute('aria-hidden'));

    if (!focusableElements.length) {
      event.preventDefault();
      closeButtonRef.current?.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      if (activeElement === first || activeElement === panelRef.current) {
        event.preventDefault();
        last.focus();
      }
    } else if (activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!shouldRender) return undefined;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleRequestClose();
      } else if (event.key === 'Tab') {
        trapFocus(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [handleRequestClose, shouldRender, trapFocus]);

  if (!shouldRender) {
    return null;
  }

  let tileCounter = -1;

  const rootClassName = [
    'agents-popup-root',
    isClosing ? 'agents-popup--closing' : 'agents-popup--entered',
    reduceMotion ? 'agents-popup--reduced' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={rootClassName}
      role="dialog"
      aria-modal="true"
      aria-labelledby="agents-popup-title"
    >
      <div className="agents-backdrop" onClick={handleBackdropClick} />
      <div
        className="agents-panel"
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="agents-panel__header">
          <h2 id="agents-popup-title" className="agents-panel__title">
            All Agents
          </h2>
          <button
            type="button"
            className="agents-panel__close"
            onClick={handleRequestClose}
            ref={closeButtonRef}
            aria-label="Close agents overview"
          >
            ×
          </button>
        </header>

        <div className="agents-panel__content">
          {orderedAgents.length === 0 ? (
            <p className="agents-panel__empty">No agents available right now.</p>
          ) : (
            <div className="agents-pyramid">
              {rows.map((row, rowIndex) => (
                <div className="agents-row" key={`agents-row-${rowIndex}`}>
                  {row.map((agent) => {
                    tileCounter += 1;
                    const entryDelay = reduceMotion ? 0 : tileCounter * 70;
                    const exitDelay = reduceMotion ? 0 : (totalTiles - tileCounter - 1) * 70;
                    return (
                      <div
                        key={agent.id}
                        className="agent-tile"
                        tabIndex={0}
                        role="article"
                        aria-label={`${agent.name}: ${agent.tagline}`}
                        style={{
                          '--agents-entry-delay': `${entryDelay}ms`,
                          '--agents-exit-delay': `${exitDelay}ms`
                        }}
                      >
                        <span className="agent-icon" style={{ color: agent.color }} aria-hidden="true">
                          {agent.icon}
                        </span>
                        <span className="agent-name">{agent.name}</span>
                        <span className="agent-tagline">{agent.tagline}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
