import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Sparkles, Tag } from "lucide-react";
import Marquee from "@/components/Marquee";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/offers").then(({ data }) => setOffers(data));
    api.get("/products", { params: { limit: 60 } }).then(({ data }) =>
      setProducts(data.filter((p) => p.discount_percent > 0)),
    );
  }, []);

  return (
    <div data-testid="offers-page">
      <section className="border-b hairline-dark bg-black text-white">
        <div className="max-w-[1480px] mx-auto px-4 md:px-8 py-16">
          <div className="eyebrow text-white/60">All offers</div>
          <h1 className="font-display font-black text-5xl md:text-7xl tracking-tighter mt-2 flex items-center gap-4">
            SALE <Sparkles className="text-[var(--accent)]" size={36} />
          </h1>
          <p className="mt-4 text-white/70 max-w-lg">Active discount drops across the store. Stack them with your favourites.</p>
        </div>
      </section>

      <Marquee />

      <section className="max-w-[1480px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)]">
          {offers.map((o) => (
            <div key={o.offer_id} className="bg-white p-6 border-l-4 border-[var(--accent)]">
              <div className="flex items-start justify-between">
                <Tag size={20} />
                <span className="font-display font-black text-3xl text-[var(--accent)]">{o.discount_percent}%</span>
              </div>
              <div className="mt-4 font-display font-bold text-lg">{o.name}</div>
              <div className="mt-2 text-xs eyebrow text-[var(--text-mute)]">
                Scope: {o.scope.toUpperCase()} {o.valid_until && `• Until ${new Date(o.valid_until).toLocaleDateString()}`}
              </div>
              <Link to="/shop" className="mt-6 inline-block text-sm font-semibold underline-offset-4 hover:underline">
                Shop with this offer →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1480px] mx-auto px-4 md:px-8 py-12">
        <h2 className="font-display font-black text-3xl mb-6">Discounted styles</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[var(--border)]">
          {products.map((p, i) => <ProductCard key={p.product_id} product={p} index={i} />)}
        </div>
      </section>
    </div>
  );
}
