'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const router = useRouter();
  
  // Checkout flow state machine
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Delivery option configuration
  const [deliveryMethod, setDeliveryMethod] = useState<'entrega' | 'levantamento'>('entrega');
  
  // Form input structures
  const [formData, setFormData] = useState({
    nome: '',
    telemovel: '',
    endereco: '',
    nuit: '',
    emergencia: '',
    notas: '',
    mpesaNumber: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'banco' | ''>('');
  const [agreed, setAgreed] = useState(false);
  const [isProcessingMpesa, setIsProcessingMpesa] = useState(false);

  const handleField = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  // Step 1 Submission handling with integrated delivery selection constraints
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.telemovel) return;
    if (deliveryMethod === 'entrega' && !formData.endereco) return;
    setStep(2);
  };

  // Step 2 Submission logic with specialized automated payment handling
  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) return;

    if (paymentMethod === 'mpesa') {
      if (!formData.mpesaNumber || formData.mpesaNumber.trim().length < 9) {
        alert('Por favor, introduza um número M-Pesa válido (mínimo 9 dígitos).');
        return;
      }
      
      // Simulate real-time API PIN Push trigger status
      setIsProcessingMpesa(true);
      setTimeout(() => {
        setIsProcessingMpesa(false);
        setStep(3);
      }, 2500);
    } else {
      setStep(3);
    }
  };

  const handleConfirm = () => {
    clearCart();
    router.push('/');
  };

  // High-contrast clean screen state for empty cart
  if (cartCount === 0 && step === 1) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center pb-24 bg-white">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#004d40]">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-[#004d40] uppercase italic mb-3 tracking-tight">O seu cesto está vazio</h1>
        <p className="text-gray-500 mb-8 font-medium text-sm">Adicione produtos grossistas antes de proceder ao fecho da sua encomenda.</p>
        <button 
          onClick={() => router.push('/loja')} 
          className="bg-[#ff9800] text-white px-10 py-4 font-black uppercase text-[11px] tracking-widest hover:bg-[#004d40] transition-colors cursor-pointer"
        >
          Ir para a Loja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 pb-24">
      
      {/* PROFESSIONAL MULTI-STEP TIMELINE INDICATOR */}
      <div className="flex mb-12">
        {[
          { n: 1, label: 'Detalhes' },
          { n: 2, label: 'Pagamento' },
          { n: 3, label: 'Confirmação' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black border-2 transition-colors ${
                step >= s.n ? 'bg-[#004d40] border-[#004d40] text-white' : 'bg-white border-gray-200 text-gray-400'
              }`}>
                {step > s.n ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : s.n}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider ${step >= s.n ? 'text-[#004d40]' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 mx-4 mb-5 transition-colors duration-300 ${step > s.n ? 'bg-[#004d40]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - ACTIONABLE FLOW PANELS */}
        <div className="lg:col-span-2">

          {/* STEP 1: LOGISTICS & INFORMATION FIELDS */}
          {step === 1 && (
            <div className="bg-white p-8 border-t-4 border-[#004d40] shadow-sm">
              <h2 className="text-2xl font-black text-[#004d40] uppercase italic tracking-tighter mb-6">Informações de Envio</h2>
              
              {/* ORDERLY SEGMENTED TOGGLE SYSTEM */}
              <div className="mb-8">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-2">Método de Distribuição *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('entrega')}
                    className={`p-4 border-2 flex items-center justify-center gap-3 font-black uppercase text-[11px] tracking-wider transition-all cursor-pointer ${
                      deliveryMethod === 'entrega' 
                        ? 'border-[#004d40] text-[#004d40] bg-[#f0faf7]' 
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Entrega ao Domicílio
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('levantamento')}
                    className={`p-4 border-2 flex items-center justify-center gap-3 font-black uppercase text-[11px] tracking-wider transition-all cursor-pointer ${
                      deliveryMethod === 'levantamento' 
                        ? 'border-[#004d40] text-[#004d40] bg-[#f0faf7]' 
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Levantar no Armazém
                  </button>
                </div>
              </div>

              <form onSubmit={handleStep1} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">Nome Completo do Destinatário *</label>
                  <input
                    type="text" required value={formData.nome} onChange={handleField('nome')}
                    placeholder="Ex: João Machava"
                    className="w-full border-b-2 border-gray-200 focus:border-[#ff9800] py-3 text-[13px] font-semibold text-gray-800 outline-none transition-colors placeholder:text-gray-400"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">Contacto Principal *</label>
                    <input
                      type="tel" required value={formData.telemovel} onChange={handleField('telemovel')}
                      placeholder="Ex: 84 000 0000"
                      className="w-full border-b-2 border-gray-200 focus:border-[#ff9800] py-3 text-[13px] font-semibold text-gray-800 outline-none transition-colors placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">NUIT da Empresa / Pessoal (Opcional)</label>
                    <input
                      type="text" value={formData.nuit} onChange={handleField('nuit')}
                      placeholder="Ex: 123456789"
                      className="w-full border-b-2 border-gray-200 focus:border-[#ff9800] py-3 text-[13px] font-semibold text-gray-800 outline-none transition-colors placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {deliveryMethod === 'entrega' ? (
                  <div className="animate-fadeIn">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">Endereço Geográfico de Entrega *</label>
                    <input
                      type="text" required value={formData.endereco} onChange={handleField('endereco')}
                      placeholder="Bairro, Avenida, Número de Porta ou Empresa..."
                      className="w-full border-b-2 border-gray-200 focus:border-[#ff9800] py-3 text-[13px] font-semibold text-gray-800 outline-none transition-colors placeholder:text-gray-400"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border-l-4 border-[#004d40] text-[12px] text-gray-700 animate-fadeIn font-medium">
                    <p className="font-bold uppercase text-[9px] tracking-wider text-[#004d40] mb-0.5">Localização para Levantamento:</p>
                    Mercado do Zimpeto, Armazém Central Secção A, Maputo. Horário: Segunda a Sábado (07:00 - 17:00).
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">Contacto Alternativo / Emergência</label>
                  <input
                    type="tel" value={formData.emergencia} onChange={handleField('emergencia')}
                    placeholder="Ex: 82 000 0000"
                    className="w-full border-b-2 border-gray-200 focus:border-[#ff9800] py-3 text-[13px] font-semibold text-gray-800 outline-none transition-colors placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">Notas Logísticas Especiais</label>
                  <textarea
                    value={formData.notas} onChange={handleField('notas')}
                    rows={2}
                    placeholder="Pontos de referência para a carrinha de distribuição ou instruções específicas..."
                    className="w-full border-b-2 border-gray-200 focus:border-[#ff9800] py-3 text-[13px] font-semibold text-gray-800 outline-none transition-colors resize-none placeholder:text-gray-400"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#ff9800] text-white py-4 font-black uppercase text-[11px] tracking-[0.15em] hover:bg-[#004d40] transition-colors mt-4 cursor-pointer"
                >
                  Continuar para Pagamento →
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: FINANCING AND GATEWAY INTERFACE */}
          {step === 2 && (
            <div className="bg-white p-8 border-t-4 border-[#004d40] shadow-sm">
              <h2 className="text-2xl font-black text-[#004d40] uppercase italic tracking-tighter mb-6">Método de Pagamento</h2>
              <form onSubmit={handleStep2} className="space-y-4">
                
                {/* DEDICATED INTEGRATED M-PESA GATEWAY ROW */}
                <div className={`p-5 border-2 transition-all ${paymentMethod === 'mpesa' ? 'border-[#004d40] bg-[#f0faf7]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <label className="flex gap-4 cursor-pointer items-start">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="mpesa" 
                      className="mt-1" 
                      checked={paymentMethod === 'mpesa'}
                      onChange={() => setPaymentMethod('mpesa')} 
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-base font-black tracking-tight text-red-600">M-PESA VODACOM</span>
                        <span className="bg-[#004d40] text-white text-[8px] font-black px-2 py-0.5 uppercase tracking-wide">Liquidação Digital</span>
                      </div>
                      <p className="text-[11px] text-gray-600 font-medium">Liquidação instantânea via sistema Push PIN móvel.</p>
                    </div>
                  </label>

                  {/* ACTIVE EXTENDED INTERACTIVE STATE */}
                  {paymentMethod === 'mpesa' && (
                    <div className="mt-5 pt-4 border-t border-gray-200/60 font-medium text-gray-800 animate-fadeIn">
                      <label className="text-[10px] font-black uppercase tracking-[0.12em] text-[#004d40] block mb-1">
                        Número de Telefone M-Pesa para Cobrança *
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                        <div className="relative flex-1">
                          <span className="absolute left-0 bottom-3 text-[13px] font-black text-gray-400 select-none">+258</span>
                          <input 
                            type="tel"
                            maxLength={9}
                            required
                            value={formData.mpesaNumber}
                            onChange={handleField('mpesaNumber')}
                            placeholder="840000000"
                            className="w-full border-b-2 border-gray-300 focus:border-[#ff9800] pl-11 py-2 text-[13px] font-black outline-none tracking-widest text-gray-800 placeholder:text-gray-300 placeholder:font-normal"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isProcessingMpesa || !formData.mpesaNumber}
                          className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all ${
                            isProcessingMpesa 
                              ? 'bg-gray-400 cursor-wait' 
                              : 'bg-[#004d40] hover:bg-[#ff9800] cursor-pointer'
                          }`}
                        >
                          {isProcessingMpesa ? 'A Processar...' : 'Autorizar via PIN Push'}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">
                        Ao clicar, receberá um pop-up oficial da Vodacom no seu telemóvel para introduzir o seu PIN e validar o valor de {cartTotal.toLocaleString('pt-MZ')} MT.
                      </p>
                    </div>
                  )}
                </div>

                {/* BANK TRANSFER LAYOUT */}
                <label className={`flex gap-4 p-5 border-2 cursor-pointer transition-colors ${paymentMethod === 'banco' ? 'border-[#004d40] bg-[#f0faf7]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="banco" 
                    className="mt-1" 
                    checked={paymentMethod === 'banco'}
                    onChange={() => setPaymentMethod('banco')} 
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-base font-black tracking-tight text-blue-900">TRANSFERÊNCIA BANCÁRIA (BIM / BCI)</span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-700">Millennium BIM NIB: <span className="text-[#004d40] font-black">0001 2345 6789 00</span></p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Titular: Zimpeto Wholesale LDA • Referência: {formData.telemovel || 'Nº de Telemóvel'}</p>
                  </div>
                </label>

                {/* HARD-CONTRAST INACTIVE GATEWAYS */}
                <div className="flex gap-4 p-5 border border-gray-100 bg-gray-50/50 opacity-50 cursor-not-allowed">
                  <div className="flex-1">
                    <div className="text-base font-black tracking-tight text-gray-400 mb-0.5">CARTÃO DE CRÉDITO / VISA INTERNATIONAL</div>
                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-wide">Canal indisponível para manutenção técnica</p>
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-[#ff9800] p-4 mt-6">
                  <p className="text-[10px] font-black text-[#004d40] uppercase tracking-wide mb-1">Aviso Operacional Obrigatório:</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                    Para liquidações via transferência manual, o envio do respectivo extracto digital ou talão de depósito para o WhatsApp corporativo <strong className="text-gray-800">+258 84 123 4567</strong> é indispensável para autorizar a saída logística imediata do stock.
                  </p>
                </div>

                <div className="flex items-start gap-3 pt-4">
                  <input 
                    type="checkbox" 
                    id="agree" 
                    checked={agreed} 
                    onChange={e => setAgreed(e.target.checked)} 
                    className="mt-1 cursor-pointer" 
                  />
                  <label htmlFor="agree" className="text-[11px] text-gray-600 font-semibold cursor-pointer select-none">
                    Declaro que verifiquei os lotes e concordo explicitamente com as políticas comerciais de distribuição do Zimpeto.
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="px-6 py-3 border-2 border-gray-200 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:border-[#004d40] hover:text-[#004d40] transition-colors bg-white cursor-pointer"
                  >
                    ← Voltar
                  </button>
                  
                  {/* Handle standard submit redirection if not standard Mpesa flow inline handling */}
                  {paymentMethod !== 'mpesa' && (
                    <button 
                      type="submit" 
                      disabled={!agreed} 
                      className={`flex-1 py-4 font-black uppercase text-[11px] tracking-[0.15em] transition-colors ${
                        agreed ? 'bg-[#ff9800] text-white hover:bg-[#004d40] cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Confirmar Encomenda Grossista →
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: TRANSACTION SUCCESS SUMMARY */}
          {step === 3 && (
            <div className="bg-white p-8 border-t-4 border-green-600 shadow-sm text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-[#004d40] uppercase italic tracking-tighter mb-3">Encomenda Registada</h2>
              <p className="text-gray-600 font-medium mb-6 text-sm max-w-lg mx-auto">
                O processamento do seu pedido foi concluído com sucesso. A equipa logística iniciará o empacotamento dos volumes com previsão de expedição em 24h.
              </p>

              <div className="bg-gray-50 p-6 text-left mb-6 space-y-3 border border-gray-100 font-medium">
                <div className="flex justify-between text-[11px] border-b border-gray-200/60 pb-2">
                  <span className="text-gray-400 uppercase font-bold tracking-wider">Cliente</span>
                  <span className="font-black text-gray-800">{formData.nome}</span>
                </div>
                <div className="flex justify-between text-[11px] border-b border-gray-200/60 pb-2">
                  <span className="text-gray-400 uppercase font-bold tracking-wider">Contacto Registado</span>
                  <span className="font-black text-gray-800">{formData.telemovel}</span>
                </div>
                <div className="flex justify-between text-[11px] border-b border-gray-200/60 pb-2">
                  <span className="text-gray-400 uppercase font-bold tracking-wider">Método Distribuição</span>
                  <span className="font-black text-gray-800 uppercase text-[10px] tracking-wide">
                    {deliveryMethod === 'entrega' ? 'Entrega Domicílio' : 'Levantamento no Armazém'}
                  </span>
                </div>
                {deliveryMethod === 'entrega' && (
                  <div className="flex justify-between text-[11px] border-b border-gray-200/60 pb-2">
                    <span className="text-gray-400 uppercase font-bold tracking-wider">Local de Descarga</span>
                    <span className="font-black text-gray-800 max-w-[220px] text-right truncate">{formData.endereco}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-gray-400 uppercase font-bold tracking-wider">Mecanismo de Liquidação</span>
                  <span className="font-black text-[#004d40] uppercase tracking-wider">{paymentMethod}</span>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 mb-6 font-semibold uppercase tracking-wider">
                Suporte Corporativo Directo WhatsApp: <span className="text-[#004d40]">+258 84 123 4567</span>
              </p>

              <button
                onClick={handleConfirm}
                className="w-full bg-[#004d40] text-white py-4 font-black uppercase text-[11px] tracking-[0.15em] hover:bg-[#1a1a1a] transition-colors cursor-pointer"
              >
                Voltar à Página Principal
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - PERMANENT HIGH-CONTRAST ORDER SUMMARY PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-white border-t-4 border-[#ff9800] p-5 shadow-sm sticky top-24">
            <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-[#004d40] mb-4">Resumo da Encomenda</h3>
            
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-200/60">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase text-gray-800 truncate leading-tight">{item.name}</p>
                    <p className="text-[9px] text-gray-400 font-bold mt-0.5">Quantidade: {item.qtd}</p>
                  </div>
                  <span className="text-[11px] font-black text-[#004d40] whitespace-nowrap">
                    {(item.price * item.qtd).toLocaleString('pt-MZ')} MT
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 pt-4 space-y-2.5 font-medium">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400 font-bold uppercase tracking-wide">Subtotal Líquido</span>
                <span className="font-black text-gray-800">{cartTotal.toLocaleString('pt-MZ')} MT</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400 font-bold uppercase tracking-wide">Porte de Distribuição</span>
                {deliveryMethod === 'levantamento' ? (
                  <span className="font-black text-gray-500 uppercase text-[9px]">Levantamento Grátis</span>
                ) : (
                  <span className={`font-black uppercase text-[9px] ${cartTotal >= 5000 ? 'text-green-700' : 'text-[#ff9800]'}`}>
                    {cartTotal >= 5000 ? 'Oferta Bulk' : 'A Calcular à Saída'}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-baseline text-[14px] pt-3 border-t border-gray-100">
                <span className="font-black text-gray-800 uppercase tracking-tight">Total Final</span>
                <span className="font-black text-[#004d40] text-xl tracking-tight">
                  {cartTotal.toLocaleString('pt-MZ')} MT
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}