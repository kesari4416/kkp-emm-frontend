import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatPrice } from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders").then(({ data }) => setOrders(data));
  }, []);

  return (
    <div data-testid="orders-page" className="max-w-[1100px] mx-auto px-4 md:px-8 py-10">
      <div className="eyebrow text-[var(--text-mute)]">Account</div>
      <h1 className="font-display font-black text-4xl mt-2 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="border hairline-dark p-12 text-center text-sm text-[var(--text-mute)]">
          No orders yet. <Link to="/shop" className="text-[var(--accent)] underline">Start shopping</Link>.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div key={o.order_id} data-testid={`order-${o.order_id}`} className="border hairline-dark bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b hairline pb-4">
                <div>
                  <div className="eyebrow text-[var(--text-mute)]">Order</div>
                  <div className="font-mono text-sm">{o.order_id}</div>
                </div>
                <div>
                  <div className="eyebrow text-[var(--text-mute)]">Placed</div>
                  <div className="text-sm">{new Date(o.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="eyebrow text-[var(--text-mute)]">Status</div>
                  <div className="text-sm font-semibold uppercase text-[var(--accent)]">{o.status}</div>
                </div>
                <div>
                  <div className="eyebrow text-[var(--text-mute)]">Total</div>
                  <div className="font-display font-bold">{formatPrice(o.total)}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {o.items.map((it, i) => (
                  <div key={i} className="flex gap-3 items-center w-full md:w-[48%]">
                    <div className="w-14 aspect-[3/4] bg-[var(--bg-admin)]">
                      {it.image && <img src={it.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="text-sm">
                      <div className="line-clamp-1">{it.name}</div>
                      <div className="text-xs text-[var(--text-mute)]">Qty {it.quantity} {it.size && `· ${it.size}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
