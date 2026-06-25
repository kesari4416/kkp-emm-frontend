import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function AdminLogin() {
  const { login, logout } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await login(email, password);
      if (user?.role !== "admin") {
        await logout();
        toast.error("This portal is for administrators only.");
        return;
      }
      toast.success("Welcome, admin");
      nav("/org", { replace: true });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="admin-login-page" className="min-h-screen bg-[#0F1419] text-white flex">
      <div className="flex-1 hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-[#1A1A1A] via-[#0F1419] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--brand-pink)] blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--brand-blue)] blur-3xl" />
        </div>
        <div className="relative z-10">
          <BrandLogo variant="light" size="lg" />
          <div className="mt-1 text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--brand-pink)]">Admin Console</div>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="font-display font-black text-4xl leading-tight tracking-tight">
            Manage the store.<br />Move the catalogue.
          </h2>
          <p className="mt-4 text-white/70 text-sm leading-relaxed">
            Products, offers, orders, customers — everything you need to run
            KKP STORES from a single console.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-[var(--brand-pink)]" /> Restricted access — admin role required</li>
            <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-[var(--brand-pink)]" /> Activity audited & logged</li>
            <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-[var(--brand-pink)]" /> Session expires after 7 days</li>
          </ul>
        </div>
        <Link to="/" className="relative z-10 text-xs text-white/50 hover:text-white inline-flex items-center gap-1">
          <ArrowLeft size={12} /> Back to storefront
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white text-[var(--text)]">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6">
          <div className="md:hidden">
            <BrandLogo size="md" />
            <div className="mt-1 text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--brand-pink)]">Admin Console</div>
          </div>
          <div>
            <div className="eyebrow text-[var(--text-mute)]">Restricted area</div>
            <h1 className="font-display font-black text-3xl mt-2">Admin sign in.</h1>
            <p className="text-sm text-[var(--text-mute)] mt-2">Use your administrator credentials to continue.</p>
          </div>
          <div>
            <Label className="eyebrow">Admin email</Label>
            <Input
              data-testid="admin-login-email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              className="mt-1 rounded-sm focus-visible:ring-[var(--brand-pink)]"
            />
          </div>
          <div>
            <Label className="eyebrow">Password</Label>
            <Input
              data-testid="admin-login-password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 rounded-sm focus-visible:ring-[var(--brand-pink)]"
            />
          </div>
          <Button
            data-testid="admin-login-submit"
            disabled={busy}
            type="submit"
            className="w-full rounded-sm bg-[var(--brand-pink)] hover:bg-[var(--brand-pink-dark)] text-white py-6 font-bold tracking-wider uppercase text-sm"
          >
            {busy ? "Signing in…" : "Sign in to Admin"}
          </Button>
          <div className="border-t hairline pt-4 text-xs text-[var(--text-mute)] text-center">
            Not an admin? <Link to="/login" className="text-[var(--brand-pink)] underline">Customer sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
