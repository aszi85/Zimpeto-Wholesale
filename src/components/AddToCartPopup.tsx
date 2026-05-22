'use client';
import { useState, useEffect } from 'react';
import { useCart } from '../app/context/CartContext';
import { Product } from '../app/context/CartContext';

export default function AddToCartPopup() {
  const { popupProduct, setPopupProduct, addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (popupProduct) {
      const defaultQty = popupProduct.qtdOptions?.[0] ?? 1;
      setQty(defaultQty);
      setSelectedOpt(defaultQty);
      setAdded(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [popupProduct]);

  if (!popupProduct) return null;

  const total = popupProduct.price * qty;
  const saving = popupProduct.oldPrice ? (popupProduct.oldPrice - popupProduct.price) * qty : 0;

  const handleAdd = () => {
    addToCart(popupProduct, qty);
    setAdded(true);
    setTimeout(() => {
      setPopupProduct(null);
    }, 800);
  };

  const selectQtyOpt = (q: number) => {
    setQty(q);
    setSelectedOpt(q);
  };

  const changeQty = (delta: number) => {
    const newQty = Math.max(1, qty + delta);
    setQty(newQty);
    setSelectedOpt(null);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[500] backdrop-blur-[2px]"
        onClick={() => setPopupProduct(null)}
      />

      {/* Slide-in Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white z-[600] flex flex-col shadow-2xl animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#004d40]">Adicionar ao Cesto</span>
          <button
            onClick={() => setPopupProduct(null)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Product Hero */}
        <div className="flex gap-4 p-5 border-b border-gray-100 bg-gray-50">
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
            <img src={popupProduct.img} alt={popupProduct.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            {popupProduct.tag && (
              <span className="inline-block bg-red-600 text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wider mb-1">
                {popupProduct.tag}
              </span>
            )}
            <h3 className="font-black text-[13px] text-gray-800 uppercase tracking-wide leading-snug mb-2">
              {popupProduct.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-[#004d40]">{popupProduct.price.toLocaleString('pt-MZ')} MT</span>
              {popupProduct.oldPrice && (
                <span className="text-xs text-gray-400 line-through">{popupProduct.oldPrice.toLocaleString('pt-MZ')} MT</span>
              )}
            </div>
            {popupProduct.oldPrice && (
              <span className="text-[10px] text-green-700 font-bold">
                Poupa {(popupProduct.oldPrice - popupProduct.price).toLocaleString('pt-MZ')} MT por unidade
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Quick Qty Options */}
          {popupProduct.qtdOptions && popupProduct.qtdOptions.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3">Quantidades frequentes</p>
              <div className="flex flex-wrap gap-2">
                {popupProduct.qtdOptions.map(q => (
                  <button
                    key={q}
                    onClick={() => selectQtyOpt(q)}
                    className={`px-4 py-2 text-[11px] font-black uppercase border-2 rounded-sm transition-all ${
                      selectedOpt === q
                        ? 'border-[#004d40] bg-[#004d40] text-white'
                        : 'border-gray-200 text-gray-600 hover:border-[#004d40] hover:text-[#004d40]'
                    }`}
                  >
                    {q} {q === 1 ? 'und.' : 'und.'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Qty Stepper */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3">Quantidade personalizada</p>
            <div className="flex items-center gap-0 border-2 border-gray-200 w-fit rounded-sm overflow-hidden">
              <button
                onClick={() => changeQty(-1)}
                className="w-10 h-10 flex items-center justify-center text-[#004d40] font-black text-xl hover:bg-[#004d40] hover:text-white transition-colors"
              >
                −
              </button>
              <div className="w-12 h-10 flex items-center justify-center text-[15px] font-black text-gray-800 border-x-2 border-gray-200">
                {qty}
              </div>
              <button
                onClick={() => changeQty(1)}
                className="w-10 h-10 flex items-center justify-center text-[#004d40] font-black text-xl hover:bg-[#004d40] hover:text-white transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Product Details */}
          {popupProduct.details && Object.keys(popupProduct.details).length > 0 && (
            <div className="bg-[#f0faf7] border border-[#004d40]/10 rounded-sm p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#004d40] mb-3">Detalhes do Produto</p>
              <div className="space-y-2">
                {Object.entries(popupProduct.details).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center">
                    <span className="text-[11px] text-gray-500 font-medium">{k}</span>
                    <span className="text-[11px] font-black text-gray-800">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info note */}
          <div className="bg-amber-50 border-l-4 border-[#ff9800] p-3">
            <p className="text-[10px] font-medium text-gray-600 leading-relaxed uppercase">
              Encomendas acima de 5.000 MT têm entrega gratuita na Cidade de Maputo.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-5 bg-white space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Total ({qty} unid.)</span>
            <div className="text-right">
              <span className="text-2xl font-black text-[#004d40]">{total.toLocaleString('pt-MZ')} MT</span>
              {saving > 0 && (
                <div className="text-[10px] text-green-700 font-bold">Poupa {saving.toLocaleString('pt-MZ')} MT</div>
              )}
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={added}
            className={`w-full py-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-[#004d40] text-white hover:bg-[#ff9800] active:scale-95'
            }`}
          >
            {added ? '✓ Adicionado ao Cesto!' : `Adicionar ${qty} ao Cesto`}
          </button>
        </div>
      </div>
    </>
  );
}
