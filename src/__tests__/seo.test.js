/* @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { setPageMeta } from '../lib/seo';

describe('SEO utilities', () => {
  it('sets title and description meta', () => {
    const head = global.document.head;
    setPageMeta('Test Title', 'Test Description');
    expect(global.document.title).toBe('Test Title');
    const meta = head.querySelector('meta[name="description"]');
    expect(meta).toBeTruthy();
    expect(meta.getAttribute('content')).toBe('Test Description');
  });
});
