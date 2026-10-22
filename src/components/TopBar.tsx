import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  MessageCircle, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Menu, 
  X, 
  Sparkles, 
  Shield, 
  GraduationCap, 
  LogIn, 
  LogOut,
  BookMarked,
  MessageSquare,
  Home,
  FileSpreadsheet,
  CalendarDays,
  Gamepad2,
  Bot,
  Award,
  Trophy
} from 'lucide-react';
import { fetchStudentBadges, fetchBadgesFromDB } from '../services/supabaseService';


interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickNote: () => void;
  onOpenAuthModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenQuickNote,
  onOpenAuthModal,
}) => {
  const { currentUser, isTeacher, isStudent, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [badgeCount, setBadgeCount] = useState<number>(0);

  React.useEffect(() => {
    const updateBadges = async () => {
      if (currentUser && currentUser.role === 'student') {
        const list = await fetchStudentBadges(currentUser.username);
        setBadgeCount(list.length);
      } else if (currentUser && currentUser.role === 'teacher') {
        const all = await fetchBadgesFromDB();
        setBadgeCount(all.length);
      }
    };
    updateBadges();

    const handleEarned = () => updateBadges();
    window.addEventListener('badge-earned', handleEarned);
    return () => window.removeEventListener('badge-earned', handleEarned);
  }, [currentUser]);

  // Distinct menus based on role
  const navItems = isTeacher
    ? [
        { id: 'anasayfa', label: 'ANASAYFA', icon: Home },
        { id: 'rozetler', label: 'ROZET ŞAMPİYONLARI', icon: Trophy },
        { id: 'odevler', label: 'ÖDEVLER', icon: BookMarked },
        { id: 'mesajlar', label: 'MESAJLAR', icon: MessageSquare },
        { id: 'notlar', label: 'NOT DEFTERİM', icon: Sparkles },
        { id: 'ogrenci_not_devamsizlik', label: 'ÖĞRENCİ NOT & DEVAMSIZLIK', icon: FileSpreadsheet },
        { id: 'planlar_yoklama', label: 'YILLIK PLANLAR & YOKLAMA', icon: CalendarDays },
        { id: 'siniflar', label: 'SINIFLARIMIZ (9-12)', icon: GraduationCap },
        { id: 'yapayzeka', label: 'YAPAY ZEKA', icon: Bot },
        { id: 'oyunlar', label: 'OYUNLAR', icon: Gamepad2 },
      ]
    : [
        { id: 'anasayfa', label: 'ÖĞRENCİ ANASAYFA', icon: Home },
        { id: 'rozetler', label: 'ROZETLERİM', icon: Award },
        { id: 'odevler', label: 'ÖDEVLERİM', icon: BookMarked },
        { id: 'mesajlar', label: 'ÖĞRETMENE SORU SOR', icon: MessageSquare },
        { id: 'siniflar', label: 'DERS İÇERİKLERİ (9-12)', icon: GraduationCap },
        { id: 'yapayzeka', label: 'YAPAY ZEKA ARAÇLARI', icon: Bot },
        { id: 'oyunlar', label: 'EĞİTİM OYUNLARI', icon: Gamepad2 },
      ];


  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full">
      {/* Topmost Dark Bar (TEDx Header + User Session Badge) */}
      <div className="bg-[#0b132b] text-white text-[11px] sm:text-xs py-2 px-3 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Brand motto */}
          <div className="flex items-center gap-2 text-slate-300">
            <span className="bg-[#e62b1e] text-white font-black px-1.5 py-0.5 text-[10px] rounded-xs tracking-wider">
              TEDx
            </span>
            <span className="italic text-[11px] truncate max-w-[200px] sm:max-w-none">
              &quot;Hep birlikte teknolojiyi doğru kullanıyor, doğru şekilde öğreniyoruz.&quot;
            </span>
          </div>

          {/* Right: User status and quick logout */}
          <div className="flex items-center gap-2 sm:gap-3 text-slate-300">
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/90 px-2 sm:px-3 py-1 rounded-full border border-slate-700">
                {isTeacher ? (
                  <Shield size={12} className="text-amber-400 shrink-0" />
                ) : (
                  <GraduationCap size={12} className="text-emerald-400 shrink-0" />
                )}
                <span className="font-bold text-white text-[11px] truncate max-w-[90px] sm:max-w-[140px]">
                  {currentUser.name || currentUser.username}
                </span>
                <span className="text-[10px] text-slate-400 hidden md:inline">
                  ({isTeacher ? 'Öğretmen' : 'Öğrenci'})
                </span>
                {isStudent && (
                  <button
                    onClick={() => setActiveTab('rozetler')}
                    className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-black border border-amber-500/40 cursor-pointer transition-colors"
                    title="Rozetlerimi Gör"
                  >
                    <Award size={11} className="text-amber-400" />
                    <span>{badgeCount} Rozet</span>
                  </button>
                )}
                {isTeacher && (
                  <button
                    onClick={() => setActiveTab('rozetler')}
                    className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-black border border-amber-500/40 cursor-pointer transition-colors"
                    title="Rozet Şampiyonları Liderlik Tablosu"
                  >
                    <Trophy size={11} className="text-amber-400" />
                    <span className="hidden sm:inline">Rozet Tablosu</span>
                  </button>
                )}
                <button
                  onClick={logout}
                  className="ml-0.5 px-1.5 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Çıkış Yap"
                >
                  <LogOut size={10} />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </div>

            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1 cursor-pointer text-xs"
              >
                <LogIn size={12} /> Giriş Yap
              </button>
            )}

            <a
              href="mailto:gencbeyinler@gmail.com"
              className="hover:text-white items-center gap-1.5 transition-colors hidden lg:flex text-slate-300"
            >
              <Mail size={13} className="text-amber-400" />
              <span>gencbeyinler@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Clean White) */}
      <div className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Logo & Teacher Brand */}
          <button
            onClick={() => setActiveTab('anasayfa')}
            className="flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-tr from-slate-900 via-indigo-950 to-blue-900 p-0.5 shadow-md flex items-center justify-center shrink-0 ring-2 ring-indigo-500/30">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-xs sm:text-sm tracking-wider">
                BT
              </div>
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight block group-hover:text-indigo-600 transition-colors">
                Burak Öğretmenin Not Defteri
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block">
                {isTeacher ? 'Öğretmen Yönetim & Ders Portalı' : 'Öğrenci Çalışma & Görev Portalı'}
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-2 2xl:gap-4 text-xs font-bold text-slate-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`py-1.5 px-2.5 rounded-lg transition-all hover:text-indigo-600 cursor-pointer whitespace-nowrap ${
                  activeTab === item.id
                    ? 'text-indigo-600 bg-indigo-50/80 font-extrabold'
                    : 'hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Social Icons & Quick Action (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-500 border-r border-slate-200 pr-3">
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 hover:text-emerald-600 hover:bg-slate-50 rounded-md transition-colors"
                title="WhatsApp Kanalı"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 hover:text-pink-600 hover:bg-slate-50 rounded-md transition-colors"
                title="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 hover:text-red-600 hover:bg-slate-50 rounded-md transition-colors"
                title="YouTube"
              >
                <Youtube size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>

            {/* Teacher Quick Note Shortcut */}
            {isTeacher && (
              <button
                onClick={onOpenQuickNote}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Sparkles size={13} className="text-amber-400" />
                <span>Hızlı Not</span>
              </button>
            )}

            {/* Student shortcut to Ask Question */}
            {isStudent && (
              <button
                onClick={() => setActiveTab('mesajlar')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <MessageSquare size={13} />
                <span>Soru Sor</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex xl:hidden items-center gap-2">
            {isStudent && (
              <button
                onClick={() => setActiveTab('mesajlar')}
                className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 rounded-lg flex items-center gap-1"
              >
                <MessageSquare size={13} />
                <span>Soru</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
              aria-label="Menüyü Aç"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer - Enhanced for mobile screens */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
            {/* User profile card on mobile */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  isTeacher ? 'bg-indigo-600' : 'bg-emerald-600'
                }`}>
                  {isTeacher ? <Shield size={16} /> : <GraduationCap size={16} />}
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    {currentUser?.name || currentUser?.username}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {isTeacher ? 'Öğretmen Yetkisi' : 'Öğrenci Portalı'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal();
                  }}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Değiştir
                </button>
                <button
                  onClick={logout}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200"
                >
                  Çıkış
                </button>
              </div>
            </div>

            {/* Navigation links with comfortable touch padding (min 44px) */}
            <div className="grid grid-cols-1 gap-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full text-left py-3 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 min-h-[44px] cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 bg-slate-50/50'
                    }`}
                  >
                    <IconComponent size={17} className={isActive ? 'text-white' : 'text-slate-500'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
