import { PositionGrid } from './PositionGrid';

export function PositionsIndex() {
  return (
    <section className="page">
      <header className="page__header">
        <h1>Positions</h1>
        <p className="lede">
          Pick a position to see where you play, your job when we have the ball and when they have it, and how the
          left, centre and right differ. The grid is laid out like the pitch, with our attack going up.
        </p>
      </header>
      <PositionGrid />
      <aside className="note">
        <strong>Names vary between clubs.</strong> Many AU/NZ clubs still use the older names, such as “halves” for
        the wide defenders and “fullbacks” for the centre backs. Each page lists the other names under the title.
      </aside>
    </section>
  );
}
