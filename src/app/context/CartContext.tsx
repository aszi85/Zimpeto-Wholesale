'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  img: string;
  tag?: string;
  details?: Record<string, string>;
  qtdOptions?: number[];
  category?: string;
}

export interface CartItem extends Product {
  qtd: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (v: boolean) => void;
  lastAdded: string | null;
  popupProduct: Product | null;
  setPopupProduct: (p: Product | null) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [popupProduct, setPopupProduct] = useState<Product | null>(null);

  const addToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qtd: item.qtd + qty } : item
        );
      }
      return [...prev, { ...product, qtd: qty }];
    });
    setLastAdded(product.name);
    setTimeout(() => setLastAdded(null), 3000);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qtd: Math.max(1, item.qtd + delta) } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.qtd, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qtd, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity,
      cartCount, cartTotal, isCartOpen, setIsCartOpen,
      lastAdded, popupProduct, setPopupProduct, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
