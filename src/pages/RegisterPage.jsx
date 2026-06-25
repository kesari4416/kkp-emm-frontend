import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form);
      toast.success("Account created");
      nav("/", { replace: true });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="register-page" className="min-h-[80vh] flex items-center justify-center p-8">
      <form onSubmit={submit} className="w-full max-w-sm space-y-6">
        <div>
          <div className="eyebrow text-[var(--text-mute)]">Create account</div>
          <h1 className="font-display font-black text-3xl mt-2">Welcome to MAISON M.</h1>
        </div>

        <div>
          <Label className="eyebrow">Full name</Label>
          <Input data-testid="register-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 rounded-none border-b border-x-0 border-t-0 border-black bg-transparent focus-visible:ring-0 focus-visible:border-[var(--accent)]" />
        </div>
        <div>
          <Label className="eyebrow">Email</Label>
          <Input data-testid="register-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 rounded-none border-b border-x-0 border-t-0 border-black bg-transparent focus-visible:ring-0 focus-visible:border-[var(--accent)]" />
        </div>
        <div>
          <Label className="eyebrow">Password</Label>
          <Input data-testid="register-password" required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 rounded-none border-b border-x-0 border-t-0 border-black bg-transparent focus-visible:ring-0 focus-visible:border-[var(--accent)]" />
        </div>

        <Button data-testid="register-submit" disabled={busy} type="submit" className="w-full btn-buy rounded-sm py-6 eyebrow">
          {busy ? "Creating…" : "Create account"}
        </Button>

        <div className="text-center text-sm text-[var(--text-mute)]">
          Already have an account? <Link to="/login" className="text-[var(--accent)] underline">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
