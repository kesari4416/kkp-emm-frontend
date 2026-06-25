import { useEffect, useState } from "react";
import { api, formatPrice } from "@/lib/api";
import { Package, ShoppingBag, Users, Tag, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => setStats(data));
    api.get("/admin/orders").then(({ data }) => setOrders(data.slice(0, 8)));
  }, []);

  const cards = [
    { label: "Revenue", value: formatPrice(stats?.revenue || 0), icon: TrendingUp, accent: true },
    { label: "Orders", value: stats?.total_orders || 0, icon: ShoppingBag },
    { label: "Products", value: stats?.total_products || 0, icon: Package },
    { label: "Customers", value: stats?.total_users || 0, icon: Users },
    { label: "Active Offers", value: stats?.active_offers || 0, icon: Tag },
  ];

  return (
    <div data-testid="admin-dashboard" className="space-y-8">
      <div>
        <div className="eyebrow text-[var(--text-mute)]">Overview</div>
        <h1 className="font-display font-black text-4xl mt-1">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`p-5 rounded fk-card ${c.accent ? "bg-[var(--brand-blue)] text-white" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="eyebrow text-current opacity-70">{c.label}</div>
              <c.icon size={16} className={c.accent ? "text-[var(--brand-yellow)]" : "text-[var(--brand-blue)]"} />
            </div>
            <div className="mt-4 font-display font-black text-3xl">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded fk-card">
        <div className="border-b hairline p-5 flex items-center justify-between">
          <div>
            <div className="eyebrow text-[var(--text-mute)]">Latest</div>
            <h2 className="font-display font-bold text-xl">Recent orders</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg)] eyebrow text-[var(--text-mute)]">
              <tr>
                <th className="text-left p-3">Order</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Items</th>
                <th className="text-right p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.order_id} className="border-t hairline">
                  <td className="p-3 font-mono text-xs">{o.order_id}</td>
                  <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="p-3 uppercase font-semibold text-[var(--brand-blue)]">{o.status}</td>
                  <td className="p-3">{o.items.length}</td>
                  <td className="p-3 text-right font-display font-bold">{formatPrice(o.total)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="5" className="p-6 text-center text-[var(--text-mute)]">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
