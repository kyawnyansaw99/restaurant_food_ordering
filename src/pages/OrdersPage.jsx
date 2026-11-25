import { Link } from 'react-router-dom';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import StatusBadge from '../components/StatusBadge';
import FoodTile from '../components/FoodTile';
import { money } from '../lib/pricing';

export default function OrdersPage() {
  const { orders, menu, addToCart, setCartOpen } = useStore();

  const reorder = (order) => {
    for (const l of order.lines) {
      const item = menu.find((m) => m.id === l.itemId && m.available);
      if (item) addToCart(item, l.selections, l.qty, l.note);
    }
    setCartOpen(true);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">My orders</h1>
      {orders.length === 0 ? (
        <div className="py-20 text-center text-char-500">
          <p className="text-5xl">🧾</p>
          <p className="mt-3">No orders yet.</p>
          <Link to="/" className="mt-4 inline-block font-semibold text-brand-600 hover:underline">Start an order</Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="flex items-center gap-3 rounded-2xl border border-char-100 bg-white p-4">
              <Link to={`/order/${o.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                <FoodTile image={o.lines[0]?.image} emoji={o.lines[0]?.emoji} seed={o.id} className="h-14 w-14 shrink-0 rounded-xl" size="text-2xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{o.id}</span>
                    <StatusBadge status={o.status} fulfillment={o.fulfillment} />
                  </div>
                  <p className="truncate text-sm text-char-500">{o.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')}</p>
                  <p className="text-xs text-char-500">
                    {new Date(o.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} · {money(o.totals.total)}
                  </p>
                </div>
                <ChevronRight size={18} className="text-char-300" />
              </Link>
              {['delivered', 'cancelled'].includes(o.status) && (
                <button onClick={() => reorder(o)} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-char-100 px-3 py-1.5 text-sm font-medium hover:bg-char-100">
                  <RotateCcw size={14} /> Reorder
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
