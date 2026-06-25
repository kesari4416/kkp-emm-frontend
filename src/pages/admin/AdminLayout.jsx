import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutGrid, ShoppingBag, Tag, FolderTree, Image, Users, LogOut, Home as HomeIcon } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const items = [
  { to: "/org", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/org/products", label: "Products", icon: ShoppingBag },
  { to: "/org/offers", label: "Offers", icon: Tag },
  { to: "/org/categories", label: "Categories", icon: FolderTree },
  { to: "/org/banners", label: "Banners", icon: Image },
  { to: "/org/orders", label: "Orders", icon: ShoppingBag },
  { to: "/org/users", label: "Users", icon: Users },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div data-testid="admin-layout" className="min-h-screen bg-[var(--bg)] grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="bg-[#1A1A1A] text-white p-6 sticky top-0 h-screen flex flex-col">
        <Link to="/" className="block">
          <BrandLogo variant="light" size="md" />
        </Link>
        <div className="text-[10px] uppercase tracking-widest text-white/50 mt-2 font-semibold">Admin Control</div>

        <nav className="mt-10 flex-1 flex flex-col gap-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              data-testid={`admin-nav-${it.label.toLowerCase()}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${
                  isActive ? "bg-[var(--brand-pink)] text-white font-semibold" : "text-white/85 hover:bg-white/10"
                }`
              }
            >
              <it.icon size={16} /> {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/15 pt-4 text-xs space-y-2">
          <div className="text-white/70 truncate">{user?.email}</div>
          <Link to="/" className="flex items-center gap-2 text-white/85 hover:text-[var(--brand-pink)]"><HomeIcon size={14} /> Back to store</Link>
          <button
            data-testid="admin-logout"
            onClick={async () => { await logout(); nav("/"); }}
            className="flex items-center gap-2 text-white/85 hover:text-[var(--brand-pink)]"
          ><LogOut size={14} /> Logout</button>
        </div>
      </aside>

      <main className="p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
