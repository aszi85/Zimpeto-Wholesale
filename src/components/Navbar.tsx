'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../app/context/CartContext';
import { ALL_PRODUCTS, CATEGORIES } from '../data';

const GROCERY_SECTIONS = [
  { id: 'fardos', name: 'Fardos & Grossista', desc: 'Arroz, farinhas, açúcar em grande escala' },
  { id: 'oleos', name: 'Óleos & Gorduras', desc: 'Óleo alimentar, azeites, margarinas' },
  { id: 'frescos', name: 'Frescos & Hortícolas', desc: 'Batatas, cebolas e hortaliças do mercado' },
  { id: 'limpeza', name: 'Higiene & Limpeza', desc: 'Detergentes em pó, sabões e desinfetantes' },
];

const RECIPE_SECTIONS = [
  { filter: 'tradicional', name: 'Pratos Tradicionais', count: 'Massa com caril, caril de amendoim...' },
  { filter: 'economico', name: 'Refeições Económicas', count: 'Maximização de sacos e fardos' },
  { filter: 'negocio', name: 'Para Cozinhas & Takeaways', count: 'Rendimento para grandes volumes' },
];

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Loja', href: '/loja' },
    { name: 'Receitas', href: '/receitas' },
    { name: 'Contacte-nos', href: '/contacto' },
    { name: 'Localização', href: '/localizacao' },
  ];

  const suggestions = searchQuery.length > 1 && ALL_PRODUCTS
    ? ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/loja?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <nav ref={navRef} className="w-full z-[100] bg-white sticky top-0 border-b border-[#e0f2ed]">
      {/* TOP INFO BAR */}
      <div className="bg-[#004d40] text-white text-[10px] font-bold py-2 px-4 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#ff9800]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          Mercado do Zimpeto, Bancada 42-B, Maputo
        </span>
        
        <div className="hidden md:flex items-center gap-6">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#ff9800]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.43 1.43 0 0 0 2.022 0l4.319-4.319a1.43 1.43 0 0 0 0-2.022l-9.58-9.581A2.25 2.25 0 0 0 9.568 3Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
            15% off em fardos de arroz esta semana
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#ff9800]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            Entrega gratuita acima de 5.000 MT
          </span>
        </div>

        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#ff9800]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.47-5.112-3.758-6.582-6.582l1.293-.97c.362-.272.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
          +258 84 123 4567
        </span>
      </div>

      {/* MAIN NAVBAR */}
      <div className="border-b border-[#e0f2ed]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 flex items-center gap-4">

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-[#f0faf7] rounded cursor-pointer"
          >
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-[#004d40] transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-[#004d40] ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-[#004d40] transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>

          {/* LOGO */}
          <button onClick={() => router.push('/')} className="font-black text-2xl text-[#004d40] italic tracking-tighter shrink-0 cursor-pointer hover:opacity-80 transition-opacity text-left">
            ZIMPETO
            <span className="text-[#004d40]/50 text-[9px] not-italic ml-1 tracking-[0.2em] uppercase font-bold block leading-none">Wholesale</span>
          </button>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
            <div className="static">
              <button
                onClick={() => setIsCatOpen(!isCatOpen)}
                className="flex items-center gap-2.5 bg-[#004d40] text-white px-4 py-2.5 text-[10px] font-black uppercase tracking-wider hover:bg-[#00332b] transition-colors cursor-pointer"
              >
                <div className="flex flex-col gap-1 w-3.5">
                  <span className={`block h-0.5 w-3.5 bg-white transition-all duration-200 ${isCatOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`block h-0.5 w-3.5 bg-white transition-all duration-200 ${isCatOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 w-3.5 bg-white transition-all duration-200 ${isCatOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
                <span>Explorar</span>
              </button>

              {/* MEGA DROPDOWN PANEL */}
              {isCatOpen && (
                <div
                  className="absolute top-full left-0 w-full bg-white border-b border-[#e0f2ed] shadow-2xl z-50 py-8 animate-fadeIn"
                  onMouseLeave={() => setIsCatOpen(false)}
                >
                  <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-3 gap-8">
                    {/* ... (Conteúdo do Mega Dropdown permanece igual) ... */}
                    <div className="space-y-4">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-[#004d40]">Mercearia & Grossista</h4>
                        <div className="space-y-1">
                            {GROCERY_SECTIONS.map(sec => (
                            <button key={sec.id} onClick={() => { router.push(`/loja?sec=${sec.id}`); setIsCatOpen(false); }} className="w-full text-left p-2 rounded hover:bg-[#f0faf7] flex flex-col transition-colors group cursor-pointer">
                                <span className="text-[11px] font-bold uppercase text-[#004d40] group-hover:text-[#ff9800]">{sec.name}</span>
                                <span className="text-[10px] text-[#004d40]/40 mt-0.5">{sec.desc}</span>
                            </button>
                            ))}
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => router.push('/#promos')} className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[#004d40] hover:bg-[#f0faf7] transition-colors cursor-pointer">
              Promoções
            </button>
          </div>

          {/* SEARCH BAR (WITH INTEGRATED NAV) */}
          <div className="flex-1 relative" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Pesquisar produtos, fardos, frescos..."
                  className="w-full border-2 border-[#004d40] py-2.5 pl-4 pr-14 text-[12px] font-medium outline-none focus:ring-2 focus:ring-[#ff9800] focus:border-[#ff9800] transition-all bg-white"
                />
                <button type="submit" className="absolute right-0 bg-[#004d40] text-white h-full px-5 hover:bg-[#00332b] cursor-pointer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" /></svg>
                </button>
              </div>
            </form>

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-[#e0f2ed] shadow-xl z-50 mt-0.5">
                {/* ... (Seu mapeamento de sugestões original) ... */}
              </div>
            )}

            {/* INTEGRATED NAVIGATION BAR (NO GRAY) */}
            <div className="bg-[#f0faf7] border-t border-[#e0f2ed] px-4 py-2 mt-2 flex items-center gap-6">
              {[
                { name: 'Início', path: '/' },
                { name: 'Loja', path: '/loja' },
                { name: 'Receitas', path: '/receitas' },
                { name: 'Contacte-nos', path: '/contacto' }
              ].map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => router.push(link.path)}
                  className="text-[10px] font-black uppercase text-[#004d40] hover:text-[#ff9800] transition-colors cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* CART */}
          <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 text-[#004d40] cursor-pointer p-2 hover:bg-[#f0faf7] rounded transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
            <div className="hidden sm:block text-left">
              <div className="text-[8px] uppercase font-black tracking-wider text-[#004d40]/60">Cesto</div>
              <div className="text-lg font-black leading-none text-[#004d40]">{cartCount}</div>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}