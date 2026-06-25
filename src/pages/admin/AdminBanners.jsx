import { useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const empty = { title: "", subtitle: "", image_url: "", link: "/shop", active: true, sort_order: 0 };

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const refresh = async () => setBanners((await api.get("/admin/banners")).data);
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) };
      if (editing) await api.put(`/admin/banners/${editing.banner_id}`, payload);
      else await api.post("/admin/banners", payload);
      toast.success(editing ? "Updated" : "Created");
      setOpen(false);
      refresh();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  return (
    <div data-testid="admin-banners" className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow text-[var(--text-mute)]">Homepage</div>
          <h1 className="font-display font-black text-4xl mt-1">Banners</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setForm(empty); }} className="rounded-none bg-black hover:bg-[var(--accent)] eyebrow">
              <Plus size={14} className="mr-2" /> New banner
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-none">
            <DialogHeader><DialogTitle className="font-display font-black text-2xl">{editing ? "Edit" : "New"} banner</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label className="eyebrow">Title</Label><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /></div>
              <div><Label className="eyebrow">Subtitle</Label><Input value={form.subtitle || ""} onChange={(e) => setForm({...form, subtitle: e.target.value})} /></div>
              <div><Label className="eyebrow">Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} /></div>
              <div><Label className="eyebrow">Link</Label><Input value={form.link || ""} onChange={(e) => setForm({...form, link: e.target.value})} /></div>
              <div><Label className="eyebrow">Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: e.target.value})} /></div>
              <div className="flex items-center justify-between"><Label className="eyebrow">Active</Label><Switch checked={form.active} onCheckedChange={(v) => setForm({...form, active: v})} /></div>
            </div>
            <Button onClick={save} className="rounded-none bg-black hover:bg-[var(--accent)] eyebrow w-full py-6">{editing ? "Save" : "Create"}</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black">
        {banners.map((b) => (
          <div key={b.banner_id} className="bg-white">
            <div className="aspect-[16/9] bg-[var(--bg-admin)]">
              <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="font-display font-bold">{b.title}</div>
              <div className="text-xs text-[var(--text-mute)] mt-1">{b.subtitle}</div>
              <div className="text-xs font-mono mt-2">Order: {b.sort_order} · {b.active ? "Active" : "Inactive"}</div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => { setEditing(b); setForm(b); setOpen(true); }} className="text-xs eyebrow hover:text-[var(--accent)]"><Pencil size={12} className="inline mr-1" />Edit</button>
                <button onClick={async () => { await api.delete(`/admin/banners/${b.banner_id}`); refresh(); }} className="text-xs eyebrow hover:text-[var(--accent)]"><Trash2 size={12} className="inline mr-1" />Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
