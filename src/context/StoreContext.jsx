import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SEED_MENU } from '../data/menu';
import { unitPrice } from '../lib/pricing';

const StoreContext = createContext(null);

function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

// Keys are versioned; bump them when the menu or currency changes so old saved data isn't reused.
// v3/v2 = Thai Baht prices. Older keys held USD prices and are cleared.
const MENU_KEY = 'ss.menu.v3';
const CART_KEY = 'ss.cart.v2';
const ORDERS_KEY = 'ss.orders.v2';
['ss.menu', 'ss.menu.v2', 'ss.cart', 'ss.orders'].forEach((k) => localStorage.removeItem(k));

const lineKey =(itemId, selections) => `${itemId}|${JSON.stringify(selections)}`;

export function StoreProvider({ children }) {
  // Bump the version suffix whenever SEED_MENU changes so browsers pick up the new menu.
  const [menu, setMenu] = usePersistentState(MENU_KEY, SEED_MENU);
  const [cart, setCart] = usePersistentState(CART_KEY, []);
  const [orders, setOrders] = usePersistentState(ORDERS_KEY, []);
  const [cartOpen, setCartOpen] = useState(false);

  // Keep orders in sync across tabs (e.g. customer tab + kitchen tab).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ORDERS_KEY && e.newValue) setOrders(JSON.parse(e.newValue));
      if (e.key === MENU_KEY && e.newValue) setMenu(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [setOrders, setMenu]);

  const addToCart = useCallback(
    (item, selections, qty, note = '') => {
      const key = lineKey(item.id, selections) + `|${note}`;
      setCart((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
        return [
          ...prev,
          {
            key,
            itemId: item.id,
            name: item.name,
            emoji: item.emoji,
            image: item.image,
            selections,
            note,
            qty,
            unitPrice: unitPrice(item, selections),
          },
        ];
      });
    },
    [setCart],
  );

  const updateQty = useCallback(
    (key, qty) =>
      setCart((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)))),
    [setCart],
  );

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const placeOrder = useCallback(
    (details) => {
      const id = `SS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      const order = {
        id,
        createdAt: new Date().toISOString(),
        status: 'placed',
        history: [{ status: 'placed', at: new Date().toISOString() }],
        lines: cart,
        ...details,
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return id;
    },
    [cart, setOrders, setCart],
  );

  const setOrderStatus = useCallback(
    (id, status) =>
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status, history: [...o.history, { status, at: new Date().toISOString() }] } : o,
        ),
      ),
    [setOrders],
  );

  const toggleAvailability = useCallback(
    (itemId) => setMenu((prev) => prev.map((m) => (m.id === itemId ? { ...m, available: !m.available } : m))),
    [setMenu],
  );

  const saveMenuItem = useCallback(
    (item) =>
      setMenu((prev) =>
        prev.some((m) => m.id === item.id) ? prev.map((m) => (m.id === item.id ? item : m)) : [...prev, item],
      ),
    [setMenu],
  );

  const deleteMenuItem = useCallback((itemId) => setMenu((prev) => prev.filter((m) => m.id !== itemId)), [setMenu]);

  const resetDemo = useCallback(() => {
    setMenu(SEED_MENU);
    setOrders([]);
    setCart([]);
  }, [setMenu, setOrders, setCart]);

  const cartCount = cart.reduce((n, l) => n + l.qty, 0);

  const value = useMemo(
    () => ({
      menu, cart, orders, cartOpen, cartCount,
      setCartOpen, addToCart, updateQty, clearCart, placeOrder,
      setOrderStatus, toggleAvailability, saveMenuItem, deleteMenuItem, resetDemo,
    }),
    [menu, cart, orders, cartOpen, cartCount, addToCart, updateQty, clearCart, placeOrder,
      setOrderStatus, toggleAvailability, saveMenuItem, deleteMenuItem, resetDemo],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
