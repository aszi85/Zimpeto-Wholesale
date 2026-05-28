'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ALL_PRODUCTS, CATEGORIES } from '@/data';

export default function Subnav() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (categoryId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/loja?cat=${categoryId}`);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const getFeaturedProducts = (categoryId: string) => {
    const products = ALL_PRODUCTS
      .filter(p => categoryId === 'todos' || p.category === categoryId)
      .slice(0, 3);
    return products;
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'todos') return ALL_PRODUCTS.length;
    return ALL_PRODUCTS.filter(p => p.category === categoryId).length;
  };

  const isShopPage = pathname === '/loja';

  return (
    <div 
      className="w-full bg-white border-b border-gray-200 z-40 sticky top-16"
      ref={dropdownRef}
    >
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between h-12">
          
          {/* Categories - Scrollable on overflow */}
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar flex-1">
            {/* Todos Button */}
            <button
              onClick={() => handleCategoryClick('todos')}
              className={`px-4 py-2 text-[13px] font-bold uppercase tracking-wide transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                isShopPage && !activeDropdown 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-black hover:text-gray-600'
              }`}
            >
              <CatalogIcon className="w-4 h-4" />
              Todos
              <span className="text-[10px] text-gray-500 ml-0.5">{ALL_PRODUCTS.length}</span>
            </button>

            {/* All Categories with Dropdowns */}
            {CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-4 py-2 text-[13px] font-bold uppercase tracking-wide transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                    activeDropdown === category.id 
                      ? 'text-black' 
                      : 'text-black hover:text-gray-600'
                  }`}
                >
                  {getCategoryIcon(category.id)}
                  {category.label}
                  <span className="text-[10px] text-gray-500">{getCategoryCount(category.id)}</span>
                  <ChevronIcon className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === category.id ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Panel */}
                {activeDropdown === category.id && (
                  <div 
                    className="absolute top-full left-0 mt-0 w-72 bg-white shadow-xl border border-gray-200 z-50"
                    onMouseEnter={() => {
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                        <h3 className="text-[12px] font-bold uppercase text-black flex items-center gap-2">
                          {getCategoryIcon(category.id)}
                          {category.label}
                        </h3>
                        <button
                          onClick={() => handleCategoryClick(category.id)}
                          className="text-[10px] font-bold uppercase text-gray-500 hover:text-black"
                        >
                          Ver todos →
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-600 mb-3">
                        {getCategoryDescription(category.id)} • {getCategoryCount(category.id)} produtos
                      </p>

                      <div className="space-y-2 mt-3">
                        {getFeaturedProducts(category.id).map(product => (
                          <button
                            key={product.id}
                            onClick={() => {
                              router.push(`/loja?q=${encodeURIComponent(product.name)}`);
                              setActiveDropdown(null);
                            }}
                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded text-left transition-colors"
                          >
                            <div className="w-10 h-10 bg-gray-50 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                              <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-bold text-black truncate">{product.name}</p>
                              <p className="text-[11px] font-bold text-gray-700">{product.price.toLocaleString('pt-MZ')} MT</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Promo inside dropdown */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-[10px] font-bold uppercase text-black text-center flex items-center justify-center gap-2">
                          <TruckIcon className="w-3 h-3" />
                          Frete grátis acima de 2000 MT
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side - Quick Actions - Fixed position */}
          <div className="flex items-center gap-4 flex-shrink-0 ml-6 pl-6 border-l border-gray-200">
            <button 
              onClick={() => router.push('/receitas')}
              className="text-[12px] font-bold uppercase tracking-wide text-black hover:text-gray-600 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <BookIcon className="w-4 h-4" />
              Receitas
            </button>
            <button 
              onClick={() => router.push('/contacto')}
              className="text-[12px] font-bold uppercase tracking-wide text-black hover:text-gray-600 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <HeadphonesIcon className="w-4 h-4" />
              Apoio
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between py-3 text-left"
          >
            <div className="flex items-center gap-2">
              <CatalogIcon className="w-4 h-4 text-black" />
              <span className="text-[13px] font-bold uppercase tracking-wide text-black">
                Todas as Categorias
              </span>
            </div>
            <ChevronIcon className={`w-4 h-4 text-black transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMobileMenuOpen && (
            <div className="pb-3 space-y-1 max-h-96 overflow-y-auto">
              <button
                onClick={() => handleCategoryClick('todos')}
                className="w-full flex items-center justify-between px-3 py-3 text-[13px] font-bold text-black hover:bg-gray-50 rounded"
              >
                <span className="flex items-center gap-3">
                  <CatalogIcon className="w-4 h-4" />
                  Todos os Produtos
                </span>
                <span className="text-[10px] text-gray-500">{ALL_PRODUCTS.length}</span>
              </button>

              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="w-full flex items-center justify-between px-3 py-3 text-[13px] font-bold text-black hover:bg-gray-50 rounded"
                >
                  <span className="flex items-center gap-3">
                    {getCategoryIcon(category.id)}
                    {category.label}
                  </span>
                  <span className="text-[10px] text-gray-500">{getCategoryCount(category.id)}</span>
                </button>
              ))}

              <div className="my-3 border-t border-gray-200" />

              <button
                onClick={() => {
                  router.push('/receitas');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 text-[13px] font-bold text-black hover:bg-gray-50 rounded"
              >
                <BookIcon className="w-4 h-4" />
                Receitas
              </button>
              <button
                onClick={() => {
                  router.push('/contacto');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 text-[13px] font-bold text-black hover:bg-gray-50 rounded"
              >
                <HeadphonesIcon className="w-4 h-4" />
                Contactar Apoio
              </button>

              <div className="mt-3 p-3 bg-gray-50 rounded mx-1">
                <p className="text-[10px] font-bold uppercase text-black text-center flex items-center justify-center gap-2">
                  <TruckIcon className="w-3 h-3" />
                  Entregas em Maputo • Frete Grátis acima de 2000 MT
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Icons
const CatalogIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ChevronIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const TruckIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.22-1.113-.616-1.53a15.04 15.04 0 00-2.008-1.7A2.372 2.372 0 0010.5 3.75H6.75a2.25 2.25 0 00-2.25 2.25m7.5 0a2.25 2.25 0 00-2.25-2.25m7.5 0V6.75" />
  </svg>
);

const BookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const HeadphonesIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75v6m16.5-6v6M3 9.75a9 9 0 0118 0v6a2.25 2.25 0 01-2.25 2.25H19.5M3.75 16.5h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75zm15 0h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75z" />
  </svg>
);

const PackageIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const CanIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const DropletIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const GrainIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75v6m16.5-6v6M3 9.75a9 9 0 0118 0v6a2.25 2.25 0 01-2.25 2.25H19.5M3.75 16.5h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75zm15 0h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75z" />
  </svg>
);

const SparklesIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18.75 6l.491 2.715a2.25 2.25 0 001.544 1.544L23.25 12l-2.465.741a2.25 2.25 0 00-1.544 1.544L18.75 18l-.491-2.715a2.25 2.25 0 00-1.544-1.544L14.25 12l2.465-.741a2.25 2.25 0 001.544-1.544z" />
  </svg>
);

const BroomIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75v6m16.5-6v6M3 9.75a9 9 0 0118 0v6a2.25 2.25 0 01-2.25 2.25H19.5M3.75 16.5h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75zm15 0h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75z" />
  </svg>
);

const MeatIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75v6m16.5-6v6M3 9.75a9 9 0 0118 0v6a2.25 2.25 0 01-2.25 2.25H19.5M3.75 16.5h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75zm15 0h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75z" />
  </svg>
);

const BreadIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75v6m16.5-6v6M3 9.75a9 9 0 0118 0v6a2.25 2.25 0 01-2.25 2.25H19.5M3.75 16.5h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75zm15 0h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75z" />
  </svg>
);

const MilkIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75v6m16.5-6v6M3 9.75a9 9 0 0118 0v6a2.25 2.25 0 01-2.25 2.25H19.5M3.75 16.5h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75zm15 0h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75z" />
  </svg>
);

function getCategoryIcon(categoryId: string) {
  const iconClass = "w-4 h-4";
  
  const icons: Record<string, React.ReactNode> = {
    'frescos': <PackageIcon className={iconClass} />,
    'enlatados': <CanIcon className={iconClass} />,
    'bebidas': <DropletIcon className={iconClass} />,
    'mercearia': <GrainIcon className={iconClass} />,
    'higiene': <SparklesIcon className={iconClass} />,
    'limpeza': <BroomIcon className={iconClass} />,
    'carnes': <MeatIcon className={iconClass} />,
    'padaria': <BreadIcon className={iconClass} />,
    'laticinios': <MilkIcon className={iconClass} />
  };
  
  return icons[categoryId] || <CatalogIcon className={iconClass} />;
}

function getCategoryDescription(categoryId: string): string {
  const descriptions: Record<string, string> = {
    'frescos': 'Frutas, legumes e vegetais frescos',
    'enlatados': 'Conservas e enlatados diversos',
    'bebidas': 'Refrigerantes, sucos e aguas',
    'mercearia': 'Arroz, massas, farinhas e graos',
    'higiene': 'Produtos de higiene pessoal',
    'limpeza': 'Produtos de limpeza domestica',
    'carnes': 'Carnes frescas e processadas',
    'padaria': 'Paes, bolos e produtos de padaria',
    'laticinios': 'Leites, queijos e iogurtes'
  };
  return descriptions[categoryId] || 'Produtos de qualidade';
}