import { Link } from "react-router-dom";

/** Tata CLiQ-style horizontal section with title + grid/scroll of branded tiles. */
export default function ThemedSection({ eyebrow, title, items = [], cols = 6, link = null }) {
  if (items.length === 0) return null;
  return (
    <section className="max-w-[1480px] mx-auto px-4 md:px-8 py-8 md:py-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          {eyebrow && <div className="eyebrow text-[var(--text-mute)]">{eyebrow}</div>}
          <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight mt-1">{title}</h2>
        </div>
        {link && (
          <Link to={link} className="text-xs md:text-sm font-semibold text-[var(--brand-pink)] hover:underline">
            View All →
          </Link>
        )}
      </div>
      <div
        className={`grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-${Math.min(cols, 4)} lg:grid-cols-${cols}`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {items.map((it) => (
          <Link
            key={it.key}
            to={it.to}
            data-testid={`themed-tile-${it.key}`}
            className="group block bg-white rounded fk-card overflow-hidden"
          >
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
            <div className="px-2.5 py-3 text-center">
              <div className="text-sm font-semibold line-clamp-1">{it.title}</div>
              {it.subtitle && (
                <div className="text-xs text-[var(--brand-pink)] font-bold mt-1 uppercase tracking-wider">
                  {it.subtitle}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
