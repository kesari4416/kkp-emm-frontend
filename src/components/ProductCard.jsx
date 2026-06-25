import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { formatPrice } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function ProductCard({ product, index = 0 }) {
  const { addToWishlist, wishlist } = useCart();
  const { user } = useAuth();
  const isWished = wishlist.some((w) => w.product_id === product.product_id);

  const onWish = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to save items");
      return;
    }
    if (!isWished) {
      await addToWishlist(product.product_id);
      toast.success("Added to wishlist");
    }
  };

  return (
    <Link
      to={`/product/${product.product_id}`}
      data-testid={`product-card-${product.product_id}`}
      className="group block fk-card fadeup"
      style={{ animationDelay: `${index * 35}ms` }}
    >
      <div className="relative aspect-[3/4] bg-[var(--bg)] overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <button
          onClick={onWish}
          data-testid={`wishlist-btn-${product.product_id}`}
          aria-label="Save to wishlist"
          className={`absolute top-2 right-2 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-sm ${
            isWished ? "text-[var(--brand-orange)]" : "text-[var(--text-mute)]"
          } hover:text-[var(--brand-orange)] transition-colors`}
        >
          <Heart size={16} fill={isWished ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-3">
        <div className="text-xs text-[var(--text-mute)] uppercase tracking-wide font-semibold">{product.brand}</div>
        <div className="mt-0.5 text-sm font-medium line-clamp-1 text-[var(--text)]">{product.name}</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-[var(--success)] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
            {product.rating} <Star size={10} fill="currentColor" />
          </span>
          <span className="text-xs text-[var(--text-mute)]">({product.rating_count})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <span className="font-display font-bold text-base text-[var(--text)]">
            {formatPrice(product.final_price)}
          </span>
          {product.discount_percent > 0 && (
            <>
              <span className="text-xs text-[var(--text-mute)] line-through">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs fk-discount">
                {product.discount_percent}% off
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
