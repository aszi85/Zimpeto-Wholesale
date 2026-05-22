'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'entrega' | 'levantamento'>('entrega');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'banco' | ''>('');
  const [agreed, setAgreed] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    telemovel: '',
    endereco: '',
    nuit: '',
    emergencia: '',
    notas: '',
    mpesaNumber: '',
  });

  const handleField = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.telemovel) return;
    if (deliveryMethod === 'entrega' && !formData.endereco) return;
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) return;
    setStep(3);
  };

  const handleConfirm = () => {
    clearCart();
    router.push('/');
  };

  if (cartCount === 0 && step === 1) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center pb-24 bg-white">
        <h1 className="text-2xl font-black text-black uppercase italic mb-3 tracking-tight">O seu cesto está vazio</h1>
        <button onClick={() => router.push('/loja')} className="bg-black text-white px-10 py-4 font-black uppercase text-[11px] tracking-widest hover:bg-black/80 transition-colors">
          Ir para a Loja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 pb-24">
      <div className="flex mb-12">
        {[ { n: 1, label: 'Detalhes' }, { n: 2, label: 'Pagamento' }, { n: 3, label: 'Confirmação' } ].map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black border-2 ${step >= s.n ? 'bg-black border-black text-white' : 'bg-white border-black text-black'}`}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span className={`text-[9px] font-black uppercase ${step >= s.n ? 'text-black' : 'text-black/50'}`}>{s.label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 mx-4 mb-5 ${step > s.n ? 'bg-black' : 'bg-black/20'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white p-8 border-t-4 border-black shadow-sm">
              <h2 className="text-2xl font-black text-black uppercase italic tracking-tighter mb-6">Informações de Envio</h2>
              <form onSubmit={handleStep1} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black block mb-1">Nome Completo *</label>
                  <input type="text" required value={formData.nome} onChange={handleField('nome')} className="w-full border-b-2 border-black py-3 text-[13px] font-semibold text-black outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black block mb-1">Contacto Principal *</label>
                  <input type="tel" required value={formData.telemovel} onChange={handleField('telemovel')} className="w-full border-b-2 border-black py-3 text-[13px] font-semibold text-black outline-none" />
                </div>
                {deliveryMethod === 'entrega' && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black block mb-1">Endereço de Entrega *</label>
                    <input type="text" required value={formData.endereco} onChange={handleField('endereco')} className="w-full border-b-2 border-black py-3 text-[13px] font-semibold text-black outline-none" />
                  </div>
                )}
                <button type="submit" className="w-full bg-black text-white py-4 font-black uppercase text-[11px] tracking-[0.15em] hover:bg-black/80 transition-colors">Continuar para Pagamento →</button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-8 border-t-4 border-black shadow-sm">
              <h2 className="text-2xl font-black text-black uppercase italic tracking-tighter mb-6">Método de Pagamento</h2>
              <form onSubmit={handleStep2} className="space-y-4">
                <div className={`p-5 border-2 ${paymentMethod === 'mpesa' ? 'border-black bg-black/5' : 'border-black'}`}>
                  <label className="flex gap-4 cursor-pointer">
                    <input type="radio" name="payment" value="mpesa" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} />
                    <div>
                      <span className="text-base font-black text-black">M-PESA VODACOM</span>
                      <p className="text-[11px] text-black font-medium">Pagamento via menu *150#</p>
                    </div>
                  </label>
                  {paymentMethod === 'mpesa' && (
                    <div className="mt-5 pt-4 border-t border-black animate-fadeIn">
                      <div className="bg-black text-white p-4 mb-4">
                        <p className="text-[10px] font-bold uppercase">1. *150# {'>'} Pagamentos {'>'} Comerciante</p>
                        <p className="text-[10px] font-bold uppercase">2. Código: <span className="text-white">XXXXXX</span></p>
                        <p className="text-[10px] font-bold uppercase">3. Valor: {cartTotal.toLocaleString('pt-MZ')} MT</p>
                      </div>
                      <label className="text-[10px] font-black uppercase text-black block mb-2">Confirme o seu número M-Pesa *</label>
                      <input type="tel" maxLength={9} required value={formData.mpesaNumber} onChange={handleField('mpesaNumber')} placeholder="840000000" className="w-full border-b-2 border-black py-2 text-[13px] font-black outline-none mb-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-3 pt-4">
                  <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1" />
                  <label htmlFor="agree" className="text-[11px] text-black font-semibold">Concordo com as políticas de venda.</label>
                </div>
                <button type="submit" disabled={!agreed} className="w-full bg-black text-white py-4 font-black uppercase text-[11px] tracking-[0.15em] disabled:opacity-50">Confirmar Encomenda →</button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-8 border-t-4 border-black shadow-sm text-center">
              <h2 className="text-2xl font-black text-black uppercase italic mb-3">Encomenda Registada</h2>
              <p className="text-black mb-6 text-sm">Obrigado! A nossa equipa irá validar o seu pagamento via M-Pesa em breve.</p>
              <button onClick={handleConfirm} className="w-full bg-black text-white py-4 font-black uppercase text-[11px]">Voltar à Página Principal</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border-t-4 border-black p-5 shadow-sm sticky top-24">
            <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-black mb-4">Resumo da Encomenda</h3>
            <div className="space-y-4 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-[11px] font-black">
                  <span>{item.name} x{item.qtd}</span>
                  <span>{(item.price * item.qtd).toLocaleString('pt-MZ')} MT</span>
                </div>
              ))}
            </div>
            <div className="border-t border-black pt-4 flex justify-between font-black text-xl">
              <span>Total</span>
              <span>{cartTotal.toLocaleString('pt-MZ')} MT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}