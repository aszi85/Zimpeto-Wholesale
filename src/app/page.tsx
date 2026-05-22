'use client';

import { useCart } from './context/CartContext';
import { useRouter } from 'next/navigation';
import { PROMO_PRODUCTS, ALL_PRODUCTS, CATEGORIES, RECIPES } from '../data';

const OUTROS_ESSENCIAIS = ALL_PRODUCTS.filter(p => !PROMO_PRODUCTS.find(pp => pp.id === p.id)).slice(0, 6);

// =========================================================================
// DICIONÁRIO DE IMAGENS DAS CATEGORIAS
// Certifica-te de que estas chaves batem com os IDs do teu ficheiro data!
// =========================================================================
const CATEGORY_IMAGES: Record<string, string> = {
  vegetais: "https://th.bing.com/th/id/OIP.L_sfOmvjBVEFSN-hHH2qBAHaE8?w=262&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  cereais: "https://th.bing.com/th/id/OIP.O72mWU2BYuYhO9s7ghCObQHaEo?w=280&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  laticinios: "https://th.bing.com/th/id/OIP.csN_J15kwBZ-MCOuG1dH2QHaE7?w=239&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",  
  carnes: "https://th.bing.com/th/id/OIP.7AXUdexZW1kwN7armp07mQHaE8?w=239&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", 
  mercearia: "https://th.bing.com/th/id/OIP.-uLP_D_FIjI4jBIq9ElUVQHaD4?w=281&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", 
  bebidas: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150",   
  higiene: "https://th.bing.com/th/id/OIP.tanr0USHGkfmgZ4fnSLRFQHaEK?w=299&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",   
  leguminosas: "https://th.bing.com/th/id/OIP.UthAGhW_ZTfJe3iU2gjyKQHaEK?w=291&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", 
  // Se houver mais alguma categoria no teu projeto, adiciona-a aqui em letras minúsculas:
};

// Imagem padrão de segurança
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150";

export default function HomePage() {
  const { setPopupProduct, setIsCartOpen } = useCart();
  const router = useRouter();

  return (
    <div className="w-full pb-20 bg-white text-gray-900">

      {/* HERO BANNER */}
      <section className="relative h-[420px] md:h-[500px] bg-gray-900 overflow-hidden border-b-4 border-[#ff9800]">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          alt="Mercado Atacado"
        />
        <div className="relative max-w-[1400px] mx-auto h-full flex flex-col justify-center px-6 md:px-10 text-white">
          <div className="bg-[#004d40]/90 p-6 md:p-10 max-w-xl">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff9800] mb-3">
              Mercado do Zimpeto • Maputo
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 italic leading-tight">
              Qualidade Bulk<br/>a Preços Justos
            </h1>
            <p className="text-base md:text-lg mb-6 font-medium text-gray-200">
              Fardos, frescos e mercearia. Directamente do Zimpeto para a sua porta.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/loja')}
                className="bg-[#ff9800] text-white px-6 py-3 font-black uppercase text-[11px] tracking-widest hover:bg-white hover:text-[#004d40] transition-all cursor-pointer"
              >
                Ver Catálogo
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('promos');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-white text-white px-6 py-3 font-black uppercase text-[11px] tracking-widest hover:bg-white hover:text-[#004d40] transition-all cursor-pointer"
              >
                Ver Promoções
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* USP STRIP */}
      <div className="bg-[#004d40] text-white py-4">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-6 text-center">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
            <svg className="w-4 h-4 text-[#ff9800]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>Entrega gratuita acima de 5.000 MT</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
            <svg className="w-4 h-4 text-[#ff9800]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Fardos e produtos a granel</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
            <svg className="w-4 h-4 text-[#ff9800]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Zimpeto, Maputo</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
            <svg className="w-4 h-4 text-[#ff9800]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>WhatsApp: +258 84 123 4567</span>
          </div>
        </div>
      </div>

      {/* PROMOÇÕES SECTION */}
      <section id="promos" className="max-w-[1400px] mx-auto py-12 px-4 md:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff9800] mb-1">Esta semana</div>
            <h2 className="text-3xl font-black text-[#004d40] uppercase tracking-tighter italic">Promoção</h2>
          </div>
          <button
            onClick={() => router.push('/loja')}
            className="text-[10px] font-black uppercase text-[#004d40] border-b-2 border-[#ff9800] pb-0.5 hover:text-[#ff9800] transition-colors"
          >
            Ver tudo →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROMO_PRODUCTS.map(p => (
            <div key={p.id} className="bg-white group border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <div className="h-52 overflow-hidden relative bg-gray-50">
                <img src={p.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-1 uppercase tracking-wider">
                  {p.tag || 'PROMO'}
                </div>
                {p.oldPrice && (
                  <div className="absolute top-2 right-2 bg-[#ff9800] text-white text-[9px] font-black px-2 py-1">
                    -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-black text-gray-800 uppercase text-[11px] mb-2 leading-tight">{p.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-black text-[#004d40]">{p.price.toLocaleString('pt-MZ')} MT</span>
                  {p.oldPrice && <span className="text-[10px] text-gray-400 line-through">{p.oldPrice.toLocaleString('pt-MZ')} MT</span>}
                </div>
                <button
                  onClick={() => setPopupProduct(p)}
                  className="mt-auto w-full bg-[#004d40] text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff9800] transition-colors cursor-pointer active:scale-95"
                >
                  Adicionar ao Cesto
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECIPES SECTION */}
      <section className="bg-white py-16 px-4 md:px-6 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff9800] mb-1">Inspiração culinária</div>
              <h2 className="text-3xl font-black text-[#004d40] uppercase tracking-tighter italic">Receitas da Nossa Terra</h2>
            </div>
            <button onClick={() => router.push('/receitas')} className="hidden sm:block text-[10px] font-black uppercase text-[#004d40] border-b-2 border-[#ff9800] pb-0.5 hover:text-[#ff9800] transition-colors">
              Ver todas →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {RECIPES.map(r => (
              <div key={r.id} onClick={() => router.push(`/receitas#recipe-${r.id}`)} className="group cursor-pointer relative overflow-hidden rounded-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img src={r.img} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#004d40]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-black text-sm uppercase tracking-wide leading-tight mb-2">{r.title}</p>
                  <div className="flex items-center gap-4 text-[9px] text-white/90 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-[#ff9800]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {r.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-[#ff9800]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {r.servings} pess.
                    </span>
                    <span className="text-[#ff9800] tracking-widest">{r.difficulty}</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-[#ff9800] text-white text-[9px] font-black px-2 py-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity tracking-wider">
                  Ver Receita
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCÃO CATEGORIAS (CORRIGIDA) */}
      <section className="max-w-[1400px] mx-auto py-14 px-4 md:px-6">
        <div className="mb-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff9800] mb-1">Navegue por</div>
          <h2 className="text-3xl font-black text-[#004d40] uppercase tracking-tighter italic">Categorias</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-4">
          {CATEGORIES.map(cat => {
            // Converte para minúsculas de forma segura
            const normalizedId = cat.id ? cat.id.toLowerCase() : '';
            // TypeScript agora fica feliz porque removemos a referência ao "cat.img"
            const categoryImage = CATEGORY_IMAGES[normalizedId] || DEFAULT_IMAGE;

            return (
              <button
                key={cat.id}
                onClick={() => router.push(`/loja?cat=${cat.id}`)}
                className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
              >
                {/* ROUNDED PRODUCT IMAGE CONTAINER */}
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white border border-gray-200 group-hover:border-[#004d40] group-hover:shadow-sm transition-all duration-200 flex items-center justify-center group-hover:scale-105">
                  <img
                    src={categoryImage}
                    alt={cat.label}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                    }}
                  />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-600 group-hover:text-[#004d40] transition-colors text-center leading-tight">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* OUTROS ESSENCIAIS */}
      <section className="bg-white border-t border-gray-100 py-14 px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <h3 className="text-xl font-black uppercase text-[#004d40] mb-8 flex items-center gap-4 italic">
            Outros Essenciais <span className="h-[2px] bg-gray-200 flex-1"></span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {OUTROS_ESSENCIAIS.map(item => (
              <div key={item.id} className="bg-[#f2f2f2] p-3 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-md transition-all group flex flex-col">
                <div className="h-28 overflow-hidden mb-3 bg-white rounded">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={item.name} />
                </div>
                <p className="text-[10px] font-black uppercase text-gray-600 mb-1 leading-tight">{item.name}</p>
                <p className="font-black text-[#004d40] text-sm mb-3">{item.price.toLocaleString('pt-MZ')} MT</p>
                <button onClick={() => setPopupProduct(item)} className="mt-auto w-full bg-[#1a1a1a] text-white py-2 text-[9px] font-black uppercase tracking-tighter hover:bg-[#ff9800] transition-colors cursor-pointer">
                  + Cesto
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#004d40] py-16 px-6 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Cozinhe como um Chef</h2>
          <p className="text-gray-300 text-sm mb-8 font-medium">
            Use a nossa base de frescos e mercearia para elevar o nível do seu negócio ou jantar familiar.
          </p>
          <button onClick={() => router.push('/receitas')} className="bg-[#ff9800] text-white px-10 py-4 font-black uppercase text-[11px] tracking-widest hover:bg-white hover:text-[#004d40] transition-all active:scale-95">
            Explorar Receitas
          </button>
        </div>
      </section>
    </div>
  );
}