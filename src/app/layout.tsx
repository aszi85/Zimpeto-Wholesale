import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from './context/CartContext';
import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';
import AddToCartPopup from '../components/AddToCartPopup';
import Footer from '../components/Footer';
import VisitorTracker from '../components/VisitorTracker';

export const metadata: Metadata = {
  title: 'Zimpeto Wholesale | Mercado de Atacado em Maputo',
  description: 'Compre produtos a granel e fardos directamente do Zimpeto. Arroz, óleo, farinhas, frescos e mais.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="bg-[#f2f2f2] min-h-screen w-full overflow-x-hidden">
        <CartProvider>
          <VisitorTracker />
          <Navbar />
          <main className="w-full px-4 md:px-8 lg:px-16">
            {children}
          </main>
          <Footer />
          <CartSidebar />
          <AddToCartPopup />
        </CartProvider>
      </body>
    </html>
  );
}
