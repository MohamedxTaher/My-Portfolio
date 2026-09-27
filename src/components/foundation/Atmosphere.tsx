/**
 * Atmosphere — fixed decorative layers: blueprint grid, cold glow fields,
 * film grain. Pure CSS, aria-hidden, pointer-events none.
 */
export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere-grid" />
      <div className="atmosphere-glow" />
      <div className="atmosphere-noise" />
    </div>
  );
}
