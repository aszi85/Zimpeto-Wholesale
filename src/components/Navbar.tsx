'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { ALL_PRODUCTS } from '@/data';
import Subnav from '@/components/Subnav';

export default function Navbar() {
  const { cartCount, setIsCartOpen, language, setLanguage, t, userEmail, logout, isAdmin } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const suggestions = searchQuery.length > 1 
    ? ALL_PRODUCTS.filter(p => t(p.name).toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5) 
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/loja?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t('speech_not_supported'));
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'pt' ? 'pt-PT' : language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          alert(t('speech_error'));
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        const cleanedText = resultText.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]+$/, "").trim();
        setSearchQuery(cleanedText);
        router.push(`/loja?q=${encodeURIComponent(cleanedText)}`);
        setShowSuggestions(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const navLinks = [
    { name: t('inicio'), href: '/' },
    { name: t('loja'), href: '/loja' },
    { name: t('receitas'), href: '/receitas' },
    { name: t('contacto'), href: '/contacto' },
    { name: t('localizacao'), href: '/localizacao' },
  ];

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* LOGO */}
          <button 
            onClick={() => router.push('/')} 
            className="font-black text-2xl text-[#004d40] italic shrink-0 flex items-baseline gap-1"
          >
            <span>ZIMPETO</span>
            <span className="text-[10px] not-italic font-black text-[#ff9800] uppercase tracking-wider hidden sm:inline-block">WHOLESALE</span>
          </button>

          {/* SEARCH BAR (Desktop) */}
          <div className="hidden md:block flex-1 max-w-xl mx-4" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative flex items-center bg-gray-100 rounded-full border border-transparent focus-within:border-[#004d40] focus-within:bg-white transition-all duration-200 px-4 py-1.5 shadow-inner">
                <svg className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  placeholder={isListening ? t('listening') : t('search_placeholder')}
                  disabled={isListening}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400 py-1"
                />
                
                {/* Voice Search Mic */}
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  title={t('search_speak')}
                  className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-[#004d40] flex items-center justify-center shrink-0 ml-1 ${
                    isListening ? 'animate-pulse bg-red-100 text-red-600 hover:bg-red-200' : ''
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                </button>
              </div>

              {/* Autocomplete suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                  {suggestions.map(p => (
                    <button 
                      key={p.id} 
                      type="button"
                      onClick={() => { 
                        router.push(`/loja?q=${encodeURIComponent(t(p.name))}`); 
                        setShowSuggestions(false); 
                        setSearchQuery(''); 
                      }} 
                      className="block w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0 text-gray-700 font-medium transition-colors"
                    >
                      {t(p.name)}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* ACTIONS / UTILITIES */}
          <div className="flex items-center gap-2 md:gap-4 lg:gap-5">
            {/* Apoio (Support) */}
            <button 
              onClick={() => router.push('/contacto')}
              className="hidden md:flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-gray-700 hover:text-[#004d40] transition-colors py-2 px-1"
            >
              <span>{t('apoio')}</span>
            </button>

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="font-bold text-xs uppercase tracking-wider hover:text-[#004d40] transition-colors flex items-center gap-1 py-2 px-2 border border-gray-200 rounded-full bg-gray-50 hover:bg-gray-100"
              >
                <span>{language === 'pt' ? '🇵🇹 PT' : language === 'hi' ? '🇮🇳 HI' : '🇬🇧 EN'}</span>
                <svg className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-200 shadow-2xl rounded-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button 
                    onClick={() => { setLanguage('pt'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-[#f0faf7] hover:text-[#004d40] transition-colors flex items-center gap-2 ${
                      language === 'pt' ? 'text-[#004d40] bg-[#f0faf7]' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-sm">🇵🇹</span> Português
                  </button>
                  <button 
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-[#f0faf7] hover:text-[#004d40] transition-colors flex items-center gap-2 ${
                      language === 'en' ? 'text-[#004d40] bg-[#f0faf7]' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-sm">🇬🇧</span> English
                  </button>
                  <button 
                    onClick={() => { setLanguage('hi'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-[#f0faf7] hover:text-[#004d40] transition-colors flex items-center gap-2 ${
                      language === 'hi' ? 'text-[#004d40] bg-[#f0faf7]' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-sm">🇮🇳</span> Hindi
                  </button>
                </div>
              )}
            </div>

            {/* Account dropdown */}
            <div className="relative" ref={accountRef}>
              <button 
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="hidden sm:flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-gray-700 hover:text-[#004d40] transition-colors py-2 px-1"
              >
                👤 {userEmail ? userEmail.split('@')[0] : t('conta')}
              </button>
              {isAccountOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 shadow-2xl rounded-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {userEmail ? (
                    <>
                      <div className="px-4 py-2 text-[10px] text-gray-400 font-bold uppercase border-b border-gray-100">{userEmail}</div>
                      {isAdmin && (
                        <>
                          <a 
                            href="/orders.html"
                            onClick={() => setIsAccountOpen(false)}
                            className="block w-full text-left px-4 py-2.5 text-xs font-bold uppercase hover:bg-[#f0faf7] hover:text-[#004d40] transition-colors"
                          >
                            {t('minhas_encomendas')}
                          </a>
                          <a 
                            href="/admin.html"
                            onClick={() => setIsAccountOpen(false)}
                            className="block w-full text-left px-4 py-2.5 text-xs font-bold uppercase hover:bg-[#f0faf7] hover:text-[#004d40] transition-colors"
                          >
                            {t('painel_visitas')}
                          </a>
                        </>
                      )}
                      <button
                        onClick={() => { logout(); setIsAccountOpen(false); router.push('/'); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase hover:bg-red-50 hover:text-red-600 transition-colors text-red-500 border-t border-gray-100"
                      >
                        {t('terminar_sessao')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { router.push('/login'); setIsAccountOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase hover:bg-[#f0faf7] hover:text-[#004d40] transition-colors"
                      >
                        {t('iniciar_sessao')}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart (Cesto) Button */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="bg-[#004d40] text-white hover:bg-[#00332c] font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-full transition-colors flex items-center gap-2 shrink-0 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>{t('cesto')} ({cartCount})</span>
            </button>

            {/* Hamburger toggle */}
            <button 
              className="lg:hidden p-2 text-2xl text-gray-700 hover:text-[#004d40]" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER/MENU */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 p-4 flex flex-col gap-4 shadow-xl w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-200">
            {/* Search Input for Mobile */}
            <div className="relative flex items-center bg-gray-100 rounded-full border border-transparent focus-within:border-[#004d40] focus-within:bg-white transition-all duration-200 px-4 py-2 shadow-inner">
              <svg className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isListening ? t('listening') : t('search_placeholder')}
                disabled={isListening}
                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`/loja?q=${encodeURIComponent(searchQuery)}`);
                    setIsMenuOpen(false);
                  }
                }}
              />
              <button
                type="button"
                onClick={startVoiceSearch}
                className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-[#004d40] flex items-center justify-center shrink-0 ${
                  isListening ? 'animate-pulse bg-red-100 text-red-600' : ''
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col border-b border-gray-100 pb-2">
              {navLinks.map(link => (
                <button 
                  key={link.name} 
                  onClick={() => { router.push(link.href); setIsMenuOpen(false); }} 
                  className="text-left font-bold py-3 text-sm text-gray-700 hover:text-[#004d40] border-b border-gray-50 last:border-b-0"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Extra Utility Links */}
            <div className="flex flex-col gap-2">
              {userEmail ? (
                <>
                  <div className="text-xs font-bold text-gray-500 uppercase py-1 border-b border-gray-50 px-1">{userEmail}</div>
                  {isAdmin && (
                    <>
                      <a 
                        href="/orders.html"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-left text-xs font-bold uppercase text-[#ff9800] py-2"
                      >
                        📦 {t('minhas_encomendas_painel')}
                      </a>
                      <a 
                        href="/admin.html"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-left text-xs font-bold uppercase text-gray-400 py-2"
                      >
                        📊 {t('painel_visitas')}
                      </a>
                    </>
                  )}
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); router.push('/'); }}
                    className="text-left text-xs font-bold uppercase text-red-500 hover:text-red-600 py-2 border-t border-gray-50 mt-1"
                  >
                    🚪 {t('terminar_sessao')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { router.push('/login'); setIsMenuOpen(false); }}
                  className="text-left text-xs font-bold uppercase text-gray-600 hover:text-[#004d40] py-2"
                >
                  👤 {t('iniciar_sessao')}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* Subnav - Row 2 */}
      <Subnav />
    </>
  );
}