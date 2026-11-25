import { useEffect, useState } from 'react';
import { X, Minus, Plus, Check } from 'lucide-react';
import FoodTile from './FoodTile';
import { Tags } from './MenuItemCard';
import { money, unitPrice } from '../lib/pricing';
import { useStore } from '../context/StoreContext';

function defaultSelections(item) {
  const s = {};
  for (const g of item.options) s[g.id] = g.type === 'multi' ? [] : g.required ? g.choices[0].id : null;
  return s;
}

export default function ItemModal({ item, onClose }) {
  const { addToCart } = useStore();
  const [selections, setSelections] = useState(() => defaultSelections(item));
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const pick = (group, choiceId) =>
    setSelections((s) => {
      if (group.type === 'single') return { ...s, [group.id]: choiceId };
      const cur = s[group.id];
      return { ...s, [group.id]: cur.includes(choiceId) ? cur.filter((c) => c !== choiceId) : [...cur, choiceId] };
    });

  const total = unitPrice(item, selections) * qty;

  const submit = () => {
    addToCart(item, selections, qty, note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        onClick={(e) => e.stopPropagation()}
        className="animate-pop flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
      >
        <div className="relative">
          <FoodTile image={item.image} emoji={item.emoji} alt={item.name} seed={item.id} className="h-56 w-full sm:h-64" size="text-7xl" />
          <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 hover:bg-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <h2 className="font-display text-2xl font-bold">{item.name}</h2>
          <p className="mt-1 text-char-500">{item.description}</p>
          <div className="mt-3"><Tags tags={item.tags} /></div>

          {item.options.map((group) => (
            <fieldset key={group.id} className="mt-6">
              <legend className="mb-2 flex w-full items-center justify-between">
                <span className="font-semibold">{group.name}</span>
                <span className="text-xs text-char-500">{group.required ? 'Required' : 'Optional'}</span>
              </legend>
              <div className="space-y-2">
                {group.choices.map((c) => {
                  const active = group.type === 'single' ? selections[group.id] === c.id : selections[group.id].includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => pick(group, c.id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                        active ? 'border-brand-500 bg-brand-50' : 'border-char-100 hover:border-char-300'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`grid h-5 w-5 place-items-center border ${group.type === 'single' ? 'rounded-full' : 'rounded-md'} ${
                            active ? 'border-brand-500 bg-brand-500 text-white' : 'border-char-300'
                          }`}
                        >
                          {active && <Check size={12} strokeWidth={3} />}
                        </span>
                        {c.name}
                      </span>
                      {c.price > 0 && <span className="text-char-500">+{money(c.price)}</span>}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <label className="mt-6 block">
            <span className="font-semibold">Special instructions</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="e.g. no peanuts, sauce on the side"
              className="mt-2 w-full rounded-xl border border-char-100 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 border-t border-char-100 p-4">
          <div className="flex items-center gap-2 rounded-full border border-char-100 p-1">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="grid h-8 w-8 place-items-center rounded-full hover:bg-char-100">
              <Minus size={16} />
            </button>
            <span className="w-6 text-center font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" className="grid h-8 w-8 place-items-center rounded-full hover:bg-char-100">
              <Plus size={16} />
            </button>
          </div>
          <button onClick={submit} className="flex flex-1 items-center justify-between rounded-full bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600">
            <span>Add to cart</span>
            <span>{money(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
