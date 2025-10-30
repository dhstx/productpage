import React from 'react';

export type Heading = { level: 2 | 3 | 4; text: string; id: string };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function parseInline(text: string): (string | JSX.Element)[] {
  // Bold **text** and links [text](url). Very naive.
  const parts: (string | JSX.Element)[] = [];
  let rest = text;
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(text))) {
    const before = text.slice(lastIndex, m.index);
    if (before) parts.push(before);
    parts.push(
      <a key={`a-${m.index}`} href={m[2]} className="text-blue-600 underline">
        {m[1]}
      </a>
    );
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  // Now handle bold in each string part
  const finalParts: (string | JSX.Element)[] = [];
  for (const p of parts) {
    if (typeof p !== 'string') {
      finalParts.push(p);
      continue;
    }
    const boldSplit = p.split(/\*\*([^*]+)\*\*/);
    for (let i = 0; i < boldSplit.length; i++) {
      if (i % 2 === 1) {
        finalParts.push(<strong key={`b-${i}`}>{boldSplit[i]}</strong>);
      } else if (boldSplit[i]) {
        finalParts.push(boldSplit[i]);
      }
    }
  }
  return finalParts;
}

export function extractHeadingsFromContent(content: string): Heading[] {
  const lines = content.split('\n');
  const result: Heading[] = [];
  for (const line of lines) {
    if (line.startsWith('#### ')) {
      const text = line.slice(5).trim();
      result.push({ level: 4, text, id: slugify(text) });
    } else if (line.startsWith('### ')) {
      const text = line.slice(4).trim();
      result.push({ level: 3, text, id: slugify(text) });
    } else if (line.startsWith('## ')) {
      const text = line.slice(3).trim();
      result.push({ level: 2, text, id: slugify(text) });
    }
  }
  return result;
}

export default function MarkdownRenderer({ content, videoEnabled = true }: { content: string; videoEnabled?: boolean }) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let inCode = false;
  let codeLang = '';
  let codeBuffer: string[] = [];
  let inList = false;
  let listBuffer: string[] = [];

  function flushCode() {
    if (!inCode) return;
    elements.push(
      <pre key={`pre-${elements.length}`} className="mb-4 overflow-x-auto rounded bg-neutral-100 p-3 text-sm dark:bg-neutral-900">
        <code className={codeLang ? `language-${codeLang}` : undefined}>{codeBuffer.join('\n')}</code>
      </pre>
    );
    inCode = false;
    codeLang = '';
    codeBuffer = [];
  }

  function flushList() {
    if (!inList) return;
    elements.push(
      <ul key={`ul-${elements.length}`} className="mb-4 list-disc pl-6">
        {listBuffer.map((t, i) => (
          <li key={i}>{parseInline(t)}</li>
        ))}
      </ul>
    );
    inList = false;
    listBuffer = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // code fence
    const fence = line.match(/^```(.*)$/);
    if (fence) {
      if (inCode) {
        // closing fence
        flushCode();
        continue;
      } else {
        // opening fence
        flushList();
        inCode = true;
        codeLang = (fence[1] || '').trim();
        continue;
      }
    }
    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    // list
    if (line.startsWith('- ')) {
      if (!inList) inList = true;
      listBuffer.push(line.slice(2));
      continue;
    } else if (inList && line.trim() === '') {
      flushList();
      continue;
    }

    // headings
    if (line.startsWith('#### ')) {
      flushList();
      const text = line.slice(5).trim();
      elements.push(
        <h4 key={`h4-${elements.length}`} id={slugify(text)} className="mb-2 mt-6 scroll-mt-24 text-base font-semibold">
          {parseInline(text)}
        </h4>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      const text = line.slice(4).trim();
      elements.push(
        <h3 key={`h3-${elements.length}`} id={slugify(text)} className="mb-2 mt-8 scroll-mt-24 text-lg font-semibold">
          {parseInline(text)}
        </h3>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      const text = line.slice(3).trim();
      elements.push(
        <h2 key={`h2-${elements.length}`} id={slugify(text)} className="mb-3 mt-8 scroll-mt-24 text-xl font-semibold">
          {parseInline(text)}
        </h2>
      );
      continue;
    }

    // blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={`bq-${elements.length}`} className="mb-4 border-l-2 border-neutral-300 pl-4 italic text-neutral-700 dark:border-neutral-700 dark:text-neutral-300">
          {parseInline(line.replace(/^>\s*/, ''))}
        </blockquote>
      );
      continue;
    }

    // custom VideoBlock tag: <VideoBlock title="..." summary="..." videoId="..." />
    const vb = line.match(/^<VideoBlock\s+([^>]*)\/>/);
    if (vb) {
      const attrs = vb[1];
      const title = /title=\"([^\"]*)\"/.exec(attrs)?.[1];
      const summary = /summary=\"([^\"]*)\"/.exec(attrs)?.[1];
      const videoId = /videoId=\"([^\"]*)\"/.exec(attrs)?.[1];
      if (!videoEnabled) {
        elements.push(
          <div key={`vb-${elements.length}`} className="my-4 rounded border border-neutral-200 p-3 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
            <div className="font-medium">{title ?? 'Video'}</div>
            <div>Safe Mode is enabled — video disabled.</div>
          </div>
        );
      } else {
        // lazy import to avoid circular dep
        const VideoBlock = require('./VideoBlock').default as React.ComponentType<{
          title?: string;
          summary?: string;
          videoId?: string;
        }>;
        elements.push(<VideoBlock key={`vb-${elements.length}`} title={title} summary={summary} videoId={videoId} />);
      }
      continue;
    }

    if (line.trim() === '') {
      elements.push(<div key={`sp-${elements.length}`} className="h-1" />);
      continue;
    }

    elements.push(
      <p key={`p-${elements.length}`} className="mb-3">
        {parseInline(line)}
      </p>
    );
  }

  // flush any pending blocks
  flushList();
  flushCode();

  return <div>{elements}</div>;
}
