import { Link } from "react-router-dom";

/** Tata CLiQ-style horizontal section.
 *  Mobile: horizontal-scroll snap row (so tiles stay legible).
 *  ≥ md: responsive grid (3 → 4 → cols).
 */
export default function ThemedSection({ eyebrow, title, items = [], cols = 6, link = null }) {
  if (items.length === 0) return null;

  // md+ columns: clamp 3..cols. lg+ uses full cols
  const mdCols = Math.min(4, cols);
  const gridStyle = {
    // Use CSS vars per breakpoint via media queries isn't easy inline, so set lg via inline + md via class
  };

  return (
    <section className="max-w-[1480px] mx-auto px-4 md:px-8 py-7 md:py-10">
      <div className="flex items-end justify-between mb-4 md:mb-5">
        <div>
          {eyebrow && <div className="eyebrow text-[var(--text-mute)]">{eyebrow}</div>}
          <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl tracking-tight mt-1">{title}</h2>
        </div>
        {link && (
          <Link to={link} className="text-xs md:text-sm font-semibold text-[var(--brand-pink)] hover:underline whitespace-nowrap">
            View All →
          </Link>
        )}
      </div>

      {/* Mobile: scroll-snap row; ≥md: responsive grid */}
      <div
        className="flex md:hidden gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 pb-1"
        data-testid="themed-section-mobile-row"
      >
        {items.map((it) => (
          <Link
            key={it.key}
            to={it.to}
            data-testid={`themed-tile-${it.key}`}
            className="group block bg-white rounded fk-card overflow-hidden snap-start flex-shrink-0 w-[44%]"
          >
            <TileInner it={it} />
          </Link>
        ))}
      </div>

      <div
        className={`hidden md:grid gap-3 md:gap-4`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {items.map((it) => (
          <Link
            key={it.key}
            to={it.to}
            data-testid={`themed-tile-md-${it.key}`}
            className="group block bg-white rounded fk-card overflow-hidden"
          >
            <TileInner it={it} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function TileInner({ it }) {
  return (
    <>
      <div className="relative aspect-square bg-[var(--bg)] overflow-hidden">
        <img
          src={it.image}
          alt={it.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        {it.badge && (
          <span className="absolute bottom-2 left-2 bg-[var(--brand-pink)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
            {it.badge}
          </span>
        )}
      </div>
      <div className="px-2.5 py-2.5 md:py-3 text-center">
        <div className="text-xs md:text-sm font-semibold line-clamp-1">{it.title}</div>
        {it.subtitle && (
          <div className="text-[10px] md:text-xs text-[var(--brand-pink)] font-bold mt-1 uppercase tracking-wider line-clamp-1">
            {it.subtitle}
          </div>
        )}
      </div>
    </>
  );
}
