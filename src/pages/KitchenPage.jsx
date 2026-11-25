import { useState } from 'react';
import { Pencil, Trash2, Plus, RotateCcw, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/menu';
import { describeSelections, money } from '../lib/pricing';
import StatusBadge from '../components/StatusBadge';
import FoodTile from '../components/FoodTile';

const NEXT = {
  placed: { delivery: 'preparing', pickup: 'preparing' },
  preparing: { delivery: 'ready', pickup: 'ready' },
  ready: { delivery: 'on_the_way', pickup: 'delivered' },
  on_the_way: { delivery: 'delivered' },
};
const NEXT_LABEL = {
  preparing: 'Start preparing',
  ready: 'Mark ready',
  on_the_way: 'Send out for delivery',
  delivered: 'Complete',
};

const COLUMNS = [
  { id: 'placed', title: 'New' },
  { id: 'preparing', title: 'Preparing' },
  { id: 'ready', title: 'Ready' },
  { id: 'on_the_way', title: 'Out for delivery' },
];

const minsAgo = (iso) => Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));

function OrderTicket({ order, menu, onAdvance, onCancel }) {
  const next = NEXT[order.status]?.[order.fulfillment];
  return (
    <div className="rounded-xl border border-char-100 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{order.id}</span>
        <span className="text-xs text-char-500">{minsAgo(order.createdAt)} min ago</span>
      </div>
      <p className="text-xs text-char-500">
        {order.customer.name} · {order.fulfillment === 'delivery' ? '🛵 Delivery' : '🏪 Pickup'}
      </p>
      <ul className="mt-2 space-y-1 text-sm">
        {order.lines.map((l) => {
          const item = menu.find((m) => m.id === l.itemId);
          const desc = item ? describeSelections(item, l.selections) : '';
          return (
            <li key={l.key}>
              <b>{l.qty}×</b> {l.name}
              {desc && <span className="block pl-5 text-xs text-char-500">{desc}</span>}
              {l.note && <span className="block pl-5 text-xs italic text-brand-700">“{l.note}”</span>}
            </li>
          );
        })}
      </ul>
      {order.instructions && <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-800">{order.instructions}</p>}
      <div className="mt-3 flex gap-2">
        {next && (
          <button onClick={() => onAdvance(order.id, next)} className="flex-1 rounded-lg bg-brand-500 py-2 text-sm font-semibold text-white hover:bg-brand-600">
            {NEXT_LABEL[next]}
          </button>
        )}
        {order.status === 'placed' && (
          <button onClick={() => onCancel(order.id)} className="rounded-lg border border-char-100 px-3 text-sm text-char-700 hover:bg-char-100">Reject</button>
        )}
      </div>
    </div>
  );
}

function OrdersBoard() {
  const { orders, menu, setOrderStatus } = useStore();
  const active = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
  const done = orders.filter((o) => ['delivered', 'cancelled'].includes(o.status));
  const today = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString() && o.status !== 'cancelled');
  const revenue = today.reduce((s, o) => s + o.totals.total, 0);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Active orders', active.length],
          ['Orders today', today.length],
          ['Revenue today', money(revenue)],
          ['Avg. order', today.length ? money(revenue / today.length) : '—'],
        ].map(([label, val]) => (
          <div key={label} className="rounded-2xl border border-char-100 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-char-500">{label}</p>
            <p className="mt-1 text-2xl font-bold">{val}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const list = active.filter((o) => o.status === col.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
          return (
            <section key={col.id} className="rounded-2xl bg-char-100/60 p-3">
              <h3 className="mb-3 flex items-center justify-between px-1 text-sm font-semibold">
                {col.title}
                <span className="rounded-full bg-white px-2 py-0.5 text-xs">{list.length}</span>
              </h3>
              <div className="space-y-3">
                {list.length === 0 && <p className="px-1 py-6 text-center text-xs text-char-500">Nothing here</p>}
                {list.map((o) => (
                  <OrderTicket key={o.id} order={o} menu={menu} onAdvance={setOrderStatus} onCancel={(id) => setOrderStatus(id, 'cancelled')} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {done.length > 0 && (
        <section className="mt-8">
          <h3 className="mb-3 font-semibold">Completed</h3>
          <div className="overflow-x-auto rounded-2xl border border-char-100 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-char-100/50 text-left text-xs uppercase text-char-500">
                <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Items</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-char-100">
                {done.map((o) => (
                  <tr key={o.id}>
                    <td className="p-3 font-medium">{o.id}</td>
                    <td className="p-3">{o.customer.name}</td>
                    <td className="p-3 text-char-500">{o.lines.reduce((n, l) => n + l.qty, 0)}</td>
                    <td className="p-3">{money(o.totals.total)}</td>
                    <td className="p-3"><StatusBadge status={o.status} fulfillment={o.fulfillment} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

const EMPTY = { name: '', description: '', price: '', category: CATEGORIES[0].id, emoji: '🍽️', image: '', tags: [] };

function MenuEditor({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial ? { ...initial, price: String(initial.price) } : EMPTY);
  const [err, setErr] = useState('');
  const toggleTag = (t) => setF((s) => ({ ...s, tags: s.tags.includes(t) ? s.tags.filter((x) => x !== t) : [...s.tags, t] }));
  const input = 'w-full rounded-xl border border-char-100 px-3 py-2 text-sm outline-none focus:border-brand-500';

  const save = (e) => {
    e.preventDefault();
    const price = parseFloat(f.price);
    if (!f.name.trim() || !(price > 0)) return setErr('Name and a price above 0 are required.');
    onSave({
      options: [],
      available: true,
      ...f,
      id: f.id ?? `m${Date.now()}`,
      name: f.name.trim(),
      description: f.description.trim(),
      price: Math.round(price * 100) / 100,
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="animate-pop w-full max-w-md space-y-4 rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">{initial ? 'Edit dish' : 'New dish'}</h3>
          <button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-[72px_1fr] gap-3">
          <label className="text-sm">Emoji<input value={f.emoji} onChange={(e) => setF({ ...f, emoji: e.target.value })} className={`${input} mt-1 text-center text-xl`} /></label>
          <label className="text-sm">Name<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={`${input} mt-1`} /></label>
        </div>
        <div className="grid grid-cols-[72px_1fr] items-end gap-3">
          <FoodTile key={f.image} image={f.image} emoji={f.emoji} seed={f.name} className="h-[72px] w-[72px] rounded-xl" size="text-3xl" />
          <label className="text-sm">Photo URL <span className="text-char-500">(optional)</span>
            <input value={f.image ?? ''} onChange={(e) => setF({ ...f, image: e.target.value.trim() })} placeholder="https://… or /images/n1.jpg" className={`${input} mt-1`} />
          </label>
        </div>
        <label className="block text-sm">Description<textarea rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={`${input} mt-1`} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">Price (฿)<input type="number" step="1" min="0" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} className={`${input} mt-1`} /></label>
          <label className="text-sm">Category
            <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className={`${input} mt-1`}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>
        <div className="flex gap-2">
          {['popular', 'spicy', 'vegetarian'].map((t) => (
            <button key={t} type="button" onClick={() => toggleTag(t)} className={`rounded-full px-3 py-1 text-sm capitalize ${f.tags.includes(t) ? 'bg-char-900 text-white' : 'bg-char-100'}`}>{t}</button>
          ))}
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded-full bg-brand-500 py-2.5 font-semibold text-white hover:bg-brand-600">Save</button>
      </form>
    </div>
  );
}

function MenuManager() {
  const { menu, toggleAvailability, saveMenuItem, deleteMenuItem } = useStore();
  const [editing, setEditing] = useState(null); // null | 'new' | item

  return (
    <>
      <div className="flex justify-end">
        <button onClick={() => setEditing('new')} className="inline-flex items-center gap-1.5 rounded-full bg-char-900 px-4 py-2 text-sm font-semibold text-white hover:bg-char-700">
          <Plus size={16} /> Add dish
        </button>
      </div>
      {CATEGORIES.map((c) => {
        const items = menu.filter((m) => m.category === c.id);
        if (!items.length) return null;
        return (
          <section key={c.id} className="mt-6">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <c.icon size={18} className="text-brand-600" /> {c.name}
            </h3>
            <div className="divide-y divide-char-100 rounded-2xl border border-char-100 bg-white">
              {items.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3">
                  <FoodTile image={m.image} emoji={m.emoji} alt={m.name} seed={m.id} className="h-12 w-12 shrink-0 rounded-lg" size="text-2xl" />
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium ${m.available ? '' : 'text-char-500 line-through'}`}>{m.name}</p>
                    <p className="text-xs text-char-500">{money(m.price)}{m.options.length ? ` · ${m.options.length} option group(s)` : ''}</p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-char-500">
                    <span className="hidden sm:inline">{m.available ? 'Available' : 'Sold out'}</span>
                    <input type="checkbox" checked={m.available} onChange={() => toggleAvailability(m.id)} className="peer sr-only" />
                    <span className="relative h-6 w-11 rounded-full bg-char-300 transition peer-checked:bg-emerald-500 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
                  </label>
                  <button onClick={() => setEditing(m)} aria-label={`Edit ${m.name}`} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-char-100"><Pencil size={15} /></button>
                  <button onClick={() => confirm(`Delete ${m.name}?`) && deleteMenuItem(m.id)} aria-label={`Delete ${m.name}`} className="grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {editing && (
        <MenuEditor
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(item) => { saveMenuItem(item); setEditing(null); }}
        />
      )}
    </>
  );
}

export default function KitchenPage() {
  const [tab, setTab] = useState('orders');
  const { resetDemo } = useStore();
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Staff</p>
          <h1 className="font-display text-3xl font-bold">Kitchen dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-char-100 p-1">
            {[['orders', 'Orders'], ['menu', 'Menu']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tab === id ? 'bg-white shadow-sm' : 'text-char-500'}`}>{label}</button>
            ))}
          </div>
          <button onClick={() => confirm('Reset menu and delete all orders?') && resetDemo()} title="Reset demo data" className="grid h-9 w-9 place-items-center rounded-full text-char-500 hover:bg-char-100">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      <div className="mt-6">{tab === 'orders' ? <OrdersBoard /> : <MenuManager />}</div>
    </main>
  );
}
