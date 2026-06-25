import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import CategoryQuicklinks from "@/components/CategoryQuicklinks";
import ThemedSection from "@/components/ThemedSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";

const GENDER_HERO = {
  women: {
    title: "Her wardrobe, her story.",
    sub: "Sarees, dresses, kanjeevaram silks, and the modern essentials.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2000&q=80",
  },
  men: {
    title: "The Men's Edit.",
    sub: "Workwear, denim, mundus, kurta sets — sharply tailored.",
    image: "https://images.unsplash.com/photo-1505632958218-4f23394784a6?auto=format&fit=crop&w=2000&q=80",
  },
  kids: {
    title: "Tiny, big energy.",
    sub: "Soft, bright, indestructible — playtime to party time.",
    image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=2000&q=80",
  },
  unisex: {
    title: "Genderless essentials.",
    sub: "Bags, jewellery, accessories — for everyone.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=2000&q=80",
  },
};

const CATEGORY_FALLBACK_IMAGE = {
  "women-dresses": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
  "women-tops": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
  "women-heels": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
  "men-tshirts": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
  "men-jeans": "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
  "men-sneakers": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  "kids-tshirts": "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=80",
  "kids-sneakers": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80",
  "bags": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
  "sarees": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
  "kanjeevaram": "https://images.unsplash.com/photo-1619516388835-2b60acc4049e?auto=format&fit=crop&w=600&q=80",
  "lehengas": "https://images.unsplash.com/photo-1600685890506-593fdf55949b?auto=format&fit=crop&w=600&q=80",
  "mundu-dhoti": "https://images.unsplash.com/photo-1641666017842-f94246ef2961?auto=format&fit=crop&w=600&q=80",
  "kurta-sets": "https://images.unsplash.com/photo-1723155781081-a9a6f34e3fe0?auto=format&fit=crop&w=600&q=80",
  "ethnic-jewellery": "https://images.unsplash.com/photo-1574397188309-e83dfe918ecb?auto=format&fit=crop&w=600&q=80",
};

function FacetChips({ label, options, selected, onToggle, testidPrefix }) {
  if (!options || options.length === 0) return null;
  return (
    <div>
      <div className="eyebrow mb-3">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.includes(o);
          return (
            <button
              key={o}
              data-testid={`${testidPrefix}-${o}`}
              onClick={() => onToggle(o)}
              className={`px-3 py-1 text-xs border transition-colors ${active ? "bg-black text-white border-black" : "border-[var(--border)] hover:border-black"}`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const splitParam = (v) => (v ? v.split(",").filter(Boolean) : []);

export default function ShopPage() {
  const [sp, setSp] = useSearchParams();
  const gender = sp.get("gender") || "";
  const search = sp.get("search") || "";
  const sort = sp.get("sort") || "newest";
  const featured = sp.get("featured") === "true";
  const categoryId = sp.get("category_id") || "";
  const categoryType = sp.get("category_type") || "";
  const brands = splitParam(sp.get("brands"));
  const sizes = splitParam(sp.get("sizes"));
  const colors = splitParam(sp.get("colors"));

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [facets, setFacets] = useState({ brands: [], sizes: [], colors: [] });
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [draftPrice, setDraftPrice] = useState([0, 20000]);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    const params = {};
    if (gender) params.gender = gender;
    if (categoryId) params.category_id = categoryId;
    if (categoryType) params.category_type = categoryType;
    api.get("/product-facets", { params }).then(({ data }) => setFacets(data));
  }, [gender, categoryId, categoryType]);

  useEffect(() => {
    const params = {};
    if (gender) params.gender = gender;
    if (categoryId) params.category_id = categoryId;
    if (categoryType) params.category_type = categoryType;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    if (featured) params.featured = true;
    if (priceRange[0] > 0) params.min_price = priceRange[0];
    if (priceRange[1] < 20000) params.max_price = priceRange[1];
    if (brands.length) params.brands = brands.join(",");
    if (sizes.length) params.sizes = sizes.join(",");
    if (colors.length) params.colors = colors.join(",");
    api.get("/products", { params }).then(({ data }) => setProducts(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, categoryId, categoryType, search, sort, featured, priceRange, sp]);

  const visibleCategories = useMemo(() => {
    if (categoryType) return categories.filter((c) => c.type === categoryType);
    if (!gender) return categories;
    return categories.filter((c) => c.gender === gender);
  }, [gender, categoryType, categories]);

  const setParam = (k, v) => {
    const next = new URLSearchParams(sp);
    if (v == null || v === "" || (Array.isArray(v) && v.length === 0)) next.delete(k);
    else next.set(k, Array.isArray(v) ? v.join(",") : v);
    setSp(next, { replace: true });
  };

  const toggle = (k, current, value) => {
    const next = current.includes(value) ? current.filter((x) => x !== value) : [...current, value];
    setParam(k, next);
  };

  // Show the category-landing block only on a clean gender browse
  // (no search, no category, no filters, no featured) so users have somewhere to start.
  const showLanding = Boolean(
    gender &&
      !search &&
      !categoryId &&
      brands.length === 0 &&
      sizes.length === 0 &&
      colors.length === 0 &&
      !featured,
  );

  // Build sub-category quicklinks for the current gender
  const quicklinks = useMemo(() => {
    if (!showLanding) return [];
    return visibleCategories.slice(0, 8).map((c) => ({
      key: c.slug,
      title: c.name,
      to: `/shop?gender=${gender}&category_id=${c.category_id}`,
      image: CATEGORY_FALLBACK_IMAGE[c.slug] || GENDER_HERO[gender]?.image,
    }));
  }, [showLanding, visibleCategories, gender]);

  // Brand spotlight derived from current gender's products
  const brandTiles = useMemo(() => {
    if (!showLanding) return [];
    const map = new Map();
    products.forEach((p) => {
      const cur = map.get(p.brand);
      if (!cur || (p.discount_percent || 0) > cur.discount) {
        map.set(p.brand, {
          brand: p.brand,
          discount: p.discount_percent || 0,
          image: p.images?.[0],
        });
      }
    });
    return Array.from(map.values()).slice(0, 6).map((b) => ({
      key: `brand-${b.brand}`,
      title: b.brand,
      subtitle: b.discount > 0 ? `Up to ${Math.round(b.discount)}% Off` : "Shop Now",
      image: b.image,
      to: `/shop?gender=${gender}&brands=${encodeURIComponent(b.brand)}`,
    }));
  }, [showLanding, products, gender]);

  const hero = GENDER_HERO[gender];

  return (
    <div data-testid="shop-page" className="bg-[var(--bg)]">
      {/* Landing hero — only when browsing a clean gender (no specific filters) */}
      {showLanding && hero && (
        <section className="relative bg-black text-white border-b hairline" data-testid="gender-landing-hero">
          <div className="relative aspect-[1440/360] min-h-[220px] max-h-[420px] overflow-hidden">
            <img src={hero.image} alt={gender} className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="relative max-w-[1480px] mx-auto px-4 md:px-8 h-full flex flex-col justify-center">
              <div className="text-[10px] md:text-xs tracking-[0.3em] font-bold uppercase opacity-90">Shop {gender}</div>
              <h1 className="font-display font-black tracking-tighter text-3xl md:text-5xl lg:text-6xl mt-2 max-w-2xl leading-[1.05]">
                {hero.title}
              </h1>
              <p className="mt-3 text-white/85 max-w-lg text-sm md:text-base">{hero.sub}</p>
            </div>
          </div>
        </section>
      )}

      {/* Category quicklinks for this gender */}
      {showLanding && quicklinks.length > 0 && (
        <CategoryQuicklinks items={quicklinks} />
      )}

      {/* Brand spotlight for this gender */}
      {showLanding && brandTiles.length > 0 && (
        <ThemedSection
          eyebrow="Top brands"
          title={`Brands in ${gender}`}
          items={brandTiles}
          cols={6}
          link={`/shop?gender=${gender}`}
        />
      )}

      <div className="max-w-[1480px] mx-auto px-4 md:px-8 py-10">
        <div className="flex items-end justify-between border-b hairline pb-6 mb-8">
          <div>
            <div className="eyebrow text-[var(--text-mute)]">{showLanding ? `All ${gender}` : "Catalogue"}</div>
            <h2 className="font-display font-black tracking-tight text-3xl sm:text-4xl mt-2">
              {search ? `“${search}”` : categoryType ? categoryType.toUpperCase() : gender ? gender.toUpperCase() : "ALL"}
            </h2>
            <div className="mt-2 text-sm text-[var(--text-mute)]">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Select value={sort} onValueChange={(v) => setParam("sort", v)}>
              <SelectTrigger data-testid="sort-select" className="w-44 rounded-sm border-[var(--border-dark)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-sm">
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="price_asc">Price — low to high</SelectItem>
                <SelectItem value="price_desc">Price — high to low</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-8">
          <div>
            <div className="eyebrow mb-3 flex items-center gap-2"><Filter size={12} /> Gender</div>
            <div className="space-y-2 text-sm">
              {["", "men", "women", "kids", "unisex"].map((g) => (
                <button
                  key={g || "all"}
                  data-testid={`filter-gender-${g || "all"}`}
                  onClick={() => setParam("gender", g)}
                  className={`block w-full text-left py-1 transition-colors ${
                    gender === g ? "text-[var(--accent)] font-semibold" : "hover:text-[var(--accent)]"
                  }`}
                >
                  {g ? g.toUpperCase() : "ALL"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="eyebrow mb-3">Category</div>
            <div className="space-y-2 text-sm max-h-72 overflow-auto no-scrollbar">
              <button
                onClick={() => setParam("category_id", "")}
                className={`block w-full text-left py-1 ${!categoryId ? "text-[var(--accent)] font-semibold" : "hover:text-[var(--accent)]"}`}
              >
                All categories
              </button>
              {visibleCategories.map((c) => (
                <button
                  key={c.category_id}
                  data-testid={`filter-cat-${c.slug}`}
                  onClick={() => setParam("category_id", c.category_id)}
                  className={`block w-full text-left py-1 ${
                    categoryId === c.category_id ? "text-[var(--accent)] font-semibold" : "hover:text-[var(--accent)]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <FacetChips
            label="Brand"
            options={facets.brands}
            selected={brands}
            onToggle={(v) => toggle("brands", brands, v)}
            testidPrefix="filter-brand"
          />
          <FacetChips
            label="Size"
            options={facets.sizes}
            selected={sizes}
            onToggle={(v) => toggle("sizes", sizes, v)}
            testidPrefix="filter-size"
          />
          <FacetChips
            label="Color"
            options={facets.colors}
            selected={colors}
            onToggle={(v) => toggle("colors", colors, v)}
            testidPrefix="filter-color"
          />

          <div>
            <div className="eyebrow mb-4">Price</div>
            <Slider
              value={draftPrice}
              onValueChange={setDraftPrice}
              onValueCommit={setPriceRange}
              min={0}
              max={20000}
              step={100}
              className="mt-2"
              data-testid="price-slider"
            />
            <div className="mt-3 flex justify-between text-xs text-[var(--text-mute)] font-mono">
              <span>₹{draftPrice[0]}</span>
              <span>₹{draftPrice[1]}</span>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={featured}
              data-testid="filter-featured"
              onCheckedChange={(v) => setParam("featured", v ? "true" : "")}
            />
            Featured only
          </label>

          <Button
            variant="outline"
            onClick={() => {
              setSp(new URLSearchParams(), { replace: true });
              setPriceRange([0, 20000]);
              setDraftPrice([0, 20000]);
            }}
            className="w-full rounded-none border-black hover:bg-black hover:text-white"
            data-testid="clear-filters"
          >
            Clear filters
          </Button>
        </aside>

        <div>
          {products.length === 0 ? (
            <div className="border hairline p-12 text-center font-mono text-sm text-[var(--text-mute)]">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {products.map((p, i) => (
                <ProductCard key={p.product_id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
