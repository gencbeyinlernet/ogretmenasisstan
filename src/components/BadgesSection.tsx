import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentBadge, StudentBadgeSummary } from '../types';
import { 
  fetchLeaderboardFromDB, 
  fetchStudentBadges,
  fetchBadgesFromDB
} from '../services/supabaseService';
import { 
  Award, 
  Trophy, 
  Sparkles, 
  BookMarked, 
  Gamepad2, 
  Medal, 
  Crown, 
  Star, 
  Search, 
  CheckCircle2, 
  Calendar, 
  ChevronRight,
  Shield,
  GraduationCap,
  Flame,
  X
} from 'lucide-react';

interface BadgesSectionProps {
  onNavigateTab?: (tab: string) => void;
}

export const BadgesSection: React.FC<BadgesSectionProps> = ({ onNavigateTab }) => {
  const { currentUser, isTeacher, isStudent } = useAuth();
  const [leaderboard, setLeaderboard] = useState<StudentBadgeSummary[]>([]);
  const [myBadges, setMyBadges] = useState<StudentBadge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentBadgeSummary | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const board = await fetchLeaderboardFromDB();
      setLeaderboard(board);

      if (currentUser && currentUser.role === 'student') {
        const studentList = await fetchStudentBadges(currentUser.username);
        setMyBadges(studentList);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen to badge-earned events to auto-refresh live
    const handleBadgeEarned = () => {
      loadData();
    };
    window.addEventListener('badge-earned', handleBadgeEarned);
    return () => window.removeEventListener('badge-earned', handleBadgeEarned);
  }, [currentUser]);

  const filteredLeaderboard = leaderboard.filter((item) =>
    item.studentUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.studentName && item.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Student level calculation
  const getStudentLevel = (count: number) => {
    if (count >= 10) return { title: 'Efsanevi Bilim İnsanı', color: 'from-amber-500 via-rose-500 to-indigo-600', max: 15, current: count };
    if (count >= 6) return { title: 'Usta Araştırmacı & Kaşif', color: 'from-indigo-600 to-purple-600', max: 10, current: count };
    if (count >= 3) return { title: 'Gümüş Yıldız Öğrenci', color: 'from-teal-600 to-emerald-600', max: 6, current: count };
    return { title: 'Girişimci Çırak', color: 'from-blue-600 to-cyan-600', max: 3, current: count };
  };

  const currentLevel = getStudentLevel(myBadges.length);
  const progressPercent = Math.min(100, Math.round((currentLevel.current / currentLevel.max) * 100));

  const renderBadgeIcon = (type: string, size = 18) => {
    switch (type) {
      case 'assignment':
        return <BookMarked size={size} className="text-amber-500" />;
      case 'ai_tool':
        return <Sparkles size={size} className="text-cyan-500" />;
      case 'game':
        return <Gamepad2 size={size} className="text-emerald-500" />;
      default:
        return <Award size={size} className="text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-2">
            <Trophy size={18} />
            <span>{isTeacher ? 'Öğretmen Başarı & Rozet Merkezi' : 'Öğrenci Rozetleri & Başarı Koleksiyonu'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isTeacher ? 'En Çok Rozet Alan Öğrenciler' : 'Kazanılan Rozetler & Seviyem'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {isTeacher
              ? 'Öğrenciler ödev tamamladıkça ve paylaştığınız yapay zeka araçlarını keşfettikçe rozet kazanırlar. En aktif ve başarılı öğrenciler burada sıralanır.'
              : 'Öğretmeninizin ödevlerini teslim ederek ve paylaştığı yapay zeka araçlarına tıklayarak rozetler toplayın, rozet şampiyonluğunda zirveye tırmanın!'}
          </p>
        </div>

        {/* Action Button or Level Pill */}
        <div className="shrink-0 flex items-center gap-3">
          {isStudent && (
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                Toplam Rozetim
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1">
                <Award size={24} className="text-amber-400" />
                {myBadges.length}
              </span>
            </div>
          )}

          {isTeacher && (
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                Toplam Dağıtılan Rozet
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-1">
                <Crown size={24} className="text-amber-400" />
                {leaderboard.reduce((acc, curr) => acc + curr.totalBadges, 0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* STUDENT SPECIFIC VIEW: My Badges Showcase */}
      {isStudent && (
        <div className="space-y-6">
          {/* Progress / Level Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${currentLevel.color} text-white flex items-center justify-center shadow-md`}>
                  <Flame size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Mevcut Başarı Rütbeniz
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {currentLevel.title}
                  </h3>
                </div>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-xs font-semibold text-slate-500">
                  Sonraki Seviyeye: <strong className="text-indigo-600">{currentLevel.max - currentLevel.current} Rozet Kaldı</strong>
                </span>
                <span className="text-xs text-slate-400 block font-mono">
                  {currentLevel.current} / {currentLevel.max} Rozet (%{progressPercent})
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${currentLevel.color} transition-all duration-500`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* How to earn more badges hints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 flex items-start gap-2.5">
                <BookMarked size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-amber-950 block">Ödevleri Tamamla (+1)</strong>
                  <span className="text-amber-800/80 text-[11px]">Öğretmenin gönderdiği ödevleri yanıtla, ödev rozetini kap.</span>
                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('odevler')}
                      className="text-amber-700 font-bold hover:underline block mt-1 cursor-pointer"
                    >
                      Ödevlere Git →
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 bg-cyan-50/70 rounded-xl border border-cyan-200/60 flex items-start gap-2.5">
                <Sparkles size={18} className="text-cyan-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-cyan-950 block">Yapay Zeka Keşfet (+1)</strong>
                  <span className="text-cyan-800/80 text-[11px]">Öğretmenin paylaştığı ChatGPT, Canva, Napkin AI araçlarına tıkla.</span>
                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('yapayzeka')}
                      className="text-cyan-700 font-bold hover:underline block mt-1 cursor-pointer"
                    >
                      Araçları Keşfet →
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/60 flex items-start gap-2.5 sm:col-span-2 lg:col-span-1">
                <Gamepad2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-emerald-950 block">Eğitici Oyunlar (+1)</strong>
                  <span className="text-emerald-800/80 text-[11px]">Tetris ve Bilgi Düellosu oyunlarını bitirerek başarı rozeti al.</span>
                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('oyunlar')}
                      className="text-emerald-700 font-bold hover:underline block mt-1 cursor-pointer"
                    >
                      Oyunları Aç →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Student's Earned Badges Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award size={18} className="text-indigo-600" />
                <span>Kazanılmış Rozetlerim ({myBadges.length})</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Öğrenci: <strong className="text-slate-800">{currentUser?.username}</strong>
              </span>
            </div>

            {myBadges.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Award size={36} className="text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">Henüz Rozetiniz Yok</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Hemen bir ödevi cevaplayarak veya öğretmeninizin paylaştığı yapay zeka araçlarına tıklayarak ilk rozetinizi kazanın!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 rounded-xl border-2 border-indigo-100 bg-gradient-to-br from-white via-indigo-50/20 to-slate-50/50 hover:border-indigo-300 hover:shadow-md transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {renderBadgeIcon(badge.badgeType, 24)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                          {badge.badgeType === 'assignment' ? 'Ödev Rozeti' : badge.badgeType === 'ai_tool' ? 'Yapay Zeka' : 'Oyun'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(badge.earnedAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                        {badge.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">
                        {badge.description}
                      </p>
                      {badge.sourceTitle && (
                        <div className="mt-2 text-[10px] text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md truncate">
                          Kaynak: {badge.sourceTitle}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEADERBOARD (EN ÇOK ROZET ALAN ÖĞRENCİLER) - Both can view, primary focus for Teacher */}
      <div className="space-y-6">
        {/* Top 3 Podium Cards */}
        {leaderboard.length >= 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1st Place */}
            {leaderboard[0] && (
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white rounded-2xl border-2 border-amber-400 p-6 shadow-md text-center relative flex flex-col justify-between">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Crown size={12} className="fill-slate-950" />
                  1. SIRA (ALTIN ŞAMPİYON)
                </div>

                <div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-900 font-black text-xl flex items-center justify-center mx-auto shadow-md ring-4 ring-amber-300/40 mb-3 mt-1">
                    🥇
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {leaderboard[0].studentName}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">@{leaderboard[0].studentUsername}</span>

                  <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-900 px-3 py-1 rounded-full font-black text-sm">
                    <Award size={16} className="text-amber-600" />
                    <span>{leaderboard[0].totalBadges} Rozet</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/60 grid grid-cols-3 gap-1 text-[11px] text-slate-600">
                  <div>
                    <span className="block font-bold text-slate-900">{leaderboard[0].assignmentBadges}</span>
                    <span className="text-[10px] text-slate-400">Ödev</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">{leaderboard[0].aiBadges}</span>
                    <span className="text-[10px] text-slate-400">Yapay Zeka</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">{leaderboard[0].gameBadges}</span>
                    <span className="text-[10px] text-slate-400">Oyun</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2nd Place */}
            {leaderboard[1] && (
              <div className="order-2 md:order-1 bg-gradient-to-b from-slate-200/40 via-slate-100/20 to-white rounded-2xl border-2 border-slate-300 p-6 shadow-sm text-center relative flex flex-col justify-between">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-600 text-white font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Medal size={12} />
                  2. SIRA (GÜMÜŞ)
                </div>

                <div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-800 font-black text-lg flex items-center justify-center mx-auto shadow-xs ring-4 ring-slate-200 mb-3 mt-1">
                    🥈
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    {leaderboard[1].studentName}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">@{leaderboard[1].studentUsername}</span>

                  <div className="mt-3 inline-flex items-center gap-1.5 bg-slate-200 text-slate-800 px-3 py-1 rounded-full font-black text-sm">
                    <Award size={15} />
                    <span>{leaderboard[1].totalBadges} Rozet</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-3 gap-1 text-[11px] text-slate-600">
                  <div>
                    <span className="block font-bold text-slate-900">{leaderboard[1].assignmentBadges}</span>
                    <span className="text-[10px] text-slate-400">Ödev</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">{leaderboard[1].aiBadges}</span>
                    <span className="text-[10px] text-slate-400">Yapay Zeka</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">{leaderboard[1].gameBadges}</span>
                    <span className="text-[10px] text-slate-400">Oyun</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {leaderboard[2] && (
              <div className="order-3 bg-gradient-to-b from-amber-700/10 via-amber-700/5 to-white rounded-2xl border-2 border-amber-600/40 p-6 shadow-sm text-center relative flex flex-col justify-between">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Medal size={12} />
                  3. SIRA (BRONZ)
                </div>

                <div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 text-white font-black text-lg flex items-center justify-center mx-auto shadow-xs ring-4 ring-amber-600/20 mb-3 mt-1">
                    🥉
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    {leaderboard[2].studentName}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">@{leaderboard[2].studentUsername}</span>

                  <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-black text-sm">
                    <Award size={15} />
                    <span>{leaderboard[2].totalBadges} Rozet</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-100 grid grid-cols-3 gap-1 text-[11px] text-slate-600">
                  <div>
                    <span className="block font-bold text-slate-900">{leaderboard[2].assignmentBadges}</span>
                    <span className="text-[10px] text-slate-400">Ödev</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">{leaderboard[2].aiBadges}</span>
                    <span className="text-[10px] text-slate-400">Yapay Zeka</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">{leaderboard[2].gameBadges}</span>
                    <span className="text-[10px] text-slate-400">Oyun</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Ranking Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                <span>Tüm Öğrenci Rozet Sıralaması</span>
              </h3>
              <p className="text-xs text-slate-500">
                Sistemdeki tüm kayıtlı öğrencilerin kazandığı rozet dökümü ve güncel sıralamaları
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Öğrenci ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                  <th className="py-3 px-4 w-14 text-center">Sıra</th>
                  <th className="py-3 px-4">Öğrenci</th>
                  <th className="py-3 px-4 text-center">Toplam Rozet</th>
                  <th className="py-3 px-4 text-center hidden sm:table-cell">Ödev Rozeti</th>
                  <th className="py-3 px-4 text-center hidden sm:table-cell">Yapay Zeka</th>
                  <th className="py-3 px-4 text-center hidden md:table-cell">Oyun</th>
                  <th className="py-3 px-4 text-right">Detay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLeaderboard.map((item) => {
                  const isCurrent = currentUser?.username.toLowerCase() === item.studentUsername.toLowerCase();
                  return (
                    <tr
                      key={item.studentUsername}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCurrent ? 'bg-indigo-50/40 font-semibold text-indigo-950' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        {item.rank === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-black inline-flex items-center justify-center text-xs shadow-xs">
                            1
                          </span>
                        ) : item.rank === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold inline-flex items-center justify-center text-xs">
                            2
                          </span>
                        ) : item.rank === 3 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold inline-flex items-center justify-center text-xs">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">#{item.rank}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {item.studentUsername.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {item.studentName} {isCurrent && '(Siz)'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              @{item.studentUsername}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full text-xs border border-indigo-200">
                          <Award size={13} className="text-amber-500" />
                          {item.totalBadges} Rozet
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center hidden sm:table-cell">
                        <span className="text-slate-600 font-semibold">{item.assignmentBadges}</span>
                      </td>
                      <td className="py-3 px-4 text-center hidden sm:table-cell">
                        <span className="text-slate-600 font-semibold">{item.aiBadges}</span>
                      </td>
                      <td className="py-3 px-4 text-center hidden md:table-cell">
                        <span className="text-slate-600 font-semibold">{item.gameBadges}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudentForModal(item)}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        >
                          İncele →
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredLeaderboard.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Aramaya uygun öğrenci bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Badge Detail Modal (When teacher or user clicks 'İncele') */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  {selectedStudentForModal.studentUsername.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {selectedStudentForModal.studentName} (@{selectedStudentForModal.studentUsername})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Toplam {selectedStudentForModal.totalBadges} Rozet Kazanıldı (Sıralama: #{selectedStudentForModal.rank})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Badges List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {selectedStudentForModal.badges.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                    {renderBadgeIcon(b.badgeType, 20)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">
                        {b.badgeType === 'assignment' ? 'Ödev Rozeti' : b.badgeType === 'ai_tool' ? 'Yapay Zeka Rozeti' : 'Oyun'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(b.earnedAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 mt-0.5 truncate">{b.title}</h5>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{b.description}</p>
                    {b.sourceTitle && (
                      <span className="inline-block mt-1.5 text-[10px] bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded">
                        Kaynak: {b.sourceTitle}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl cursor-pointer"
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
