import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/api";
import { Heart, X } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  return (
    <div data-testid="wishlist-page" className="max-w-[1480px] mx-auto px-4 md:px-8 py-10">
      <div className="eyebrow text-[var(--text-mute)]">Saved</div>
      <h1 className="font-display font-black text-4xl mt-2 mb-8 flex items-center gap-3">
        Wishlist <Heart size={24} className="text-[var(--accent)]" fill="currentColor" />
      </h1>
      {wishlist.length === 0 ? (
        <div className="border hairline-dark p-12 text-center text-sm text-[var(--text-mute)]">
          Nothing saved yet. <Link to="/shop" className="text-[var(--accent)] underline">Discover pieces</Link>.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[var(--border)]">
          {wishlist.map((w) => (
            <div key={w.wishlist_item_id} className="bg-white relative group">
              <Link to={`/product/${w.product_id}`} className="block aspect-[3/4] bg-[var(--bg-admin)] overflow-hidden">
                <img src={w.product?.images?.[0]} alt={w.product?.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </Link>
              <button
                data-testid={`wishlist-remove-${w.product_id}`}
                onClick={() => removeFromWishlist(w.product_id)}
                className="absolute top-2 right-2 w-8 h-8 bg-white border border-black flex items-center justify-center hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]"
                aria-label="Remove from wishlist"
              ><X size={14} /></button>
              <div className="p-4">
                <div className="eyebrow text-[var(--text-mute)]">{w.product?.brand}</div>
                <Link to={`/product/${w.product_id}`} className="block mt-1 text-sm font-medium line-clamp-1 hover:text-[var(--accent)]">
                  {w.product?.name}
                </Link>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display font-bold">{formatPrice(w.product?.final_price || 0)}</span>
                  {w.product?.discount_percent > 0 && (
                    <span className="text-[var(--accent)] text-xs">{w.product.discount_percent}% off</span>
                  )}
                </div>
                <button
                  data-testid={`move-to-bag-${w.product_id}`}
                  onClick={async () => {
                    await addToCart(w.product_id, w.product?.sizes?.[0], w.product?.colors?.[0], 1);
                  }}
                  className="mt-4 w-full btn-cart py-2 eyebrow rounded-sm"
                >
                  Move to bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
