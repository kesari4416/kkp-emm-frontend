import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, formatPrice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Heart, Star, Truck, ShieldCheck, RotateCw, ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";
import Reviews from "@/components/Reviews";
import RelatedProducts from "@/components/RelatedProducts";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart, addToWishlist, wishlist } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    setProduct(null);
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
      setSize(data.sizes?.[0] || null);
      setColor(data.colors?.[0] || null);
    });
  }, [id]);

  if (!product) return <div className="p-12 text-center font-mono text-sm">Loading…</div>;
  const isWished = wishlist.some((w) => w.product_id === product.product_id);

  const onAdd = async () => {
    if (!user) {
      toast.error("Please log in to add to bag");
      nav("/login");
      return;
    }
    if (product.sizes?.length > 0 && !size) {
      toast.error("Please select a size");
      return;
    }
    await addToCart(product.product_id, size, color, 1);
    toast.success("Added to bag");
  };

  return (
    <>
      <div data-testid="product-detail-page" className="max-w-[1480px] mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image gallery */}
      <div>
        <div className="aspect-[3/4] bg-[var(--bg-admin)] overflow-hidden border hairline">
          <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
        </div>
        {product.images?.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-20 aspect-square border ${i === activeImg ? "border-black" : "border-[var(--border)]"}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <div className="eyebrow text-[var(--text-mute)]">{product.brand}</div>
        <h1 className="font-display font-black tracking-tighter text-3xl sm:text-4xl mt-2">
          {product.name}
        </h1>

        <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 border hairline-dark text-xs">
          <Star size={12} fill="currentColor" /> {product.rating} • {product.rating_count} reviews
        </div>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="font-display font-bold text-3xl">{formatPrice(product.final_price)}</span>
          {product.discount_percent > 0 && (
            <>
              <span className="text-[var(--text-mute)] line-through">{formatPrice(product.price)}</span>
              <span className="text-[var(--accent)] font-semibold">{product.discount_percent}% OFF</span>
            </>
          )}
        </div>
        <div className="text-xs text-[var(--text-mute)] mt-1">Inclusive of all taxes</div>

        <div className="mt-8">
          <div className="eyebrow mb-3">Color</div>
          <div className="flex flex-wrap gap-2">
            {product.colors?.map((c) => (
              <button
                key={c}
                data-testid={`color-${c}`}
                onClick={() => setColor(c)}
                className={`px-4 py-2 border text-sm rounded transition-colors ${color === c ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white" : "border-[var(--border)] hover:border-[var(--brand-blue)]"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="eyebrow mb-3 flex items-center justify-between">
            <span>Size</span>
            <button className="text-[var(--brand-blue)] hover:underline">Size guide</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes?.map((s) => (
              <button
                key={s}
                data-testid={`size-${s}`}
                onClick={() => setSize(s)}
                className={`min-w-[3rem] px-3 py-2 border text-sm rounded transition-colors ${size === s ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white" : "border-[var(--border)] hover:border-[var(--brand-blue)]"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            data-testid="add-to-cart-btn"
            onClick={onAdd}
            className="btn-cart rounded-sm py-6 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} /> Add to Cart
          </Button>
          <Button
            data-testid="buy-now-btn"
            onClick={async () => { await onAdd(); if (user) nav("/checkout"); }}
            className="btn-buy rounded-sm py-6 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Zap size={18} /> Buy Now
          </Button>
          <Button
            data-testid="add-to-wishlist-btn"
            variant="outline"
            onClick={async () => {
              if (!user) { nav("/login"); return; }
              await addToWishlist(product.product_id);
              toast.success("Saved to wishlist");
            }}
            className={`rounded-sm border py-5 px-6 sm:col-span-2 ${isWished ? "text-[var(--brand-orange)] border-[var(--brand-orange)]" : "border-[var(--border-dark)]"} hover:bg-[var(--bg)]`}
          >
            <Heart size={18} className="mr-2" fill={isWished ? "currentColor" : "none"} /> {isWished ? "Saved" : "Save to Wishlist"}
          </Button>
        </div>

        <div className="mt-8 border-t hairline pt-6 space-y-3 text-sm">
          <div className="flex items-center gap-3"><Truck size={16} className="text-[var(--brand-blue)]" /> Free shipping on orders over ₹999</div>
          <div className="flex items-center gap-3"><RotateCw size={16} className="text-[var(--brand-blue)]" /> 30-day easy returns</div>
          <div className="flex items-center gap-3"><ShieldCheck size={16} className="text-[var(--brand-blue)]" /> 100% authentic products</div>
        </div>

        <div className="mt-8 border-t hairline pt-6">
          <div className="eyebrow mb-3">Product details</div>
          <p className="text-sm leading-relaxed text-[var(--text-mute)]">{product.description}</p>
        </div>
      </div>
    </div>
    <div className="max-w-[1480px] mx-auto px-4 md:px-8 pb-16">
      <RelatedProducts productId={product.product_id} />
      <Reviews productId={product.product_id} />
    </div>
    </>
  );
}
