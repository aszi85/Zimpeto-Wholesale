export default function LocalizacaoPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 pb-24">
      <div className="mb-10">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff9800] mb-2">Como Chegar</div>
        <h1 className="text-4xl font-black text-[#004d40] uppercase italic tracking-tighter">Localização</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-white p-6 border-l-4 border-[#004d40] shadow-sm">
            <h3 className="font-black uppercase text-[11px] tracking-widest text-[#004d40] mb-3">Morada</h3>
            <p className="text-sm font-medium text-gray-700 leading-relaxed">
              Mercado do Zimpeto<br />
              Bancada 42-B<br />
              Zimpeto, Maputo<br />
              Moçambique
            </p>
          </div>

          <div className="bg-white p-6 border-l-4 border-[#ff9800] shadow-sm">
            <h3 className="font-black uppercase text-[11px] tracking-widest text-[#004d40] mb-3">Horário</h3>
            <div className="space-y-1 text-[12px] font-medium text-gray-700">
              <div className="flex justify-between"><span>Segunda – Sexta</span><span className="font-black">7h – 17h30</span></div>
              <div className="flex justify-between"><span>Sábado</span><span className="font-black">7h – 14h</span></div>
              <div className="flex justify-between"><span>Domingo</span><span className="text-red-500 font-black">Fechado</span></div>
            </div>
          </div>

          <div className="bg-white p-6 border-l-4 border-gray-200 shadow-sm">
            <h3 className="font-black uppercase text-[11px] tracking-widest text-[#004d40] mb-3">Transportes Próximos</h3>
            <ul className="space-y-1 text-[12px] font-medium text-gray-700">
              <li>🚌 Chapa 27 – Museu/Zimpeto</li>
              <li>🚌 Chapa 34 – Baixa/Zimpeto</li>
              <li>🚗 Estacionamento disponível no local</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {/* Map embed placeholder */}
          <div className="bg-gray-100 rounded-sm h-80 flex flex-col items-center justify-center border border-gray-200 gap-4">
            <span className="text-4xl">🗺️</span>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">
              Mercado do Zimpeto<br/>Maputo, Moçambique
            </p>
            <a
              href="https://maps.google.com/?q=Mercado+do+Zimpeto+Maputo"
              target="_blank"
              rel="noreferrer"
              className="bg-[#004d40] text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff9800] transition-colors"
            >
              Abrir no Google Maps →
            </a>
          </div>

          <div className="bg-[#004d40] text-white p-5">
            <h3 className="font-black uppercase text-[11px] tracking-widest mb-2">Precisa de Ajuda?</h3>
            <p className="text-[11px] text-white/80 mb-3">Ligue ou envie mensagem antes de visitar para confirmar disponibilidade de stock.</p>
            <p className="font-black text-[#ff9800]">+258 84 123 4567</p>
          </div>
        </div>
      </div>
    </main>
  );
}
