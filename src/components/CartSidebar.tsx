'use client';
import { useCart } from '../app/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[500] backdrop-blur-[2px]" onClick={() => setIsCartOpen(false)} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white z-[600] flex flex-col shadow-2xl animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#004d40]">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white">O Seu Cesto</span>
            <span className="ml-2 bg-[#ff9800] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
              {cartCount} {cartCount === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xl"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-black text-[#004d40] uppercase text-sm mb-2">Cesto vazio</p>
              <p className="text-xs text-gray-400 mb-6">Adicione produtos para começar a sua encomenda</p>
              <button
                onClick={() => { setIsCartOpen(false); router.push('/loja'); }}
                className="bg-[#004d40] text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff9800] transition-colors"
              >
                Ir à Loja
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-16 rounded flex-shrink-0 overflow-hidden border border-gray-100">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wide text-gray-700 leading-snug mb-1 truncate">{item.name}</p>
                    <p className="text-[11px] font-black text-[#004d40] mb-2">{(item.price * item.qtd).toLocaleString('pt-MZ')} MT</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 text-[#004d40] font-black text-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="w-7 h-7 text-[11px] font-black flex items-center justify-center border-x border-gray-200">
                          {item.qtd}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 text-[#004d40] font-black text-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium">{item.price.toLocaleString('pt-MZ')} MT/und</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors text-sm mt-1 flex-shrink-0"
                    title="Remover"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-3 bg-white">
            <div className="bg-[#f0faf7] p-4 rounded-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-medium text-gray-500 uppercase">Subtotal</span>
                <span className="text-[13px] font-black text-gray-700">{cartTotal.toLocaleString('pt-MZ')} MT</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-medium text-gray-500 uppercase">Entrega</span>
                <span className="text-[11px] font-black text-green-700">
                  {cartTotal >= 5000 ? 'Gratuita' : '+ A calcular'}
                </span>
              </div>
              {cartTotal >= 5000 && (
                <p className="text-[9px] text-green-700 font-medium mt-1">✓ Qualificou para entrega gratuita!</p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-600">Total</span>
              <span className="text-2xl font-black text-[#004d40]">{cartTotal.toLocaleString('pt-MZ')} MT</span>
            </div>
            <button
              onClick={() => { setIsCartOpen(false); router.push('/checkout'); }}
              className="w-full bg-[#ff9800] text-white py-4 text-[11px] font-black uppercase tracking-[0.15em] hover:bg-[#004d40] transition-colors active:scale-95"
            >
              Finalizar Encomenda
            </button>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full border-2 border-gray-200 text-gray-500 py-3 text-[10px] font-black uppercase tracking-widest hover:border-[#004d40] hover:text-[#004d40] transition-colors"
            >
              Continuar a Comprar
            </button>
          </div>
        )}
      </div>
    </>
  );
}
