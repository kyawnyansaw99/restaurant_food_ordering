import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, ChefHat, UtensilsCrossed } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { RESTAURANT } from '../data/menu';

const linkCls = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-char-700 hover:bg-char-100'
  }`;

export default function Navbar() {
  const { cartCount, setCartOpen } = useStore();
  return (
    <header className="sticky top-0 z-30 border-b border-char-100 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white">
            <UtensilsCrossed size={18} strokeWidth={2.25} />
          </span>
          <span className="font-display text-xl font-bold">{RESTAURANT.name}</span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={linkCls}>Menu</NavLink>
          <NavLink to="/orders" className={linkCls}>My orders</NavLink>
          <NavLink to="/kitchen" className={linkCls}>
            <span className="inline-flex items-center gap-1.5"><ChefHat size={16} /> <span className="hidden sm:inline">Kitchen</span></span>
          </NavLink>
          <button
            onClick={() => setCartOpen(true)}
            className="relative ml-2 inline-flex items-center gap-2 rounded-full bg-char-900 px-4 py-2 text-sm font-semibold text-white hover:bg-char-700"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-xs">{cartCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
