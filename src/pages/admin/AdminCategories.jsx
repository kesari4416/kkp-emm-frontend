import { useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const empty = { name: "", slug: "", gender: "men", type: "apparel", image_url: "" };

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const refresh = async () => setCats((await api.get("/categories")).data);
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    try {
      if (editing) await api.put(`/admin/categories/${editing.category_id}`, form);
      else await api.post("/admin/categories", form);
      toast.success(editing ? "Updated" : "Created");
      setOpen(false);
      refresh();
    } catch (e) { toast.error(formatApiError(e)); }
  };
  const remove = async (c) => {
    if (!window.confirm(`Delete ${c.name}?`)) return;
    await api.delete(`/admin/categories/${c.category_id}`);
    refresh();
  };

  return (
    <div data-testid="admin-categories" className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow text-[var(--text-mute)]">Taxonomy</div>
          <h1 className="font-display font-black text-4xl mt-1">Categories</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setForm(empty); }} className="rounded-none bg-black hover:bg-[var(--accent)] eyebrow">
              <Plus size={14} className="mr-2" /> New
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-none">
            <DialogHeader><DialogTitle className="font-display font-black text-2xl">{editing ? "Edit" : "New"} category</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label className="eyebrow">Name</Label><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
              <div><Label className="eyebrow">Slug</Label><Input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} /></div>
              <div>
                <Label className="eyebrow">Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({...form, gender: v})}>
                  <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="eyebrow">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({...form, type: v})}>
                  <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="apparel">Apparel</SelectItem>
                    <SelectItem value="footwear">Footwear</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="eyebrow">Image URL</Label><Input value={form.image_url || ""} onChange={(e) => setForm({...form, image_url: e.target.value})} /></div>
            </div>
            <Button onClick={save} className="rounded-none bg-black hover:bg-[var(--accent)] eyebrow w-full py-6">{editing ? "Save" : "Create"}</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border hairline-dark overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-admin)] eyebrow text-[var(--text-mute)]">
            <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Slug</th><th className="text-left p-3">Gender</th><th className="text-left p-3">Type</th><th className="text-right p-3">Actions</th></tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.category_id} className="border-t hairline">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 font-mono text-xs">{c.slug}</td>
                <td className="p-3 uppercase">{c.gender}</td>
                <td className="p-3 capitalize">{c.type}</td>
                <td className="p-3 text-right">
                  <button onClick={() => { setEditing(c); setForm({name: c.name, slug: c.slug, gender: c.gender, type: c.type, image_url: c.image_url || ""}); setOpen(true); }} className="p-2 hover:text-[var(--accent)]"><Pencil size={14} /></button>
                  <button onClick={() => remove(c)} className="p-2 hover:text-[var(--accent)]"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
