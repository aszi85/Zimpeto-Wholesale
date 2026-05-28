'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';  // <-- FIXED PATH
import { ALL_PRODUCTS } from '@/data';
import Subnav from '@/components/subnav';

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = searchQuery.length > 1 
    ? ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5) 
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Loja', href: '/loja' },
    { name: 'Receitas', href: '/receitas' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <>
      <nav className="w-full bg-white border-b border-[#e0f2ed] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <button onClick={() => router.push('/')} className="font-black text-2xl text-[#004d40] italic shrink-0">
            ZIMPETO
          </button>

          {/* PESQUISA DESKTOP */}
          <div className="hidden md:block relative flex-1 max-w-md mx-6" ref={searchRef}>
            <input 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
              placeholder="Pesquisar produtos..." 
              className="w-full p-2 border border-[#004d40] text-sm outline-none"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border shadow-lg z-50">
                {suggestions.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => { 
                      router.push(`/loja?q=${encodeURIComponent(p.name)}`); 
                      setShowSuggestions(false); 
                      setSearchQuery(''); 
                    }} 
                    className="block w-full p-2 text-left hover:bg-gray-100 text-sm border-b"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AÇÕES MOBILE/DESKTOP */}
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="font-bold text-sm">CESTO ({cartCount})</button>
            <button className="lg:hidden p-2 text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* PAINEL MOBILE (Dropdown) */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-xl w-full">
            <input 
              className="w-full p-2 border border-[#004d40]" 
              placeholder="Pesquisar..." 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {navLinks.map(link => (
              <button 
                key={link.name} 
                onClick={() => { router.push(link.href); setIsMenuOpen(false); }} 
                className="text-left font-bold py-2 border-b"
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </nav>
      
      {/* Subnav - placed directly under main navbar */}
      <Subnav />
    </>
  );
}