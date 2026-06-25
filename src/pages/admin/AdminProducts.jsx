import { useEffect, useState } from "react";
import { api, formatApiError, formatPrice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const empty = {
  name: "",
  brand: "",
  description: "",
  category_id: "",
  gender: "men",
  price: 0,
  sizes: [],
  colors: [],
  images: [],
  stock: 0,
  rating: 4,
  rating_count: 0,
  featured: false,
  offer_percent: 0,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const refresh = async () => {
    const [p, c] = await Promise.all([api.get("/products", { params: { limit: 200 } }), api.get("/categories")]);
    setProducts(p.data);
    setCategories(c.data);
  };

  useEffect(() => { refresh(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...empty, category_id: categories[0]?.category_id || "" }); setOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, brand: p.brand, description: p.description, category_id: p.category_id,
      gender: p.gender, price: p.price, sizes: p.sizes, colors: p.colors, images: p.images,
      stock: p.stock, rating: p.rating, rating_count: p.rating_count, featured: p.featured,
      offer_percent: p.offer_percent || 0,
    });
    setOpen(true);
  };

  const save = async () => {
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        rating: Number(form.rating),
        rating_count: Number(form.rating_count),
        offer_percent: Number(form.offer_percent) || 0,
        sizes: typeof form.sizes === "string" ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : form.sizes,
        colors: typeof form.colors === "string" ? form.colors.split(",").map((s) => s.trim()).filter(Boolean) : form.colors,
        images: typeof form.images === "string" ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : form.images,
      };
      if (editing) await api.put(`/admin/products/${editing.product_id}`, payload);
      else await api.post("/admin/products", payload);
      toast.success(editing ? "Product updated" : "Product created");
      setOpen(false);
      refresh();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    await api.delete(`/admin/products/${p.product_id}`);
    toast.success("Deleted");
    refresh();
  };

  const saveOffer = async (p, val) => {
    const pct = Math.max(0, Math.min(90, Number(val) || 0));
    try {
      await api.patch(`/admin/products/${p.product_id}/offer`, { offer_percent: pct });
      toast.success(pct > 0 ? `${pct}% offer set on ${p.name}` : `Offer cleared on ${p.name}`);
      refresh();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  const arrField = (key) => Array.isArray(form[key]) ? form[key].join(", ") : form[key];

  return (
    <div data-testid="admin-products" className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow text-[var(--text-mute)]">Catalog</div>
          <h1 className="font-display font-black text-4xl mt-1">Products</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="admin-add-product" onClick={openCreate} className="rounded-none bg-black hover:bg-[var(--accent)] eyebrow">
              <Plus size={14} className="mr-2" /> Add product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-none">
            <DialogHeader><DialogTitle className="font-display font-black text-2xl">{editing ? "Edit" : "New"} product</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-auto pr-1">
              <Field label="Name" full><Input data-testid="prod-name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></Field>
              <Field label="Brand"><Input data-testid="prod-brand" value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} /></Field>
              <Field label="Price (₹)"><Input data-testid="prod-price" type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} /></Field>
              <Field label="Category">
                <Select value={form.category_id} onValueChange={(v) => setForm({...form, category_id: v})}>
                  <SelectTrigger data-testid="prod-category" className="rounded-none"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="rounded-none">
                    {categories.map((c) => <SelectItem key={c.category_id} value={c.category_id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Gender">
                <Select value={form.gender} onValueChange={(v) => setForm({...form, gender: v})}>
                  <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Stock"><Input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} /></Field>
              <Field label="Rating"><Input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({...form, rating: e.target.value})} /></Field>
              <Field label="Offer % (per-product override)">
                <Input
                  data-testid="prod-offer-percent"
                  type="number"
                  min="0"
                  max="90"
                  step="1"
                  value={form.offer_percent}
                  onChange={(e) => setForm({...form, offer_percent: e.target.value})}
                  placeholder="0"
                />
              </Field>
              <Field label="Description" full><Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="rounded-sm" /></Field>
              <Field label="Sizes (comma-separated)" full><Input data-testid="prod-sizes" value={arrField("sizes")} onChange={(e) => setForm({...form, sizes: e.target.value})} /></Field>
              <Field label="Colors (comma-separated)" full><Input value={arrField("colors")} onChange={(e) => setForm({...form, colors: e.target.value})} /></Field>
              <Field label="Product images" full>
                <ProductImagesEditor
                  images={Array.isArray(form.images) ? form.images : (typeof form.images === "string" ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [])}
                  onChange={(imgs) => setForm({ ...form, images: imgs })}
                />
              </Field>
              <Field label="Featured" full>
                <div className="flex items-center gap-3"><Switch checked={form.featured} onCheckedChange={(v) => setForm({...form, featured: v})} /> Show on homepage</div>
              </Field>
            </div>
            <Button data-testid="prod-save" onClick={save} className="rounded-sm bg-[var(--brand-pink)] hover:bg-[var(--brand-pink-dark)] text-white eyebrow w-full py-6">
              {editing ? "Save changes" : "Create product"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded fk-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg)] eyebrow text-[var(--text-mute)]">
            <tr>
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3">Brand</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Gender</th>
              <th className="text-right p-3">Price</th>
              <th className="text-right p-3">Stock</th>
              <th className="text-center p-3">Offer %</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const cat = categories.find((c) => c.category_id === p.category_id);
              return (
                <tr key={p.product_id} className="border-t hairline">
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-10 aspect-[3/4] bg-[var(--bg)]">
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span>{p.name}</span>
                  </td>
                  <td className="p-3">{p.brand}</td>
                  <td className="p-3">{cat?.name || "—"}</td>
                  <td className="p-3 uppercase">{p.gender}</td>
                  <td className="p-3 text-right">{formatPrice(p.price)}</td>
                  <td className="p-3 text-right">{p.stock}</td>
                  <td className="p-3 text-center">
                    <ProductOfferInput product={p} onSave={saveOffer} />
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(p)} data-testid={`edit-prod-${p.product_id}`} className="p-2 hover:text-[var(--brand-blue)]"><Pencil size={14} /></button>
                    <button onClick={() => remove(p)} data-testid={`del-prod-${p.product_id}`} className="p-2 hover:text-[var(--brand-orange)]"><Trash2 size={14} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <Label className="eyebrow text-[var(--text-mute)]">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ProductImagesEditor({ images, onChange }) {
  const [busy, setBusy] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const upload = async (files) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const next = [...images];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const { data } = await api.post("/admin/upload-image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        next.push(data.url);
      }
      onChange(next);
      toast.success(`${files.length} image${files.length === 1 ? "" : "s"} uploaded`);
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setBusy(false);
    }
  };

  const remove = (idx) => onChange(images.filter((_, i) => i !== idx));

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    onChange([...images, u]);
    setUrlInput("");
  };

  return (
    <div className="space-y-3" data-testid="product-images-editor">
      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative group aspect-[3/4] bg-[var(--bg)] border hairline rounded overflow-hidden" data-testid={`product-image-thumb-${i}`}>
              <img src={src} alt={`product ${i}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                data-testid={`product-image-remove-${i}`}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white text-[var(--brand-pink)] border hairline opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-xs"
                aria-label="Remove image"
              >×</button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-[var(--brand-pink)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Primary</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploader */}
      <label
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors ${busy ? "border-[var(--brand-pink)] bg-[#FFF3F7]" : "border-[var(--border-dark)] hover:border-[var(--brand-pink)] hover:bg-[#FFF3F7]"}`}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          disabled={busy}
          onChange={(e) => { upload(e.target.files); e.target.value = ""; }}
          data-testid="product-image-upload-input"
        />
        <div className="text-2xl text-[var(--brand-pink)]">+</div>
        <div className="text-sm font-semibold mt-1">{busy ? "Uploading…" : "Upload images"}</div>
        <div className="text-xs text-[var(--text-mute)] mt-0.5">PNG, JPG, WEBP up to 8 MB · multiple files allowed</div>
      </label>

      {/* Add by URL fallback */}
      <div className="flex gap-2">
        <Input
          placeholder="…or paste an image URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
          className="text-sm"
          data-testid="product-image-url-input"
        />
        <Button type="button" onClick={addUrl} variant="outline" className="rounded-sm border-[var(--brand-pink)] text-[var(--brand-pink)] hover:bg-[var(--brand-pink)] hover:text-white" data-testid="product-image-url-add">
          Add URL
        </Button>
      </div>
    </div>
  );
}

function ProductOfferInput({ product, onSave }) {  const [val, setVal] = useState(product.offer_percent || 0);
  useEffect(() => { setVal(product.offer_percent || 0); }, [product.offer_percent]);
  const dirty = Number(val) !== Number(product.offer_percent || 0);
  return (
    <div className="inline-flex items-center gap-1.5">
      <input
        type="number"
        min="0"
        max="90"
        step="1"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => { if (dirty) onSave(product, val); }}
        onKeyDown={(e) => { if (e.key === "Enter" && dirty) { e.target.blur(); } }}
        data-testid={`offer-input-${product.product_id}`}
        className="w-14 px-2 py-1 border hairline-dark text-center text-sm rounded-sm focus:outline-none focus:border-[var(--brand-blue)]"
      />
      <span className="text-xs text-[var(--text-mute)]">%</span>
      {dirty && (
        <button
          data-testid={`offer-save-${product.product_id}`}
          onClick={() => onSave(product, val)}
          className="text-[10px] eyebrow px-1.5 py-0.5 bg-[var(--brand-blue)] text-white rounded-sm hover:bg-[var(--brand-blue-dark)]"
        >Save</button>
      )}
    </div>
  );
}
