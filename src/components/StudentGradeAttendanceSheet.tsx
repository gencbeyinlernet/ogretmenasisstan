import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  Download, 
  Edit2, 
  Plus, 
  Save, 
  RotateCcw, 
  Search, 
  Check, 
  X, 
  Table, 
  Sparkles,
  Link2,
  Lock
} from 'lucide-react';

interface StudentRow {
  number: string;
  name: string;
  week1: string;
  week2: string;
  week3: string;
  week4: string;
  notes?: string;
}

const initialRows: StudentRow[] = [
  { number: '102', name: 'Ahmet Yılmaz', week1: '+', week2: '+', week3: '+', week4: '' },
  { number: '115', name: 'Ayşe Kaya', week1: '+', week2: '+', week3: '+', week4: '+' },
  { number: '142', name: 'Baran Demir', week1: '-', week2: '+', week3: '-', week4: '' },
  { number: '156', name: 'Ceren Çelik', week1: '+', week2: '+', week3: '+', week4: '+' },
  { number: '178', name: 'Deniz Aydın', week1: '+', week2: '+', week3: '+', week4: '' },
  { number: '190', name: 'Efe Şahin', week1: 'İzinli', week2: '+', week3: '+', week4: '+' },
  { number: '205', name: 'Elif Koç', week1: '+', week2: '+', week3: '+', week4: '+' },
  { number: '220', name: 'Furkan Arslan', week1: '+', week2: '+', week3: '-', week4: '' },
  { number: '233', name: 'Gamze Tekin', week1: '+', week2: '+', week3: '+', week4: '+' },
  { number: '254', name: 'Hasan Polat', week1: '+', week2: '+', week3: '+', week4: '' },
];

export const StudentGradeAttendanceSheet: React.FC = () => {
  const { isTeacher } = useAuth();
  const [rows, setRows] = useState<StudentRow[]>(() => {
    const saved = localStorage.getItem('burak_student_grade_attendance_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialRows;
  });

  const [externalUrl, setExternalUrl] = useState<string>(() => {
    return localStorage.getItem('burak_spreadsheet_url') || '/assets/aistudio/Ba_l_ks_z_e-tablo_666529ff';
  });

  const [isUrlModalOpen, setIsUrlModalOpen] = useState<boolean>(false);
  const [tempUrl, setTempUrl] = useState<string>(externalUrl);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('9-A');
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('burak_student_grade_attendance_data', JSON.stringify(rows));
  }, [rows]);

  const handleCellChange = (index: number, field: keyof StudentRow, value: string) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = tempUrl.trim() || '/assets/aistudio/Ba_l_ks_z_e-tablo_666529ff';
    setExternalUrl(finalUrl);
    localStorage.setItem('burak_spreadsheet_url', finalUrl);
    setIsUrlModalOpen(false);
  };

  const handleDownloadCsv = () => {
    const header = 'Numara,İsim Soy İsim,1.hafta kontrol,2.hafta,3.hafta,4.hafta\n';
    const body = rows
      .map((r) => `${r.number},${r.name},${r.week1},${r.week2},${r.week3},${r.week4}`)
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ogrenci_Not_ve_Devamsizlik_${selectedClass}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveNotification = () => {
    localStorage.setItem('burak_student_grade_attendance_data', JSON.stringify(rows));
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const filteredRows = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.number.includes(searchQuery)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileSpreadsheet size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Öğrenci Not & Devamsızlık E-Tablosu
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Haftalık ödev/ders kontrolü, yoklama takibi ve e-tablo bağlantısı
          </p>
        </div>

        {/* Action Controls & External Link Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          {/* External Link button */}
          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <ExternalLink size={14} />
            <span>E-Tablo Linkini Aç</span>
          </a>

          {/* Edit URL (Teacher Only) */}
          {isTeacher && (
            <button
              onClick={() => {
                setTempUrl(externalUrl);
                setIsUrlModalOpen(true);
              }}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Google Sheets veya bağlantı linkini güncelle"
            >
              <Link2 size={14} className="text-slate-500" />
              <span>Linki Düzenle</span>
            </button>
          )}

          {/* Download CSV */}
          <button
            onClick={handleDownloadCsv}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="CSV olarak bilgisayara indir"
          >
            <Download size={14} className="text-slate-500" />
            <span>CSV İndir</span>
          </button>

          {/* Save Status (Teacher Only) */}
          {isTeacher ? (
            <button
              onClick={handleSaveNotification}
              className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isSavedNotice ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span className="text-emerald-700">Kaydedildi</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Kaydet</span>
                </>
              )}
            </button>
          ) : (
            <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600 text-xs font-medium flex items-center gap-1">
              <Lock size={12} className="text-slate-400" />
              <span>Öğrenci Görüntüleme</span>
            </div>
          )}
        </div>
      </div>

      {/* Class & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
          {['9-A', '10-B', '11-A', '12-C'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                selectedClass === cls
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cls} Şubesi
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Öğrenci veya numara ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Spreadsheet Interactive Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="py-3 px-4 w-20 border-r border-slate-200">Numara</th>
              <th className="py-3 px-4 min-w-[180px] border-r border-slate-200">İsim Soy İsim</th>
              <th className="py-3 px-4 text-center border-r border-slate-200 bg-slate-50/80 min-w-[110px]">
                1. Hafta Kontrol
              </th>
              <th className="py-3 px-4 text-center border-r border-slate-200 bg-slate-50/80 min-w-[110px]">
                2. Hafta
              </th>
              <th className="py-3 px-4 text-center border-r border-slate-200 bg-slate-50/80 min-w-[110px]">
                3. Hafta
              </th>
              <th className="py-3 px-4 text-center border-r border-slate-200 bg-slate-50/80 min-w-[110px]">
                4. Hafta
              </th>
              <th className="py-3 px-4 text-center min-w-[110px]">Hızlı İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredRows.map((student, idx) => (
              <tr key={student.number} className="hover:bg-slate-50/80 transition-colors">
                {/* Student Number */}
                <td className="py-2.5 px-4 font-mono font-semibold text-slate-600 border-r border-slate-100 tabular-nums">
                  {student.number}
                </td>

                {/* Student Name */}
                <td className="py-2.5 px-4 font-medium text-slate-900 border-r border-slate-100">
                  {student.name}
                </td>

                {/* Week 1 */}
                <td className="py-1 px-2 border-r border-slate-100 text-center">
                  <input
                    type="text"
                    value={student.week1}
                    readOnly={!isTeacher}
                    onChange={(e) => handleCellChange(idx, 'week1', e.target.value)}
                    placeholder="+"
                    className={`w-full py-1.5 px-2 text-center text-xs font-semibold rounded border transition-colors ${
                      !isTeacher ? 'cursor-default focus:outline-none' : 'focus:outline-none focus:ring-1 focus:ring-emerald-500'
                    } ${
                      student.week1 === '+'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : student.week1 === '-'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  />
                </td>

                {/* Week 2 */}
                <td className="py-1 px-2 border-r border-slate-100 text-center">
                  <input
                    type="text"
                    value={student.week2}
                    readOnly={!isTeacher}
                    onChange={(e) => handleCellChange(idx, 'week2', e.target.value)}
                    placeholder="+"
                    className={`w-full py-1.5 px-2 text-center text-xs font-semibold rounded border transition-colors ${
                      !isTeacher ? 'cursor-default focus:outline-none' : 'focus:outline-none focus:ring-1 focus:ring-emerald-500'
                    } ${
                      student.week2 === '+'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : student.week2 === '-'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  />
                </td>

                {/* Week 3 */}
                <td className="py-1 px-2 border-r border-slate-100 text-center">
                  <input
                    type="text"
                    value={student.week3}
                    readOnly={!isTeacher}
                    onChange={(e) => handleCellChange(idx, 'week3', e.target.value)}
                    placeholder="+"
                    className={`w-full py-1.5 px-2 text-center text-xs font-semibold rounded border transition-colors ${
                      !isTeacher ? 'cursor-default focus:outline-none' : 'focus:outline-none focus:ring-1 focus:ring-emerald-500'
                    } ${
                      student.week3 === '+'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : student.week3 === '-'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  />
                </td>

                {/* Week 4 */}
                <td className="py-1 px-2 border-r border-slate-100 text-center">
                  <input
                    type="text"
                    value={student.week4}
                    readOnly={!isTeacher}
                    onChange={(e) => handleCellChange(idx, 'week4', e.target.value)}
                    placeholder="+"
                    className={`w-full py-1.5 px-2 text-center text-xs font-semibold rounded border transition-colors ${
                      !isTeacher ? 'cursor-default focus:outline-none' : 'focus:outline-none focus:ring-1 focus:ring-emerald-500'
                    } ${
                      student.week4 === '+'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : student.week4 === '-'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  />
                </td>

                {/* Quick Toggle Controls */}
                <td className="py-1 px-2 text-center">
                  {isTeacher ? (
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleCellChange(idx, 'week4', '+')}
                        className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold rounded cursor-pointer"
                        title="4. Haftaya + ver"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleCellChange(idx, 'week4', '-')}
                        className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold rounded cursor-pointer"
                        title="4. Haftaya - ver"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleCellChange(idx, 'week4', 'İzinli')}
                        className="px-1.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-medium rounded cursor-pointer"
                        title="İzinli yaz"
                      >
                        İ
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Onaylı</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Information Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Aktif E-Tablo:</span>
          <span className="font-mono text-[11px] text-slate-600 truncate max-w-xs sm:max-w-md">
            {externalUrl}
          </span>
        </div>

        <span className="text-emerald-700 font-medium">
          * Yaptığınız hücre değişiklikleri tarayıcınızda otomatik kaydedilir.
        </span>
      </div>

      {/* Edit URL Modal */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={16} className="text-emerald-600" />
                <h4 className="text-sm font-semibold text-slate-900">
                  Öğrenci Not & Devamsızlık E-Tablo Linki
                </h4>
              </div>
              <button
                onClick={() => setIsUrlModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Google E-Tablolar (Google Sheets), OneDrive veya okul bilgi sistemindeki çevrimiçi tablonuzun linkini buraya yapıştırabilirsiniz. &quot;E-Tablo Linkini Aç&quot; butonuna tıkladığınızda bu bağlantı açılacaktır.
            </p>

            <form onSubmit={handleSaveUrl} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  E-Tablo Web Adresi (URL)
                </label>
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/... veya /assets/..."
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Check size={14} /> Linki Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
