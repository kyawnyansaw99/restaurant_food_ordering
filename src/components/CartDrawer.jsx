import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { cartTotals, describeSelections, money } from '../lib/pricing';
import { RESTAURANT } from '../data/menu';
import FoodTile from './FoodTile';

export function CartLine({ line, menu, onQty, compact = false }) {
  const item = menu.find((m) => m.id === line.itemId);
  const desc = item ? describeSelections(item, line.selections) : '';
  return (
    <div className="flex gap-3 py-3">
      <FoodTile image={line.image ?? item?.image} emoji={line.emoji} alt={line.name} seed={line.itemId} className="h-14 w-14 shrink-0 rounded-lg" size="text-2xl" />
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-2">
          <p className="font-medium leading-snug">{compact && `${line.qty}× `}{line.name}</p>
          <p className="shrink-0 font-medium">{money(line.unitPrice * line.qty)}</p>
        </div>
        {desc && <p className="text-xs text-char-500">{desc}</p>}
        {line.note && <p className="text-xs italic text-char-500">“{line.note}”</p>}
        {onQty && (
          <div className="mt-2 flex items-center gap-2">
            <button onClick={() => onQty(line.key, line.qty - 1)} aria-label="Decrease" className="grid h-7 w-7 place-items-center rounded-full border border-char-100 hover:bg-char-100">
              {line.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
            </button>
            <span className="w-5 text-center text-sm font-semibold">{line.qty}</span>
            <button onClick={() => onQty(line.key, line.qty + 1)} aria-label="Increase" className="grid h-7 w-7 place-items-center rounded-full border border-char-100 hover:bg-char-100">
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { cart, menu, cartOpen, setCartOpen, updateQty } = useStore();
  const navigate = useNavigate();
  const { subtotal } = cartTotals(cart);
  const toFree = RESTAURANT.freeDeliveryOver - subtotal;

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setCartOpen(false)}>
      <aside
        onClick={(e) => e.stopPropagation()}
        className="animate-slide-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-char-100 p-4">
          <h2 className="font-display text-xl font-bold">Your order</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="grid h-9 w-9 place-items-center rounded-full hover:bg-char-100">
            <X size={18} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-char-500">
            <ShoppingBag size={40} className="text-char-300" />
            <p>Your cart is empty.</p>
            <button onClick={() => setCartOpen(false)} className="font-semibold text-brand-600 hover:underline">Browse the menu</button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-char-100 overflow-y-auto px-4">
              {cart.map((line) => (
                <CartLine key={line.key} line={line} menu={menu} onQty={updateQty} />
              ))}
            </div>
            <div className="space-y-3 border-t border-char-100 p-4">
              {toFree > 0 ? (
                <div>
                  <p className="text-sm text-char-700">Add <b>{money(toFree)}</b> more for free delivery</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-char-100">
                    <div className="h-full bg-brand-500" style={{ width: `${Math.min(100, (subtotal / RESTAURANT.freeDeliveryOver) * 100)}%` }} />
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-emerald-700">🎉 You've unlocked free delivery</p>
              )}
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <button
                onClick={() => { setCartOpen(false); navigate('/checkout'); }}
                className="w-full rounded-full bg-brand-500 py-3 font-semibold text-white hover:bg-brand-600"
              >
                Go to checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
