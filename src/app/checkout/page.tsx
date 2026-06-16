'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
// @ts-ignore
import { supabase } from '../../../supabase.js';

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart, t } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'entrega' | 'levantamento'>('entrega');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'flutterwave' | 'emola' | ''>('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
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

  const handleConfirm = async () => {
    if (!paymentMethod || !agreed) return;
    setLoading(true);
    setErrorMsg('');

    if (paymentMethod === 'mpesa') {
      if (!formData.mpesaNumber) {
        setErrorMsg('Por favor, introduza o número do M-Pesa.');
        setLoading(false);
        return;
      }
      try {
        if (!supabase) {
          throw new Error('Cliente da Base de Dados não inicializado.');
        }

        // Format address based on delivery selection
        const addressBase = deliveryMethod === 'entrega'
          ? `${formData.bairro}, ${formData.rua}, casa ${formData.numeroCasa}${formData.referencia ? ' (Ref: ' + formData.referencia + ')' : ''}`
          : 'Mercado do Zimpeto, Bancada 42-B, Maputo (Levantamento)';

        const addressString = addressBase + ` | Payment Info: ${JSON.stringify({
          payment_method: 'M-Pesa',
          phone_number: formData.mpesaNumber,
          amount: cartTotal,
          status: 'pending',
          transaction_id: ''
        })}`;

        // 1. Insert order into Supabase
        const { data: orderData, error: insertError } = await supabase
          .from('orders')
          .insert({
            customer_name: formData.nome,
            email: formData.email,
            phone: formData.telemovel,
            address: addressString,
            items: cart,
            total_price: cartTotal,
            status: 'pending'
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        clearCart();
        window.location.href = `/processing.html?orderId=${orderData.id}&phone=${formData.mpesaNumber}&amount=${cartTotal}`;
      } catch (err: any) {
        console.error('M-Pesa payment failed to initialize:', err);
        setErrorMsg('Pagamento falhou. Tente novamente.');
        setLoading(false);
      }
      return;
    }

    if (paymentMethod === 'flutterwave') {
      if (!(window as any).FlutterwaveCheckout) {
        setErrorMsg('O sistema de pagamento da Flutterwave ainda está a carregar. Por favor, tente novamente em alguns segundos.');
        setLoading(false);
        return;
      }

      try {
        (window as any).FlutterwaveCheckout({
          public_key: 'FLWPUBK_TEST-5f5b1f2cd6156de9f0f229a813ba550b-X',
          tx_ref: 'tx-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          amount: parseFloat((cartTotal / 64).toFixed(2)),
          currency: 'USD',
          country: 'MZ',
          payment_options: 'card, mobilemoney',
          customer: {
            email: formData.email,
            phone_number: formData.telemovel,
            name: formData.nome,
          },
          customizations: {
            title: 'Zimpeto Wholesale',
            description: 'Pagamento de Encomenda',
            logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150',
          },
          callback: async function (response: any) {
            console.log('Flutterwave response:', response);
            if (response.status === 'successful') {
              try {
                if (!supabase) {
                  throw new Error('Cliente da Base de Dados não inicializado.');
                }
                const addressString = (deliveryMethod === 'entrega'
                  ? `${formData.bairro}, ${formData.rua}, casa ${formData.numeroCasa}${formData.referencia ? ' (Ref: ' + formData.referencia + ')' : ''}`
                  : 'Mercado do Zimpeto, Bancada 42-B, Maputo (Levantamento)') + ` [Flutterwave Ref: ${response.transaction_id || response.tx_ref}]`;

                // Insert paid order
                const { data: orderData, error: insertError } = await supabase
                  .from('orders')
                  .insert({
                    customer_name: formData.nome,
                    email: formData.email,
                    phone: formData.telemovel,
                    address: addressString,
                    items: cart,
                    total_price: cartTotal,
                    status: 'paid'
                  })
                  .select()
                  .single();


                if (insertError) throw insertError;

                // Send receipt
                try {
                  await fetch('/api/send-receipt', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: formData.email,
                      customer_name: formData.nome,
                      phone: formData.telemovel,
                      address: addressString,
                      items: cart,
                      total_price: cartTotal,
                      order_id: orderData.id,
                      payment_status: 'paid'
                    }),
                  });
                } catch (emailErr) {
                  console.error('Failed to trigger email receipt:', emailErr);
                }

                clearCart();
                window.location.href = `/thankyou.html?orderId=${orderData.id}`;
              } catch (err: any) {
                console.error('Failed to save paid order:', err);
                setErrorMsg(err.message || 'Erro ao processar a encomenda. Por favor, contacte-nos.');
                setLoading(false);
              }
            } else {
              setErrorMsg('O pagamento não foi concluído. Por favor, tente novamente.');
              setLoading(false);
            }
          },
          onclose: function () {
            console.log('Payment modal closed');
            setLoading(false);
          }
        });
      } catch (err: any) {
        console.error('Error starting Flutterwave:', err);
        setErrorMsg('Ocorreu um erro ao iniciar a Flutterwave.');
        setLoading(false);
      }
      return;
    }

    if (paymentMethod === 'emola') {
      try {
        if (!supabase) {
          throw new Error('Cliente da Base de Dados não inicializado.');
        }

        // Format address based on delivery selection
        const addressBase = deliveryMethod === 'entrega'
          ? `${formData.bairro}, ${formData.rua}, casa ${formData.numeroCasa}${formData.referencia ? ' (Ref: ' + formData.referencia + ')' : ''}`
          : 'Mercado do Zimpeto, Bancada 42-B, Maputo (Levantamento)';

        const addressString = addressBase + ` | Payment Info: ${JSON.stringify({
          payment_method: 'e-Mola',
          phone_number: formData.telemovel,
          amount: cartTotal,
          status: 'pending',
          transaction_id: ''
        })}`;

        // 1. Insert order into Supabase
        const { data: orderData, error: insertError } = await supabase
          .from('orders')
          .insert({
            customer_name: formData.nome,
            email: formData.email,
            phone: formData.telemovel,
            address: addressString,
            items: cart,
            total_price: cartTotal,
            status: 'pending'
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        // 2. Trigger email receipt via send-receipt Route Handler
        try {
          await fetch('/api/send-receipt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              customer_name: formData.nome,
              phone: formData.telemovel,
              address: addressString,
              items: cart,
              total_price: cartTotal,
              order_id: orderData.id,
              payment_status: 'pending'
            }),
          });
        } catch (emailErr) {
          console.error('Failed to trigger email receipt:', emailErr);
        }

        // 3. Display message
        alert(`Enviaremos um pedido de pagamento e-Mola para o seu número em breve. Referência: ${orderData.id}`);

        // 4. Clear shopping cart and redirect
        clearCart();
        window.location.href = `/thankyou.html?orderId=${orderData.id}`;
      } catch (err: any) {
        console.error('Checkout failed:', err);
        setErrorMsg(err.message || 'Erro ao processar encomenda. Por favor, tente novamente.');
        setLoading(false);
      }
      return;
    }

    try {
      if (!supabase) {
        throw new Error('Cliente da Base de Dados não inicializado.');
      }

      // Format address based on delivery selection
      const addressString = deliveryMethod === 'entrega'
        ? `${formData.bairro}, ${formData.rua}, casa ${formData.numeroCasa}${formData.referencia ? ' (Ref: ' + formData.referencia + ')' : ''}`
        : 'Mercado do Zimpeto, Bancada 42-B, Maputo (Levantamento)';

      // 1. Insert order into Supabase
      const { data: orderData, error: insertError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.nome,
          email: formData.email,
          phone: formData.telemovel,
          address: addressString,
          items: cart,
          total_price: cartTotal,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // 2. Trigger email receipt via send-receipt Route Handler
      try {
        await fetch('/api/send-receipt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            customer_name: formData.nome,
            phone: formData.telemovel,
            address: addressString,
            items: cart,
            total_price: cartTotal,
            order_id: orderData.id
          }),
        });
      } catch (emailErr) {
        console.error('Failed to trigger email receipt:', emailErr);
      }

      // 3. Clear shopping cart and redirect
      clearCart();
      window.location.href = `/thankyou.html?orderId=${orderData.id}`;
    } catch (err: any) {
      console.error('Checkout failed:', err);
      setErrorMsg(err.message || 'Erro ao processar encomenda. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  if (cartCount === 0 && step === 1) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-black uppercase mb-6">{t('cesto_empty_title')}</h1>
        <button onClick={() => router.push('/loja')} className="bg-black text-white px-8 py-3 text-[11px] font-black uppercase hover:bg-black/80">{t('back_store_btn')}</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Indicador de Passos */}
      <div className="flex mb-12 justify-center gap-8">
        {[ { n: 1, label: t('details_step') }, { n: 2, label: t('payment_step') } ].map((s) => (
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
            <form onSubmit={handleStep1} className="bg-white p-8 border-t-4 border-black shadow-sm space-y-5 animate-fadeIn">
              <h2 className="text-xl font-black uppercase italic mb-6">{t('shipping_info_title')}</h2>
              
              <div className="flex gap-2 mb-4">
                <button type="button" onClick={() => setDeliveryMethod('entrega')} className={`flex-1 py-2 text-[10px] font-black uppercase border-2 ${deliveryMethod === 'entrega' ? 'bg-black text-white' : ''}`}>{t('delivery_tab')}</button>
                <button type="button" onClick={() => setDeliveryMethod('levantamento')} className={`flex-1 py-2 text-[10px] font-black uppercase border-2 ${deliveryMethod === 'levantamento' ? 'bg-black text-white' : ''}`}>{t('pickup_tab')}</button>
              </div>

              <input required placeholder={`${t('full_name_label')}`} value={formData.nome} onChange={handleField('nome')} className="w-full border-b-2 py-3 text-sm outline-none" />
              <input required type="email" placeholder={`${t('email_label')}`} value={formData.email} onChange={handleField('email')} className="w-full border-b-2 py-3 text-sm outline-none" />
              <input required placeholder={`${t('telemovel')}`} value={formData.telemovel} onChange={handleField('telemovel')} className="w-full border-b-2 py-3 text-sm outline-none" />
              
              {deliveryMethod === 'entrega' && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <input required placeholder={`${t('bairro_placeholder')}`} value={formData.bairro} onChange={handleField('bairro')} className="w-full border-b-2 py-2 text-sm outline-none" />
                  <input required placeholder={`${t('rua_placeholder')}`} value={formData.rua} onChange={handleField('rua')} className="w-full border-b-2 py-2 text-sm outline-none" />
                  <input placeholder={`${t('casa_placeholder')}`} value={formData.numeroCasa} onChange={handleField('numeroCasa')} className="w-full border-b-2 py-2 text-sm outline-none" />
                  <input placeholder={`${t('referencia_placeholder')}`} value={formData.referencia} onChange={handleField('referencia')} className="w-full border-b-2 py-2 text-sm outline-none" />
                </div>
              )}

              {deliveryMethod === 'levantamento' && (
                <div className="bg-gray-50 border border-gray-200 rounded p-4 text-xs space-y-1">
                  <span className="font-bold text-[#004d40] uppercase tracking-wider block mb-1">{t('pickup_location_title')}</span>
                  <p className="text-gray-800 font-medium">{t('market_name')}, {t('bancada_label')}</p>
                  <p className="text-gray-800 font-medium">Maputo, Moçambique</p>
                  <p className="text-gray-500 italic mt-1">{t('pickup_schedule_msg')}</p>
                </div>
              )}

              <button type="submit" className="w-full bg-black text-white py-4 font-black uppercase text-[11px] mt-4">{t('continue_payment_btn')}</button>
            </form>
          )}

          {step === 2 && (
            <div className="bg-white p-8 border-t-4 border-black shadow-sm animate-fadeIn space-y-4">
              <h2 className="text-xl font-black uppercase italic mb-6">{t('payment_method_title')}</h2>
              
              {/* Mpesa payment option */}
              <div className={`p-5 border-2 cursor-pointer ${paymentMethod === 'mpesa' ? 'border-black bg-black/5' : 'border-gray-200'}`} onClick={() => setPaymentMethod('mpesa')}>
                <span className="text-sm font-black">M-PESA VODACOM</span>
                {paymentMethod === 'mpesa' && (
                  <div className="mt-5 pt-4 border-t border-black space-y-3">
                    <div className="bg-black text-white p-4 text-[10px] font-bold">
                      <p className="uppercase">Introduza o seu número M-Pesa. Irá receber um pedido de confirmação de pagamento (PIN) no seu telemóvel.</p>
                    </div>
                    <input type="tel" maxLength={9} required value={formData.mpesaNumber} onChange={handleField('mpesaNumber')} placeholder="Número de Telefone M-Pesa (ex: 841234567)" className="w-full border-b-2 py-2 text-sm font-bold outline-none" />
                  </div>
                )}
              </div>

              {/* Flutterwave payment option */}
              <div className={`p-5 border-2 cursor-pointer ${paymentMethod === 'flutterwave' ? 'border-black bg-black/5' : 'border-gray-200'}`} onClick={() => setPaymentMethod('flutterwave')}>
                <span className="text-sm font-black uppercase">{t('flutterwave_title')}</span>
                {paymentMethod === 'flutterwave' && (
                  <div className="mt-5 pt-4 border-t border-black space-y-3">
                    <div className="bg-[#004d40] text-white p-4 text-[10px] font-bold">
                      <p className="uppercase">{t('flutterwave_instructions')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* e-Mola payment option */}
              <div className={`p-5 border-2 cursor-pointer ${paymentMethod === 'emola' ? 'border-black bg-black/5' : 'border-gray-200'}`} onClick={() => setPaymentMethod('emola')}>
                <span className="text-sm font-black uppercase">e-Mola</span>
                {paymentMethod === 'emola' && (
                  <div className="mt-5 pt-4 border-t border-black space-y-3">
                    <div className="bg-black text-white p-4 text-[10px] font-bold">
                      <p className="uppercase">{t('emola_instructions')}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <label className="flex items-center gap-2 mt-6 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <span className="text-[10px] font-black uppercase">{t('agree_policies_label')}</span>
              </label>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 mt-4 rounded-sm text-center">
                  {errorMsg}
                </div>
              )}

              <button 
                disabled={!agreed || !paymentMethod || loading} 
                onClick={handleConfirm} 
                className="w-full bg-black text-white py-4 mt-6 font-black uppercase text-[11px] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading 
                  ? (paymentMethod === 'mpesa' ? 'Confirme o pagamento no seu telemóvel...' : t('processing_order_btn')) 
                  : (paymentMethod === 'mpesa' ? 'Pagar com M-Pesa' : t('confirm_order_btn'))}
              </button>
            </div>
          )}
        </div>

        {/* Resumo Estático */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 sticky top-24 border-t-4 border-black">
            <h3 className="text-[11px] font-black uppercase mb-4">{t('order_summary_title')}</h3>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-[11px] font-bold">
                  <span>{t(item.name)} x{item.qtd}</span>
                  <span>{(item.price * item.qtd).toLocaleString('pt-MZ')} MT</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-black text-lg">
              <span>{t('total_label')}</span>
              <span>{cartTotal.toLocaleString('pt-MZ')} MT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}