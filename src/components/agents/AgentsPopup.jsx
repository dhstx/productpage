'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { agents as agentData } from '../../lib/agents-enhanced';
import { getAgentColor } from '../ui/agentThemes';
import getAgentIcon from '../ui/agentIcons';

const TRANSITION_DURATION_MS = 340;
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export default function AgentsPopup({ open, onClose }) {
  const [isMounted, setIsMounted] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  const agents = useMemo(
    () =>
      agentData.map((agent) => ({
        id: agent.id,
        name: agent.name,
        tagline: agent.tagline,
        color: getAgentColor(agent.name, agent.color),
      })),
    []
  );

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      setIsClosing(false);
    } else if (isMounted) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
        setIsMounted(false);
      }, TRANSITION_DURATION_MS);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open, isMounted]);

  const trapFocus = useCallback((event) => {
    if (event.key !== 'Tab' || !dialogRef.current) return;
    const focusable = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE_SELECTORS)).filter(
      (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !dialogRef.current.contains(active)) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (active === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }
      trapFocus(event);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMounted, onClose, trapFocus]);

  useEffect(() => {
    if (!isMounted) return;
    const focusTarget = closeButtonRef.current;
    const timer = focusTarget ? setTimeout(() => focusTarget.focus({ preventScroll: true }), 40) : null;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isMounted]);

  const handleBackdropClick = useCallback(() => {
    onClose?.();
  }, [onClose]);

  if (!isMounted) return null;

  const interactive = open || isClosing;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        interactive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-black/50 transition-opacity duration-[340ms] ${
          open && !isClosing ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleBackdropClick}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="agents-popup-title agents-popup-title-desktop"
        className={`relative z-10 flex h-full w-full flex-col bg-[#090909] shadow-2xl transition-all duration-[340ms] ${
          open && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } sm:h-auto sm:w-[min(1100px,92vw)] sm:max-h-[80vh] sm:overflow-hidden sm:rounded-2xl`}
      >
        <div className="flex items-center justify-center border-b border-white/10 px-4 py-3 sm:hidden">
          <h2 id="agents-popup-title" className="text-base font-semibold text-[#F2F2F2]">
            All Agents
          </h2>
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-10 sm:py-10">
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close agents list"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-white/10 bg-[#101010] p-2 text-[#B3B3B3] transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC96C]/60 sm:right-6 sm:top-6"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          <header className="hidden sm:block mb-8">
            <h2 id="agents-popup-title-desktop" className="text-2xl font-semibold text-[#F2F2F2]">
              All Agents
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#B3B3B3]">
              Explore the full roster supporting your command decisions and specialized initiatives.
            </p>
          </header>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 sm:gap-6">
            {agents.map((agent) => {
              const IconComponent = getAgentIcon(agent.name);
              return (
                <div
                  key={agent.id}
                  tabIndex={0}
                  className="group flex flex-col items-center rounded-xl border border-white/5 bg-[#121212] p-4 text-center transition-transform duration-200 hover:scale-[1.06] hover:border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC96C]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-semibold text-[#080808] shadow-inner"
                    style={{ backgroundColor: agent.color }}
                    aria-hidden="true"
                  >
                    <IconComponent size={28} color="#080808" />
                  </div>
                  <div className="mt-4 text-sm font-semibold uppercase tracking-wide text-[#F2F2F2]">
                    {agent.name}
                  </div>
                  <div className="mt-1 text-xs text-[#B3B3B3] leading-snug">
                    {agent.tagline}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
