import React, { useState } from 'react';
import { Search, ExternalLink, Calendar, ArrowRight, BookOpen, Clock, Tag, User } from 'lucide-react';

interface RecentContentSectionProps {
  onSelectContent?: (contentId: string) => void;
  onOpenNotes?: () => void;
}

const articles = [
  {
    id: 'art-1',
    title: '19, 20, 21, 22 Ekim Uygulamalı Proje Tabanlı Yapay Zekâ Eğitimi Kılavuzu',
    category: 'Yapay Zeka',
    date: '22 Ekim 2026',
    readTime: '6 dk okuma',
    excerpt: 'Ders tasarımında üretken yapay zekayı pedagojik olarak nasıl kullanabiliriz? ChatGPT, Napkin AI ve Canva entegrasyonu.',
    image: '/src/assets/images/banner_ai_education_1792693980269.jpg',
    author: 'Burak Turgut',
  },
  {
    id: 'art-2',
    title: 'Yeni Eğitim Yılının İlk Zümre Kararları ve Yıllık Müfredat Takvimi',
    category: 'Mevzuat & Plan',
    date: '18 Ekim 2026',
    readTime: '4 dk okuma',
    excerpt: '9-12. sınıf matematik ve bilişim zümresi ortak sınav tarihleri, proje teslim takvimleri ve MEB kazanım tablosu.',
    image: '/src/assets/images/hero_teacher_workspace_1792693703716.jpg',
    author: 'Zümre Kurulu',
  },
  {
    id: 'art-3',
    title: 'Sınıf İçi Oyunlaştırma: Mini Tetris ve Bilgi Düellosu ile Dikkat Toplama',
    category: 'Oyun Tabanlı Öğrenme',
    date: '15 Ekim 2026',
    readTime: '5 dk okuma',
    excerpt: 'Akıllı tahta üzerinden Canva mini oyunları ile ders başı ısınma etkinlikleri ve öğrenci motivasyon teknikleri.',
    image: '/src/assets/images/avatar_burak_teacher_1792693703563.jpg',
    author: 'Burak Turgut',
  },
];

export const RecentContentSection: React.FC<RecentContentSectionProps> = ({ onOpenNotes }) => {
  const [siteSearch, setSiteSearch] = useState('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSearch.trim()) return;
    setSearchFeedback(`"${siteSearch}" için arama yapıldı. İlgili içerikler aşağıda listelendi.`);
    setTimeout(() => setSearchFeedback(null), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
      {/* Left 2 Cols: Son Eklenen İçerikler (Matches Reference Image) */}
      <div className="lg:col-span-2 space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Son Eklenen İçerikler
              </h3>
              <div className="w-16 h-1 bg-[#0f1d3e] rounded-full mt-1.5 mb-1" />
              <p className="text-xs text-slate-500 font-medium">
                Teknoloji, tasarım ve dijital okuryazarlık
              </p>
            </div>

            <button
              onClick={onOpenNotes}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Tüm Notlar & Yazılar <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {searchFeedback && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-800">
            {searchFeedback}
          </div>
        )}

        {/* Content Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {articles.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-[#0f1d3e]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                    {item.category}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                    <span>{item.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.readTime}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700">{item.author}</span>
                <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  İncele →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Right 1 Col: Sitede Ara Box & Quick Teacher Info (Matches Reference Image) */}
      <div className="space-y-4">
        {/* Sitede Ara Card (Exact Match to Reference Image) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 mb-2 tracking-tight">Sitede Ara</h4>
          <div className="w-12 h-0.5 bg-[#0f1d3e] rounded-full mb-3" />

          <form onSubmit={handleSearchSubmit} className="flex items-stretch gap-1.5">
            <input
              type="text"
              placeholder="Aranacak kelime..."
              value={siteSearch}
              onChange={(e) => setSiteSearch(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-slate-50/50"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#0f1d3e] hover:bg-slate-900 text-white font-bold text-xs rounded-lg uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              ARA
            </button>
          </form>
        </div>

        {/* Burak Teacher Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-center space-y-3">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-3 border-indigo-100 shadow-sm">
            <img
              src="/src/assets/images/avatar_burak_teacher_1792693703563.jpg"
              alt="Burak Öğretmen"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900">Burak Turgut</h4>
            <p className="text-xs text-indigo-600 font-medium">Bilişim Teknolojileri Öğretmeni & Yapay Zeka Uzmanı</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Teknolojiyi eğitimle harmanlayarak geleceğin sınıflarını tasarlıyoruz.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-xs text-slate-600 font-mono">
            <div>
              <span className="block font-bold text-slate-900">4 Sınıf</span>
              <span className="text-[10px] text-slate-400">9-12 Şubeler</span>
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div>
              <span className="block font-bold text-slate-900">30+ Araç</span>
              <span className="text-[10px] text-slate-400">AI Kütüphanesi</span>
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div>
              <span className="block font-bold text-slate-900">2 Oyun</span>
              <span className="text-[10px] text-slate-400">Canva Etkinlik</span>
            </div>
          </div>
        </div>

        {/* Quick Official Portals Strip */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <span className="text-xs font-bold text-slate-700 block mb-1">Bakanlık & Ders Kısayolları</span>
          {[
            { name: 'MEB E-Okul Girişi', url: 'https://e-okul.meb.gov.tr' },
            { name: 'MEBBİS Öğretmen Portalı', url: 'https://mebbis.meb.gov.tr' },
            { name: 'EBA Ders İçerikleri', url: 'https://www.eba.gov.tr' },
            { name: 'OGM Materyal Soru Bankası', url: 'https://ogmmateryal.eba.gov.tr' },
          ].map((portal, idx) => (
            <a
              key={idx}
              href={portal.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 text-xs text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
            >
              <span>{portal.name}</span>
              <ExternalLink size={12} className="text-slate-400" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
