import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderPage from './pages/OrderPage';
import OrdersPage from './pages/OrdersPage';
import KitchenPage from './pages/KitchenPage';
import { RESTAURANT } from './data/menu';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/kitchen" element={<KitchenPage />} />
          <Route path="*" element={<MenuPage />} />
        </Routes>
      </div>
      <footer className="border-t border-char-100 py-6 text-center text-xs text-char-500">
        © {new Date().getFullYear()} {RESTAURANT.name} · 12 Market Street · Open daily 11:00–22:30
      </footer>
      <CartDrawer />
    </div>
  );
}
