import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchAutosuggest from "@/components/SearchAutosuggest";
import BrandLogo from "@/components/BrandLogo";

const categoryTabs = [
  { label: "WOMEN", to: "/shop?gender=women" },
  { label: "MEN", to: "/shop?gender=men" },
  { label: "KIDS", to: "/shop?gender=kids" },
  { label: "ETHNIC", to: "/ethnic", accent: true },
  { label: "FOOTWEAR", to: "/shop?category_type=footwear" },
  { label: "ACCESSORIES", to: "/shop?category_type=accessories" },
  { label: "OFFERS", to: "/offers", accent: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items, wishlist } = useCart();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white text-[var(--text)] border-b hairline shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      {/* Top thin utility bar */}
      <div className="bg-[var(--bg)] border-b hairline text-xs text-[var(--text-mute)]">
        <div className="max-w-[1480px] mx-auto px-4 md:px-8 h-7 flex items-center justify-end gap-5">
          <span className="hidden md:inline">Welcome to KKP STORES</span>
          <a className="hidden md:inline hover:text-[var(--brand-pink)] cursor-pointer">Become a Seller</a>
          <a className="hidden md:inline hover:text-[var(--brand-pink)] cursor-pointer">Customer Care</a>
          <a className="hover:text-[var(--brand-pink)] cursor-pointer">Track Order</a>
          <span className="hidden md:inline border-l hairline pl-5">₹ INR</span>
        </div>
      </div>

      {/* Main nav bar — logo + search + user actions */}
      <div className="max-w-[1480px] mx-auto px-4 md:px-8 h-16 flex items-center gap-4 md:gap-8">
        <Link to="/" data-testid="logo-link" className="flex items-baseline flex-shrink-0">
          <BrandLogo size="md" />
        </Link>

        <SearchAutosuggest />

        <div className="flex items-center gap-1 md:gap-3 ml-auto flex-shrink-0">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button data-testid="user-menu-trigger" className="px-2 py-1 hover:text-[var(--brand-pink)] flex items-center gap-1 text-sm">
                  <User size={18} />
                  <span className="hidden md:inline font-semibold">{user.name?.split(" ")[0]}</span>
                  <ChevronDown size={12} className="hidden md:inline opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="eyebrow text-[var(--text-mute)]">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => nav("/orders")} data-testid="menu-orders">My Orders</DropdownMenuItem>
                <DropdownMenuItem onClick={() => nav("/wishlist")} data-testid="menu-wishlist">Wishlist</DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => nav("/org")} data-testid="menu-admin" className="text-[var(--brand-pink)] font-semibold">Admin Panel</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => { await logout(); nav("/"); }}
                  data-testid="menu-logout"
                  className="text-[var(--brand-orange)]"
                >
                  <LogOut size={14} className="mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              data-testid="login-link"
              onClick={() => nav("/login")}
              className="text-sm font-semibold hover:text-[var(--brand-pink)] px-2 py-1"
            >
              Sign In
            </button>
          )}
          <Link to="/wishlist" data-testid="wishlist-link" className="relative px-2 py-1 hover:text-[var(--brand-pink)] flex items-center gap-1 text-sm">
            <Heart size={18} />
            <span className="hidden md:inline font-semibold">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[var(--brand-pink)] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" data-testid="cart-link" className="relative px-2 py-1 hover:text-[var(--brand-pink)] flex items-center gap-1 text-sm">
            <ShoppingBag size={18} />
            <span className="hidden md:inline font-semibold">Bag</span>
            {items.length > 0 && (
              <span data-testid="cart-count" className="absolute -top-0.5 right-0 bg-[var(--brand-pink)] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category strip */}
      <div className="border-t hairline">
        <div className="max-w-[1480px] mx-auto px-2 md:px-8 overflow-x-auto no-scrollbar">
          <nav className="flex items-center justify-start md:justify-center gap-1">
            {categoryTabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                data-testid={`nav-${t.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-xs md:text-[13px] font-bold tracking-wider uppercase whitespace-nowrap px-3 md:px-5 py-3 transition-colors border-b-2 ${
                    isActive
                      ? "text-[var(--brand-pink)] border-[var(--brand-pink)]"
                      : t.accent
                        ? "text-[var(--brand-pink)] border-transparent hover:border-[var(--brand-pink)]"
                        : "text-[var(--text)] border-transparent hover:text-[var(--brand-pink)] hover:border-[var(--brand-pink)]"
                  }`
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
