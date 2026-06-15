'use client';
import { useState } from 'react';
import { RECIPES } from '../../data';
import { useCart } from '../context/CartContext';

type Recipe = (typeof RECIPES)[number];

export default function ReceitasPage() {
  const [selected, setSelected] = useState<Recipe | null>(null);
  const { t } = useCart();

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 pb-20">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-[#ff9800] font-black uppercase text-[10px] tracking-widest mb-8 hover:text-[#004d40] transition-colors"
        >
          {t('back_recipes')}
        </button>

        <div className="bg-white border border-gray-100 overflow-hidden shadow-lg">
          <div className="relative h-72 overflow-hidden">
            <img src={selected.img} alt={t(selected.title)} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#004d40]/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">{t(selected.title)}</h1>
              <div className="flex gap-4 text-[10px] font-black uppercase text-white/80">
                <span>⏱ {selected.time}</span>
                <span>👥 {selected.servings} {t('recipe_detail_servings')}</span>
                <span>📊 {selected.difficulty === 'Fácil' ? t('difficulty_facil') : t('difficulty_medio')}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <p className="text-gray-600 font-medium mb-8 text-sm leading-relaxed">{t(selected.description)}</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#004d40] border-b-2 border-[#ff9800] pb-2 mb-4">
                  {t('ingredients_label')}
                </h3>
                <ul className="space-y-2">
                  {selected.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] font-medium text-gray-700">
                      <span className="text-[#ff9800] font-black mt-0.5">•</span>
                      {t(ing)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#004d40] border-b-2 border-[#ff9800] pb-2 mb-4">
                  {t('preparation_label')}
                </h3>
                <ol className="space-y-4">
                  {selected.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-6 h-6 bg-[#004d40] text-white text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-[12px] font-medium text-gray-700 leading-relaxed">{t(step)}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <a
                href="/loja"
                className="inline-block bg-[#ff9800] text-white px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-[#004d40] transition-colors"
              >
                {t('buy_ingredients_btn')}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 pb-20">
      <div className="mb-10 text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff9800] mb-2">{t('culinary_mz')}</div>
        <h1 className="text-4xl font-black text-[#004d40] uppercase italic tracking-tighter mb-3">{t('recipes_earth_title')}</h1>
        <p className="text-gray-500 font-medium max-w-xl mx-auto text-sm">
          {t('recipes_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {RECIPES.map(r => (
          <div
            key={r.id}
            className="bg-white border border-gray-100 group overflow-hidden flex flex-col md:flex-row cursor-pointer"
            onClick={() => setSelected(r)}
          >
            <div className="md:w-56 h-48 md:h-auto overflow-hidden flex-shrink-0 relative">
              <img
                src={r.img}
                alt={t(r.title)}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-black text-[#004d40] uppercase italic text-lg tracking-tight mb-2">{t(r.title)}</h3>
                <p className="text-gray-500 text-[12px] font-medium leading-relaxed mb-4">{t(r.description)}</p>
                <div className="flex gap-4 text-[9px] font-black uppercase tracking-wider text-gray-400 mb-4">
                  <span className="flex items-center gap-1">⏱ {r.time}</span>
                  <span className="flex items-center gap-1">👥 {r.servings} {t('people_servings')}</span>
                  <span className={`px-2 py-0.5 ${r.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {r.difficulty === 'Fácil' ? t('difficulty_facil') : t('difficulty_medio')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelected(r)}
                className="self-start bg-[#004d40] text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff9800] transition-colors"
              >
                {t('recipe_detail_btn')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
