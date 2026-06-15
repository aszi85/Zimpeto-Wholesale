'use client';

import { useRouter } from 'next/navigation';

export default function AdminRoutingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col justify-between py-12 px-4 font-sans selection:bg-[#ff9800] selection:text-black">
      <div className="max-w-4xl w-full mx-auto my-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff9800]">
            Zimpeto Wholesale
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 uppercase italic">
            Portal de Administração
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Aceda aos painéis de controlo e monitorização da loja Zimpeto Wholesale.
          </p>
        </div>

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          
          {/* Order Management Card */}
          <a
            href="/orders.html"
            className="group block p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-[#ff9800] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(255,152,0,0.1)]"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-gray-800 rounded-xl text-2xl group-hover:scale-110 transition-transform duration-300">
                📦
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-gray-800 px-2.5 py-1 rounded-full group-hover:text-[#ff9800] transition-colors duration-300">
                Gestão
              </span>
            </div>
            
            <h2 className="text-xl font-bold uppercase italic mt-6 text-white group-hover:text-emerald-300 transition-colors">
              Gestão de Encomendas
            </h2>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Gerencie e acompanhe todos os pedidos dos clientes, mude os estados de pagamento e actualize as entregas.
            </p>
            
            <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase text-[#ff9800] group-hover:gap-3 transition-all duration-300">
              Entrar no Painel <span>→</span>
            </div>
          </a>

          {/* Visitor Analytics Card */}
          <a
            href="/admin.html"
            className="group block p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-emerald-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)]"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-gray-800 rounded-xl text-2xl group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-gray-800 px-2.5 py-1 rounded-full group-hover:text-emerald-400 transition-colors duration-300">
                Monitoria
              </span>
            </div>
            
            <h2 className="text-xl font-bold uppercase italic mt-6 text-white group-hover:text-emerald-300 transition-colors">
              Análise de Visitantes
            </h2>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Monitore acessos de visitantes em tempo real, visualize a duração média no site e filtre origens geográficas.
            </p>
            
            <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 group-hover:gap-3 transition-all duration-300">
              Entrar no Painel <span>→</span>
            </div>
          </a>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Voltar para a Página Principal
          </button>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-wider mt-12">
        © {new Date().getFullYear()} Zimpeto Wholesale • Todos os direitos reservados.
      </footer>
    </div>
  );
}
