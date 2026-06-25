import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatApiError, formatPrice } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, subtotal, refresh } = useCart();
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const [form, setForm] = useState({
    full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (items.length === 0 && !submitting) {
    return (
      <div className="max-w-[1480px] mx-auto px-4 md:px-8 py-24 text-center">
        <h1 className="font-display font-black text-4xl">Your bag is empty.</h1>
      </div>
    );
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/checkout", {
        address: form,
        payment_method: "COD",
      });
      await refresh();
      nav(`/order-success/${data.order_id}`);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="checkout-page" className="max-w-[1480px] mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
      <form onSubmit={placeOrder} className="space-y-8">
        <div>
          <div className="eyebrow text-[var(--text-mute)]">Step 1</div>
          <h2 className="font-display font-black text-3xl">Shipping address</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full name" required>
            <Input data-testid="addr-name" required value={form.full_name} onChange={set("full_name")} className="rounded-none border-b border-x-0 border-t-0 border-black bg-transparent focus-visible:ring-0 focus-visible:border-[var(--accent)]" />
          </Field>
          <Field label="Phone" required>
            <Input data-testid="addr-phone" required value={form.phone} onChange={set("phone")} className="rounded-none border-b border-x-0 border-t-0 border-black bg-transparent focus-visible:ring-0 focus-visible:border-[var(--accent)]" />
          </Field>
          <Field label="Address line 1" required full>
            <Input data-testid="addr-line1" required value={form.line1} onChange={set("line1")} className="rounded-none border-b border-x-0 border-t-0 border-black bg-transparent focus-visible:ring-0 focus-visible:border-[var(--accent)]" />
          </Field>
          <Field label="Address line 2" full>
            <Input data-testid="addr-line2" value={form.line2} onChange={set("line2")} className="rounded-none border-b border-x-0 border-t-0 border-black bg-transparent focus-visible:ring-0 focus-visible:border-[var(--accent)]" />
          </Field>
          <Field label="City" required>
            <Input data-testid="addr-city" required value={form.city} onChange={set("city")} className="rounded-none border-b border-x-0 border-t-0 border-black bg-transparent focus-visible:ring-0 focus-visible:border-[var(--accent)]" />
          </Field>
          <Field label="State" required>
            <Input data-testid="addr-state" required value={form.state} onChange={set("state")} className="rounded-none border-b border-x-0 border-t-0 border-black bg-transparent focus-visible:ring-0 focus-visible:border-[var(--accent)]" />
          </Field>
          <Field label="PIN code" required>
            <Input data-testid="addr-pin" required value={form.pincode} onChange={set("pincode")} className="rounded-none border-b border-x-0 border-t-0 border-black bg-transparent focus-visible:ring-0 focus-visible:border-[var(--accent)]" />
          </Field>
        </div>

        <div className="border-t hairline pt-6">
          <div className="eyebrow text-[var(--text-mute)]">Step 2</div>
          <h2 className="font-display font-black text-3xl">Payment</h2>
          <div className="mt-4 fk-card rounded p-4 flex items-center justify-between border-l-4 border-[var(--brand-blue)]">
            <div>
              <div className="font-medium">Cash on Delivery</div>
              <div className="text-xs text-[var(--text-mute)] mt-1">Pay when your order arrives. Mock — no card needed.</div>
            </div>
            <span className="eyebrow text-[var(--brand-blue)]">Selected</span>
          </div>
        </div>

        <Button
          data-testid="place-order-btn"
          type="submit"
          disabled={submitting}
          className="w-full btn-buy rounded-sm py-6 eyebrow"
        >
          {submitting ? "Placing order…" : `Place order — ${formatPrice(subtotal + shipping)}`}
        </Button>
      </form>

      <aside className="fk-card rounded p-6 h-fit sticky top-24">
        <div className="eyebrow mb-4">Order summary</div>
        <div className="space-y-3 max-h-72 overflow-auto no-scrollbar">
          {items.map((it) => (
            <div key={it.cart_item_id} className="flex gap-3 text-sm">
              <div className="w-14 aspect-[3/4] bg-[var(--bg-admin)]">
                <img src={it.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="line-clamp-1">{it.product?.name}</div>
                <div className="text-xs text-[var(--text-mute)]">Qty {it.quantity} {it.size && `· ${it.size}`}</div>
              </div>
              <div className="font-medium">{formatPrice((it.product?.final_price || 0) * it.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="border-t hairline pt-3 mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
          <div className="border-t hairline pt-3 flex justify-between font-display font-bold text-lg">
            <span>Total</span><span>{formatPrice(subtotal + shipping)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, full, children, required }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label className="eyebrow text-[var(--text-mute)]">{label}{required && " *"}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
