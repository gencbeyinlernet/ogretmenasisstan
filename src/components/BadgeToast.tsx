import React, { useEffect, useState } from 'react';
import { StudentBadge } from '../types';
import { Award, Sparkles, BookMarked, Gamepad2, X, Star } from 'lucide-react';

export const BadgeToast: React.FC = () => {
  const [currentBadge, setCurrentBadge] = useState<StudentBadge | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBadgeEarned = (event: any) => {
      if (event.detail && event.detail.badge) {
        setCurrentBadge(event.detail.badge);
        setTotal(event.detail.totalBadges || 0);
        setIsVisible(true);

        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('badge-earned', handleBadgeEarned);
    return () => window.removeEventListener('badge-earned', handleBadgeEarned);
  }, []);

  if (!isVisible || !currentBadge) return null;

  const renderIcon = () => {
    switch (currentBadge.badgeType) {
      case 'assignment':
        return <BookMarked size={28} className="text-amber-300" />;
      case 'ai_tool':
        return <Sparkles size={28} className="text-cyan-300" />;
      case 'game':
        return <Gamepad2 size={28} className="text-emerald-300" />;
      default:
        return <Award size={28} className="text-yellow-300" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 shadow-2xl border-2 border-amber-400/60 ring-4 ring-amber-400/20 flex items-start gap-3.5 backdrop-blur-md">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-white/30 animate-pulse">
          {renderIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 flex items-center gap-1">
              <Star size={11} className="fill-amber-300" />
              TEBRİKLER! +1 ROZET KAZANDINIZ!
            </span>
            <button
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <h4 className="text-sm font-extrabold text-white mt-0.5 truncate">
            {currentBadge.title}
          </h4>
          <p className="text-xs text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
            {currentBadge.description}
          </p>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-amber-200">
            <span>Toplam Rozetiniz: {total}</span>
            <span className="text-white/80 font-normal">Profilinize Eklendi ✨</span>
          </div>
        </div>
      </div>
    </div>
  );
};
