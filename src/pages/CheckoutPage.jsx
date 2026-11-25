import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bike, Store, Banknote, CreditCard, ArrowLeft, Tag, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CartLine } from '../components/CartDrawer';
import { cartTotals, money, PROMO_CODES } from '../lib/pricing';
import { RESTAURANT } from '../data/menu';

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-char-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

const inputCls = (err) =>
  `w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 ${err ? 'border-red-400' : 'border-char-100'}`;

function Choice({ active, onClick, icon: Icon, title, subtitle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center gap-3 rounded-xl border p-4 text-left transition ${
        active ? 'border-brand-500 bg-brand-50' : 'border-char-100 bg-white hover:border-char-300'
      }`}
    >
      <Icon size={22} className={active ? 'text-brand-600' : 'text-char-500'} />
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-xs text-char-500">{subtitle}</span>
      </span>
    </button>
  );
}

export default function CheckoutPage() {
  const { cart, menu, updateQty, placeOrder } = useStore();
  const navigate = useNavigate();
  const [fulfillment, setFulfillment] = useState('delivery');
  const [payment, setPayment] = useState('cash');
  const [form, setForm] = useState({ name: '', phone: '', address: '', instructions: '' });
  const [errors, setErrors] = useState({});
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const totals = cartTotals(cart, fulfillment, promo);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h1>
        <Link to="/" className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600">Browse the menu</Link>
      </main>
    );
  }

  const applyPromo = () => {
    const p = PROMO_CODES[promoInput.trim().toUpperCase()];
    if (p) { setPromo(p); setPromoError(''); setPromoInput(''); }
    else setPromoError('That code isn’t valid.');
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your name.';
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) errs.phone = 'Please enter a valid phone number.';
    if (fulfillment === 'delivery' && form.address.trim().length < 6) errs.address = 'Please enter a delivery address.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const id = placeOrder({
      customer: { name: form.name.trim(), phone: form.phone.trim() },
      fulfillment,
      address: fulfillment === 'delivery' ? form.address.trim() : null,
      instructions: form.instructions.trim(),
      payment,
      promo: promo?.code ?? null,
      totals,
    });
    navigate(`/order/${id}`);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-char-500 hover:text-char-900">
        <ArrowLeft size={16} /> Back to menu
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Checkout</h1>

      <form onSubmit={submit} className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-lg font-semibold">1. How do you want it?</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Choice active={fulfillment === 'delivery'} onClick={() => setFulfillment('delivery')} icon={Bike} title="Delivery" subtitle={`${RESTAURANT.prepMinutes + 10}–${RESTAURANT.prepMinutes + 25} min`} />
              <Choice active={fulfillment === 'pickup'} onClick={() => setFulfillment('pickup')} icon={Store} title="Pickup" subtitle={`Ready in ~${RESTAURANT.prepMinutes} min`} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">2. Your details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name}>
                <input value={form.name} onChange={set('name')} autoComplete="name" className={inputCls(errors.name)} />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input value={form.phone} onChange={set('phone')} type="tel" autoComplete="tel" className={inputCls(errors.phone)} />
              </Field>
              {fulfillment === 'delivery' && (
                <div className="sm:col-span-2">
                  <Field label="Delivery address" error={errors.address}>
                    <input value={form.address} onChange={set('address')} autoComplete="street-address" placeholder="Street, building, unit" className={inputCls(errors.address)} />
                  </Field>
                </div>
              )}
              <div className="sm:col-span-2">
                <Field label={fulfillment === 'delivery' ? 'Notes for the rider (optional)' : 'Notes for the kitchen (optional)'}>
                  <input value={form.instructions} onChange={set('instructions')} className={inputCls()} />
                </Field>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">3. Payment</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Choice active={payment === 'cash'} onClick={() => setPayment('cash')} icon={Banknote} title="Cash" subtitle={fulfillment === 'delivery' ? 'Pay the rider' : 'Pay at the counter'} />
              <Choice active={payment === 'card'} onClick={() => setPayment('card')} icon={CreditCard} title="Card" subtitle={fulfillment === 'delivery' ? 'Card machine on delivery' : 'Tap at the counter'} />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-char-100 bg-white p-5 lg:sticky lg:top-24">
          <h2 className="font-semibold">Order summary</h2>
          <div className="mt-2 max-h-72 divide-y divide-char-100 overflow-y-auto">
            {cart.map((l) => <CartLine key={l.key} line={l} menu={menu} onQty={updateQty} />)}
          </div>

          <div className="mt-4 border-t border-char-100 pt-4">
            {promo ? (
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                <span className="inline-flex items-center gap-2"><Tag size={14} /> {promo.code} · {promo.label}</span>
                <button type="button" onClick={() => setPromo(null)} aria-label="Remove promo"><X size={16} /></button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
                    placeholder="Promo code"
                    className={inputCls(promoError)}
                  />
                  <button type="button" onClick={applyPromo} className="rounded-xl border border-char-100 px-4 text-sm font-semibold hover:bg-char-100">Apply</button>
                </div>
                {promoError && <p className="mt-1 text-xs text-red-600">{promoError}</p>}
              </div>
            )}
          </div>

          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-char-500">Subtotal</dt><dd>{money(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount</dt><dd>−{money(totals.discount)}</dd></div>}
            {fulfillment === 'delivery' && (
              <div className="flex justify-between"><dt className="text-char-500">Delivery</dt><dd>{totals.deliveryFee ? money(totals.deliveryFee) : 'Free'}</dd></div>
            )}
            <div className="flex justify-between border-t border-char-100 pt-2 text-base font-bold"><dt>Total</dt><dd>{money(totals.total)}</dd></div>
            <div className="flex justify-between text-xs text-char-500"><dt>Includes VAT 7%</dt><dd>{money(totals.vatIncluded)}</dd></div>
          </dl>

          <button type="submit" className="mt-5 w-full rounded-full bg-brand-500 py-3 font-semibold text-white hover:bg-brand-600">
            Place order · {money(totals.total)}
          </button>
        </aside>
      </form>
    </main>
  );
}
