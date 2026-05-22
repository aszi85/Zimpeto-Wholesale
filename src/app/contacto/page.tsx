'use client';
import { useState } from 'react';

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 pb-24">
      <div className="mb-10">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff9800] mb-2">Fale Connosco</div>
        <h1 className="text-4xl font-black text-[#004d40] uppercase italic tracking-tighter">Contactos</h1>
        <p className="text-gray-500 mt-2 font-medium">Apoio ao cliente • Maputo & Matola</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          {[
            { icon: '📍', title: 'Localização', lines: ['Mercado do Zimpeto, Bancada 42-B', 'Maputo, Moçambique'] },
            { icon: '📞', title: 'WhatsApp / Chamadas', lines: ['+258 84 123 4567', 'Segunda – Sábado: 7h – 18h'] },
            { icon: '📧', title: 'Email', lines: ['zimpeto@wholesale.co.mz'] },
            { icon: '🕒', title: 'Horário de Funcionamento', lines: ['Segunda a Sexta: 7h – 17h30', 'Sábado: 7h – 14h', 'Domingo: Fechado'] },
          ].map(item => (
            <div key={item.title} className="flex gap-4">
              <div className="w-10 h-10 bg-[#f0faf7] border border-[#004d40]/10 flex items-center justify-center rounded flex-shrink-0 text-xl">
                {item.icon}
              </div>
              <div>
                <h4 className="font-black uppercase text-[10px] tracking-widest mb-1 text-[#004d40]">{item.title}</h4>
                {item.lines.map(l => (
                  <p key={l} className="text-sm font-medium text-gray-700">{l}</p>
                ))}
              </div>
            </div>
          ))}

          {/* Map placeholder */}
          <div className="bg-gray-100 rounded-sm h-40 flex items-center justify-center border border-gray-200">
            <a
              href="https://maps.google.com/?q=Mercado+do+Zimpeto+Maputo"
              target="_blank"
              rel="noreferrer"
              className="text-[#004d40] font-black text-[11px] uppercase tracking-widest hover:text-[#ff9800] transition-colors"
            >
              📍 Ver no Google Maps →
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 border-t-4 border-[#004d40] shadow-sm">
          {sent ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-black text-[#004d40] uppercase italic mb-2">Mensagem Enviada!</h3>
              <p className="text-gray-500 text-sm font-medium">Responderemos em breve pelo email ou WhatsApp.</p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 text-[10px] font-black uppercase text-[#ff9800] hover:underline"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-black text-[#004d40] uppercase italic tracking-tighter mb-6">Envie uma Mensagem</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">Nome *</label>
                  <input
                    required type="text" value={form.nome}
                    onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                    className="w-full border-b-2 border-gray-200 focus:border-[#ff9800] py-3 text-[13px] outline-none transition-colors font-medium"
                    placeholder="O seu nome"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">Email ou Telemóvel *</label>
                  <input
                    required type="text" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full border-b-2 border-gray-200 focus:border-[#ff9800] py-3 text-[13px] outline-none transition-colors font-medium"
                    placeholder="email@exemplo.com ou 84 000 0000"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">Mensagem *</label>
                  <textarea
                    required rows={4} value={form.mensagem}
                    onChange={e => setForm(p => ({ ...p, mensagem: e.target.value }))}
                    className="w-full border-b-2 border-gray-200 focus:border-[#ff9800] py-3 text-[13px] outline-none transition-colors font-medium resize-none"
                    placeholder="Como podemos ajudar?"
                  />
                </div>
                <button type="submit" className="w-full bg-[#004d40] text-white py-4 font-black uppercase text-[11px] tracking-[0.15em] hover:bg-[#ff9800] transition-colors">
                  Enviar Mensagem
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
