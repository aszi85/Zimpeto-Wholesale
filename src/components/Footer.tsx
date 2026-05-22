'use client';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-[#1a1a1a] text-white pt-12 pb-6 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl font-black italic text-white mb-1">ZIMPETO</div>
            <div className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-4">Wholesale</div>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
              Mercado do Zimpeto, Bancada 42-B.<br />
              Maputo, Moçambique.
            </p>
            <p className="text-[11px] text-[#ff9800] font-bold mt-2">+258 84 123 4567</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-4">Loja</h4>
            <ul className="space-y-2">
              {[
                { label: 'Catálogo', href: '/loja' },
                { label: 'Promoções', href: '/#promos' },
                { label: 'Receitas', href: '/receitas' },
                { label: 'Checkout', href: '/checkout' },
              ].map(l => (
                <li key={l.href}>
                  <button
                    onClick={() => router.push(l.href)}
                    className="text-[11px] text-gray-400 font-medium hover:text-white transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-4">Empresa</h4>
            <ul className="space-y-2">
              {[
                { label: 'Contacto', href: '/contacto' },
                { label: 'Login / Conta', href: '/login' },
              ].map(l => (
                <li key={l.href}>
                  <button
                    onClick={() => router.push(l.href)}
                    className="text-[11px] text-gray-400 font-medium hover:text-white transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-4">Entrega</h4>
            <ul className="space-y-2 text-[11px] text-gray-400 font-medium">
              <li>Maputo & Matola</li>
              <li>Fardos a granel</li>
              <li>Grátis &gt; 5.000 MT</li>
              <li>⏱ Entrega 24–48h</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-gray-600 font-medium">
            © {new Date().getFullYear()} Zimpeto Wholesale LDA. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <span className="text-[10px] text-gray-600 font-medium">M-Pesa</span>
            <span className="text-[10px] text-gray-600 font-medium">Millennium BIM</span>
            <span className="text-[10px] text-gray-600 font-medium">Transferência Bancária</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
