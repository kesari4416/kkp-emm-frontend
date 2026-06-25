import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const { items, removeCartItem, updateCartItem, subtotal } = useCart();
  const nav = useNavigate();
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;

  if (items.length === 0) {
    return (
      <div data-testid="cart-page" className="max-w-[1480px] mx-auto px-4 md:px-8 py-24 text-center">
        <div className="eyebrow text-[var(--text-mute)]">Your bag</div>
        <h1 className="font-display font-black text-4xl mt-3">Bag is empty</h1>
        <p className="text-[var(--text-mute)] mt-3">Start shopping to fill it with something incredible.</p>
        <Link to="/shop" className="inline-block mt-8 bg-black text-white px-8 py-4 eyebrow hover:bg-[var(--accent)] transition-colors">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="cart-page" className="max-w-[1480px] mx-auto px-4 md:px-8 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 md:gap-10">
      <div>
        <div className="eyebrow text-[var(--text-mute)]">Your bag</div>
        <h1 className="font-display font-black text-2xl md:text-4xl mt-2 mb-5 md:mb-8">{items.length} {items.length === 1 ? "item" : "items"}</h1>

        <div className="divide-y hairline border-t border-b hairline">
          {items.map((it) => (
            <div key={it.cart_item_id} data-testid={`cart-item-${it.cart_item_id}`} className="py-4 md:py-6 flex gap-3 md:gap-4">
              <Link to={`/product/${it.product_id}`} className="w-20 md:w-28 aspect-[3/4] flex-shrink-0 bg-[var(--bg-admin)]">
                <img src={it.product?.images?.[0]} alt={it.product?.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="eyebrow text-[var(--text-mute)] truncate">{it.product?.brand}</div>
                <Link to={`/product/${it.product_id}`} className="text-sm font-medium hover:text-[var(--accent)] line-clamp-2">
                  {it.product?.name}
                </Link>
                <div className="text-xs text-[var(--text-mute)] mt-1">
                  {it.size && `Size: ${it.size}`} {it.color && `· ${it.color}`}
                </div>
                <div className="mt-auto pt-2 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center border hairline">
                    <button
                      data-testid={`qty-minus-${it.cart_item_id}`}
                      onClick={() => it.quantity > 1 && updateCartItem(it.cart_item_id, { product_id: it.product_id, size: it.size, color: it.color, quantity: it.quantity - 1 })}
                      className="px-2 py-1 hover:bg-[var(--brand-blue)] hover:text-white"
                    ><Minus size={14} /></button>
                    <span className="px-3 text-sm font-mono" data-testid={`qty-${it.cart_item_id}`}>{it.quantity}</span>
                    <button
                      data-testid={`qty-plus-${it.cart_item_id}`}
                      onClick={() => updateCartItem(it.cart_item_id, { product_id: it.product_id, size: it.size, color: it.color, quantity: it.quantity + 1 })}
                      className="px-2 py-1 hover:bg-[var(--brand-blue)] hover:text-white"
                    ><Plus size={14} /></button>
                  </div>
                  <div className="font-display font-bold">{formatPrice((it.product?.final_price || 0) * it.quantity)}</div>
                </div>
              </div>
              <button
                data-testid={`remove-${it.cart_item_id}`}
                onClick={() => removeCartItem(it.cart_item_id)}
                className="self-start p-2 hover:text-[var(--accent)]"
              ><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <aside className="fk-card rounded p-4 md:p-6 h-fit lg:sticky lg:top-24">
        <div className="eyebrow mb-3 md:mb-4">Order summary</div>
        <div className="space-y-2.5 md:space-y-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
          <div className="border-t hairline pt-3 mt-3 flex justify-between font-display font-bold text-base md:text-lg">
            <span>Total</span><span>{formatPrice(subtotal + shipping)}</span>
          </div>
        </div>
        <Button
          data-testid="checkout-btn"
          onClick={() => nav("/checkout")}
          className="w-full mt-5 md:mt-6 btn-buy rounded-sm py-5 md:py-6 eyebrow"
        >
          Proceed to checkout
        </Button>
        <div className="text-xs text-[var(--text-mute)] mt-3">
          Free shipping on orders over ₹999.
        </div>
      </aside>
    </div>
  );
}
