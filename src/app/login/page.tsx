'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
// @ts-ignore
import { supabase } from '../../../supabase.js';

export default function LoginPage() {
  const router = useRouter();
  const { login, t } = useCart();
  const [screen, setScreen] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [testOtp, setTestOtp] = useState<string | null>(null);

  // Send OTP handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg(t('email_required'));
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setTestOtp(null);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar código OTP.');
      }

      if (data.testMode && data.code) {
        setTestOtp(data.code);
      }

      setScreen('verify');
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrorMsg(t('otp_length_error') || 'O código deve ter 6 dígitos.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      if (!supabase) {
        throw new Error('Banco de dados não configurado.');
      }

      const now = new Date().toISOString();
      const { data: matchedOtp, error: fetchError } = await supabase
        .from('otps')
        .select('*')
        .eq('email', email)
        .eq('code', otp)
        .eq('used', false)
        .gt('expires_at', now)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (!matchedOtp) {
        throw new Error(t('invalid_otp'));
      }

      // Mark OTP as used
      await supabase
        .from('otps')
        .update({ used: true })
        .eq('email', email)
        .eq('code', otp);

      // Perform context login
      login(email);

      // Redirect home
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao verificar o código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-16 bg-white text-gray-900">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-sm shadow-xl p-8 border-t-4 border-[#004d40]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#004d40] italic uppercase tracking-tighter">ZIMPETO</h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Wholesale Marketplace</p>
        </div>

        {screen === 'request' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-gray-800 mb-2">{t('login_otp_title')}</h2>
              <p className="text-xs font-semibold text-gray-400 uppercase leading-relaxed mb-6">{t('login_otp_desc')}</p>
              
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black block mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ex: admin@zimpeto.com"
                className="w-full border border-gray-200 focus:border-[#ff9800] px-4 py-3 text-sm outline-none transition-colors font-medium placeholder:text-gray-400"
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
              {loading ? t('processing_btn') : t('send_otp')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-gray-800 mb-2">{t('login_otp_title')}</h2>
              <p className="text-xs font-semibold text-gray-600 mb-6">
                Código OTP enviado para <span className="font-bold text-black">{email}</span>.
              </p>

              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-black block mb-2 text-center">
                Introduza o Código de 6 Dígitos
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full border-2 border-dashed border-gray-300 focus:border-[#004d40] px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none transition-colors"
                placeholder="000000"
              />
            </div>

            {testOtp && (
              <div className="bg-amber-50 border-l-4 border-[#ff9800] p-4 text-center">
                <span className="block text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">{t('test_mode_active')}</span>
                <span className="text-[10px] text-gray-600 uppercase font-semibold">{t('code_generated')}: </span>
                <span className="font-mono font-bold text-lg text-[#004d40] select-all tracking-wider">{testOtp}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-sm text-center">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScreen('request')}
                className="flex-1 border-2 border-gray-200 text-gray-500 py-3 text-[10px] font-black uppercase tracking-widest hover:border-[#004d40] hover:text-[#004d40] transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#004d40] text-white py-3 font-black uppercase text-[10px] tracking-widest hover:bg-[#ff9800] transition-colors disabled:opacity-50"
              >
                {loading ? t('processing_btn') : t('verify_login')}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
