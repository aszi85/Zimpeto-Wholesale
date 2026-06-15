'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS, CATEGORIES } from '../../data';

function LojaContent() {
  const { setPopupProduct, t } = useCart();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const cat = searchParams.get('cat');
    const q = searchParams.get('q');
    if (cat) setActiveCategory(cat);
    if (q) {
      const cleanedQ = q.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]+$/, "").trim();
      setSearchQuery(cleanedQ);
    }
  }, [searchParams]);

  const filtered = ALL_PRODUCTS
    .filter(p => {
      const matchesCat = activeCategory === 'todos' || p.category === activeCategory;
      const matchesQ = !searchQuery || t(p.name).toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQ;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return t(a.name).localeCompare(t(b.name));
      return 0;
    });

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 pb-20">
      <div className="mb-8">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff9800] mb-1">{t('catalog_wholesale')}</div>
        <h1 className="text-3xl font-black text-[#004d40] uppercase tracking-tighter italic mb-4">{t('catalog_title')}</h1>

        <div className="flex gap-2 mb-5 max-w-xl">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('filter_placeholder')}
            className="flex-1 border-2 border-[#004d40] px-4 py-2.5 text-[12px] font-medium outline-none focus:ring-2 focus:ring-[#ff9800]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="bg-gray-200 text-gray-600 px-4 text-[11px] font-black uppercase hover:bg-gray-300 transition-colors"
            >
              {t('filter_clear')}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-2 transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#004d40] text-white border-[#004d40]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#004d40] hover:text-[#004d40]'
              }`}
            >
              {t(cat.id)}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-gray-500">
            {filtered.length} {filtered.length === 1 ? t('product_found') : t('products_found')}
          </p>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border-2 border-gray-200 text-[10px] font-black uppercase px-3 py-2 outline-none focus:border-[#004d40] cursor-pointer"
          >
            <option value="default">{t('sort_default')}</option>
            <option value="price-asc">{t('sort_price_asc')}</option>
            <option value="price-desc">{t('sort_price_desc')}</option>
            <option value="name">{t('sort_name')}</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-black text-[#004d40] uppercase mb-2">{t('not_found_title')}</p>
          <p className="text-gray-400 text-sm mb-6">{t('not_found_desc')}</p>
          <button
            onClick={() => { setActiveCategory('todos'); setSearchQuery(''); }}
            className="bg-[#004d40] text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff9800] transition-colors"
          >
            {t('not_found_btn')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(p => (
            <div 
              key={p.id} 
              className="bg-white border border-gray-100 group flex flex-col cursor-pointer"
              onClick={() => setPopupProduct(p)}
            >
              <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                <img
                  src={p.img}
                  className="w-full h-full object-cover"
                  alt={t(p.name)}
                />
                {p.tag && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 uppercase">
                    {p.tag}
                  </div>
                )}
                {p.oldPrice && (
                  <div className="absolute top-2 right-2 bg-[#ff9800] text-white text-[8px] font-black px-1.5 py-0.5">
                    -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="font-bold uppercase text-[10px] text-gray-500 mb-1 leading-tight">{t(p.name)}</p>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-lg font-black text-[#004d40]">{p.price.toLocaleString('pt-MZ')} MT</span>
                  {p.oldPrice && (
                    <span className="text-[9px] text-gray-400 line-through">{p.oldPrice.toLocaleString('pt-MZ')}</span>
                  )}
                </div>
                <button
                  onClick={() => setPopupProduct(p)}
                  className="mt-auto bg-[#1a1a1a] text-white py-2.5 text-[9px] font-black uppercase tracking-wider hover:bg-[#ff9800] transition-colors active:scale-95"
                >
                  {t('add_to_cart_short')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LojaFallback() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 pb-20">
      {/* ... (keep existing fallback code as is) ... */}
    </div>
  );
}

export default function LojaPage() {
  return (
    <Suspense fallback={<LojaFallback />}>
      <LojaContent />
    </Suspense>
  );
}