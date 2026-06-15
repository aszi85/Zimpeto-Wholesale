'use client';

import { useState } from 'react';
// @ts-ignore
import { supabase } from '../../../supabase.js';
import { useCart } from '../context/CartContext';

export default function ContactoPage() {
  const { t } = useCart();
  const [screen, setScreen] = useState<'form' | 'otp' | 'success'>('form');
  
  // Form Data
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [message, setMessage] = useState('');
  
  // OTP Verification
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  
  // Local testing helper (displays code if Resend is not configured)
  const [testOtp, setTestOtp] = useState<string | null>(null);

  // Submit Contact Form - Sends OTP
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');
    setTestOtp(null);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailAddress }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao enviar código de verificação.');
      }

      // If API ran in local testing mode, save the code to show it
      if (data.testMode && data.code) {
        setTestOtp(data.code);
      }

      setScreen('otp');
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setErrorMsg('O código OTP deve ter 6 dígitos.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (!supabase) {
        throw new Error('Cliente do banco de dados não configurado.');
      }

      // 1. Query the otps table for a valid match
      const now = new Date().toISOString();
      const { data: matchedOtp, error: fetchError } = await supabase
        .from('otps')
        .select('*')
        .eq('email', emailAddress)
        .eq('code', otpCode)
        .eq('used', false)
        .gt('expires_at', now)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (!matchedOtp) {
        throw new Error('Código incorreto, já utilizado ou expirado.');
      }

      // 2. Mark the OTP code as used
      const { error: updateError } = await supabase
        .from('otps')
        .update({ used: true })
        .eq('email', emailAddress)
        .eq('code', otpCode);

      if (updateError) {
        throw updateError;
      }

      // 3. Success state
      setScreen('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao verificar o código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');
    setTestOtp(null);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailAddress }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao reenviar código.');
      }

      if (data.testMode && data.code) {
        setTestOtp(data.code);
      }

      setInfoMsg('Novo código enviado com sucesso!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao reenviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Centered Professional Card Container */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-sm shadow-xl p-8 border-t-4 border-[#004d40] transition-all duration-300">
        
        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff9800] mb-1">{t('catalog_wholesale')}</div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#004d40]">{t('contact_title')}</h2>
        </div>

        {/* ==================== SCREEN 1: FORM ==================== */}
        {screen === 'form' && (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black block mb-2">
                {t('full_name_label')}
              </label>
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-200 focus:border-[#ff9800] px-4 py-3 text-sm outline-none transition-colors font-medium placeholder:text-gray-400"
                placeholder={t('full_name_placeholder')}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black block mb-2">
                {t('email_label')}
              </label>
              <input
                required
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full border border-gray-200 focus:border-[#ff9800] px-4 py-3 text-sm outline-none transition-colors font-medium placeholder:text-gray-400"
                placeholder={t('email_placeholder')}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black block mb-2">
                {t('message_label')}
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-200 focus:border-[#ff9800] px-4 py-3 text-sm outline-none transition-colors font-medium resize-none placeholder:text-gray-400"
                placeholder={t('message_placeholder')}
              />
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-sm">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004d40] text-white py-4 font-black uppercase text-[11px] tracking-[0.15em] hover:bg-[#ff9800] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  {t('processing_btn')}
                </>
              ) : (
                t('send_message_btn')
              )}
            </button>
          </form>
        )}

        {/* ==================== SCREEN 2: OTP INPUT ==================== */}
        {screen === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <p className="text-sm font-medium text-center text-gray-600 mb-6">
              {t('otp_sent_msg')} <span className="font-bold text-black">{emailAddress}</span>.
            </p>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black block mb-2 text-center">
                {t('otp_enter_label')}
              </label>
              <input
                required
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full border-2 border-dashed border-gray-300 focus:border-[#004d40] px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none transition-colors"
                placeholder="000000"
              />
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-sm text-center">
                {errorMsg}
              </div>
            )}

            {infoMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold p-3 rounded-sm text-center">
                {infoMsg}
              </div>
            )}

            {/* Test Mode helper widget */}
            {testOtp && (
              <div className="bg-gray-100 border border-gray-200 text-gray-700 text-xs p-3 rounded-sm text-center">
                <span className="font-bold uppercase text-[9px] text-gray-500 block mb-1">{t('test_mode_active')}</span>
                {t('code_generated')}: <strong className="text-black text-sm tracking-wider font-mono bg-white px-2 py-0.5 border rounded-sm">{testOtp}</strong>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004d40] text-white py-4 font-black uppercase text-[11px] tracking-[0.15em] hover:bg-[#ff9800] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  {t('verifying_btn')}
                </>
              ) : (
                t('confirm_code_btn')
              )}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-[10px] font-black uppercase text-[#ff9800] hover:underline"
              >
                {t('resend_code_btn')}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setScreen('form')}
                className="text-[10px] font-black uppercase text-gray-400 hover:text-gray-600"
              >
                {t('back_form_btn')}
              </button>
            </div>
          </form>
        )}

        {/* ==================== SCREEN 3: SUCCESS ==================== */}
        {screen === 'success' && (
          <div className="text-center py-8 space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 text-[#004d40] rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div>
              <h3 className="text-xl font-black text-[#004d40] uppercase italic tracking-tighter mb-2">
                {t('verification_completed')}
              </h3>
              <p className="text-sm font-medium text-black">
                {t('message_sent_success')}
              </p>
            </div>

            <button
              onClick={() => {
                setFullName('');
                setEmailAddress('');
                setMessage('');
                setScreen('form');
                setErrorMsg('');
                setInfoMsg('');
                setTestOtp(null);
              }}
              className="mt-6 text-[10px] font-black uppercase text-[#ff9800] hover:underline"
            >
              {t('send_another_msg')}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}