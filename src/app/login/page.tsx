'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', nome: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#004d40] italic uppercase tracking-tighter">ZIMPETO</h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Wholesale Marketplace</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-gray-200 mb-8">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider transition-colors ${tab === 'login' ? 'border-b-2 border-[#004d40] text-[#004d40] -mb-0.5' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Iniciar Sessão
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider transition-colors ${tab === 'register' ? 'border-b-2 border-[#004d40] text-[#004d40] -mb-0.5' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Criar Conta
          </button>
        </div>

        <div className="bg-white p-8 border-t-4 border-[#004d40] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {tab === 'register' && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">Nome Completo</label>
                <input
                  type="text" required value={form.nome}
                  onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                  placeholder="João Machava"
                  className="w-full border-b-2 border-gray-200 focus:border-[#ff9800] py-3 text-[13px] font-medium outline-none transition-colors"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">Email ou Telemóvel</label>
              <input
                type="text" required value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="840000000 ou email@exemplo.com"
                className="w-full border-b-2 border-gray-200 focus:border-[#ff9800] py-3 text-[13px] font-medium outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">Palavra-Passe</label>
              <input
                type="password" required value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full border-b-2 border-gray-200 focus:border-[#ff9800] py-3 text-[13px] font-medium outline-none transition-colors"
              />
            </div>
            {tab === 'login' && (
              <div className="text-right">
                <button type="button" className="text-[10px] font-black uppercase text-gray-400 hover:text-[#ff9800] transition-colors">
                  Esqueceu a senha?
                </button>
              </div>
            )}
            <button type="submit" className="w-full bg-[#004d40] text-white py-4 text-[11px] font-black uppercase tracking-[0.15em] hover:bg-[#ff9800] transition-colors mt-2">
              {tab === 'login' ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-gray-400 font-medium mt-4">
          Ao continuar, aceita os nossos termos de uso e política de privacidade.
        </p>
      </div>
    </main>
  );
}
