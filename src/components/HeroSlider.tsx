import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Megaphone, ChevronUp, ChevronDown, ExternalLink, Calendar, Users, Award, Sparkles } from 'lucide-react';

interface HeroSliderProps {
  onSelectAnnouncement?: (announcement: string) => void;
  onOpenAiTools?: () => void;
  onOpenGames?: () => void;
}

const slides = [
  {
    id: 1,
    tag: 'SADECE ÖĞRETMENLER',
    title: 'Proje Tabanlı Yapay Zeka Eğitimi',
    subtitle: 'Yapay zeka destekli ekip çalışmasıyla, teoriyi pratiğe dönüştürerek gerçek projeler üretmek isteyen öğretmenlerimiz için...',
    date: '19, 20, 21, 22 Ekim 2026',
    overlayTitle: '19,20,21,22 Ekim Uygulamalı Proje Tabanlı Yapay Zekâ ile Ders Tasarımı Eğitimi - Online',
    speaker1: {
      name: 'Burak Turgut',
      role: 'Bilişim Teknolojileri Öğretmeni & Yapay Zeka Uzmanı',
    },
    speaker2: {
      name: 'Türker Örün',
      role: 'Yapay Zeka Uzmanı',
    },
    features: ['30 Yapay Zeka Aracı', '8 Saat Canlı Eğitim + Kayıt', 'AI Ajanları ve Otomasyon', 'Ders İçeriği Üretimi'],
    ctaText: 'Eğitim Detayları & Kayıt',
    image: '/src/assets/images/banner_ai_education_1792693980269.jpg',
  },
  {
    id: 2,
    tag: 'EĞİTİM & ETKİNLİK OYUNLARI',
    title: 'Sınıf İçi İnteraktif Oyun Dünyası',
    subtitle: 'Canva üzerinde hazırlanan Mini Tetris ve Bilgi Düellosu ile derslerinizi daha dinamik ve eğlenceli hale getirin.',
    date: 'Aktif Kullanımda',
    overlayTitle: 'Burak Öğretmenin Canva Mini Tetris ve Bilgi Düellosu Oyun Platformu',
    speaker1: {
      name: 'Burak Turgut',
      role: 'Oyunlaştırılmış Eğitim Tasarımcısı',
    },
    speaker2: {
      name: 'Genç Beyinler',
      role: 'Eğitim Teknolojileri Topluluğu',
    },
    features: ['Mini Tetris Canlı', 'Bilgi Düellosu', 'Hafıza Kartları', 'Wordwall & Kahoot'],
    ctaText: 'Oyunları Başlat',
    image: '/src/assets/images/hero_teacher_workspace_1792693703716.jpg',
  },
];

const announcements = [
  {
    id: 'a1',
    category: 'YENİ',
    categoryColor: 'text-indigo-600',
    title: '19,20,21,22 Ekim Uygulamalı Proje Tabanlı Yapay Zekâ ile Ders Tasarımı Eğitimi - Online',
    date: '22 Ekim 2026',
  },
  {
    id: 'a2',
    category: 'TOPLULUK',
    categoryColor: 'text-emerald-600',
    title: 'Türkiye Proje Tabanlı Eğitim Topluluğuna Katılmak İster Misin?',
    date: '20 Ekim 2026',
  },
  {
    id: 'a3',
    category: 'KAYNAK',
    categoryColor: 'text-blue-600',
    title: 'TEKNOFEST - Akıllı Proje Yazma Asistanı ve Şablon Kılavuzları Yayında',
    date: '18 Ekim 2026',
  },
  {
    id: 'a4',
    category: 'ETKİNLİK',
    categoryColor: 'text-amber-600',
    title: '9, 10, 11 ve 12. Sınıflar 1. Dönem 1. Ortak Yazılı Soru Dağılım Çizelgeleri',
    date: '15 Ekim 2026',
  },
  {
    id: 'a5',
    category: 'DUYURU',
    categoryColor: 'text-purple-600',
    title: 'Yapay Zeka Destekli Ders İçeriği Üretimi için ChatGPT & Napkin AI Rehberi',
    date: '12 Ekim 2026',
  },
];

export const HeroSlider: React.FC<HeroSliderProps> = ({ onOpenAiTools, onOpenGames }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [announcementScrollIndex, setAnnouncementScrollIndex] = useState(0);

  const slide = slides[currentSlideIndex];

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleScrollAnnouncementsUp = () => {
    setAnnouncementScrollIndex((prev) => Math.max(0, prev - 1));
  };

  const handleScrollAnnouncementsDown = () => {
    setAnnouncementScrollIndex((prev) => Math.min(announcements.length - 3, prev + 1));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2/3: Featured Banner Slider (Matching Reference Image) */}
      <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-900 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between group">
        {/* Background Image with Dark Scrim Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover opacity-35 transform transition-transform duration-700 group-hover:scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/85 to-indigo-950/70" />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer backdrop-blur-xs hover:scale-105"
          title="Önceki Slayt"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer backdrop-blur-xs hover:scale-105"
          title="Sonraki Slayt"
        >
          <ChevronRight size={18} />
        </button>

        {/* Top Banner Content */}
        <div className="relative z-10 p-6 sm:p-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/90 text-white text-[11px] font-bold rounded-md tracking-wider uppercase mb-3 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>{slide.tag}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-xl text-balance drop-shadow-sm">
              {slide.title}
            </h2>

            <p className="mt-2.5 text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed text-balance line-clamp-2">
              {slide.subtitle}
            </p>
          </div>

          {/* Speakers & Key Highlights Box */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            {/* Speakers preview */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-indigo-400 shrink-0 shadow-sm">
                <img
                  src="/src/assets/images/avatar_burak_teacher_1792693703563.jpg"
                  alt={slide.speaker1.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[11px] text-indigo-300 font-semibold block uppercase tracking-wide">
                  Eğitim Lideri
                </span>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  {slide.speaker1.name}
                </span>
                <span className="text-[10px] text-slate-400 block max-w-[200px] truncate">
                  {slide.speaker1.role}
                </span>
              </div>
            </div>

            {/* Feature Badges list */}
            <div className="hidden sm:flex flex-wrap items-center gap-1.5 max-w-xs">
              {slide.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-white/10 text-white/90 text-[10px] rounded-md font-medium backdrop-blur-xs border border-white/10"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Banner Title Overlay Strip (Matches Reference Image) */}
        <div className="relative z-10 bg-slate-950/85 backdrop-blur-md px-6 py-3 border-t border-white/10 flex items-center justify-between gap-4">
          <p className="text-xs sm:text-sm font-bold text-white truncate max-w-lg">
            {slide.overlayTitle}
          </p>

          <div className="flex items-center gap-2 shrink-0">
            {currentSlideIndex === 0 ? (
              <button
                onClick={onOpenAiTools}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                Yapay Zeka Araçları
              </button>
            ) : (
              <button
                onClick={onOpenGames}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                Oyunları Oyna
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right 1/3: 📢 Duyurular Card (Matching Reference Image) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          {/* Card Header with controls */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Megaphone size={18} className="text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Duyurular</h3>
            </div>

            {/* Up / Down navigation arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleScrollAnnouncementsUp}
                disabled={announcementScrollIndex === 0}
                className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                title="Yukarı Kaydır"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={handleScrollAnnouncementsDown}
                disabled={announcementScrollIndex >= announcements.length - 3}
                className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                title="Aşağı Kaydır"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Announcements List */}
          <div className="space-y-3.5">
            {announcements
              .slice(announcementScrollIndex, announcementScrollIndex + 3)
              .map((item) => (
                <div
                  key={item.id}
                  className="pb-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 p-2 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-extrabold tracking-wider ${item.categoryColor}`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">{item.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">
                    {item.title}
                  </h4>
                </div>
              ))}
          </div>
        </div>

        {/* Bottom Quick Notice */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Toplam {announcements.length} güncel duyuru</span>
          <span className="text-indigo-600 font-medium">MEB & Bilişim Takvimi</span>
        </div>
      </div>
    </div>
  );
};
