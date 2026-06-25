import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function RelatedProducts({ productId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!productId) return;
    api.get(`/products/${productId}/related`, { params: { limit: 12 } }).then(({ data }) => setItems(data));
  }, [productId]);

  if (items.length === 0) return null;

  return (
    <section data-testid="related-products" className="border-t hairline pt-10 mt-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="eyebrow text-[var(--text-mute)]">You may also like</div>
          <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight mt-1">
            More pieces in this story
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {items.slice(0, 12).map((p, i) => (
          <ProductCard key={p.product_id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
