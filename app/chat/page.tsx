// Demo wiring page for Next.js (optional when running under Vite)
'use client';

import React, { useState } from 'react';
import DHSPromptSuggester from '@/app/components/DHSPromptSuggester';

export default function ChatDemoPage() {
  const [value, setValue] = useState('');
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Prompt Suggester Demo</h1>
      <DHSPromptSuggester
        history={[]}
        uiHint={{ n: 3, language: 'en', style: 'concise' }}
        onApply={(text) => setValue(text)}
      />
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Composer value</label>
        <input
          className="w-full rounded border border-gray-300 p-2 text-sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Composer value"
        />
      </div>
    </main>
  );
}
