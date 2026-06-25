export default function Marquee({ text = "MID-SEASON SALE — FLAT 20% OFF EVERYTHING — FREE SHIPPING OVER ₹999 —" }) {
  const items = Array.from({ length: 8 }, () => text);
  return (
    <div className="border-y bg-[var(--brand-yellow)] text-[var(--text)] overflow-hidden" style={{ borderColor: "#E6CE00" }}>
      <div className="marquee-track flex whitespace-nowrap py-2.5">
        {items.map((t, i) => (
          <span key={i} className="font-display font-bold text-sm md:text-base px-6 tracking-tight">{t}</span>
        ))}
        {items.map((t, i) => (
          <span key={`b-${i}`} className="font-display font-bold text-sm md:text-base px-6 tracking-tight">{t}</span>
        ))}
      </div>
    </div>
  );
}
