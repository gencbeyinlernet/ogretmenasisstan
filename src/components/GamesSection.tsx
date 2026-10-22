import React, { useState } from 'react';
import { MiniTetris } from './MiniTetris';
import { QuizDuel } from './QuizDuel';
import { externalGameCards } from '../data/initialData';
import { Gamepad2, Trophy, ExternalLink, Play, Sparkles, MonitorPlay, Layers } from 'lucide-react';

export const GamesSection: React.FC = () => {
  const [activeGameView, setActiveGameView] = useState<'hub' | 'tetris' | 'quiz'>('hub');
  const [modalIframeUrl, setModalIframeUrl] = useState<string | null>(null);

  const canvaTetrisUrl = 'https://canvawebsitesi.my.canva.site/mini-tetris';
  const canvaQuizUrl = 'https://canvawebsitesi.my.canva.site/bilgi-d-ellosu';

  return (
    <div className="space-y-6">
      {/* Featured Canva Games by Burak Teacher */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded uppercase tracking-wider">
                Burak Öğretmenin Oyunları
              </span>
              <span className="text-xs text-slate-400">· Canva Üzerinde Tasarlandı</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">Canva Mini Tetris & Bilgi Düellosu</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Öğrencilerinizle ders aralarında veya akıllı tahta başında doğrudan oynayabileceğiniz özel tasarım oyunlarınız.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveGameView('hub')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeGameView === 'hub' ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Tüm Oyunlar
            </button>
            <button
              onClick={() => setActiveGameView('tetris')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeGameView === 'tetris' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Mini Tetris
            </button>
            <button
              onClick={() => setActiveGameView('quiz')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeGameView === 'quiz' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Bilgi Düellosu
            </button>
          </div>
        </div>

        {/* Canva Direct Links Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Mini Tetris Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4.5 hover:bg-white/10 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-200 text-[11px] font-medium rounded">
                  Canva Web Oyunu
                </span>
                <span className="text-xs text-amber-400 font-mono">10x20 Klasik</span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">🎮 Mini Tetris</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Kişisel Canva web sitenizde yayınladığınız retro arcade mini tetris oyunu.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              <a
                href={canvaTetrisUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink size={13} />
                <span>Canva Sitesinde Aç</span>
              </a>
              <button
                onClick={() => setActiveGameView('tetris')}
                className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play size={13} />
                <span>Yerleşik Oyna</span>
              </button>
            </div>
          </div>

          {/* Bilgi Düellosu Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4.5 hover:bg-white/10 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-amber-500/30 text-amber-200 text-[11px] font-medium rounded">
                  Canva Web Oyunu
                </span>
                <span className="text-xs text-emerald-400 font-mono">Çoktan Seçmeli</span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">⚔️ Bilgi Düellosu</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Öğrencileriniz için hazırladığınız genel kültür, matematik ve bilişim bilgi düellosu.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              <a
                href={canvaQuizUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink size={13} />
                <span>Canva Sitesinde Aç</span>
              </a>
              <button
                onClick={() => setActiveGameView('quiz')}
                className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play size={13} />
                <span>Yerleşik Oyna</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Playable Engines */}
      {activeGameView === 'tetris' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Yerleşik Mini Tetris Konsolu</h4>
            <a
              href={canvaTetrisUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
            >
              <ExternalLink size={12} /> Canva Linkine Git ({canvaTetrisUrl})
            </a>
          </div>
          <MiniTetris />
        </div>
      )}

      {activeGameView === 'quiz' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Yerleşik Bilgi Düellosu Yarışması</h4>
            <a
              href={canvaQuizUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
            >
              <ExternalLink size={12} /> Canva Linkine Git ({canvaQuizUrl})
            </a>
          </div>
          <QuizDuel />
        </div>
      )}

      {/* External Educational Games Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Gamepad2 size={16} className="text-indigo-600" />
              Örnek Oyun & Etkinlik Platformları
            </h3>
            <p className="text-xs text-slate-500">Derste akıllı tahtayla kullanabileceğiniz popüler oyunlaştırılmış eğitim portalları</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {externalGameCards.map((game) => (
            <a
              key={game.id}
              href={game.url}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/60 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {game.badge}
                  </span>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-indigo-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                  {game.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{game.category}</span>
                <span className="text-indigo-600 font-medium group-hover:underline">Oyuna Git →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
