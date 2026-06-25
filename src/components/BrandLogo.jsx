/**
 * KKP STORES brand mark.
 * Tata CLiQ-inspired: bold black wordmark with a pink accent on a single character.
 *
 * Variants:
 *  - "default"  : dark wordmark for light backgrounds
 *  - "light"    : white wordmark for dark/blue backgrounds (admin sidebar, dark hero)
 *  - "compact"  : icon-style mark only (no "STORES" subtext)
 */
export default function BrandLogo({ variant = "default", size = "md", showSubtext = true, className = "" }) {
  const isLight = variant === "light";
  const sizes = {
    sm: { k: "text-xl", sub: "text-[8px]", gap: "gap-2" },
    md: { k: "text-2xl", sub: "text-[9px]", gap: "gap-2" },
    lg: { k: "text-4xl", sub: "text-[11px]", gap: "gap-2.5" },
    xl: { k: "text-6xl", sub: "text-[14px]", gap: "gap-3" },
  };
  const s = sizes[size] || sizes.md;
  const baseColor = isLight ? "text-white" : "text-[var(--text)]";
  const accentColor = "text-[var(--brand-pink)]";
  return (
    <span data-testid="brand-logo" className={`inline-flex items-center select-none ${s.gap} ${className}`}>
      <span className={`font-display font-black tracking-tighter ${s.k} ${baseColor} relative leading-none`}>
        kk<span className={accentColor}>p</span>
        <span
          aria-hidden
          className={`absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-[var(--brand-pink)]`}
        />
      </span>
      {showSubtext && variant !== "compact" && (
        <span className={`uppercase font-bold tracking-[0.35em] ${s.sub} ${isLight ? "text-white/85" : "text-[var(--text-mute)]"}`}>
          Stores
        </span>
      )}
    </span>
  );
}
