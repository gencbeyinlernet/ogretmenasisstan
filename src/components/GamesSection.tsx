import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { EducationalGame, GameCompletion } from '../types';
import { 
  fetchGamesFromDB, 
  saveGameToDB, 
  deleteGameFromDB, 
  submitGameCompletionToDB,
  awardBadgeToStudent
} from '../services/supabaseService';

import { MiniTetris } from './MiniTetris';
import { QuizDuel } from './QuizDuel';
import { 
  Gamepad2, 
  Plus, 
  ExternalLink, 
  Play, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Users, 
  Clock, 
  X, 
  Award, 
  Layers, 
  Send,
  HelpCircle
} from 'lucide-react';

export const GamesSection: React.FC = () => {
  const { currentUser, isTeacher, isStudent } = useAuth();
  const [games, setGames] = useState<EducationalGame[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Game Playing Modal
  const [activePlayGame, setActivePlayGame] = useState<EducationalGame | null>(null);
  const [activeEmbeddedLocal, setActiveEmbeddedLocal] = useState<'tetris' | 'quiz' | null>(null);

  // Teacher: New Game Form State
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Zeka & Mantık');
  const [newGrade, setNewGrade] = useState('Tüm Sınıflar');

  // Student: "I Finished the Game" Completion Modal State
  const [completingGame, setCompletingGame] = useState<EducationalGame | null>(null);
  const [completionScore, setCompletionScore] = useState('');
  const [completionNote, setCompletionNote] = useState('');
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false);
  const [completionSuccess, setCompletionSuccess] = useState(false);

  // Teacher: View completions list modal
  const [viewingCompletionsGame, setViewingCompletionsGame] = useState<EducationalGame | null>(null);

  const loadGames = async () => {
    setLoading(true);
    try {
      const data = await fetchGamesFromDB();
      setGames(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newGame: EducationalGame = {
      id: `game-${Date.now()}`,
      title: newTitle.trim(),
      url: formattedUrl,
      description: newDescription.trim() || 'Eğitici ders oyunu',
      category: newCategory,
      grade: newGrade,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.username || 'burakturgut',
      completions: [],
    };

    await saveGameToDB(newGame);
    setNewTitle('');
    setNewUrl('');
    setNewDescription('');
    setIsAddingGame(false);
    await loadGames();
  };

  const handleDeleteGame = async (id: string) => {
    if (window.confirm('Bu oyunu kaldırmak istediğinize emin misiniz?')) {
      await deleteGameFromDB(id);
      await loadGames();
    }
  };

  const handleStudentCompleteGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingGame || !currentUser) return;

    setIsSubmittingCompletion(true);
    try {
      await submitGameCompletionToDB(
        completingGame.id,
        currentUser.username,
        completionScore.trim() || undefined,
        completionNote.trim() || undefined
      );

      // Award game badge
      await awardBadgeToStudent(
        currentUser.username,
        'game',
        'Oyun Ustası Rozeti',
        `"${completingGame.title}" eğitici oyununu başarıyla tamamladınız!`,
        'Gamepad2',
        completingGame.title
      );

      setCompletionSuccess(true);
      setTimeout(() => {
        setCompletionSuccess(false);
        setCompletingGame(null);
        setCompletionScore('');
        setCompletionNote('');
      }, 1800);
      await loadGames();
    } finally {
      setIsSubmittingCompletion(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-7 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded uppercase tracking-wider">
                Eğitim & Zeka Oyunları
              </span>
              <span className="text-xs text-slate-400">· Canva, Wayground & Özel Bağlantılar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Eğitici Oyunlar ve Görevler
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              {isTeacher
                ? 'Buraya istediğiniz oyun bağlantılarını ekleyebilirsiniz. Eklediğiniz oyunlar anında öğrencilerin ekranında listelenir ve öğrencilerin oyunu bitirme bildirimlerini takip edebilirsiniz.'
                : 'Burak Öğretmeninizin eklediği eğitici oyunları oynayabilir, bitirdiğinizde öğretmene bildirim göndererek skorunuzu kaydedebilirsiniz!'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isTeacher && (
              <button
                onClick={() => setIsAddingGame(!isAddingGame)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={16} />
                <span>{isAddingGame ? 'Formu Kapat' : 'Yeni Oyun Ekle'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Local Game Launchers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-2">
          <button
            onClick={() => setActiveEmbeddedLocal('tetris')}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-indigo-300">
                  Yerleşik Mini Tetris
                </span>
                <span className="text-[10px] text-slate-400">Direkt tarayıcıda klasik arcade tetris</span>
              </div>
            </div>
            <Play size={14} className="text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => setActiveEmbeddedLocal('quiz')}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚔️</span>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-emerald-300">
                  Yerleşik Bilgi Düellosu
                </span>
                <span className="text-[10px] text-slate-400">Bilişim ve fen sorularıyla interaktif yarış</span>
              </div>
            </div>
            <Play size={14} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Embedded Local Game Modals */}
      {activeEmbeddedLocal === 'tetris' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Gamepad2 size={16} className="text-indigo-600" />
              <span>Yerleşik Mini Tetris Oyunu</span>
            </h3>
            <button
              onClick={() => setActiveEmbeddedLocal(null)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-bold cursor-pointer"
            >
              Kapat
            </button>
          </div>
          <MiniTetris />
        </div>
      )}

      {activeEmbeddedLocal === 'quiz' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Trophy size={16} className="text-amber-600" />
              <span>Yerleşik Bilgi Düellosu</span>
            </h3>
            <button
              onClick={() => setActiveEmbeddedLocal(null)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-bold cursor-pointer"
            >
              Kapat
            </button>
          </div>
          <QuizDuel />
        </div>
      )}

      {/* Teacher: New Game Form */}
      {isTeacher && isAddingGame && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-5 sm:p-6 shadow-md transition-all">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-600" />
            <span>Yeni Oyun Bağlantısı Ekle</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Eklediğiniz oyun linki (Canva, Wayground, Wordwall vb.) anında tüm öğrencilerin paneline düşecektir.
          </p>

          <form onSubmit={handleCreateGame} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Oyun Başlığı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="örn: Canva Matematik Bulmacası"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Oyun Bağlantı Linki (URL) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://canvawebsitesi.my.canva.site/... veya wayground.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori / Alan
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Zeka & Mantık">Zeka & Mantık</option>
                  <option value="Quiz & Düello">Quiz & Düello</option>
                  <option value="Kodlama & Algoritma">Kodlama & Algoritma</option>
                  <option value="Ders Pekiştirme">Ders Pekiştirme</option>
                  <option value="Genel">Genel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hedef Sınıf
                </label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Tüm Sınıflar">Tüm Sınıflar</option>
                  <option value="9. Sınıf">9. Sınıf</option>
                  <option value="10. Sınıf">10. Sınıf</option>
                  <option value="11. Sınıf">11. Sınıf</option>
                  <option value="12. Sınıf">12. Sınıf</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Oyun Açıklaması veya Öğrenci Yönergesi
              </label>
              <textarea
                rows={2}
                placeholder="Öğrencilerin bu oyunda ne yapması gerektiğini veya kuralları kısaca belirtiniz..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingGame(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md"
              >
                Oyunu Öğrencilere Yayınla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Games List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Gamepad2 size={18} className="text-indigo-600" />
            <span>Yayınlanan Oyunlar ({games.length})</span>
          </h3>
          {loading && <span className="text-xs text-slate-400">Yükleniyor...</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => {
            const completionCount = game.completions?.length || 0;
            const myCompletion = isStudent && currentUser
              ? game.completions?.find(
                  (c) => c.studentUsername.toLowerCase() === currentUser.username.toLowerCase()
                )
              : null;

            return (
              <div
                key={game.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold">
                      {game.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {game.grade}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 line-clamp-1">
                    {game.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {/* Completion status */}
                  {isStudent && (
                    <div className="text-xs">
                      {myCompletion ? (
                        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-[11px]">
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            <span>Tamamlandı!</span>
                          </span>
                          {myCompletion.score && (
                            <span className="font-extrabold text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                              Skor: {myCompletion.score}
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setCompletingGame(game)}
                          className="w-full py-1.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Trophy size={13} className="text-amber-600" />
                          <span>Oyunu Bitirdim! Öğretmene Bildir</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Teacher: View completions */}
                  {isTeacher && (
                    <div className="flex items-center justify-between text-xs">
                      <button
                        onClick={() => setViewingCompletionsGame(game)}
                        className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] underline flex items-center gap-1 cursor-pointer"
                      >
                        <Users size={13} />
                        <span>{completionCount} Öğrenci Bitirdi</span>
                      </button>

                      <button
                        onClick={() => handleDeleteGame(game.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Oyunu Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  {/* Play & Open Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActivePlayGame(game)}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play size={13} />
                      <span>Burada Oyna</span>
                    </button>

                    <a
                      href={game.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Yeni Sekmede Aç"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: Play Game in Interactive Iframe / View */}
      {activePlayGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden border border-slate-300">
            {/* Modal Top */}
            <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🎮</span>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base leading-tight">
                    {activePlayGame.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate max-w-xs sm:max-w-md">
                    {activePlayGame.url}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isStudent && (
                  <button
                    onClick={() => {
                      setCompletingGame(activePlayGame);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Trophy size={13} />
                    <span className="hidden sm:inline">Oyunu Bitirdim</span>
                    <span className="sm:hidden">Bitirdim</span>
                  </button>
                )}

                <a
                  href={activePlayGame.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1"
                  title="Yeni sekmede aç"
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">Sekmede Aç</span>
                </a>

                <button
                  onClick={() => setActivePlayGame(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Iframe */}
            <div className="flex-1 bg-slate-100 relative">
              <iframe
                src={activePlayGame.url}
                title={activePlayGame.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Student "I Finished the Game" Submit Report */}
      {completingGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Trophy size={16} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Oyunu Bitirdim!</h4>
                  <p className="text-[11px] text-slate-500">{completingGame.title}</p>
                </div>
              </div>
              <button
                onClick={() => setCompletingGame(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {completionSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
                <h5 className="font-bold text-sm text-slate-900">Tebrikler! Bildirim Gönderildi.</h5>
                <p className="text-xs text-slate-500">
                  Burak Öğretmeniniz oyunu tamamladığınızı ve skorunuzu görebilecektir.
                </p>
              </div>
            ) : (
              <form onSubmit={handleStudentCompleteGame} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aldığınız Puan veya Skor (İsteğe Bağlı)
                  </label>
                  <input
                    type="text"
                    placeholder="örn: 2450 puan, 5. seviye veya 10/10 doğru"
                    value={completionScore}
                    onChange={(e) => setCompletionScore(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Öğretmeninize Not / Yorum (İsteğe Bağlı)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="örn: Çok eğlenceli bir oyundu, soruları kolayca çözdüm!"
                    value={completionNote}
                    onChange={(e) => setCompletionNote(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCompletingGame(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCompletion}
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <Send size={14} />
                    <span>{isSubmittingCompletion ? 'İletiliyor...' : 'Öğretmene Bildir'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: Teacher View Completed Students */}
      {viewingCompletionsGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Oyunu Bitiren Öğrenciler</h4>
                  <p className="text-[11px] text-slate-500">{viewingCompletionsGame.title}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingCompletionsGame(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5">
              {(!viewingCompletionsGame.completions || viewingCompletionsGame.completions.length === 0) ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Henüz bu oyunu bitirdiğini bildiren öğrenci bulunmuyor.
                </div>
              ) : (
                viewingCompletionsGame.completions.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {comp.studentUsername}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comp.completedAt).toLocaleString('tr-TR')}
                      </span>
                    </div>

                    {comp.score && (
                      <div className="flex items-center gap-1 text-emerald-800 font-bold text-[11px]">
                        <Award size={13} className="text-emerald-600" />
                        <span>Skor: {comp.score}</span>
                      </div>
                    )}

                    {comp.notes && (
                      <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100 mt-1">
                        &quot;{comp.notes}&quot;
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingCompletionsGame(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
