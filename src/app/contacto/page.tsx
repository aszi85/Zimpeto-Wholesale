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
        <p className="text-black mt-2 font-medium">Apoio ao cliente • Maputo & Matola</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          {[
            { title: 'Localização', icon: 'M12 21s-8-7.5-8-12a8 8 0 1 1 16 0c0 4.5-8 12-8 12z', lines: ['Mercado do Zimpeto, Bancada 42-B', 'Maputo, Moçambique'] },
            { title: 'WhatsApp / Chamadas', icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z', lines: ['+258 84 123 4567', 'Segunda – Sábado: 7h – 18h'] },
            { title: 'Email', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', lines: ['zimpeto@wholesale.co.mz'] },
            { title: 'Horário de Funcionamento', icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z M12 6v6l4 2', lines: ['Segunda a Sexta: 7h – 17h30', 'Sábado: 7h – 14h', 'Domingo: Fechado'] },
          ].map(item => (
            <div key={item.title} className="flex gap-4">
              <div className="w-10 h-10 bg-[#f0faf7] border border-[#004d40]/10 flex items-center justify-center rounded flex-shrink-0">
                <svg className="w-5 h-5 text-[#004d40]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
              </div>
              <div>
                <h4 className="font-black uppercase text-[10px] tracking-widest mb-1 text-[#004d40]">{item.title}</h4>
                {item.lines.map(l => (
                  <p key={l} className="text-sm font-medium text-black leading-relaxed">{l}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-sm h-40 flex items-center justify-center border border-black">
            <a href="#" className="text-[#004d40] font-black text-[11px] uppercase tracking-widest hover:text-[#ff9800] transition-colors">
              Ver no Google Maps
            </a>
          </div>
        </div>

        <div className="bg-white p-8 border-t-4 border-[#004d40] shadow-sm">
          {sent ? (
            <div className="text-center py-10">
              <h3 className="font-black text-[#004d40] uppercase italic mb-2">Mensagem Enviada</h3>
              <p className="text-black text-sm font-medium">Responderemos em breve.</p>
              <button onClick={() => setSent(false)} className="mt-6 text-[10px] font-black uppercase text-[#ff9800] hover:underline">
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-xl font-black text-[#004d40] uppercase italic tracking-tighter mb-6">Envie uma Mensagem</h3>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black block mb-1">Nome *</label>
                <input required type="text" value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} className="w-full border-b-2 border-black focus:border-[#ff9800] py-3 text-[13px] outline-none transition-colors font-medium placeholder:text-black" placeholder="O seu nome" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black block mb-1">Email ou Telemóvel *</label>
                <input required type="text" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full border-b-2 border-black focus:border-[#ff9800] py-3 text-[13px] outline-none transition-colors font-medium placeholder:text-black" placeholder="email@exemplo.com ou 84 000 0000" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black block mb-1">Mensagem *</label>
                <textarea required rows={4} value={form.mensagem} onChange={e => setForm(p => ({ ...p, mensagem: e.target.value }))} className="w-full border-b-2 border-black focus:border-[#ff9800] py-3 text-[13px] outline-none transition-colors font-medium resize-none placeholder:text-black" placeholder="Como podemos ajudar?" />
              </div>
              <button type="submit" className="w-full bg-[#004d40] text-white py-4 font-black uppercase text-[11px] tracking-[0.15em] hover:bg-[#ff9800] transition-colors">
                Enviar Mensagem
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}