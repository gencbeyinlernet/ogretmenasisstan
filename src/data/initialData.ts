import { Note, ClassGradeContent, QuickLink, QuizQuestion, Student } from '../types';

export const initialNotes: Note[] = [
  {
    id: '1',
    title: '10-B Fonksiyonlar 1. Yazılı Hazırlık Soruları',
    content: 'Grafik çizimi ve bileşke fonksiyon konularından 5 klasik, 10 çoktan seçmeli soru fotokopi odasına bırakılacak.',
    category: 'Sınav & Ödev',
    date: '22 Ekim 2026',
    isPinned: true,
    color: 'amber',
  },
  {
    id: '2',
    title: '11. Sınıf Veli Bilgilendirme Toplantısı',
    content: 'Cuma günü saat 16:30 konferans salonunda YKS çalışma temposu ve deneme sınavı sonuçları değerlendirilecek.',
    category: 'Veli Görüşmesi',
    date: '21 Ekim 2026',
    isPinned: true,
    color: 'emerald',
  },
  {
    id: '3',
    title: 'İlçe Zümre Kararları Teslimi',
    content: 'Müfredat kazanım takip tablosu idareye imzalı olarak elden teslim edilecek.',
    category: 'Zümre & İdari',
    date: '20 Ekim 2026',
    isPinned: false,
    color: 'blue',
  },
  {
    id: '4',
    title: '12-C AYT Geometri Çemberde Açı Etüdü',
    content: 'Salı ve Perşembe öğle aralarında soru çözümü yapılacak. Çıkmış ÖSYM soruları fasikülü dağıtılacak.',
    category: 'Ders Notu',
    date: '19 Ekim 2026',
    isPinned: false,
    color: 'purple',
  },
  {
    id: '5',
    title: 'TUBİTAK 4006 Bilim Fuarı Proje Taslakları',
    content: 'Matematik modelleme ve kodlama projesi için 9-A sınıfından 3 öğrenci ile cuma günü toplantı.',
    category: 'Genel',
    date: '18 Ekim 2026',
    isPinned: false,
    color: 'rose',
  },
];

export const initialQuickLinks: QuickLink[] = [
  {
    id: 'meb-1',
    title: 'MEB E-Okul Yönetim Bilgi Sistemi',
    description: 'Not girişi, devamsızlık ve karne işlemleri',
    url: 'https://e-okul.meb.gov.tr',
    category: 'meb',
  },
  {
    id: 'meb-2',
    title: 'MEBBİS Öğretmen Portalı',
    description: 'Hizmetiçi eğitim, özlük ve başvuru modülü',
    url: 'https://mebbis.meb.gov.tr',
    category: 'meb',
  },
  {
    id: 'meb-3',
    title: 'EBA - Eğitim Bilişim Ağı',
    description: 'Ders içerikleri, canlı ders ve dijital kütüphane',
    url: 'https://www.eba.gov.tr',
    category: 'meb',
  },
  {
    id: 'meb-4',
    title: 'OGM Materyal & Soru Havuzu',
    description: 'Ortaöğretim Genel Müdürlüğü kazanım testleri',
    url: 'https://ogmmateryal.eba.gov.tr',
    category: 'meb',
  },
  {
    id: 'meb-5',
    title: 'ÖBA - Öğretmen Bilişim Ağı',
    description: 'Mesleki gelişim seminerleri ve eğitim videoları',
    url: 'https://oba.gov.tr',
    category: 'meb',
  },
  {
    id: 'plan-1',
    title: '2026-2027 MEB Yıllık Çerçeve Planı',
    description: 'Haftalık ders ve tatil dağılım takvimi',
    url: 'https://mufredat.meb.gov.tr',
    category: 'plan',
  },
  {
    id: 'plan-2',
    title: 'Zümre Çalışma Takvimi & Formları',
    description: 'Aylık kazanım değerlendirme tutanakları',
    url: 'https://mufredat.meb.gov.tr/Programlar.aspx',
    category: 'plan',
  },
  {
    id: 'yoklama-1',
    title: 'Günlük Sınıf Defteri & Yoklama Fişi',
    description: 'Haftalık e-yoklama taslak çizelgesi',
    url: '#yoklama-modulu',
    category: 'yoklama',
  },
];

export const classGradesData: Record<number, ClassGradeContent> = {
  9: {
    grade: 9,
    title: '9. Sınıf - Temel Liseye Uyum & Matematik',
    description: 'Mantık, Kümeler, Sayı Kümeleri ve Temel Geometri',
    units: [
      {
        title: '1. Ünite: Mantık ve Önermeler',
        topics: ['Önermeler ve Doğruluk Değerleri', 'Bileşik Önermeler (Ve, Veya, İse, Ancak ve Ancak)', 'Açık Önermeler ve Niceleyiciler'],
        durationWeeks: 4,
      },
      {
        title: '2. Ünite: Kümeler',
        topics: ['Kümelerde Temel Kavramlar', 'Alt Küme & Eşit Kümeler', 'Kümelerde İşlemler ve Problemler'],
        durationWeeks: 5,
      },
      {
        title: '3. Ünite: Denklem ve Eşitsizlikler',
        topics: ['Gerçek Sayılar & Bölünebilme', 'Birinci Dereceden Denklemler', 'Mutlak Değerli Eşitsizlikler'],
        durationWeeks: 10,
      },
      {
        title: '4. Ünite: Üçgenler',
        topics: ['Üçgende Açılar', 'Üçgende Eşlik ve Benzerlik', 'Pisagor ve Öklid Bağıntıları'],
        durationWeeks: 12,
      },
    ],
    materials: [
      { id: 'm9-1', title: 'Mantık ve Doğruluk Tabloları Çalışma Yaprağı (PDF)', type: 'pdf', url: 'https://ogmmateryal.eba.gov.tr', size: '1.4 MB' },
      { id: 'm9-2', title: 'Kümeler Kazanım Kavrama Testi - 1', type: 'test', url: 'https://ogmmateryal.eba.gov.tr', size: '18 Soru' },
      { id: 'm9-3', title: '1. Dönem 1. Ortak Yazılı Örnek Soruları', type: 'pdf', url: 'https://ogmmateryal.eba.gov.tr', size: '2.1 MB' },
      { id: 'm9-4', title: 'Mutlak Değer İnteraktif GeoGebra Simülasyonu', type: 'link', url: 'https://www.geogebra.org' },
    ],
    examDates: [
      { name: '1. Dönem 1. Yazılı', date: '04 Kasım 2026' },
      { name: '1. Dönem 2. Yazılı', date: '25 Aralık 2026' },
    ],
  },
  10: {
    grade: 10,
    title: '10. Sınıf - Fonksiyonlar & Geometri',
    description: 'Sayma ve Olasılık, Fonksiyonlar, Polinomlar ve Dörtgenler',
    units: [
      {
        title: '1. Ünite: Sayma ve Olasılık',
        topics: ['Permütasyon ve Kombinasyon', 'Binom Açılımı', 'Basit Olayların Olasılığı'],
        durationWeeks: 6,
      },
      {
        title: '2. Ünite: Fonksiyonlar',
        topics: ['Fonksiyon Kavramı ve Gösterimi', 'Fonksiyonların Grafikleri', 'Bileşke ve Ters Fonksiyon'],
        durationWeeks: 10,
      },
      {
        title: '3. Ünite: Polinomlar',
        topics: ['Polinom Kavramı ve İşlemler', 'Polinomlarda Bölme ve Kalan Bulma', 'Çarpanlara Ayırma'],
        durationWeeks: 8,
      },
      {
        title: '4. Ünite: Dörtgenler ve Çokgenler',
        topics: ['Özel Dörtgenler (Paralelkenar, Eşkenar Dörtgen)', 'Yamuk ve Deltoid', 'Dörtgenlerde Alan'],
        durationWeeks: 10,
      },
    ],
    materials: [
      { id: 'm10-1', title: 'Permütasyon - Kombinasyon Soru Bankası Fasikülü', type: 'pdf', url: 'https://ogmmateryal.eba.gov.tr', size: '3.2 MB' },
      { id: 'm10-2', title: 'Fonksiyonlar Grafik Çizim Alıştırmaları', type: 'test', url: 'https://ogmmateryal.eba.gov.tr', size: '25 Soru' },
      { id: 'm10-3', title: 'Polinomlar Yazılıya Hazırlık Denemesi', type: 'pdf', url: 'https://ogmmateryal.eba.gov.tr', size: '1.8 MB' },
    ],
    examDates: [
      { name: '1. Dönem 1. Yazılı', date: '06 Kasım 2026' },
      { name: '1. Dönem 2. Yazılı', date: '28 Aralık 2026' },
    ],
  },
  11: {
    grade: 11,
    title: '11. Sınıf - İleri Matematik & YKS Temeli',
    description: 'Trigonometri, Analitik Geometri, Fonksiyon Uygulamaları, Çember ve Daire',
    units: [
      {
        title: '1. Ünite: Trigonometri',
        topics: ['Yönlü Açılar ve Birim Çember', 'Trigonometrik Fonksiyonlar ve Grafikleri', 'Sinüs ve Kosinüs Teoremleri'],
        durationWeeks: 9,
      },
      {
        title: '2. Ünite: Analitik Geometri',
        topics: ['Doğrunun Analitik İncelenmesi', 'İki Nokta Arası Uzaklık', 'Noktanın Doğruya Uzaklığı'],
        durationWeeks: 8,
      },
      {
        title: '3. Ünite: Fonksiyonlarda Uygulamalar',
        topics: ['İkinci Dereceden Fonksiyonlar (Parabol)', 'Fonksiyonların Dönüşümleri', 'Eşitsizlik Sistemleri'],
        durationWeeks: 9,
      },
      {
        title: '4. Ünite: Çember ve Daire',
        topics: ['Çemberde Teğet - Kiriş Özellikleri', 'Çemberde Açılar', 'Dairede Çevre ve Alan Hesabı'],
        durationWeeks: 8,
      },
    ],
    materials: [
      { id: 'm11-1', title: 'Trigonometri Formül & Pratik Kurallar Tablosu', type: 'pdf', url: 'https://ogmmateryal.eba.gov.tr', size: '850 KB' },
      { id: 'm11-2', title: 'Parabol ve Grafik Dönüşümleri Test Serisi', type: 'test', url: 'https://ogmmateryal.eba.gov.tr', size: '30 Soru' },
      { id: 'm11-3', title: '11. Sınıf Analitik Geometri Çıkmış ÖSYM Soruları', type: 'pdf', url: 'https://ogmmateryal.eba.gov.tr', size: '2.9 MB' },
    ],
    examDates: [
      { name: '1. Dönem 1. Yazılı', date: '11 Kasım 2026' },
      { name: '1. Dönem 2. Yazılı', date: '30 Aralık 2026' },
    ],
  },
  12: {
    grade: 12,
    title: '12. Sınıf - YKS / TYT & AYT Maratonu',
    description: 'Diziler, Logaritma, Limit, Türev, İntegral ve Analitik Geometri',
    units: [
      {
        title: '1. Ünite: Logaritma ve Üstel Fonksiyonlar',
        topics: ['Üstel Fonksiyon', 'Logaritma Fonksiyonu ve Özellikleri', 'Logaritmalı Denklemler'],
        durationWeeks: 6,
      },
      {
        title: '2. Ünite: Diziler',
        topics: ['Aritmetik ve Geometrik Diziler', 'Dizilerin Toplam Formülleri', 'Gerçek Hayat Problemleri'],
        durationWeeks: 5,
      },
      {
        title: '3. Ünite: Limit ve Süreklilik',
        topics: ['Sağdan-Soldan Limit', 'Belirsizlik Durumları (0/0)', 'Fonksiyonun Sürekliliği'],
        durationWeeks: 6,
      },
      {
        title: '4. Ünite: Türev ve İntegral',
        topics: ['Türev Alma Kuralları', 'Fiziksel Yorum ve Maksimum-Minimum', 'Belirli ve Belirsiz İntegral', 'İntegral ile Alan Hesabı'],
        durationWeeks: 14,
      },
    ],
    materials: [
      { id: 'm12-1', title: '2027 YKS Matematik Konu Takip Çizelgesi', type: 'pdf', url: 'https://ogmmateryal.eba.gov.tr', size: '1.2 MB' },
      { id: 'm12-2', title: 'Türev - İntegral Çıkmış AYT Soruları (2018-2026)', type: 'pdf', url: 'https://ogmmateryal.eba.gov.tr', size: '4.8 MB' },
      { id: 'm12-3', title: 'Logaritma ve Diziler Karma Deneme Sınavı', type: 'test', url: 'https://ogmmateryal.eba.gov.tr', size: '40 Soru' },
      { id: 'm12-4', title: 'ÖSYM Tarzı Yeni Nesil Problem Fasikülü', type: 'pdf', url: 'https://ogmmateryal.eba.gov.tr', size: '3.5 MB' },
    ],
    examDates: [
      { name: '1. Dönem 1. Yazılı', date: '13 Kasım 2026' },
      { name: '1. Kurumsal TYT Denemesi', date: '21 Kasım 2026' },
      { name: '1. Dönem 2. Yazılı', date: '04 Ocak 2027' },
    ],
  },
};

export const sampleClassStudents: Record<string, Student[]> = {
  '9-A': [
    { id: 's1', number: '102', name: 'Ahmet Yılmaz', status: 'present' },
    { id: 's2', number: '115', name: 'Ayşe Kaya', status: 'present' },
    { id: 's3', number: '142', name: 'Baran Demir', status: 'absent', notes: 'Raporlu' },
    { id: 's4', number: '156', name: 'Ceren Çelik', status: 'present' },
    { id: 's5', number: '178', name: 'Deniz Aydın', status: 'present' },
    { id: 's6', number: '190', name: 'Efe Şahin', status: 'excused', notes: 'Müsabakada' },
    { id: 's7', number: '205', name: 'Elif Koç', status: 'present' },
    { id: 's8', number: '220', name: 'Furkan Arslan', status: 'present' },
    { id: 's9', number: '233', name: 'Gamze Tekin', status: 'present' },
    { id: 's10', number: '254', name: 'Hasan Polat', status: 'present' },
  ],
  '10-B': [
    { id: 's11', number: '304', name: 'Burak Erdem', status: 'present' },
    { id: 's12', number: '318', name: 'Büşra Yıldız', status: 'present' },
    { id: 's13', number: '325', name: 'Canberk Özkan', status: 'present' },
    { id: 's14', number: '340', name: 'Dilan Aksoy', status: 'absent' },
    { id: 's15', number: '362', name: 'Emre Güler', status: 'present' },
    { id: 's16', number: '377', name: 'İrem Çetin', status: 'present' },
    { id: 's17', number: '390', name: 'Kaan Vural', status: 'present' },
  ],
  '11-A': [
    { id: 's18', number: '412', name: 'Melis Doğan', status: 'present' },
    { id: 's19', number: '426', name: 'Mert Aktaş', status: 'present' },
    { id: 's20', number: '439', name: 'Nazlı Öztürk', status: 'present' },
    { id: 's21', number: '455', name: 'Oğuzhan Kılıç', status: 'excused', notes: 'Rehberlik Servisinde' },
    { id: 's22', number: '468', name: 'Seda Korkmaz', status: 'present' },
    { id: 's23', number: '480', name: 'Umut Can', status: 'present' },
  ],
  '12-C': [
    { id: 's24', number: '501', name: 'Alperen Kurt', status: 'present' },
    { id: 's25', number: '514', name: 'Buse Tan', status: 'present' },
    { id: 's26', number: '528', name: 'Doğukan Avcı', status: 'present' },
    { id: 's27', number: '542', name: 'Ezgi Yavuz', status: 'present' },
    { id: 's28', number: '557', name: 'Kerem Yalçın', status: 'absent' },
    { id: 's29', number: '570', name: 'Zeynep Bulut', status: 'present' },
  ],
};

export const sampleQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Bir kümenin 5 elemanı varsa, bu kümenin kaç adet alt kümesi bulunur?',
    category: 'Matematik',
    options: ['16', '25', '32', '64'],
    correctIndex: 2,
    explanation: 'n elemanlı bir kümenin alt küme sayısı 2^n formülü ile hesaplanır. 2^5 = 32 dir.',
  },
  {
    id: 2,
    question: 'İlk Türk yazılı belgeleri olarak kabul edilen Orhun Abideleri hangi alfabe ile yazılmıştır?',
    category: 'Tarih & Dil',
    options: ['Uygur Alfabesi', 'Göktürk (Köktürk) Alfabesi', 'Soğd Alfabesi', 'Arap Alfabesi'],
    correctIndex: 1,
    explanation: 'Orhun Yazıtları, 38 harften oluşan Göktürk alfabesi ile dikilmiştir.',
  },
  {
    id: 3,
    question: 'f(x) = 2x + 6 doğrusal fonksiyonunun tersi f⁻¹(x) aşağıdakilerden hangisidir?',
    category: 'Matematik',
    options: ['(x - 6) / 2', '(x + 6) / 2', '2x - 6', '-2x + 6'],
    correctIndex: 0,
    explanation: 'y = 2x + 6 ise 2x = y - 6 => x = (y - 6)/2 bulunur.',
  },
  {
    id: 4,
    question: 'Türkiye’nin yüzölçümü bakımından en büyük gölü hangisidir?',
    category: 'Coğrafya',
    options: ['Tuz Gölü', 'Van Gölü', 'Beyşehir Gölü', 'İznik Gölü'],
    correctIndex: 1,
    explanation: 'Van Gölü, yaklaşık 3.713 km² alanı ile Türkiye’nin en büyük gölüdür.',
  },
  {
    id: 5,
    question: '3 basamaklı en küçük asal sayı kaçtır?',
    category: 'Matematik & Mantık',
    options: ['101', '103', '107', '109'],
    correctIndex: 0,
    explanation: '100 çift sayıdır, 101 ise yalnızca 1 ve kendisine bölünen 3 basamaklı ilk asal sayıdır.',
  },
  {
    id: 6,
    question: 'Periyodik tabloda atom numarası 1 olan element hangisidir?',
    category: 'Genel Bilim',
    options: ['Helyum (He)', 'Hidrojen (H)', 'Lityum (Li)', 'Karbon (C)'],
    correctIndex: 1,
    explanation: 'Hidrojen evrende en çok bulunan ve atom numarası 1 olan elementtir.',
  },
  {
    id: 7,
    question: 'Bir dik üçgende hipotenüs uzunluğu 13 cm, dik kenarlardan biri 5 cm ise diğer dik kenar kaç cm dir?',
    category: 'Geometri',
    options: ['10 cm', '11 cm', '12 cm', '8 cm'],
    correctIndex: 2,
    explanation: '5 - 12 - 13 özel dik üçgeni kuralından ötürü diğer dik kenar 12 cm dir.',
  },
  {
    id: 8,
    question: 'Cumhuriyetin ilanı hangi tarihte gerçekleşmiştir?',
    category: 'Cumhuriyet Tarihi',
    options: ['23 Nisan 1920', '19 Mayıs 1919', '29 Ekim 1923', '30 Ağustos 1922'],
    correctIndex: 2,
    explanation: 'Türkiye Büyük Millet Meclisi 29 Ekim 1923 tarihinde Cumhuriyeti ilan etmiştir.',
  },
];

export const externalGameCards = [
  {
    id: 'g-wayground',
    title: 'Wayground İnteraktif Quiz',
    category: 'Quiz & Yarışma Hazırlama',
    description: 'Sınıf içi canlı quizler, yapay zeka destekli soru hazırlama ve anlık öğrenci katılımı.',
    url: 'https://wayground.com',
    badge: 'Öne Çıkan Quiz',
  },
  {
    id: 'g-1',
    title: 'Wordwall İnteraktif Testler',
    category: 'Sınıf İçi Çark & Eşleştirme',
    description: 'Öğrencilerle derste kelime eşleştirme, bilgi çarkı ve kutu açma oyunları.',
    url: 'https://wordwall.net/tr',
    badge: 'Popüler',
  },
  {
    id: 'g-2',
    title: 'Kahoot! Canlı Sınıf Düellosu',
    category: 'Canlı Yarışma',
    description: 'Akıllı tahta üzerinden tüm sınıfla eş zamanlı çoktan seçmeli yarışmalar.',
    url: 'https://kahoot.com',
    badge: 'Canlı Çok Oyunculu',
  },
  {
    id: 'g-3',
    title: 'Quizizz Eğlenceli Değerlendirme',
    category: 'Bireysel & Sınıf Modu',
    description: 'Kendi hızında soru çözümü, anlık meme animasyonları ve detaylı sınıf raporu.',
    url: 'https://quizizz.com',
    badge: 'Otomatik Raporlama',
  },
  {
    id: 'g-4',
    title: 'GeoGebra Matematik & Geometri',
    category: 'Görsel Simülasyon',
    description: 'Dinamik geometri, fonksiyon grafikleri, 3D çizim ve açık kaynak materyaller.',
    url: 'https://www.geogebra.org',
    badge: 'MEB Uyumlu',
  },
  {
    id: 'g-5',
    title: 'Blooket Eğitici Mini Oyunlar',
    category: 'Oyun Tabanlı Öğrenme',
    description: 'Tower Defense, Cafe, Gold Quest modlarıyla heyecanlı tekrar etkinlikleri.',
    url: 'https://www.blooket.com',
    badge: 'Yüksek Katılım',
  },
];

export const weeklySchedule = [
  { day: 'Pazartesi', slots: ['9-A (Matematik)', '9-A (Matematik)', '10-B (Geometri)', 'Öğle Arası', '11-A (İleri Mat)', '11-A (İleri Mat)', 'Zümre Saati'] },
  { day: 'Salı', slots: ['12-C (AYT Hazırlık)', '12-C (AYT Hazırlık)', '10-B (Matematik)', 'Öğle Arası', '9-A (Rehberlik)', 'Boş / Planlama', 'Etüt'] },
  { day: 'Çarşamba', slots: ['11-A (İleri Mat)', '11-A (İleri Mat)', 'Nöbetçi Öğretmen (2. Kat)', 'Öğle Arası', '12-C (Geometri)', '12-C (Geometri)', 'Boş'] },
  { day: 'Perşembe', slots: ['10-B (Matematik)', '10-B (Matematik)', '9-A (Matematik)', 'Öğle Arası', '11-A (Etüt)', 'Veli Görüşme Saati', 'Boş'] },
  { day: 'Cuma', slots: ['12-C (AYT Deneme Analizi)', '12-C (AYT Deneme)', '10-B (Uygulama)', 'Öğle Arası', '9-A (Matematik)', 'Sosyal Kulüp', 'Hafta Kapanışı'] },
];
