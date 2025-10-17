export function diagnoseCogs() {
  const el = document.querySelector('.product-cogs-v2 .gear-img-v2') as HTMLElement | null;
  if (!el) { console.warn('No gear found'); return; }
  const badProps = ['filter','mixBlendMode','opacity','clipPath','maskImage','webkitMaskImage','overflow','background','borderRadius'];
  let i = 0, node: any = el;
  // Walk up 10 ancestors and print suspicious computed styles
  while (node && i < 10) {
    const cs = getComputedStyle(node);
    const report = badProps.reduce((acc,p)=>{ acc[p]= (cs as any)[p]; return acc; }, {} as any);
    // eslint-disable-next-line no-console
    console.log(i===0?'[GEAR IMG]':'[ANCESTOR '+i+']', node, report);
    node = node.parentElement; i++;
  }
}
