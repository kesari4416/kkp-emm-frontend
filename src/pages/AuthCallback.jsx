import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const nav = useNavigate();
  const { setUser } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    const hash = window.location.hash || "";
    const match = hash.match(/session_id=([^&]+)/);
    if (!match) {
      nav("/login", { replace: true });
      return;
    }
    const sessionId = decodeURIComponent(match[1]);
    api
      .get("/auth/google/session", { headers: { "X-Session-ID": sessionId } })
      .then(({ data }) => {
        setUser(data);
        // Clean URL fragment
        window.history.replaceState({}, "", window.location.pathname);
        nav("/", { replace: true });
      })
      .catch(() => {
        nav("/login", { replace: true });
      });
  }, [nav, setUser]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center font-mono text-sm text-[var(--text-mute)]">
      Signing you in with Google…
    </div>
  );
}
