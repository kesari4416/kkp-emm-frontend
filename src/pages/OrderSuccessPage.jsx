import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, formatPrice } from "@/lib/api";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data));
  }, [id]);

  if (!order) return <div className="p-12 text-center font-mono">Loading…</div>;

  return (
    <div data-testid="order-success-page" className="max-w-[900px] mx-auto px-4 md:px-8 py-16">
      <div className="text-center">
        <CheckCircle2 size={56} className="mx-auto text-[var(--accent)]" />
        <div className="eyebrow text-[var(--text-mute)] mt-6">Order confirmed</div>
        <h1 className="font-display font-black text-4xl mt-2">Thank you for your order.</h1>
        <p className="mt-3 text-[var(--text-mute)]">Order <span className="font-mono">{order.order_id}</span> placed on {new Date(order.created_at).toLocaleString()}.</p>
        <p className="mt-2 text-sm text-[var(--text-mute)]" data-testid="email-confirmation-note">
          A confirmation email has been sent to your inbox.
        </p>
      </div>

      <div className="mt-10 border hairline-dark p-6 bg-white">
        <div className="eyebrow mb-4">Order details</div>
        <div className="divide-y hairline">
          {order.items.map((it, i) => (
            <div key={i} className="py-3 flex gap-3 items-center">
              <div className="w-12 aspect-[3/4] bg-[var(--bg-admin)]">
                {it.image && <img src={it.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <div className="text-sm">{it.name}</div>
                <div className="text-xs text-[var(--text-mute)]">Qty {it.quantity} {it.size && `· ${it.size}`}</div>
              </div>
              <div className="font-medium">{formatPrice(it.unit_price * it.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="border-t hairline pt-4 mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between font-display font-bold text-lg pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
      </div>

      <div className="mt-6 border hairline-dark p-6 bg-white">
        <div className="eyebrow mb-3">Shipping to</div>
        <div className="text-sm">
          {order.address.full_name} · {order.address.phone}<br />
          {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br />
          {order.address.city}, {order.address.state} — {order.address.pincode}
        </div>
      </div>

      <div className="mt-10 text-center flex gap-3 justify-center">
        <Link to="/orders" data-testid="view-orders" className="border border-black px-6 py-3 eyebrow hover:bg-black hover:text-white">My Orders</Link>
        <Link to="/shop" className="bg-black text-white px-6 py-3 eyebrow hover:bg-[var(--accent)]">Continue shopping</Link>
      </div>
    </div>
  );
}
