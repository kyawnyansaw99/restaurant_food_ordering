import { Plus, Flame, Leaf, Star } from 'lucide-react';
import FoodTile from './FoodTile';
import { money } from '../lib/pricing';

export function Tags({ tags }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.includes('popular') && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
          <Star size={12} /> Popular
        </span>
      )}
      {tags.includes('spicy') && (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          <Flame size={12} /> Spicy
        </span>
      )}
      {tags.includes('vegetarian') && (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
          <Leaf size={12} /> Veg
        </span>
      )}
    </div>
  );
}

export default function MenuItemCard({ item, onSelect }) {
  const disabled = !item.available;
  return (
    <button
      onClick={() => !disabled && onSelect(item)}
      disabled={disabled}
      className="group flex flex-col overflow-hidden rounded-2xl border border-char-100 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
    >
      <div className="relative">
        <FoodTile image={item.image} emoji={item.emoji} alt={item.name} seed={item.id} className="aspect-[4/3] w-full" />
        {disabled ? (
          <span className="absolute inset-0 grid place-items-center bg-white/60 text-sm font-semibold text-char-700">Sold out</span>
        ) : (
          <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white text-brand-600 shadow-md transition group-hover:bg-brand-500 group-hover:text-white">
            <Plus size={20} />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug">{item.name}</h3>
          <span className="shrink-0 font-semibold text-brand-700">{money(item.price)}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-char-500">{item.description}</p>
        {item.tags.length > 0 && <div className="mt-auto pt-3"><Tags tags={item.tags} /></div>}
      </div>
    </button>
  );
}
