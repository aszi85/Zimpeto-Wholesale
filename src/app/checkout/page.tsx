'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'entrega' | 'levantamento'>('entrega');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | ''>('');
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    telemovel: '',
    bairro: '',
    rua: '',
    numeroCasa: '',
    referencia: '',
    mpesaNumber: '',
  });

  const handleField = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => 
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryMethod === 'entrega' && (!formData.bairro || !formData.rua)) return;
    setStep(2);
  };

  const handleConfirm = () => {
    if (!paymentMethod || !agreed) return;
    // Aqui seria feita a chamada à API para salvar a encomenda
    clearCart();
    setStep(3);
  };

  if (cartCount === 0 && step === 1) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-black uppercase mb-6">O seu cesto está vazio</h1>
        <button onClick={() => router.push('/loja')} className="bg-black text-white px-8 py-3 text-[11px] font-black uppercase hover:bg-black/80">Ir para a Loja</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Indicador de Passos */}
      <div className="flex mb-12 justify-center gap-8">
        {[ { n: 1, label: 'Detalhes' }, { n: 2, label: 'Pagamento' }, { n: 3, label: 'Confirmação' } ].map((s) => (
          <div key={s.n} className="flex flex-col items-center gap-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black border-2 ${step >= s.n ? 'bg-black border-black text-white' : 'bg-white border-black'}`}>
              {step > s.n ? '✓' : s.n}
            </div>
            <span className={`text-[9px] font-black uppercase ${step >= s.n ? 'text-black' : 'text-gray-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <form onSubmit={handleStep1} className="bg-white p-8 border-t-4 border-black shadow-sm space-y-5">
              <h2 className="text-xl font-black uppercase italic mb-6">Informações de Envio</h2>
              
              <div className="flex gap-2 mb-4">
                <button type="button" onClick={() => setDeliveryMethod('entrega')} className={`flex-1 py-2 text-[10px] font-black uppercase border-2 ${deliveryMethod === 'entrega' ? 'bg-black text-white' : ''}`}>Entrega</button>
                <button type="button" onClick={() => setDeliveryMethod('levantamento')} className={`flex-1 py-2 text-[10px] font-black uppercase border-2 ${deliveryMethod === 'levantamento' ? 'bg-black text-white' : ''}`}>Levantamento</button>
              </div>

              <input required placeholder="Nome Completo *" value={formData.nome} onChange={handleField('nome')} className="w-full border-b-2 py-3 text-sm outline-none" />
              <input required placeholder="Telemóvel *" value={formData.telemovel} onChange={handleField('telemovel')} className="w-full border-b-2 py-3 text-sm outline-none" />
              
              {deliveryMethod === 'entrega' && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <input required placeholder="Bairro *" value={formData.bairro} onChange={handleField('bairro')} className="w-full border-b-2 py-2 text-sm outline-none" />
                  <input required placeholder="Rua *" value={formData.rua} onChange={handleField('rua')} className="w-full border-b-2 py-2 text-sm outline-none" />
                  <input placeholder="Nº da Casa" value={formData.numeroCasa} onChange={handleField('numeroCasa')} className="w-full border-b-2 py-2 text-sm outline-none" />
                  <input placeholder="Referência" value={formData.referencia} onChange={handleField('referencia')} className="w-full border-b-2 py-2 text-sm outline-none" />
                </div>
              )}
              <button type="submit" className="w-full bg-black text-white py-4 font-black uppercase text-[11px] mt-4">Continuar para Pagamento →</button>
            </form>
          )}

          {step === 2 && (
            <div className="bg-white p-8 border-t-4 border-black shadow-sm">
              <h2 className="text-xl font-black uppercase italic mb-6">Método de Pagamento</h2>
              <div className={`p-5 border-2 cursor-pointer ${paymentMethod === 'mpesa' ? 'border-black bg-black/5' : 'border-gray-200'}`} onClick={() => setPaymentMethod('mpesa')}>
                <span className="text-sm font-black">M-PESA VODACOM</span>
                {paymentMethod === 'mpesa' && (
                  <div className="mt-5 pt-4 border-t border-black space-y-3">
                    <div className="bg-black text-white p-4 text-[10px] font-bold">
                      <p className="mb-2 uppercase">1. Envie o valor para: <span className="text-[#ff9800]">84 000 0000</span> (Zimpeto Wholesale)</p>
                      <p className="uppercase">2. Após o envio, envie a confirmação de pagamento para: <span className="text-[#ff9800]">84 000 0000</span> (Zimpeto Wholesale). E aguarde a nossa confirmação.</p>
                    </div>
                    <input type="tel" maxLength={9} required value={formData.mpesaNumber} onChange={handleField('mpesaNumber')} placeholder="Codigo de Confirmação" className="w-full border-b-2 py-2 text-sm font-bold outline-none" />
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 mt-6 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <span className="text-[10px] font-black uppercase">Concordo com as políticas de venda</span>
              </label>
              <button disabled={!agreed || !paymentMethod} onClick={handleConfirm} className="w-full bg-black text-white py-4 mt-6 font-black uppercase text-[11px] disabled:opacity-50">Confirmar Encomenda →</button>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-8 border-t-4 border-black shadow-sm text-center">
              <h2 className="text-2xl font-black uppercase italic mb-3">Encomenda Recebida</h2>
              <p className="text-black text-sm mb-6 leading-relaxed">
                Obrigado! Recebemos os seus dados. Assim que confirmarmos o pagamento, a nossa equipa entrará em contacto através do número <b>{formData.telemovel}</b> para formalizar o pedido e iniciar a entrega.
              </p>
              <button onClick={() => router.push('/')} className="w-full bg-black text-white py-4 font-black uppercase text-[11px]">Voltar ao Início</button>
            </div>
          )}
        </div>

        {/* Resumo Estático */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 sticky top-24 border-t-4 border-black">
            <h3 className="text-[11px] font-black uppercase mb-4">Resumo da Encomenda</h3>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-[11px] font-bold">
                  <span>{item.name} x{item.qtd}</span>
                  <span>{(item.price * item.qtd).toLocaleString('pt-MZ')} MT</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-black text-lg">
              <span>Total</span>
              <span>{cartTotal.toLocaleString('pt-MZ')} MT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}