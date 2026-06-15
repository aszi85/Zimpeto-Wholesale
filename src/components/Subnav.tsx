'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

export default function Subnav() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useCart();

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  const links = [
    { name: t('inicio'), href: '/' },
    { name: t('loja'), href: '/loja' },
    { name: t('receitas'), href: '/receitas' },
    { name: t('contacto'), href: '/contacto' },
    { name: t('localizacao'), href: '/localizacao' },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200 z-40 sticky top-16 hidden lg:block shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center h-12 gap-8">
          {links.map(link => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={`text-[12px] font-black uppercase tracking-wider transition-colors duration-200 cursor-pointer pb-1 border-b-2 ${
                isActive(link.href) 
                  ? 'text-[#004d40] border-[#ff9800]' 
                  : 'border-transparent text-gray-700 hover:text-[#004d40]'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}