import { useEffect, useState } from "react";
import { api, formatPrice } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const STATUSES = ["placed", "packed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const refresh = async () => setOrders((await api.get("/admin/orders")).data);
  useEffect(() => { refresh(); }, []);

  const updateStatus = async (orderId, status) => {
    await api.put(`/admin/orders/${orderId}/status`, { status });
    toast.success(`Marked as ${status}`);
    refresh();
  };

  return (
    <div data-testid="admin-orders" className="space-y-6">
      <div>
        <div className="eyebrow text-[var(--text-mute)]">Operations</div>
        <h1 className="font-display font-black text-4xl mt-1">Orders</h1>
      </div>

      <div className="bg-white border hairline-dark overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-admin)] eyebrow text-[var(--text-mute)]">
            <tr>
              <th className="text-left p-3">Order ID</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Items</th>
              <th className="text-right p-3">Total</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.order_id} className="border-t hairline">
                <td className="p-3 font-mono text-xs">{o.order_id}</td>
                <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="p-3">{o.address?.full_name}</td>
                <td className="p-3">{o.items.length}</td>
                <td className="p-3 text-right font-display font-bold">{formatPrice(o.total)}</td>
                <td className="p-3">
                  <Select value={o.status} onValueChange={(v) => updateStatus(o.order_id, v)}>
                    <SelectTrigger className="w-36 rounded-none uppercase text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-none">
                      {STATUSES.map((s) => <SelectItem key={s} value={s} className="uppercase">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan="6" className="p-6 text-center text-[var(--text-mute)]">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
