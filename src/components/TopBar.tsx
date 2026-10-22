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
  Database,
  BookMarked,
  MessageSquare
} from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickNote: () => void;
  onOpenAuthModal: () => void;
  onOpenSqlModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenQuickNote,
  onOpenAuthModal,
  onOpenSqlModal,
}) => {
  const { currentUser, isTeacher, isStudent, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Distinct menus based on role
  const navItems = isTeacher
    ? [
        { id: 'anasayfa', label: 'ANASAYFA' },
        { id: 'odevler', label: 'ÖDEVLER' },
        { id: 'mesajlar', label: 'MESAJLAR' },
        { id: 'notlar', label: 'NOT DEFTERİM' },
        { id: 'ogrenci_not_devamsizlik', label: 'ÖĞRENCİ NOT & DEVAMSIZLIK' },
        { id: 'planlar_yoklama', label: 'YILLIK PLANLAR & YOKLAMA' },
        { id: 'siniflar', label: 'SINIFLARIMIZ (9-12)' },
        { id: 'yapayzeka', label: 'YAPAY ZEKA' },
        { id: 'oyunlar', label: 'OYUNLAR' },
      ]
    : [
        { id: 'anasayfa', label: 'ÖĞRENCİ ANASAYFA' },
        { id: 'odevler', label: 'ÖDEVLERİM' },
        { id: 'mesajlar', label: 'ÖĞRETMENE SORU SOR' },
        { id: 'siniflar', label: 'DERS İÇERİKLERİ (9-12)' },
        { id: 'yapayzeka', label: 'YAPAY ZEKA ARAÇLARI' },
        { id: 'oyunlar', label: 'EĞİTİM OYUNLARI' },
      ];

  return (
    <header className="w-full">
      {/* Topmost Dark Bar (TEDx Header + Green SQL Button on left) */}
      <div className="bg-[#0b132b] text-white text-[11px] sm:text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Top-Left: Green SQL Button requested by user */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSqlModal}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] tracking-wide shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5 animate-pulse hover:animate-none"
              title="Supabase veri tabanı kurulum SQL kodunu aç"
            >
              <Database size={13} className="shrink-0" />
              <span>⚡ Supabase SQL Kodu</span>
            </button>

            <div className="hidden md:flex items-center gap-2 text-slate-300">
              <span className="bg-[#e62b1e] text-white font-black px-1.5 py-0.5 text-[10px] rounded-xs tracking-wider">
                TEDx
              </span>
              <span className="italic text-[11px]">
                &quot;Hep birlikte teknolojiyi doğru kullanıyor, doğru şekilde öğreniyoruz.&quot;
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            {/* User Session Status */}
            <div className="flex items-center gap-2 text-[11px]">
              {currentUser ? (
                <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700">
                  {isTeacher ? (
                    <Shield size={13} className="text-amber-400" />
                  ) : (
                    <GraduationCap size={13} className="text-emerald-400" />
                  )}
                  <span className="font-bold text-white">
                    {currentUser.name || currentUser.username}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({isTeacher ? 'Öğretmen Yetkisi' : 'Öğrenci Portalı'})
                  </span>
                  <button
                    onClick={logout}
                    className="ml-1 px-2 py-0.5 rounded-md bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Hesaptan Çıkış Yap"
                  >
                    <LogOut size={11} />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1 cursor-pointer text-xs"
                >
                  <LogIn size={13} /> Giriş Yap / Kayıt Ol
                </button>
              )}
            </div>

            <a
              href="mailto:gencbeyinler@gmail.com"
              className="hover:text-white flex items-center gap-1.5 transition-colors hidden lg:flex text-slate-300"
            >
              <Mail size={13} className="text-amber-400" />
              <span>gencbeyinler@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Clean White) */}
      <div className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Teacher Brand */}
          <button
            onClick={() => setActiveTab('anasayfa')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-slate-900 via-indigo-950 to-blue-900 p-0.5 shadow-md flex items-center justify-center shrink-0 ring-2 ring-indigo-500/30">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-sm tracking-wider">
                BT
              </div>
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight block group-hover:text-indigo-600 transition-colors">
                Burak Öğretmenin Not Defteri
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                {isTeacher ? 'Öğretmen Yönetim & Ders Portalı' : 'Öğrenci Çalışma & Görev Portalı'}
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-4 text-xs font-bold text-slate-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`py-1.5 px-2 rounded-lg transition-all hover:text-indigo-600 cursor-pointer whitespace-nowrap ${
                  activeTab === item.id
                    ? 'text-indigo-600 bg-indigo-50/80 font-extrabold'
                    : 'hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Social Icons & Quick Action */}
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

            {/* Teacher Only Quick Note Button */}
            {isTeacher && (
              <button
                onClick={onOpenQuickNote}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Sparkles size={13} className="text-amber-400" />
                <span>Hızlı Not Al</span>
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

          {/* Mobile hamburger */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1">
            <div className="p-2 bg-slate-50 rounded-lg mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                {currentUser?.name || 'Giriş Yapılmadı'}
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="text-indigo-600 font-bold hover:underline"
              >
                Hesap Değiştir
              </button>
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
