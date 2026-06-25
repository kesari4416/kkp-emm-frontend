import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import BrandLogo from "@/components/BrandLogo";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      nav(from, { replace: true });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  const googleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div data-testid="login-page" className="min-h-[80vh] grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block relative bg-black">
        <img src="https://images.unsplash.com/photo-1570212773364-e30cd076539e?auto=format&fit=crop&w=1200&q=80" alt="" className="w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 p-12 flex flex-col justify-end">
          <BrandLogo variant="light" size="xl" />
          <div className="mt-6 text-white/80 max-w-sm text-base leading-relaxed">
            Heritage textiles, hand-woven in South India. Drape the story. Wear the craft.
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6">
          <div>
            <div className="eyebrow text-[var(--text-mute)]">Sign in</div>
            <h1 className="font-display font-black text-3xl mt-2">Welcome back.</h1>
          </div>

          <div>
            <Label className="eyebrow">Email</Label>
            <Input data-testid="login-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 rounded-none border-b border-x-0 border-t-0 border-black bg-transparent focus-visible:ring-0 focus-visible:border-[var(--accent)]" />
          </div>
          <div>
            <Label className="eyebrow">Password</Label>
            <Input data-testid="login-password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 rounded-none border-b border-x-0 border-t-0 border-black bg-transparent focus-visible:ring-0 focus-visible:border-[var(--accent)]" />
          </div>

          <Button data-testid="login-submit" disabled={busy} type="submit" className="w-full btn-buy rounded-sm py-6 eyebrow">
            {busy ? "Signing in…" : "Sign in"}
          </Button>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t hairline" /></div>
            <span className="relative px-3 bg-[var(--bg)] eyebrow text-[var(--text-mute)]">Or</span>
          </div>

          <button
            type="button"
            onClick={googleLogin}
            data-testid="google-login-btn"
            className="w-full border border-[var(--brand-blue)] text-[var(--brand-blue)] py-3 eyebrow flex items-center justify-center gap-3 hover:bg-[var(--brand-blue)] hover:text-white transition-colors rounded-sm"
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.3-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 16.5 4.5 10 8.7 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5.1 0 9.8-2 13.3-5.2l-6.1-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.9 39.3 16.4 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.8-3.6 5l6.1 5.2C40.6 35 43.5 30 43.5 24c0-1.2-.1-2.3 0.1-3.5z"/></svg>
            Continue with Google
          </button>

          <div className="text-center text-sm text-[var(--text-mute)]">
            New here? <Link to="/register" data-testid="register-link" className="text-[var(--accent)] underline">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
