import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/Marquee";
import ThemedSection from "@/components/ThemedSection";
import CategoryQuicklinks from "@/components/CategoryQuicklinks";

const QUICKLINKS_IMG = {
  "women": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80",
  "men": "https://images.unsplash.com/photo-1624353656309-8be1a6c457be?auto=format&fit=crop&w=400&q=80",
  "kids": "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=400&q=80",
  "ethnic": "https://images.unsplash.com/photo-1727430228383-aa1fb59db8bf?auto=format&fit=crop&w=400&q=80",
  "saree": "https://images.unsplash.com/photo-1570212773364-e30cd076539e?auto=format&fit=crop&w=400&q=80",
  "jewellery": "https://images.unsplash.com/photo-1574397188309-e83dfe918ecb?auto=format&fit=crop&w=400&q=80",
  "footwear": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
  "bags": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80",
};

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    api.get("/banners").then(({ data }) => setBanners(data));
    api.get("/products", { params: { limit: 200 } }).then(({ data }) => setProducts(data));
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  const findCat = (slug) => categories.find((c) => c.slug === slug);
  const catLink = (slug) => {
    const c = findCat(slug);
    return c ? `/shop?category_id=${c.category_id}` : "/shop";
  };

  // Quicklinks — circular tiles
  const quicklinks = useMemo(() => ([
    { key: "women", title: "Women", to: "/shop?gender=women", image: QUICKLINKS_IMG.women },
    { key: "men", title: "Men", to: "/shop?gender=men", image: QUICKLINKS_IMG.men },
    { key: "kids", title: "Kids", to: "/shop?gender=kids", image: QUICKLINKS_IMG.kids },
    { key: "ethnic", title: "Ethnic", to: "/ethnic", image: QUICKLINKS_IMG.ethnic },
    { key: "sarees", title: "Sarees", to: catLink("sarees"), image: QUICKLINKS_IMG.saree },
    { key: "kanjeevaram", title: "Kanjeevaram", to: catLink("kanjeevaram"), image: "https://images.unsplash.com/photo-1619516388835-2b60acc4049e?auto=format&fit=crop&w=400&q=80" },
    { key: "mundu-dhoti", title: "Mundu & Dhoti", to: catLink("mundu-dhoti"), image: "https://images.unsplash.com/photo-1641666017842-f94246ef2961?auto=format&fit=crop&w=400&q=80" },
    { key: "jewellery", title: "Jewellery", to: catLink("ethnic-jewellery"), image: QUICKLINKS_IMG.jewellery },
  ]), [categories]); // eslint-disable-line react-hooks/exhaustive-deps

  // Brand spotlight — derive distinct brands with their best discount from products
  const brandTiles = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const existing = map.get(p.brand);
      if (!existing || (p.discount_percent || 0) > existing.discount) {
        map.set(p.brand, {
          brand: p.brand,
          discount: p.discount_percent || 0,
          image: p.images?.[0],
          gender: p.gender,
        });
      }
    });
    return Array.from(map.values()).slice(0, 12).map((b) => ({
      key: `brand-${b.brand}`,
      title: b.brand,
      subtitle: b.discount > 0 ? `Up to ${Math.round(b.discount)}% Off` : "Shop Now",
      image: b.image,
      to: `/shop?brands=${encodeURIComponent(b.brand)}`,
    }));
  }, [products]);

  // Section helpers — convert products to tile shape
  const productTile = (p, badge) => ({
    key: p.product_id,
    title: p.name,
    subtitle: badge || (p.discount_percent > 0 ? `${Math.round(p.discount_percent)}% Off` : null),
    image: p.images?.[0],
    to: `/product/${p.product_id}`,
  });

  // Themed groups
  const womenEthnic = products.filter((p) => p.gender === "women" && ["sarees", "kanjeevaram", "lehengas"].includes(findCat(undefined)?.slug || (categories.find((c) => c.category_id === p.category_id)?.slug)));
  const menEdit = products.filter((p) => p.gender === "men").slice(0, 6);
  const stepInto = products.filter((p) => {
    const c = categories.find((c) => c.category_id === p.category_id);
    return c?.type === "footwear";
  }).slice(0, 6);
  const tinyBig = products.filter((p) => p.gender === "kids").slice(0, 6);
  const heritageEdit = products.filter((p) => {
    const c = categories.find((c) => c.category_id === p.category_id);
    return ["kanjeevaram", "sarees", "lehengas", "mundu-dhoti", "ethnic-jewellery"].includes(c?.slug);
  }).slice(0, 6);
  const indianwear = products.filter((p) => {
    const c = categories.find((c) => c.category_id === p.category_id);
    return p.gender === "women" && ["sarees", "kanjeevaram", "lehengas"].includes(c?.slug);
  }).slice(0, 6);

  return (
    <div data-testid="home-page" className="bg-[var(--bg)]">
      {/* Hero carousel — Tata CLiQ-style full-bleed */}
      <section className="relative bg-white">
        <div className="max-w-[1480px] mx-auto">
          <div className="relative aspect-[1440/450] min-h-[280px] max-h-[520px] overflow-hidden">
            {banners.map((b, i) => (
              <div
                key={b.banner_id}
                className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
              >
                <Link to={b.link || "/shop"}>
                  <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="px-6 md:px-12 lg:px-20 max-w-2xl text-white">
                      <div className="text-xs md:text-sm tracking-[0.25em] font-bold uppercase opacity-90">{b.subtitle || "New Drop"}</div>
                      <h1 className="font-display font-black tracking-tighter text-3xl md:text-5xl lg:text-6xl mt-3 leading-[1.05]">
                        {b.title}
                      </h1>
                      <div className="mt-6 inline-flex items-center gap-2 bg-white text-[var(--text)] px-6 py-3 rounded-sm font-bold text-sm hover:bg-[var(--brand-pink)] hover:text-white transition-colors">
                        SHOP NOW <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            {/* Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    data-testid={`hero-dot-${i}`}
                    onClick={() => setActive(i)}
                    className={`h-1.5 transition-all ${i === active ? "bg-white w-8" : "bg-white/50 w-4"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Marquee text="MID-SEASON SALE — FLAT 20% OFF EVERYTHING — FREE SHIPPING OVER ₹999 — KKP HERITAGE EDIT —" />

      {/* Quicklinks — circular */}
      <CategoryQuicklinks items={quicklinks} />

      {/* Brand spotlight */}
      <ThemedSection
        eyebrow="Brand spotlight"
        title="Loved brands. Limited drops."
        items={brandTiles}
        cols={6}
        link="/shop"
      />

      {/* Her Indianwear Era */}
      <ThemedSection
        eyebrow="For her"
        title="Her Indianwear Era"
        items={indianwear.map((p) => productTile(p, p.discount_percent > 0 ? `Min ${Math.round(p.discount_percent)}% Off` : "Just In"))}
        cols={6}
        link="/ethnic"
      />

      {/* The Men's Edit */}
      <ThemedSection
        eyebrow="For him"
        title="The Men's Edit"
        items={menEdit.map((p) => productTile(p))}
        cols={6}
        link="/shop?gender=men"
      />

      {/* Step Into Now (footwear) */}
      <ThemedSection
        eyebrow="Step into"
        title="Step Into Now"
        items={stepInto.map((p) => productTile(p))}
        cols={6}
        link="/shop?category_type=footwear"
      />

      {/* Tiny Big Energy (kids) */}
      <ThemedSection
        eyebrow="Mini fits"
        title="Tiny, Big Energy"
        items={tinyBig.map((p) => productTile(p))}
        cols={6}
        link="/shop?gender=kids"
      />

      {/* The Heritage Edit (south Indian) */}
      <ThemedSection
        eyebrow="Made in India"
        title="The Heritage Edit"
        items={heritageEdit.map((p) => productTile(p, p.discount_percent > 0 ? `${Math.round(p.discount_percent)}% Off` : "Hand-Woven"))}
        cols={6}
        link="/ethnic"
      />

      {/* Featured editorial — using ProductCard */}
      {products.length > 0 && (
        <section className="max-w-[1480px] mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="eyebrow text-[var(--text-mute)]">Editor's Picks</div>
              <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight mt-1 flex items-center gap-2">
                Featured pieces <Sparkles size={20} className="text-[var(--brand-pink)]" />
              </h2>
            </div>
            <Link to="/shop?featured=true" className="text-sm font-semibold text-[var(--brand-pink)] hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.filter((p) => p.featured).slice(0, 8).map((p, i) => (
              <ProductCard key={p.product_id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Promises */}
      <section className="bg-white border-y hairline">
        <div className="max-w-[1480px] mx-auto px-4 md:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, label: "Free Shipping", sub: "On orders over ₹999" },
            { icon: RefreshCw, label: "30-day Returns", sub: "Free & easy" },
            { icon: ShieldCheck, label: "Authenticity Guaranteed", sub: "100% real labels" },
            { icon: Sparkles, label: "Heritage Curated", sub: "Sourced from artisans" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={22} className="mt-1 text-[var(--brand-pink)] flex-shrink-0" />
              <div>
                <div className="font-display font-bold text-sm">{label}</div>
                <div className="text-xs text-[var(--text-mute)] mt-1">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
