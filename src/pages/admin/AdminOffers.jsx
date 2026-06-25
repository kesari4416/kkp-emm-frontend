import { useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const empty = {
  name: "", discount_percent: 10, scope: "all", category_ids: [], product_ids: [], active: true, valid_until: "",
};

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const refresh = async () => {
    const [o, c] = await Promise.all([api.get("/admin/offers"), api.get("/categories")]);
    setOffers(o.data);
    setCategories(c.data);
  };
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    try {
      const payload = {
        ...form,
        discount_percent: Number(form.discount_percent),
        valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null,
      };
      if (editing) await api.put(`/admin/offers/${editing.offer_id}`, payload);
      else await api.post("/admin/offers", payload);
      toast.success(editing ? "Offer updated" : "Offer created");
      setOpen(false);
      refresh();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  const remove = async (o) => {
    if (!window.confirm(`Delete ${o.name}?`)) return;
    await api.delete(`/admin/offers/${o.offer_id}`);
    toast.success("Deleted");
    refresh();
  };

  return (
    <div data-testid="admin-offers" className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow text-[var(--text-mute)]">Pricing</div>
          <h1 className="font-display font-black text-4xl mt-1">Offers & Discounts</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="admin-add-offer" onClick={() => { setEditing(null); setForm(empty); }} className="rounded-none bg-black hover:bg-[var(--accent)] eyebrow">
              <Plus size={14} className="mr-2" /> New offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg rounded-none">
            <DialogHeader><DialogTitle className="font-display font-black text-2xl">{editing ? "Edit" : "New"} offer</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="eyebrow text-[var(--text-mute)]">Name</Label>
                <Input data-testid="offer-name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label className="eyebrow text-[var(--text-mute)]">Discount %</Label>
                <Input data-testid="offer-percent" type="number" min="0" max="90" value={form.discount_percent} onChange={(e) => setForm({...form, discount_percent: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label className="eyebrow text-[var(--text-mute)]">Scope</Label>
                <Select value={form.scope} onValueChange={(v) => setForm({...form, scope: v})}>
                  <SelectTrigger className="rounded-none mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="all">All products</SelectItem>
                    <SelectItem value="category">By category</SelectItem>
                    <SelectItem value="product">Specific products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.scope === "category" && (
                <div>
                  <Label className="eyebrow text-[var(--text-mute)]">Categories (toggle)</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {categories.map((c) => {
                      const active = form.category_ids.includes(c.category_id);
                      return (
                        <button
                          key={c.category_id}
                          type="button"
                          onClick={() => setForm((f) => ({
                            ...f,
                            category_ids: active ? f.category_ids.filter((x) => x !== c.category_id) : [...f.category_ids, c.category_id],
                          }))}
                          className={`px-3 py-1 text-xs border ${active ? "bg-black text-white" : "border-black"}`}
                        >{c.name}</button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div>
                <Label className="eyebrow text-[var(--text-mute)]">Valid until (optional)</Label>
                <Input type="date" value={form.valid_until ? form.valid_until.slice(0, 10) : ""} onChange={(e) => setForm({...form, valid_until: e.target.value})} className="mt-1 rounded-none" />
              </div>
              <div className="flex items-center justify-between">
                <Label className="eyebrow">Active</Label>
                <Switch checked={form.active} onCheckedChange={(v) => setForm({...form, active: v})} />
              </div>
            </div>
            <Button data-testid="offer-save" onClick={save} className="rounded-none bg-black hover:bg-[var(--accent)] eyebrow w-full py-6">
              {editing ? "Save changes" : "Create offer"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border hairline-dark overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-admin)] eyebrow text-[var(--text-mute)]">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Discount</th>
              <th className="text-left p-3">Scope</th>
              <th className="text-left p-3">Valid until</th>
              <th className="text-left p-3">Active</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.offer_id} className="border-t hairline">
                <td className="p-3 font-medium">{o.name}</td>
                <td className="p-3"><span className="font-display font-bold text-[var(--accent)]">{o.discount_percent}%</span></td>
                <td className="p-3 uppercase">{o.scope}</td>
                <td className="p-3">{o.valid_until ? new Date(o.valid_until).toLocaleDateString() : "—"}</td>
                <td className="p-3">{o.active ? "Yes" : "No"}</td>
                <td className="p-3 text-right">
                  <button onClick={() => { setEditing(o); setForm({...o, valid_until: o.valid_until || ""}); setOpen(true); }} className="p-2 hover:text-[var(--accent)]"><Pencil size={14} /></button>
                  <button onClick={() => remove(o)} className="p-2 hover:text-[var(--accent)]"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
