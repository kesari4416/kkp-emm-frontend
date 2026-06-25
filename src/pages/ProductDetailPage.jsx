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
      <div data-testid="product-detail-page" className="max-w-[1480px] mx-auto px-4 md:px-8 py-5 md:py-10 pb-24 md:pb-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
      {/* Image gallery */}
      <div>
        <div className="aspect-[3/4] bg-[var(--bg-admin)] overflow-hidden border hairline">
          <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
        </div>
        {product.images?.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-16 md:w-20 aspect-square flex-shrink-0 border ${i === activeImg ? "border-black" : "border-[var(--border)]"}`}
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
        <h1 className="font-display font-black tracking-tighter text-2xl sm:text-3xl md:text-4xl mt-2">
          {product.name}
        </h1>

        <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 border hairline-dark text-xs">
          <Star size={12} fill="currentColor" /> {product.rating} • {product.rating_count} reviews
        </div>

        <div className="mt-5 md:mt-6 flex items-baseline gap-3 flex-wrap">
          <span className="font-display font-bold text-2xl md:text-3xl">{formatPrice(product.final_price)}</span>
          {product.discount_percent > 0 && (
            <>
              <span className="text-[var(--text-mute)] line-through text-sm md:text-base">{formatPrice(product.price)}</span>
              <span className="text-[var(--accent)] font-semibold text-sm md:text-base">{product.discount_percent}% OFF</span>
            </>
          )}
        </div>
        <div className="text-xs text-[var(--text-mute)] mt-1">Inclusive of all taxes</div>

        <div className="mt-6 md:mt-8">
          <div className="eyebrow mb-3">Color</div>
          <div className="flex flex-wrap gap-2">
            {product.colors?.map((c) => (
              <button
                key={c}
                data-testid={`color-${c}`}
                onClick={() => setColor(c)}
                className={`px-3 md:px-4 py-2 border text-xs md:text-sm rounded transition-colors ${color === c ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white" : "border-[var(--border)] hover:border-[var(--brand-blue)]"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 md:mt-6">
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
                className={`min-w-[2.75rem] md:min-w-[3rem] px-3 py-2 border text-xs md:text-sm rounded transition-colors ${size === s ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white" : "border-[var(--border)] hover:border-[var(--brand-blue)]"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 md:mt-8 grid grid-cols-2 gap-2 md:gap-3">
          <Button
            data-testid="add-to-cart-btn"
            onClick={onAdd}
            className="btn-cart rounded-sm py-5 md:py-6 text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} /> <span className="hidden xs:inline">Add to </span>Cart
          </Button>
          <Button
            data-testid="buy-now-btn"
            onClick={async () => { await onAdd(); if (user) nav("/checkout"); }}
            className="btn-buy rounded-sm py-5 md:py-6 text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Zap size={16} /> Buy Now
          </Button>
          <Button
            data-testid="add-to-wishlist-btn"
            variant="outline"
            onClick={async () => {
              if (!user) { nav("/login"); return; }
              await addToWishlist(product.product_id);
              toast.success("Saved to wishlist");
            }}
            className={`rounded-sm border py-4 md:py-5 px-4 md:px-6 col-span-2 text-xs md:text-sm ${isWished ? "text-[var(--brand-orange)] border-[var(--brand-orange)]" : "border-[var(--border-dark)]"} hover:bg-[var(--bg)]`}
          >
            <Heart size={16} className="mr-2" fill={isWished ? "currentColor" : "none"} /> {isWished ? "Saved" : "Save to Wishlist"}
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

    {/* Mobile sticky CTA bar */}
    <div
      data-testid="mobile-sticky-cta"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t hairline shadow-[0_-2px_8px_rgba(0,0,0,0.08)] px-3 py-2.5 flex items-center gap-2"
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex flex-col leading-tight min-w-0 flex-shrink-0 mr-1">
        <span className="font-display font-bold text-base">{formatPrice(product.final_price)}</span>
        {product.discount_percent > 0 && (
          <span className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-wider">
            {product.discount_percent}% off
          </span>
        )}
      </div>
      <Button
        data-testid="mobile-sticky-add-to-cart"
        onClick={onAdd}
        className="btn-cart rounded-sm flex-1 h-11 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1"
      >
        <ShoppingBag size={15} /> Cart
      </Button>
      <Button
        data-testid="mobile-sticky-buy-now"
        onClick={async () => { await onAdd(); if (user) nav("/checkout"); }}
        className="btn-buy rounded-sm flex-1 h-11 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1"
      >
        <Zap size={15} /> Buy Now
      </Button>
    </div>
    </>
  );
}
