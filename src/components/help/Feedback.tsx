import React, { useState } from 'react';

export default function Feedback({ articlePath }: { articlePath: string }) {
  const [sent, setSent] = useState(false);
  const [value, setValue] = useState('');
  const [vote, setVote] = useState<'up' | 'down' | null>(null);

  async function submit() {
    try {
      await fetch('/api/help/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: articlePath, vote, text: value }),
      });
      setSent(true);
    } catch (e) {
      // ignore
      setSent(true);
    }
  }

  if (sent) return <div className="text-sm text-neutral-600 dark:text-neutral-400">Thanks for the feedback!</div>;

  return (
    <div className="rounded border border-neutral-200 p-3 text-sm dark:border-neutral-800">
      <div className="mb-2 font-medium">Was this page helpful?</div>
      <div className="mb-2 flex gap-2">
        <button
          onClick={() => setVote('up')}
          className={`rounded border px-2 py-1 ${vote === 'up' ? 'border-emerald-500 text-emerald-600' : 'border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'}`}
        >
          👍 Yes
        </button>
        <button
          onClick={() => setVote('down')}
          className={`rounded border px-2 py-1 ${vote === 'down' ? 'border-rose-500 text-rose-600' : 'border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'}`}
        >
          👎 No
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Optional: Tell us more"
        className="mb-2 w-full rounded border border-neutral-300 bg-white p-2 text-neutral-900 placeholder-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
      />
      <div>
        <button onClick={submit} className="rounded bg-neutral-900 px-3 py-1 text-white dark:bg-neutral-200 dark:text-neutral-900">Submit</button>
      </div>
    </div>
  );
}
