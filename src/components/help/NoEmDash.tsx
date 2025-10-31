'use client';

import { useEffect } from 'react';

export default function NoEmDash() {
  useEffect(() => {
    const root = document.querySelector('[data-um]');
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const replacements = (value: string) =>
      value
        .replace(/\s—\s/g, ' → ')
        .replace(/—/g, ' - ');

    const nodes: Text[] = [];
    let current: Node | null;
    while ((current = walker.nextNode())) {
      nodes.push(current as Text);
    }
    nodes.forEach((node) => {
      node.nodeValue = replacements(node.nodeValue || '');
    });
  }, []);

  return null;
}
