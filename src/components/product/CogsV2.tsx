export default function CogsV2() {
  return (
    <section className="product-cogs-v2" data-cogs="v2" aria-hidden="true">
      <div className="gear-row-v2">
        <figure className="gear-item-v2 gear-sm" data-size="sm">
          <img
            className="gear-img-v2"
            src="/assets/gear-modern.png"
            srcSet="/assets/gear-modern.png 1x, /assets/gear-modern@2x.png 2x, /assets/gear-modern@3x.png 3x"
            alt=""
            decoding="async"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (!(img as any).dataset?.fallbackApplied) {
                (img as any).dataset = { ...(img as any).dataset, fallbackApplied: 'true' } as DOMStringMap;
                img.src = '/assets/gear-modern.svg';
                img.removeAttribute('srcset');
              }
            }}
          />
        </figure>
        <figure className="gear-item-v2 gear-md" data-size="md">
          <img
            className="gear-img-v2"
            src="/assets/gear-modern.png"
            srcSet="/assets/gear-modern.png 1x, /assets/gear-modern@2x.png 2x, /assets/gear-modern@3x.png 3x"
            alt=""
            decoding="async"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (!(img as any).dataset?.fallbackApplied) {
                (img as any).dataset = { ...(img as any).dataset, fallbackApplied: 'true' } as DOMStringMap;
                img.src = '/assets/gear-modern.svg';
                img.removeAttribute('srcset');
              }
            }}
          />
        </figure>
        <figure className="gear-item-v2 gear-lg" data-size="lg">
          <img
            className="gear-img-v2"
            src="/assets/gear-modern.png"
            srcSet="/assets/gear-modern.png 1x, /assets/gear-modern@2x.png 2x, /assets/gear-modern@3x.png 3x"
            alt=""
            decoding="async"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (!(img as any).dataset?.fallbackApplied) {
                (img as any).dataset = { ...(img as any).dataset, fallbackApplied: 'true' } as DOMStringMap;
                img.src = '/assets/gear-modern.svg';
                img.removeAttribute('srcset');
              }
            }}
          />
        </figure>
      </div>
    </section>
  );
}
