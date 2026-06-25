import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      setWishlist([]);
      return;
    }
    try {
      const [c, w] = await Promise.all([api.get("/cart"), api.get("/wishlist")]);
      setItems(c.data);
      setWishlist(w.data);
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = async (product_id, size, color, quantity = 1) => {
    await api.post("/cart", { product_id, size, color, quantity });
    await refresh();
  };
  const updateCartItem = async (cart_item_id, payload) => {
    await api.put(`/cart/${cart_item_id}`, payload);
    await refresh();
  };
  const removeCartItem = async (cart_item_id) => {
    await api.delete(`/cart/${cart_item_id}`);
    await refresh();
  };
  const addToWishlist = async (product_id) => {
    await api.post("/wishlist", { product_id });
    await refresh();
  };
  const removeFromWishlist = async (product_id) => {
    await api.delete(`/wishlist/${product_id}`);
    await refresh();
  };

  const subtotal = items.reduce(
    (s, it) => s + (it.product?.final_price || 0) * it.quantity,
    0,
  );

  return (
    <CartCtx.Provider
      value={{
        items,
        wishlist,
        refresh,
        addToCart,
        updateCartItem,
        removeCartItem,
        addToWishlist,
        removeFromWishlist,
        subtotal,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const v = useContext(CartCtx);
  if (!v) throw new Error("useCart must be inside CartProvider");
  return v;
}
