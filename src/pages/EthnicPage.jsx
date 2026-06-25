import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/Marquee";

const HERO = {
  img: "https://images.unsplash.com/photo-1570212773364-e30cd076539e?auto=format&fit=crop&w=2000&q=80",
  alt: "Bridal saree",
};

const STORIES = [
  {
    title: "Kanjeevaram Silk",
    sub: "Heirloom looms of Kanchipuram",
    img: "https://images.unsplash.com/photo-1600685890506-593fdf55949b?auto=format&fit=crop&w=1200&q=80",
    slug: "kanjeevaram",
  },
  {
    title: "Kerala Kasavu",
    sub: "Hand-spun cotton with kasavu gold",
    img: "https://images.unsplash.com/photo-1641666017842-f94246ef2961?auto=format&fit=crop&w=1200&q=80",
    slug: "mundu-dhoti",
  },
  {
    title: "Temple Jewellery",
    sub: "Antique-gold motifs from Tanjore",
    img: "https://images.unsplash.com/photo-1574397188309-e83dfe918ecb?auto=format&fit=crop&w=1200&q=80",
    slug: "ethnic-jewellery",
  },
  {
    title: "Block-Printed Kurtas",
    sub: "Hand-blocked cotton",
    img: "https://images.unsplash.com/photo-1727430201245-fb796167e302?auto=format&fit=crop&w=1200&q=80",
    slug: "kurta-sets",
  },
];

export default function EthnicPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories").then(({ data }) => {
      const ethnic = data.filter((c) => ["sarees", "kanjeevaram", "lehengas", "mundu-dhoti", "kurta-sets", "ethnic-jewellery"].includes(c.slug));
      setCategories(ethnic);
      // Fetch products across these categories
      const ids = ethnic.map((c) => c.category_id);
      // Pull all products and filter by ethnic category ids (simpler than N requests)
      api.get("/products", { params: { limit: 200 } }).then(({ data: prods }) => {
        setProducts(prods.filter((p) => ids.includes(p.category_id)));
      });
    });
  }, []);

  return (
    <div data-testid="ethnic-page">
      {/* Hero */}
      <section className="relative border-b hairline-dark bg-black text-white">
        <div className="relative h-[78vh] min-h-[520px]">
          <img src={HERO.img} alt={HERO.alt} className="absolute inset-0 w-full h-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="relative max-w-[1480px] mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-16 md:pb-24">
            <div className="eyebrow text-white/70">A heritage collection</div>
            <h1 className="font-display font-black tracking-tighter text-5xl sm:text-6xl lg:text-8xl mt-3 max-w-4xl leading-[0.92]">
              SOUTH<br/><span className="text-[var(--accent)]">/</span> INDIAN
            </h1>
            <p className="mt-6 text-white/80 max-w-xl text-base md:text-lg leading-relaxed">
              Hand-woven kanjeevarams, Kerala kasavu, temple jewellery and block-printed kurtas — sourced directly from artisan looms across Tamil Nadu, Karnataka, Andhra Pradesh and Kerala.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#collection" data-testid="ethnic-cta-shop" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 eyebrow hover:bg-[var(--accent)] hover:text-white transition-colors">
                Shop the collection <ArrowRight size={16} />
              </a>
              <Link to="/offers" className="inline-flex items-center gap-3 border border-white text-white px-8 py-4 eyebrow hover:bg-white hover:text-black transition-colors">
                Festive offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Marquee text="HAND-WOVEN — DIRECTLY FROM ARTISANS — FREE SHIPPING OVER ₹999 — FESTIVE EDIT —" />

      {/* Stories grid */}
      <section className="max-w-[1480px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="eyebrow text-[var(--text-mute)]">01 — Stories from the South</div>
            <h2 className="font-display font-black tracking-tighter text-3xl sm:text-4xl mt-2 flex items-center gap-3">
              Crafted by hand <Sparkles size={22} className="text-[var(--accent)]" />
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black">
          {STORIES.map((s) => {
            const cat = categories.find((c) => c.slug === s.slug);
            const href = cat ? `/shop?category_id=${cat.category_id}` : "#collection";
            return (
              <Link
                key={s.slug}
                to={href}
                data-testid={`story-${s.slug}`}
                className="relative group bg-black aspect-[3/4] overflow-hidden"
              >
                <img src={s.img} alt={s.title} className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="eyebrow text-white/70">{s.sub}</div>
                  <div className="font-display font-black text-white text-2xl mt-1 leading-tight">{s.title}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Heritage strip — South Indian aesthetic banner */}
      <section className="border-y hairline-dark overflow-hidden">
        <div className="relative h-[420px] md:h-[520px]">
          <img
            src="https://images.unsplash.com/photo-1652961573558-fd8de8cf4e77?auto=format&fit=crop&w=2400&q=80"
            alt="Decorated elephant during a Kerala temple festival"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
          <div className="relative max-w-[1480px] mx-auto px-4 md:px-8 h-full flex flex-col justify-center text-white">
            <div className="eyebrow text-white/70">A culture worth wearing</div>
            <div className="font-display font-black text-4xl md:text-6xl tracking-tighter mt-3 max-w-xl leading-[0.95]">
              From Kanchi looms to your wardrobe.
            </div>
            <div className="mt-4 max-w-lg text-white/80 text-sm md:text-base">
              Every saree, mundu and kurta in this edit is sourced from artisan clusters we work with directly — fair-priced, traceable, and unmistakably South Indian.
            </div>
          </div>
        </div>
      </section>

      {/* Collection grid */}
      <section id="collection" className="max-w-[1480px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="eyebrow text-[var(--text-mute)]">02 — The Collection</div>
            <h2 className="font-display font-black tracking-tighter text-3xl sm:text-4xl mt-2">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </h2>
          </div>
        </div>
        {products.length === 0 ? (
          <div className="border hairline-dark p-12 text-center text-sm text-[var(--text-mute)]">Loading collection…</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[var(--border)]">
            {products.map((p, i) => (
              <ProductCard key={p.product_id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
