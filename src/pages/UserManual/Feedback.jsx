import React, { useState } from 'react';

export default function Feedback({ context = 'user-manual' }) {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);
  const [rating, setRating] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    try {
      const payload = { context, rating, message: value.slice(0, 500) };
      // In production, send to API endpoint. Here, keep inline and non-blocking.
      // Redact PII or secrets if logging.
      console.info('[feedback]', { ...payload, message: '[redacted]' });
      setSent(true);
      setValue('');
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-md border p-4" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
      <h3 className="font-semibold">Was this helpful?</h3>
      {!sent ? (
        <form onSubmit={submit} className="mt-2 space-y-3">
          <div className="flex items-center gap-2">
            <button type="button" aria-pressed={rating === 'up'} onClick={() => setRating('up')} className="px-2 py-1 rounded-md border" style={{ borderColor: 'var(--card-border)' }}>
              👍
            </button>
            <button type="button" aria-pressed={rating === 'down'} onClick={() => setRating('down')} className="px-2 py-1 rounded-md border" style={{ borderColor: 'var(--card-border)' }}>
              👎
            </button>
          </div>
          <label htmlFor="um-feedback" className="sr-only">Feedback</label>
          <textarea
            id="um-feedback"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            placeholder="Tell us what to improve (no overlays; inline only)"
            className="w-full rounded-md border px-3 py-2 text-sm"
            style={{ background: 'var(--card-bg)', color: 'var(--text)', borderColor: 'var(--card-border)' }}
          />
          <div className="flex justify-end">
            <button type="submit" className="px-3 py-1.5 rounded-md" style={{ background: 'var(--accent-gold)', color: '#111' }}>
              Send
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Thanks for your feedback!</p>
      )}
    </div>
  );
}
