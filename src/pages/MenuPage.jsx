import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Clock, Bike, BadgePercent, LayoutGrid, Star, Leaf, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, RESTAURANT } from '../data/menu';
import MenuItemCard from '../components/MenuItemCard';
import ItemModal from '../components/ItemModal';
import { money } from '../lib/pricing';

const FILTERS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'popular', label: 'Popular', icon: Star },
  { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
  { id: 'spicy', label: 'Spicy', icon: Flame },
];

export default function MenuPage() {
  const { menu } = useStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const sectionRefs = useRef({});

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menu.filter(
      (m) =>
        (filter === 'all' || m.tags.includes(filter)) &&
        (!q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)),
    );
  }, [menu, query, filter]);

  const grouped = CATEGORIES.map((c) => ({ ...c, items: visible.filter((m) => m.category === c.id) })).filter((c) => c.items.length);

  // Highlight the category currently in view.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActiveCat(top.target.dataset.cat);
      },
      { rootMargin: '-160px 0px -60% 0px' },
    );
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [grouped.length, query, filter]);

  const jumpTo = (id) => {
    const el = sectionRefs.current[id];
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: 'smooth' });
  };

  return (
    <>
      <section className="bg-char-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.3fr_1fr] md:items-center md:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">Open now · until 10:30 pm</p>
            <h1 className="mt-2 font-display text-4xl font-bold leading-tight md:text-5xl">
              {RESTAURANT.tagline.split(',')[0]},<br />
              <span className="text-brand-400">{RESTAURANT.tagline.split(',')[1]?.trim()}</span>
            </h1>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5"><Clock size={16} /> {RESTAURANT.prepMinutes}–{RESTAURANT.prepMinutes + 15} min</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5"><Bike size={16} /> Free delivery over {money(RESTAURANT.freeDeliveryOver)}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5"><BadgePercent size={16} /> Code <b>WELCOME10</b> for 10% off</span>
            </div>
          </div>
          <div className="hidden grid-cols-3 gap-3 md:grid">
            {['n1', 'r1', 's1', 'so1', 'w6', 'd1'].map((id, i) => (
              <img
                key={id}
                src={`images/${id}.jpg`}
                alt=""
                className={`aspect-square w-full rounded-2xl object-cover shadow-lg ${i % 2 ? 'translate-y-4' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-20 border-b border-char-100 bg-cream/95 backdrop-blur">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-char-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes…"
                className="w-full rounded-full border border-char-100 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-500"
              />
            </label>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {FILTERS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                    filter === id
                      ? 'border-char-900 bg-char-900 text-white'
                      : 'border-char-100 bg-white text-char-700 hover:border-char-300'
                  }`}
                >
                  <Icon size={15} strokeWidth={2.25} />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {grouped.map(({ id, name, icon: Icon, items }) => {
              const active = activeCat === id;
              return (
                <button
                  key={id}
                  onClick={() => jumpTo(id)}
                  className={`group inline-flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-semibold transition ${
                    active ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25' : 'text-char-700 hover:bg-white'
                  }`}
                >
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full transition ${
                      active ? 'bg-white/20' : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100'
                    }`}
                  >
                    <Icon size={15} strokeWidth={2.25} />
                  </span>
                  {name}
                  <span className={`text-xs font-medium ${active ? 'text-white/75' : 'text-char-500'}`}>{items.length}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {grouped.length === 0 && (
          <div className="py-20 text-center text-char-500">
            <p className="text-4xl">🔍</p>
            <p className="mt-2">No dishes match “{query}”.</p>
          </div>
        )}
        {grouped.map((c) => (
          <section key={c.id} data-cat={c.id} ref={(el) => (sectionRefs.current[c.id] = el)} className="mb-10">
            <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-bold">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 text-white">
                <c.icon size={20} strokeWidth={2.25} />
              </span>
              {c.name}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {c.items.map((item) => (
                <MenuItemCard key={item.id} item={item} onSelect={setSelected} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {selected && <ItemModal key={selected.id} item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
