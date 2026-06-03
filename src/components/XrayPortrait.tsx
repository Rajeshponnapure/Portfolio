/**
 * The signature X-RAY hover effect.
 * Base layer = the masked portrait (cap + mask + shades), always visible.
 * Reveal layer = the unmasked face, shown ONLY through a soft circle that
 * tracks the cursor — so moving across the portrait "x-rays" the real face
 * under the pointer. On leave, the lens collapses back to nothing.
 */
export function XrayPortrait() {
  const setVars = (el: HTMLElement, x: number, y: number, r: number) => {
    el.style.setProperty('--xx', `${x}px`);
    el.style.setProperty('--xy', `${y}px`);
    el.style.setProperty('--xr', `${r}px`);
  };

  return (
    <div
      className="xray"
      data-hover
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setVars(e.currentTarget, e.clientX - rect.left, e.clientY - rect.top, 130);
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty('--xr', '0px');
      }}
    >
      <img className="xray-base" src="/portraits/rajesh-masked.png" alt="Rajesh — masked, in cinematic rim light" draggable={false} />
      <img className="xray-reveal" src="/portraits/rajesh-unmasked.png" alt="Rajesh — face revealed" draggable={false} />
      <div className="xray-scan" />
      <div className="xray-lens" />
      <div className="xray-frame" />
      <span className="xray-corner tl" />
      <span className="xray-corner tr" />
      <span className="xray-corner bl" />
      <span className="xray-corner br" />
      <span className="xray-tag mono">X-RAY · move to reveal</span>
    </div>
  );
}
