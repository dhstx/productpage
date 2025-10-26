import { Paperclip, Mic } from 'lucide-react';
import { Fragment } from 'react';

/**
 * ChatTools renders the shared tools row used by chat inputs.
 * It preserves markup/classes from the main chat for visual parity.
 *
 * Props:
 * - onAttach: () => void
 * - onToggleMode: (mode: 'chat'|'agi'|string) => void
 * - activeMode: string
 * - onMicStart: () => void
 * - onMicStop: () => void
 * - onUpload: (files: File[]) => void
 * - disabled: boolean
 * - features: { mic?: boolean; upload?: boolean; modes?: string[] }
 * - rightAppend: ReactNode (optional) – renders at end of right controls (e.g., Send button)
 * - children: ReactNode – optional middle content (e.g., textarea)
 */
export default function ChatTools({
  children,
  onAttach,
  onToggleMode,
  activeMode = 'chat',
  onMicStart,
  onMicStop, // reserved for future stop handling
  onUpload,
  disabled = false,
  features = { mic: true, upload: true, modes: ['chat', 'agi'] },
  rightAppend,
  uploadOnRight = false
}) {
  const availableModes = Array.isArray(features?.modes) && features.modes.length > 0
    ? features.modes
    : ['chat', 'agi'];

  const showMic = features?.mic !== false;
  const showUpload = features?.upload !== false;

  return (
    <div className="flex flex-wrap items-start gap-3 sm:flex-nowrap">
      {/* Attachment Button (left) */}
      {showUpload && !uploadOnRight && (
        <button
          type="button"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#202020] transition-colors hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            if (disabled) return;
            onAttach?.();
          }}
          aria-label="Attach file"
          disabled={disabled}
        >
          <Paperclip className="w-5 h-5 text-[#B3B3B3]" />
        </button>
      )}

      {/* Middle content */}
      <div className="min-w-0 flex-1">
        {children}
      </div>

      {/* Right controls */}
      <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
        {/* Move upload button to right if requested */}
        {showUpload && uploadOnRight && (
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#202020] transition-colors hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (disabled) return;
              onAttach?.();
            }}
            aria-label="Attach file"
            disabled={disabled}
          >
            <Paperclip className="w-5 h-5 text-[#B3B3B3]" />
          </button>
        )}
        {availableModes.includes('chat') && (
          <button
            type="button"
            className={
              "flex-1 rounded-full border border-transparent bg-[#202020] px-4 py-2 text-center text-sm font-medium text-[#B3B3B3] transition-colors hover:bg-[#2A2A2A] sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed" +
              (activeMode === 'chat' ? ' ring-1 ring-[#FFC96C]/50' : '')
            }
            onClick={() => {
              if (disabled) return;
              onToggleMode?.('chat');
            }}
            aria-pressed={activeMode === 'chat'}
            disabled={disabled}
          >
            Chat
          </button>
        )}

        {availableModes.includes('agi') && (
          <button
            type="button"
            className={
              "flex-1 rounded-full border border-transparent bg-[#202020] px-4 py-2 text-center text-sm font-medium text-[#B3B3B3] transition-colors hover:bg-[#2A2A2A] sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed" +
              (activeMode === 'agi' ? ' ring-1 ring-[#FFC96C]/50' : '')
            }
            onClick={() => {
              if (disabled) return;
              onToggleMode?.('agi');
            }}
            aria-pressed={activeMode === 'agi'}
            disabled={disabled}
          >
            Agent
          </button>
        )}

        {showMic && (
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#202020] transition-colors hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (disabled) return;
              onMicStart?.();
            }}
            aria-label="Start voice input"
            disabled={disabled}
          >
            <Mic className="w-5 h-5 text-[#B3B3B3]" />
          </button>
        )}

        {rightAppend ? <Fragment>{rightAppend}</Fragment> : null}
      </div>
    </div>
  );
}
