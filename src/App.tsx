/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { AuthModal } from './components/AuthModal';
import { TopBar } from './components/TopBar';
import { HeroSlider } from './components/HeroSlider';
import { AiToolsSection } from './components/AiToolsSection';
import { QuickActionGrid } from './components/QuickActionGrid';
import { GamesSection } from './components/GamesSection';
import { NotesSection } from './components/NotesSection';
import { AttendanceSection } from './components/AttendanceSection';
import { ClassesSection } from './components/ClassesSection';
import { RecentContentSection } from './components/RecentContentSection';
import { StudentGradeAttendanceSheet } from './components/StudentGradeAttendanceSheet';
import { AnnualPlansModal } from './components/AnnualPlansModal';
import { LinkEditorModal } from './components/LinkEditorModal';
import { AssignmentsSection } from './components/AssignmentsSection';
import { MessagesSection } from './components/MessagesSection';
import { Footer } from './components/Footer';
import { QuickLink } from './types';
import { initialQuickLinks } from './data/initialData';
import { 
  Gamepad2, 
  NotebookPen, 
  ClipboardList, 
  GraduationCap, 
  CalendarDays,
  FileSpreadsheet,
  Shield,
  Eye,
  BookMarked,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';

function AppContent() {
  const { currentUser, isTeacher, isStudent, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('anasayfa');
  const [isAnnualPlansOpen, setIsAnnualPlansOpen] = useState<boolean>(false);
  const [isLinkEditorOpen, setIsLinkEditorOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activeEditingLink, setActiveEditingLink] = useState<QuickLink | null>(null);

  // Quick link storage
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(() => {
    const saved = localStorage.getItem('burak_quick_links');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialQuickLinks;
  });

  const annualPlanItem = quickLinks.find((l) => l.id === 'plan-1') || {
    id: 'plan-1',
    title: '2026-2027 MEB Yıllık Çerçeve Planı',
    url: 'https://mufredat.meb.gov.tr',
    category: 'plan',
  };

  const handleSaveEditedLink = (updated: QuickLink) => {
    const updatedList = quickLinks.map((l) => (l.id === updated.id ? updated : l));
    setQuickLinks(updatedList);
    localStorage.setItem('burak_quick_links', JSON.stringify(updatedList));
  };

  const handleOpenLinkEditorForAnnual = () => {
    if (!isTeacher) return;
    setActiveEditingLink(annualPlanItem);
    setIsLinkEditorOpen(true);
  };

  // 1. IF NO USER IS LOGGED IN: Render simple, clean Auth & Landing Screen
  // (Zero private notes, no attendance, no annual plans)
  if (!currentUser) {
    return <AuthScreen />;
  }

  // 2. LOGGED-IN EXPERIENCE (Teacher or Student)
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Bar with TEDx header and role-filtered navigation */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickNote={() => setActiveTab('notlar')}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Role Banner Indicator */}
      <div className={`px-4 sm:px-8 py-2 text-xs font-medium border-b flex items-center justify-between ${
        isTeacher 
          ? 'bg-indigo-50/80 border-indigo-100 text-indigo-950' 
          : 'bg-emerald-50/80 border-emerald-100 text-emerald-950'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            {isTeacher ? (
              <>
                <Shield size={15} className="text-indigo-600 shrink-0" />
                <span>
                  <strong>Öğretmen Paneli:</strong> Hoş geldiniz Sayın <strong>Burak Turgut</strong>. Ödev oluşturma, mesaj yanıtlama, not defteri ve devamsızlık e-tablosu yönetim yetkilerine sahipsiniz.
                </span>
              </>
            ) : (
              <>
                <GraduationCap size={15} className="text-emerald-600 shrink-0" />
                <span>
                  <strong>Öğrenci Portalı:</strong> Merhaba <strong>{currentUser.username}</strong>! Verilen ödevlerinizi teslim edebilir, Burak Öğretmeninize özel soru sorabilir ve ders kaynaklarını inceleyebilirsiniz.
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-[11px] font-bold underline hover:opacity-80 cursor-pointer"
            >
              Hesap Değiştir
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={logout}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-8">
        {/* TAB: ANASAYFA */}
        {activeTab === 'anasayfa' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <HeroSlider
              onOpenAiTools={() => setActiveTab('yapayzeka')}
              onOpenGames={() => setActiveTab('oyunlar')}
            />

            {/* Student Quick Shortcuts Banner (If Student) */}
            {isStudent && (
              <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                    Öğrenci Çalışma Merkezi
                  </span>
                  <h3 className="text-xl font-extrabold">Ödevlerinizi ve Sorularınızı Yönetin</h3>
                  <p className="text-xs text-white/90 mt-1 max-w-xl">
                    Burak Öğretmeninizin yayınladığı en son ödevleri teslim edebilir, yapamadığınız soruları birebir danışabilirsiniz.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveTab('odevler')}
                    className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookMarked size={15} className="text-emerald-600" />
                    <span>Ödevlerime Git</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('mesajlar')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-950/60 text-white border border-white/20 font-bold text-xs hover:bg-emerald-950/80 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare size={15} />
                    <span>Öğretmene Soru Sor</span>
                  </button>
                </div>
              </section>
            )}

            {/* AI Tools Section */}
            <section id="yapayzeka-bolumu">
              <AiToolsSection />
            </section>

            {/* 3x3 Quick Action Grid */}
            <section>
              <QuickActionGrid
                onNavigateSection={(sec) => setActiveTab(sec)}
                onOpenAnnualPlans={() => setIsAnnualPlansOpen(true)}
              />
            </section>

            {/* Workspace Tab Grid (Tailored by Role) */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {isTeacher ? 'Öğretmen Çalışma Masası' : 'Öğrenci Etkinlik & Ders Masası'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isTeacher
                      ? 'Ders notları, ödev kontrolleri, e-tablo puanlama ve oyun modülleri'
                      : 'Eğitici oyunlar, ödevleriniz ve 9-12. sınıf ders içerikleri'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('odevler')}
                    className="px-3 py-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <BookMarked size={14} className="text-indigo-600" />
                    <span>{isTeacher ? 'Ödev Yönetimi' : 'Ödevlerim'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('mesajlar')}
                    className="px-3 py-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare size={14} className="text-emerald-600" />
                    <span>{isTeacher ? 'Mesajlar' : 'Soru Sor'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('oyunlar')}
                    className="px-3 py-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Gamepad2 size={14} className="text-amber-600" />
                    <span>Oyunlar</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('siniflar')}
                    className="px-3 py-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <GraduationCap size={14} className="text-blue-600" />
                    <span>9-12 Sınıflar</span>
                  </button>

                  {/* Teacher-only quick actions */}
                  {isTeacher && (
                    <>
                      <button
                        onClick={() => setActiveTab('ogrenci_not_devamsizlik')}
                        className="px-3 py-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <FileSpreadsheet size={14} className="text-emerald-600" />
                        <span>E-Tablo</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('notlar')}
                        className="px-3 py-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <NotebookPen size={14} className="text-indigo-600" />
                        <span>Not Defterim</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Home interactive widgets */}
              {isTeacher ? (
                /* Teacher View: Games & Private Notes together */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Gamepad2 size={15} className="text-indigo-600" />
                        Canva Oyunlarım (Mini Tetris & Düello)
                      </span>
                      <button
                        onClick={() => setActiveTab('oyunlar')}
                        className="text-xs text-indigo-600 hover:underline font-medium"
                      >
                        Genişlet →
                      </button>
                    </div>
                    <GamesSection />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <NotebookPen size={15} className="text-emerald-600" />
                        Burak Öğretmenin Not Defteri
                      </span>
                      <button
                        onClick={() => setActiveTab('notlar')}
                        className="text-xs text-indigo-600 hover:underline font-medium"
                      >
                        Tüm Notlar →
                      </button>
                    </div>
                    <NotesSection />
                  </div>
                </div>
              ) : (
                /* Student View: Games & 9-12 Materials (Private notes hidden!) */
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Gamepad2 size={15} className="text-indigo-600" />
                        Eğitici Zeka ve Bilgi Oyunları
                      </span>
                      <button
                        onClick={() => setActiveTab('oyunlar')}
                        className="text-xs text-indigo-600 hover:underline font-medium"
                      >
                        Tüm Oyunlar →
                      </button>
                    </div>
                    <GamesSection />
                  </div>
                </div>
              )}
            </section>

            {/* Son Eklenen İçerikler */}
            <section>
              <RecentContentSection onOpenNotes={() => isTeacher ? setActiveTab('notlar') : setActiveTab('siniflar')} />
            </section>
          </div>
        )}

        {/* TAB: ÖDEVLER (Both Teacher and Student) */}
        {activeTab === 'odevler' && (
          <div className="space-y-6">
            <AssignmentsSection />
          </div>
        )}

        {/* TAB: MESAJLAR / ÖĞRETMENE SORU SOR */}
        {activeTab === 'mesajlar' && (
          <div className="space-y-6">
            <MessagesSection />
          </div>
        )}

        {/* TAB: NOTLAR (Teacher Only) */}
        {activeTab === 'notlar' && (
          <div className="space-y-6">
            {isTeacher ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      Burak Öğretmenin Not Defteri
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Ders notları, zümre toplantıları, sınav hazırlıkları ve veli görüşmeleri
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('anasayfa')}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    ← Anasayfaya Dön
                  </button>
                </div>
                <NotesSection />
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                <Shield size={36} className="text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Bu Sayfa Öğretmen Özel Alanıdır</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Burak Öğretmenin kişisel not defteri sadece öğretmen yetkisine açıktır. Ders içerikleri ve ödevlerinize menülerden ulaşabilirsiniz.
                </p>
                <button
                  onClick={() => setActiveTab('anasayfa')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Öğrenci Anasayfasına Dön
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: ÖĞRENCİ NOT & DEVAMSIZLIK E-TABLOSU (Teacher Only) */}
        {activeTab === 'ogrenci_not_devamsizlik' && (
          <div className="space-y-6">
            {isTeacher ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      Öğrenci Not & Devamsızlık E-Tablosu
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Öğrenci listesi, yazılı sınav notları, devamsızlık durumu ve e-tablo düzenleme
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('anasayfa')}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    ← Anasayfaya Dön
                  </button>
                </div>
                <StudentGradeAttendanceSheet />
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                <Shield size={36} className="text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Yetkisiz Erişim</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Sınıf not ve devamsızlık çizelgesi yalnızca öğretmen tarafından yönetilebilir. Ödevlerinizin değerlendirme notunu <strong>ÖDEVLERİM</strong> sekmesinden görebilirsiniz.
                </p>
                <button
                  onClick={() => setActiveTab('odevler')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Ödevlerime Git
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: YILLIK PLANLAR & YOKLAMA (Teacher Only) */}
        {activeTab === 'planlar_yoklama' && (
          <div className="space-y-6">
            {isTeacher ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      Yıllık Planlar & Sınıf Yoklama Modülü
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      MEB yıllık kazanım çizelgesi ve şubeler için e-yoklama takip fişi
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAnnualPlansOpen(true)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <CalendarDays size={14} /> Yıllık Planları İncele
                    </button>
                    <button
                      onClick={() => setActiveTab('anasayfa')}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      ← Anasayfaya Dön
                    </button>
                  </div>
                </div>
                <AttendanceSection />
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                <Shield size={36} className="text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">İdari Alan</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Müfredat yıllık planları öğretmen evrak alanıdır.
                </p>
                <button
                  onClick={() => setActiveTab('anasayfa')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Öğrenci Anasayfasına Dön
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: SINIFLAR (9-12) (Both Teacher and Student) */}
        {activeTab === 'siniflar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Sınıflarımız (9, 10, 11 ve 12. Sınıf)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Müfredat üniteleri, çalışma kağıtları, kazanım testleri ve YKS maratonu
                </p>
              </div>
              <button
                onClick={() => setActiveTab('anasayfa')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                ← Anasayfaya Dön
              </button>
            </div>
            <ClassesSection />
          </div>
        )}

        {/* TAB: YAPAY ZEKA ARAÇLARI */}
        {activeTab === 'yapayzeka' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  En Çok Kullandığım Yapay Zeka Araçları
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  ChatGPT, Canva, Napkin AI ve Wayground Quiz ile interaktif öğrenme
                </p>
              </div>
              <button
                onClick={() => setActiveTab('anasayfa')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                ← Anasayfaya Dön
              </button>
            </div>
            <AiToolsSection />
          </div>
        )}

        {/* TAB: OYUNLAR */}
        {activeTab === 'oyunlar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Eğitim ve Zeka Oyunlarım
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Mini Tetris, Bilgi Düellosu ve Wayground ile dersleri eğlenerek pekiştirin
                </p>
              </div>
              <button
                onClick={() => setActiveTab('anasayfa')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                ← Anasayfaya Dön
              </button>
            </div>
            <GamesSection />
          </div>
        )}

        {/* TAB: BİZE ULAŞIN */}
        {activeTab === 'iletisim' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">Bize Ulaşın</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Eğitim teknolojileri atölyeleri, yapay zeka seminerleri veya zümre iş birlikleri için iletişime geçebilirsiniz.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">E-Posta Adresi</span>
                  <span className="text-slate-500 font-mono">gencbeyinler@gmail.com</span>
                </div>
                <a
                  href="mailto:gencbeyinler@gmail.com"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Mail Gönder
                </a>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">WhatsApp Topluluk Kanalı</span>
                  <span className="text-slate-500">Türkiye Yapay Zeka Öğretmen Grubu</span>
                </div>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Kanala Katıl
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Annual Plans Modal */}
      <AnnualPlansModal
        isOpen={isAnnualPlansOpen}
        onClose={() => setIsAnnualPlansOpen(false)}
        onOpenLinkEditor={handleOpenLinkEditorForAnnual}
        annualPlanUrl={annualPlanItem.url}
      />

      {/* Link Editor Modal */}
      <LinkEditorModal
        isOpen={isLinkEditorOpen}
        onClose={() => setIsLinkEditorOpen(false)}
        link={activeEditingLink}
        onSave={handleSaveEditedLink}
      />

      {/* Auth Modal for switching accounts */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
