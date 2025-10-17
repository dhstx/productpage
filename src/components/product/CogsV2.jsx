export default function CogsV2() {
  const commonImgProps = {
    className: "gear-img-v2",
    src: "/assets/gear-modern.png",
    srcSet:
      "/assets/gear-modern.png 1x, /assets/gear-modern@2x.png 2x, /assets/gear-modern@3x.png 3x",
    alt: "",
    decoding: "async",
    loading: "lazy",
    onError: (e) => {
      const img = e.currentTarget;
      if (img && !img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = "true";
        img.src = "/assets/gear-modern.svg";
        img.removeAttribute("srcset");
      }
    },
  };

  return (
    <div className="product-cogs-v2" data-cogs="v2" aria-hidden="true">
      <div className="gear-row-v2">
        <div className="gear-item-v2 gear-sm" data-size="sm">
          <img {...commonImgProps} />
        </div>
        <div className="gear-item-v2 gear-md" data-size="md">
          <img {...commonImgProps} />
        </div>
        <div className="gear-item-v2 gear-lg" data-size="lg">
          <img {...commonImgProps} />
        </div>
      </div>
    </div>
  );
}
