import { Link } from "react-router-dom";

/** Circular category quicklinks row (Tata CLiQ-style "Shop Drop"). */
export default function CategoryQuicklinks({ items = [] }) {
  if (items.length === 0) return null;
  return (
    <section className="max-w-[1480px] mx-auto px-4 md:px-8 py-8 md:py-10">
      <div className="mb-5">
        <div className="eyebrow text-[var(--text-mute)]">Shop the drop</div>
        <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight mt-1">
          Trending categories
        </h2>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 md:gap-5">
        {items.map((c) => (
          <Link
            key={c.key}
            to={c.to}
            data-testid={`quicklink-${c.key}`}
            className="group flex flex-col items-center text-center"
          >
            <div className="relative aspect-square w-full rounded-full overflow-hidden bg-[var(--bg)] ring-2 ring-transparent group-hover:ring-[var(--brand-pink)] transition-all">
              <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="mt-2 text-xs md:text-sm font-semibold group-hover:text-[var(--brand-pink)] transition-colors">{c.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
