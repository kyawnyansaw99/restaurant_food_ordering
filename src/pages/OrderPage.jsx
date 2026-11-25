import { Link, useParams } from 'react-router-dom';
import { Check, Phone, MapPin, Store } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ORDER_STATUSES, RESTAURANT } from '../data/menu';
import { CartLine } from '../components/CartDrawer';
import StatusBadge, { statusLabel } from '../components/StatusBadge';
import { money } from '../lib/pricing';

const time = (iso) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export default function OrderPage() {
  const { id } = useParams();
  const { orders, menu, setOrderStatus } = useStore();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Order not found</h1>
        <Link to="/orders" className="mt-4 inline-block font-semibold text-brand-600 hover:underline">See your orders</Link>
      </main>
    );
  }

  const steps = ORDER_STATUSES.filter((s) => order.fulfillment === 'delivery' || s.id !== 'on_the_way');
  const currentIdx = steps.findIndex((s) => s.id === order.status);
  const cancelled = order.status === 'cancelled';
  const eta = new Date(new Date(order.createdAt).getTime() + (RESTAURANT.prepMinutes + (order.fulfillment === 'delivery' ? 20 : 0)) * 60000);
  const stamp = (status) => order.history.find((h) => h.status === status)?.at;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-3xl bg-char-900 p-6 text-white md:p-8">
        <p className="text-sm text-char-300">Order {order.id}</p>
        <h1 className="mt-1 font-display text-3xl font-bold">
          {cancelled ? 'Order cancelled' : order.status === 'delivered' ? 'Enjoy your meal! 🎉' : `Thanks, ${order.customer.name.split(' ')[0]}!`}
        </h1>
        {!cancelled && order.status !== 'delivered' && (
          <p className="mt-2 text-char-300">
            Estimated {order.fulfillment === 'delivery' ? 'arrival' : 'pickup'}: <b className="text-white">{time(eta.toISOString())}</b>
          </p>
        )}

        {!cancelled && (
          <ol className="mt-8 grid gap-4" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
            {steps.map((s, i) => {
              const done = i <= currentIdx;
              return (
                <li key={s.id} className="relative">
                  {i > 0 && <span className={`absolute right-1/2 top-4 h-0.5 w-full ${i <= currentIdx ? 'bg-brand-500' : 'bg-white/15'}`} />}
                  <div className="relative flex flex-col items-center text-center">
                    <span className={`grid h-8 w-8 place-items-center rounded-full ${done ? 'bg-brand-500' : 'bg-char-700'} ${i === currentIdx ? 'ring-4 ring-brand-500/30' : ''}`}>
                      {done ? <Check size={16} strokeWidth={3} /> : <span className="text-xs">{i + 1}</span>}
                    </span>
                    <span className={`mt-2 text-xs font-medium ${done ? 'text-white' : 'text-char-300'}`}>{statusLabel(s.id, order.fulfillment)}</span>
                    {stamp(s.id) && <span className="text-[11px] text-char-300">{time(stamp(s.id))}</span>}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-char-500">
        This page updates live. Open the <Link to="/kitchen" className="underline">Kitchen</Link> view in another tab to move the order along.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-char-100 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Items</h2>
            <StatusBadge status={order.status} fulfillment={order.fulfillment} />
          </div>
          <div className="divide-y divide-char-100">
            {order.lines.map((l) => <CartLine key={l.key} line={l} menu={menu} compact />)}
          </div>
          <dl className="mt-3 space-y-1 border-t border-char-100 pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-char-500">Subtotal</dt><dd>{money(order.totals.subtotal)}</dd></div>
            {order.totals.discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount ({order.promo})</dt><dd>−{money(order.totals.discount)}</dd></div>}
            {order.fulfillment === 'delivery' && <div className="flex justify-between"><dt className="text-char-500">Delivery</dt><dd>{order.totals.deliveryFee ? money(order.totals.deliveryFee) : 'Free'}</dd></div>}
            <div className="flex justify-between font-bold"><dt>Total</dt><dd>{money(order.totals.total)}</dd></div>
            <div className="flex justify-between text-xs text-char-500"><dt>Includes VAT 7%</dt><dd>{money(order.totals.vatIncluded ?? 0)}</dd></div>
          </dl>
        </section>

        <section className="h-fit space-y-4 rounded-2xl border border-char-100 bg-white p-5 text-sm">
          <h2 className="font-semibold">Details</h2>
          <p className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-char-500" /> {order.customer.name} · {order.customer.phone}</p>
          {order.fulfillment === 'delivery' ? (
            <p className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-char-500" /> {order.address}</p>
          ) : (
            <p className="flex gap-2"><Store size={16} className="mt-0.5 shrink-0 text-char-500" /> Pickup at {RESTAURANT.name}</p>
          )}
          {order.instructions && <p className="text-char-500">Note: {order.instructions}</p>}
          <p className="text-char-500">Payment: {order.payment === 'cash' ? 'Cash' : 'Card'} on {order.fulfillment === 'delivery' ? 'delivery' : 'pickup'}</p>
          {order.status === 'placed' && (
            <button
              onClick={() => confirm('Cancel this order?') && setOrderStatus(order.id, 'cancelled')}
              className="w-full rounded-full border border-red-200 py-2.5 font-semibold text-red-600 hover:bg-red-50"
            >
              Cancel order
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
