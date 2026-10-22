import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Shield, GraduationCap, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'teacher' | 'student-login' | 'student-register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'teacher',
}) => {
  const { loginTeacher, loginStudent, registerStudent } = useAuth();
  const [tab, setTab] = useState<'teacher' | 'student-login' | 'student-register'>(defaultTab);

  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (tab === 'teacher') {
      const res = loginTeacher(username, password);
      if (res.success) {
        setSuccess('Öğretmen girişi başarılı!');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setError(res.error || 'Hatalı giriş');
      }
    } else if (tab === 'student-login') {
      const res = await loginStudent(username, password);
      if (res.success) {
        setSuccess('Öğrenci girişi başarılı! Öğretmeninizin paylaştığı içeriklere yönlendiriliyorsunuz.');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setError(res.error || 'Hatalı giriş');
      }
    } else if (tab === 'student-register') {
      const res = await registerStudent(username, password);
      if (res.success) {
        setSuccess('Kaydınız başarıyla oluşturuldu ve giriş yapıldı!');
        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        setError(res.error || 'Kayıt başarısız');
      }
    }
  };

  const handleQuickFillTeacher = () => {
    setUsername('burakturgut');
    setPassword('123456');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#0b132b] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              Giriş & Yetkilendirme
            </span>
            <h3 className="text-base font-bold">Burak Öğretmenin Not Defteri</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 border-b border-slate-200 text-xs font-semibold bg-slate-50">
          <button
            onClick={() => {
              setTab('teacher');
              setError(null);
            }}
            className={`py-3 px-2 text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              tab === 'teacher'
                ? 'bg-white text-indigo-700 border-b-2 border-indigo-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield size={15} />
            <span>Öğretmen Girişi</span>
          </button>

          <button
            onClick={() => {
              setTab('student-login');
              setError(null);
            }}
            className={`py-3 px-2 text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              tab === 'student-login'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap size={15} />
            <span>Öğrenci Girişi</span>
          </button>

          <button
            onClick={() => {
              setTab('student-register');
              setError(null);
            }}
            className={`py-3 px-2 text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              tab === 'student-register'
                ? 'bg-white text-blue-700 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus size={15} />
            <span>Öğrenci Kaydı</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {tab === 'teacher' && (
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start justify-between gap-2">
              <div>
                <span className="font-bold block mb-0.5">Öğretmen Yönetim Modu</span>
                <p className="text-[11px] text-indigo-700">
                  İçerik ekleme, not düzenleme, sınıf yoklama ve e-tablo puanlama yetkilerine sahip tam erişim.
                </p>
              </div>
              <button
                type="button"
                onClick={handleQuickFillTeacher}
                className="px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded hover:bg-indigo-700 shrink-0 cursor-pointer"
                title="Kullanıcı adı ve şifreyi doldur"
              >
                Otomatik Doldur
              </button>
            </div>
          )}

          {tab === 'student-login' && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-900">
              <span className="font-bold block mb-0.5">Öğrenci Portalı Girişi</span>
              <p className="text-[11px] text-emerald-700">
                Burak Öğretmenin paylaştığı ders notlarını, oyunları (Tetris, Düello), quizleri ve çalışma kağıtlarını görüntüleyebilirsiniz.
              </p>
            </div>
          )}

          {tab === 'student-register' && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900">
              <span className="font-bold block mb-0.5">Hızlı Öğrenci Kaydı</span>
              <p className="text-[11px] text-blue-700">
                Sadece bir kullanıcı adı ve şifre belirleyerek anında sisteme dahil olabilirsiniz.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                placeholder={tab === 'teacher' ? 'burakturgut' : 'Öğrenci kullanıcı adınız'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
              {tab === 'teacher' && (
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Sabit kullanıcı adı: <code className="text-indigo-600 font-mono font-bold">burakturgut</code>
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Şifre
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
              {tab === 'teacher' && (
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Sabit şifre: <code className="text-indigo-600 font-mono font-bold">123456</code>
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 text-xs font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'teacher'
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : tab === 'student-login'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {tab === 'teacher' && <Shield size={14} />}
              {tab === 'student-login' && <LogIn size={14} />}
              {tab === 'student-register' && <UserPlus size={14} />}
              <span>
                {tab === 'teacher'
                  ? 'Öğretmen Olarak Giriş Yap'
                  : tab === 'student-login'
                  ? 'Öğrenci Olarak Giriş Yap'
                  : 'Öğrenci Kaydını Tamamla'}
              </span>
            </button>
          </form>

          {/* Switch tab hint */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {tab === 'student-login' ? (
              <span>
                Henüz hesabın yok mu?{' '}
                <button
                  onClick={() => setTab('student-register')}
                  className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                >
                  Hemen Kayıt Ol
                </button>
              </span>
            ) : tab === 'student-register' ? (
              <span>
                Zaten hesabın var mı?{' '}
                <button
                  onClick={() => setTab('student-login')}
                  className="text-blue-700 font-semibold hover:underline cursor-pointer"
                >
                  Giriş Yap
                </button>
              </span>
            ) : (
              <span>
                Öğrenci misiniz?{' '}
                <button
                  onClick={() => setTab('student-login')}
                  className="text-indigo-700 font-semibold hover:underline cursor-pointer"
                >
                  Öğrenci Girişine Geç
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
