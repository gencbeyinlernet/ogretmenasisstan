import React from 'react';
import { Mail, MessageCircle, Instagram, Youtube, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b132b] text-white mt-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800 text-xs">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#e62b1e] text-white font-black px-1.5 py-0.5 text-[10px] rounded-xs tracking-wider">
                TEDx
              </span>
              <span className="font-bold text-white text-sm">Burak Öğretmen</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              &quot;Hep birlikte teknolojiyi doğru kullanıyor, doğru şekilde öğreniyoruz.&quot;
            </p>
            <p className="text-slate-400 text-[11px]">
              Bilişim Teknolojileri Öğretmeni & Yapay Zeka Uzmanı Burak Turgut tarafından hazırlanmıştır.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Yapay Zeka & Araçlar</h5>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li><a href="https://chatgpt.com/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">ChatGPT Asistanı</a></li>
              <li><a href="https://www.canva.com/folder/all-designs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Canva Tasarımlarım</a></li>
              <li><a href="https://www.napkin.ai/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Napkin AI Şemalar</a></li>
              <li><a href="https://wayground.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Wayground Quiz Hazırlama</a></li>
              <li><a href="https://ogmmateryal.eba.gov.tr" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">OGM Materyal</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Oyunlarım & Etkinlikler</h5>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li><a href="https://canvawebsitesi.my.canva.site/mini-tetris" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Canva Mini Tetris</a></li>
              <li><a href="https://canvawebsitesi.my.canva.site/bilgi-d-ellosu" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Canva Bilgi Düellosu</a></li>
              <li><a href="https://wayground.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Wayground Canlı Quiz</a></li>
              <li><a href="https://wordwall.net/tr" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Wordwall Etkinlikleri</a></li>
              <li><a href="https://kahoot.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Kahoot! Canlı Yarışma</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">İletişim & Topluluk</h5>
            <p className="text-slate-400 text-[11px]">
              Eğitim teknolojileri, atölye çalışmaları veya soru-cevap için ulaşabilirsiniz.
            </p>
            <a
              href="mailto:gencbeyinler@gmail.com"
              className="text-amber-400 hover:underline block text-[11px] font-mono"
            >
              gencbeyinler@gmail.com
            </a>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors"><MessageCircle size={15} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors"><Instagram size={15} /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors"><Youtube size={15} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors"><Linkedin size={15} /></a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 Burak Öğretmenin Not Defteri · Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-1">
            <span>Öğretmenler ve geleceğin genç beyinleri için tasarlandı</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
