import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { api, formatPrice } from "@/lib/api";

export default function SearchAutosuggest() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState({ products: [], brands: [] });
  const [highlight, setHighlight] = useState(-1);
  const timer = useRef(null);
  const wrap = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    if (!q.trim()) {
      setResults({ products: [], brands: [] });
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      api.get("/search/suggest", { params: { q: q.trim() } }).then(({ data }) => {
        setResults(data);
        setHighlight(-1);
      });
    }, 180);
  }, [q]);

  useEffect(() => {
    const onClick = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submit = (e) => {
    e?.preventDefault();
    if (highlight >= 0 && results.products[highlight]) {
      nav(`/product/${results.products[highlight].product_id}`);
    } else if (q.trim()) {
      nav(`/shop?search=${encodeURIComponent(q.trim())}`);
    }
    setOpen(false);
  };

  const onKey = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.products.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hasResults = results.products.length > 0 || results.brands.length > 0;

  return (
    <div ref={wrap} className="relative flex-1 max-w-2xl">
      <form onSubmit={submit} className="flex w-full items-center bg-white rounded">
        <Search size={16} className="mx-3 text-[var(--brand-blue)]" />
        <input
          data-testid="search-input"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search for products, brands and more"
          className="w-full bg-transparent text-sm py-2 outline-none text-[var(--text)] placeholder:text-[var(--text-mute)]"
        />
        {q && (
          <button type="button" onClick={() => { setQ(""); setResults({ products: [], brands: [] }); }} className="px-2 text-[var(--text-mute)] hover:text-[var(--text)]" aria-label="Clear">
            <X size={14} />
          </button>
        )}
        <button data-testid="search-submit" type="submit" className="eyebrow px-4 py-2 bg-[var(--brand-yellow)] text-[var(--text)] hover:bg-[#FFD400] transition-colors rounded-r">GO</button>
      </form>

      {open && q.trim() && hasResults && (
        <div data-testid="search-suggest-dropdown" className="absolute top-full left-0 right-0 mt-1 bg-white border hairline shadow-xl z-[60] max-h-[70vh] overflow-auto text-[var(--text)]">
          {results.brands.length > 0 && (
            <div className="p-3 border-b hairline">
              <div className="eyebrow text-[var(--text-mute)] mb-2">Brands</div>
              <div className="flex flex-wrap gap-2">
                {results.brands.map((b) => (
                  <Link
                    key={b}
                    onClick={() => setOpen(false)}
                    to={`/shop?brands=${encodeURIComponent(b)}`}
                    data-testid={`suggest-brand-${b}`}
                    className="px-3 py-1 text-xs border border-[var(--brand-blue)] text-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-white rounded transition-colors"
                  >{b}</Link>
                ))}
              </div>
            </div>
          )}
          {results.products.length > 0 && (
            <div className="p-1">
              <div className="eyebrow text-[var(--text-mute)] px-2 py-2">Products</div>
              {results.products.map((p, i) => (
                <Link
                  key={p.product_id}
                  to={`/product/${p.product_id}`}
                  onClick={() => setOpen(false)}
                  data-testid={`suggest-product-${p.product_id}`}
                  className={`flex items-center gap-3 px-2 py-2 transition-colors ${i === highlight ? "bg-[var(--bg)]" : "hover:bg-[var(--bg)]"}`}
                  onMouseEnter={() => setHighlight(i)}
                >
                  <div className="w-12 aspect-[3/4] bg-[var(--bg)] flex-shrink-0">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-[var(--text-mute)] uppercase font-semibold">{p.brand}</div>
                    <div className="text-sm font-medium truncate">{p.name}</div>
                  </div>
                  <div className="font-display font-bold text-sm">{formatPrice(p.price)}</div>
                </Link>
              ))}
            </div>
          )}
          <button
            data-testid="suggest-see-all"
            onClick={submit}
            className="w-full eyebrow px-4 py-3 border-t hairline text-left text-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-white transition-colors"
          >See all results for "{q}" →</button>
        </div>
      )}
    </div>
  );
}
