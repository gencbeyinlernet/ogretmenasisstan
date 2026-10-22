import React, { useState } from 'react';
import { 
  Rocket, 
  Smartphone, 
  Users, 
  Gamepad2, 
  Lightbulb, 
  Landmark, 
  Sprout, 
  School, 
  Laptop,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface QuickActionGridProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAnnualPlans: () => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({
  onNavigateSection,
  onOpenAnnualPlans,
}) => {
  const [activeCategory, setActiveCategory] = useState('Projelerimiz');

  const categories = [
    'Projelerimiz',
    'Yapay Zeka',
    'Oyunlarım',
    'Yıllık Planlar',
    'Sınıf Yoklama',
    'Not Defterim',
  ];

  const cards = [
    {
      id: 'c1',
      title: 'Teknofest Asistan',
      category: 'Projelerimiz',
      subtitle: 'Akıllı proje yazma ve başvuru asistanı',
      icon: Rocket,
      action: () => onNavigateSection('projeler'),
    },
    {
      id: 'c2',
      title: 'Yapay Zekâ Atölyesi Rehberi',
      category: 'Yapay Zeka',
      subtitle: 'ChatGPT, Canva ve Napkin AI araçları',
      icon: Smartphone,
      action: () => onNavigateSection('yapayzeka'),
    },
    {
      id: 'c3',
      title: 'Proje Tabanlı Eğitim Topluluğu',
      category: 'Projelerimiz',
      subtitle: 'Öğretmenler arası iş birliği ağı',
      icon: Users,
      action: () => onNavigateSection('topluluk'),
    },
    {
      id: 'c4',
      title: 'Siber Oyun & Mini Tetris',
      category: 'Oyunlarım',
      subtitle: 'Canva Mini Tetris ve eğitsel oyunlar',
      icon: Gamepad2,
      action: () => onNavigateSection('oyunlar'),
    },
    {
      id: 'c5',
      title: 'Bilgi Düellosu & Yarışma',
      category: 'Oyunlarım',
      subtitle: 'Canva Bilgi Düellosu ve soru havuzu',
      icon: Lightbulb,
      action: () => onNavigateSection('oyunlar'),
    },
    {
      id: 'c6',
      title: 'Sınıflarımız (9-12)',
      category: 'Projelerimiz',
      subtitle: 'Kazanımlar, çalışma kağıtları ve denemeler',
      icon: Landmark,
      action: () => onNavigateSection('siniflar'),
    },
    {
      id: 'c7',
      title: 'Yıllık Planlar (MEB)',
      category: 'Yıllık Planlar',
      subtitle: '2026-2027 ünitelendirilmiş kazanım planları',
      icon: Sprout,
      action: () => onOpenAnnualPlans(),
    },
    {
      id: 'c8',
      title: 'Öğrenci Not & Devamsızlık',
      category: 'Sınıf Yoklama',
      subtitle: 'Haftalık e-tablo kontrolü ve çizelge linki',
      icon: School,
      action: () => onNavigateSection('ogrenci_not_devamsizlik'),
    },
    {
      id: 'c9',
      title: 'Burak Öğretmen Not Defteri',
      category: 'Not Defterim',
      subtitle: 'Kişisel ders notları, ajanda ve hatırlatıcılar',
      icon: Laptop,
      action: () => onNavigateSection('notlar'),
    },
  ];

  const filteredCards = activeCategory === 'Projelerimiz'
    ? cards
    : cards.filter(c => c.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* Category Filter Pills (Matches Reference Image) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs ${
              activeCategory === cat
                ? 'bg-[#0f1d3e] text-white border-[#0f1d3e] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3x3 Card Grid (Matches Reference Image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {filteredCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.action}
              className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-indigo-300 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {/* Coral / Red-tinted rounded square icon background like the image */}
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100/80 flex items-center justify-center text-rose-500 group-hover:scale-105 group-hover:bg-rose-100 transition-all shrink-0">
                  <IconComponent size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
