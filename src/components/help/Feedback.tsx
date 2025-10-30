import React, { useState } from 'react';

export default function Feedback({ slug }: { slug: string }) {
  const [sent, setSent] = useState(false);
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');

  async function submit() {
    try {
      const res = await fetch('/api/help/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, helpful, notes }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSent(true);
    } catch (err) {
      console.log('[help.feedback]', { slug, helpful, notes });
      setSent(true);
    }
  }

  if (sent) {
    return <div className="text-sm" style={{ color: 'var(--muted)' }}>Thanks for your feedback.</div>;
  }

  return (
    <div className="space-y-3">
      <div className="text-sm">Was this helpful?</div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setHelpful(true)}
          className={`px-3 py-1 rounded-[3px] ${helpful === true ? 'opacity-100' : 'opacity-70'}`}
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text)' }}
          aria-pressed={helpful === true}
        >
          👍 Yes
        </button>
        <button
          type="button"
          onClick={() => setHelpful(false)}
          className={`px-3 py-1 rounded-[3px] ${helpful === false ? 'opacity-100' : 'opacity-70'}`}
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text)' }}
          aria-pressed={helpful === false}
        >
          👎 No
        </button>
      </div>
      <div>
        <label htmlFor="help-feedback-notes" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
          Optional comments
        </label>
        <textarea
          id="help-feedback-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-[4px] px-3 py-2"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text)' }}
        />
      </div>
      <div>
        <button
          type="button"
          onClick={submit}
          className="px-4 py-2 rounded-[3px]"
          style={{ background: 'var(--accent-muted)', color: 'var(--accent-gold)', border: '1px solid var(--card-border)' }}
          disabled={helpful === null}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
