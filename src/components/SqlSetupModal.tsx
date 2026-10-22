import React, { useState } from 'react';
import { Database, Copy, Check, X, Terminal, ExternalLink, Sparkles } from 'lucide-react';

export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- BURAK ÖĞRETMENİN NOT DEFTERİ - SUPABASE VERİ TABANI ŞEMASI
-- Proje: ylxavscavnzztjyexwjs.supabase.co
-- ========================================================

-- 1. ÖĞRENCİ HESAPLARI TABLOSU (students)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BURAK ÖĞRETMENİN NOTLARI (notes)
CREATE TABLE IF NOT EXISTS public.notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'Genel',
    date DATE DEFAULT CURRENT_DATE,
    is_pinned BOOLEAN DEFAULT FALSE,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ÖDEVLER TABLOSU (assignments)
CREATE TABLE IF NOT EXISTS public.assignments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    grade TEXT DEFAULT 'Tüm Sınıflar',
    description TEXT NOT NULL,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ÖĞRENCİ ÖDEV TESLİMLERİ (assignment_submissions)
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id TEXT PRIMARY KEY,
    assignment_id TEXT REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_username TEXT NOT NULL,
    answer TEXT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    feedback TEXT,
    score TEXT
);

-- 5. ÖZEL MESAJLAŞMA & SORU-CEVAP (messages)
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    sender_username TEXT NOT NULL,
    receiver_username TEXT NOT NULL,
    sender_role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

-- 6. ÖĞRENCİ NOT VE DEVAMSIZLIK E-TABLOSU (student_grades_attendance)
CREATE TABLE IF NOT EXISTS public.student_grades_attendance (
    id SERIAL PRIMARY KEY,
    school_no TEXT NOT NULL,
    student_name TEXT NOT NULL,
    grade_level TEXT DEFAULT '10. Sınıf',
    exam_1 INT,
    exam_2 INT,
    perf_grade INT,
    absence_days INT DEFAULT 0,
    teacher_notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- GÜVENLİK VE ANONİM İZİNLER (Row Level Security - RLS)
-- İstemcinin anon anahtarla verileri okuyup yazabilmesi için:
-- ========================================================

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_grades_attendance ENABLE ROW LEVEL SECURITY;

-- Anonim erişim politikaları (Tüm işlemler için izin)
CREATE POLICY "Anon Full Access Students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Notes" ON public.notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Assignments" ON public.assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Submissions" ON public.assignment_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Attendance" ON public.student_grades_attendance FOR ALL USING (true) WITH CHECK (true);

-- ========================================================
-- BAŞLANGIÇ ÖRNEK VERİLERİ (SEED DATA)
-- ========================================================

-- Örnek öğrenci hesapları
INSERT INTO public.students (username, password)
VALUES 
    ('ahmet', '123'),
    ('ayse', '123')
ON CONFLICT (username) DO NOTHING;

-- Örnek öğretmen notları
INSERT INTO public.notes (id, title, content, category, is_pinned)
VALUES 
    ('note-1', '1. Dönem Zümre Toplantısı Kararları', 'Tüm sınıflarda ortak sınav tarihleri belirlendi. 9 ve 10. sınıflarda proje ödevleri 2. haftada toplanacak.', 'Zümre & İdari', true),
    ('note-2', 'Öğrenci Proje Değerlendirme Kriterleri', '1. Kaynakça zenginliği, 2. Sunum becerisi, 3. Zamanında teslim.', 'Ders Notu', false)
ON CONFLICT (id) DO NOTHING;

-- Örnek ödevler
INSERT INTO public.assignments (id, title, subject, grade, description, due_date)
VALUES 
    ('asg-1', 'Fizik & Bilim: Vektörler ve Kuvvet Dengesi', 'Fizik / Fen Bilimleri', '10. Sınıf', 'Ders kitabındaki sayfa 42-45 arasındaki vektör bileşenleri sorularını çözünüz.', CURRENT_DATE + INTERVAL '7 days'),
    ('asg-2', 'Algoritma ve Mantık: Döngü Akış Diyagramı', 'Bilişim Teknolojileri', 'Tüm Sınıflar', '1 ile 100 arasındaki asal sayıları bulan akış diyagramını açıklayınız.', CURRENT_DATE + INTERVAL '12 days')
ON CONFLICT (id) DO NOTHING;

-- Örnek ilk mesaj
INSERT INTO public.messages (id, sender_username, receiver_username, sender_role, content, is_read)
VALUES 
    ('msg-1', 'ahmet', 'burakturgut', 'student', 'Hocam merhaba, 10. sınıf vektörler ödevindeki 3. soruda açı değerini nasıl almamız gerekiyor?', true),
    ('msg-2', 'burakturgut', 'ahmet', 'teacher', 'Merhaba Ahmet, 3. soruda cos(37) = 0.8 ve sin(37) = 0.6 alabilirsin.', true)
ON CONFLICT (id) DO NOTHING;
`;

interface SqlSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlSetupModal: React.FC<SqlSetupModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Database size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Supabase SQL Kurulum Kodu</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Tam Şema + Tablolar + İzinler
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Proje ID: <code className="text-emerald-400 font-mono">ylxavscavnzztjyexwjs</code> için hazırlandı
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
                copied
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? 'Kopyalandı!' : 'Tüm SQL Kodunu Kopyala'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Instructions Banner */}
        <div className="bg-emerald-950/30 border-b border-emerald-900/40 px-5 py-3 text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-emerald-400 shrink-0" />
            <span>
              <strong>Nasıl Kurulur?</strong> 1. Aşağıdaki kodu kopyalayın → 2. Supabase panelinizde <strong>SQL Editor</strong> kısmına girin → 3. <strong>New Query</strong> açıp yapıştırın ve <strong>Run</strong> butonuna basın.
            </span>
          </div>

          <a
            href="https://supabase.com/dashboard/project/ylxavscavnzztjyexwjs/sql"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
          >
            <span>Supabase SQL Editörünü Aç</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950/90 font-mono text-xs text-emerald-300 leading-relaxed selection:bg-emerald-500 selection:text-slate-950">
          <pre className="whitespace-pre">{SUPABASE_SQL_SCHEMA}</pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-slate-500" />
            <span>Bu SQL şeması: Öğrenci Hesapları, Öğretmen Notları, Ödevler, Teslimatlar, Mesajlaşma ve Not E-Tablosunu eksiksiz kurar.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Pencereyi Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
