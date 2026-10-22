import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  GraduationCap, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  Database,
  ArrowRight,
  Lock
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loginTeacher, loginStudent, registerStudent, isCloudConnected } = useAuth();
  
  // Active mode: 'student-login' | 'student-register' | 'teacher-login'
  const [authMode, setAuthMode] = useState<'student-login' | 'student-register' | 'teacher-login'>('student-login');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestRegister, setSuggestRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSuggestRegister(false);
    setIsSubmitting(true);

    try {
      if (authMode === 'teacher-login') {
        const res = loginTeacher(username, password);
        if (res.success) {
          setSuccess('Öğretmen girişi başarılı. Platform yükleniyor...');
        } else {
          setError(res.error || 'Kullanıcı adı veya şifre hatalı. Lütfen bilgilerinizi kontrol ediniz.');
        }
      } else if (authMode === 'student-login') {
        const res = await loginStudent(username, password);
        if (res.success) {
          setSuccess('Öğrenci girişi başarılı. Öğrenci panelinize yönlendiriliyorsunuz...');
        } else {
          setError(res.error || 'Kullanıcı adı veya şifre hatalı.');
          // If student doesn't exist, invite them to register
          if (res.error?.includes('bulunamadı') || res.error?.includes('kayıt')) {
            setSuggestRegister(true);
          }
        }
      } else if (authMode === 'student-register') {
        const res = await registerStudent(username, password);
        if (res.success) {
          setSuccess('Kaydınız başarıyla oluşturuldu! Öğrenci sistemine giriş yapılıyor...');
        } else {
          setError(res.error || 'Kayıt oluşturulamadı.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top minimal branding banner - Responsive */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <BookOpen size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                Burak Öğretmenin Not Defteri
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400">Eğitim & Öğretmen Platformu</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
              <Database size={11} className={isCloudConnected ? 'text-emerald-400' : 'text-amber-400'} />
              <span className="hidden xs:inline">Supabase DB:</span>
              <span>{isCloudConnected ? 'Aktif' : 'Çevrimdışı'}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Center content - Fully Mobile Responsive */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-10">
        {/* Left Information Column */}
        <div className="lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
            <Sparkles size={14} className="text-amber-400 shrink-0" />
            <span>Güvenli ve Ayrılmış Giriş Portalı</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Eğitime Açılan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Dijital Kapı</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
            Platform öğretmen ve öğrenci için özel olarak tasarlanmıştır. Giriş yaptıktan sonra sadece yetkinize uygun menüler açılır:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-1">
                <Shield size={15} />
                <span>Öğretmen Paneli</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Yıllık planlar, devamsızlık ve not e-tablosu, ödev dağıtımı, soru yanıtlama ve kişisel not defteri.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                <GraduationCap size={15} />
                <span>Öğrenci Paneli</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ödevleri yanıtlama, öğretmene soru sorma, 9-12. sınıf ders materyalleri ve zeka oyunları.
              </p>
            </div>
          </div>
        </div>

        {/* Right Auth Card */}
        <div className="lg:w-1/2 w-full max-w-md">
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 shadow-2xl p-5 sm:p-6 backdrop-blur-xl relative">
            {/* Top Auth Mode Tabs */}
            <div className="grid grid-cols-3 p-1 bg-slate-900/80 rounded-xl mb-5 text-xs font-semibold border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('student-login');
                  setError(null);
                  setSuccess(null);
                  setSuggestRegister(false);
                }}
                className={`py-2 px-1 rounded-lg transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  authMode === 'student-login'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap size={14} />
                <span className="text-[11px] sm:text-xs">Öğrenci Giriş</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('student-register');
                  setError(null);
                  setSuccess(null);
                  setSuggestRegister(false);
                }}
                className={`py-2 px-1 rounded-lg transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  authMode === 'student-register'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus size={14} />
                <span className="text-[11px] sm:text-xs">Öğrenci Kayıt</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('teacher-login');
                  setError(null);
                  setSuccess(null);
                  setSuggestRegister(false);
                }}
                className={`py-2 px-1 rounded-lg transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  authMode === 'teacher-login'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield size={14} />
                <span className="text-[11px] sm:text-xs">Öğretmen</span>
              </button>
            </div>

            {/* Title / Description */}
            <div className="mb-5 text-center">
              {authMode === 'teacher-login' && (
                <>
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center mb-2">
                    <Shield size={22} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Öğretmen Girişi</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    İdari planlar, devamsızlık ve not defteri araçları
                  </p>
                </>
              )}

              {authMode === 'student-login' && (
                <>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center mb-2">
                    <GraduationCap size={22} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Öğrenci Girişi</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Kullanıcı adı ve şifrenizle giriş yapınız
                  </p>
                </>
              )}

              {authMode === 'student-register' && (
                <>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center mb-2">
                    <UserPlus size={22} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Yeni Öğrenci Kaydı</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Kullanıcı adı ve şifre belirleyerek sisteme katılın
                  </p>
                </>
              )}
            </div>

            {/* Error / Success Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1">
                  <p>{error}</p>
                  {suggestRegister && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('student-register');
                        setError(null);
                        setSuggestRegister(false);
                      }}
                      className="mt-2 text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Hemen Kayıt Ol Ekranına Git</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınızı giriniz"
                  required
                  autoComplete="username"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={authMode === 'student-register' ? 'new-password' : 'current-password'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-white ${
                  authMode === 'teacher-login'
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                } disabled:opacity-50`}
              >
                {authMode === 'student-register' ? (
                  <>
                    <UserPlus size={16} />
                    <span>{isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol ve Giriş Yap'}</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>{isSubmitting ? 'Giriş Yapılıyor...' : 'Sisteme Giriş Yap'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Sub-footer guidance */}
            <div className="mt-5 pt-4 border-t border-slate-700/60 text-center text-xs text-slate-400">
              {authMode === 'student-login' && (
                <p>
                  Henüz hesabınız yok mu?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('student-register');
                      setError(null);
                    }}
                    className="text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Hemen Öğrenci Kaydı Oluşturun
                  </button>
                </p>
              )}
              {authMode === 'student-register' && (
                <p>
                  Zaten bir hesabınız var mı?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('student-login');
                      setError(null);
                    }}
                    className="text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Öğrenci Girişine Dönün
                  </button>
                </p>
              )}
              {authMode === 'teacher-login' && (
                <p className="text-slate-400 flex items-center justify-center gap-1 text-[11px]">
                  <Lock size={12} className="text-indigo-400" />
                  <span>Öğretmen hesabı şifrelenmiş yetkili erişim gerektirir.</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/40 py-3 sm:py-4 px-4 sm:px-6 text-center text-xs text-slate-500">
        <p>Burak Öğretmenin Not Defteri © 2026. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};
