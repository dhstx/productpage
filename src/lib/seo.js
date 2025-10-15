import { useEffect } from 'react';

export function setPageMeta(title, description) {
  if (typeof document === 'undefined') return;
  if (title) {
    document.title = title;
  }
  if (description) {
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description);
  }
}

export function usePageMeta(title, description) {
  useEffect(() => {
    setPageMeta(title, description);
  }, [title, description]);
}
