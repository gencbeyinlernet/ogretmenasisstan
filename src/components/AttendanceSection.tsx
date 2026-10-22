import React, { useState } from 'react';
import { sampleClassStudents } from '../data/initialData';
import { Student } from '../types';
import { Check, X, Clock, Users, Copy, CheckCircle2, AlertCircle } from 'lucide-react';

export const AttendanceSection: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>('9-A');
  const [attendanceData, setAttendanceData] = useState<Record<string, Student[]>>(sampleClassStudents);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const currentStudents = attendanceData[selectedClass] || [];

  const handleToggleStatus = (studentId: string, newStatus: Student['status']) => {
    setAttendanceData((prev) => ({
      ...prev,
      [selectedClass]: prev[selectedClass].map((st) =>
        st.id === studentId ? { ...st, status: newStatus } : st
      ),
    }));
  };

  const markAllPresent = () => {
    setAttendanceData((prev) => ({
      ...prev,
      [selectedClass]: prev[selectedClass].map((st) => ({ ...st, status: 'present' })),
    }));
  };

  const presentCount = currentStudents.filter((s) => s.status === 'present').length;
  const absentCount = currentStudents.filter((s) => s.status === 'absent').length;
  const excusedCount = currentStudents.filter((s) => s.status === 'excused').length;
  const totalStudents = currentStudents.length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const handleCopySummary = () => {
    const absents = currentStudents.filter((s) => s.status === 'absent').map((s) => `${s.number} - ${s.name}`);
    const excused = currentStudents.filter((s) => s.status === 'excused').map((s) => `${s.number} - ${s.name} (${s.notes || 'İzinli'})`);
    
    const summaryText = `📋 ${selectedClass} Yoklama Raporu (${new Date().toLocaleDateString('tr-TR')})\n` +
      `Mevcut: ${presentCount}/${totalStudents} (%${attendanceRate})\n` +
      `❌ Gelmeyenler (${absentCount}): ${absents.length > 0 ? absents.join(', ') : 'Yok'}\n` +
      `⏳ İzinli/Raporlu (${excusedCount}): ${excused.length > 0 ? excused.join(', ') : 'Yok'}\n` +
      `Öğretmen: Burak Öğretmen`;

    navigator.clipboard.writeText(summaryText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            Sınıf Yoklama Modülü <span className="text-xs font-normal text-slate-500">· Günlük Takip</span>
          </h3>
          <p className="text-xs text-slate-500">Öğrenci durumlarını hızlıca işaretleyin ve E-Okul özetini kopyalayın</p>
        </div>

        {/* Class Selection Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {Object.keys(attendanceData).map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                selectedClass === cls
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
          <span className="text-[11px] text-slate-500 block">Sınıf Mevcudu</span>
          <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">{totalStudents}</span>
        </div>
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-3">
          <span className="text-[11px] text-emerald-800 block">Derste Olanlar</span>
          <span className="text-lg font-bold text-emerald-700 font-mono tabular-nums">
            {presentCount} <span className="text-xs font-normal">(%{attendanceRate})</span>
          </span>
        </div>
        <div className="bg-rose-50/60 border border-rose-100 rounded-lg p-3">
          <span className="text-[11px] text-rose-800 block">Gelmeyenler</span>
          <span className="text-lg font-bold text-rose-700 font-mono tabular-nums">{absentCount}</span>
        </div>
        <div className="bg-amber-50/60 border border-amber-100 rounded-lg p-3">
          <span className="text-[11px] text-amber-800 block">İzinli / Raporlu</span>
          <span className="text-lg font-bold text-amber-700 font-mono tabular-nums">{excusedCount}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between text-xs pt-1">
        <button
          onClick={markAllPresent}
          className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline flex items-center gap-1 cursor-pointer"
        >
          <CheckCircle2 size={14} /> Tüm Sınıfı 'Geldi' İşaretle
        </button>

        <button
          onClick={handleCopySummary}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copiedNotification ? (
            <>
              <Check size={14} className="text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Özet Kopyalandı!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Yoklama Özetini Kopyala</span>
            </>
          )}
        </button>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 w-16">No</th>
              <th className="py-2.5 px-3">Adı Soyadı</th>
              <th className="py-2.5 px-3">Durum Notu</th>
              <th className="py-2.5 px-3 text-right">Yoklama Durumu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentStudents.map((st) => (
              <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 px-3 font-mono font-medium text-slate-500 tabular-nums">{st.number}</td>
                <td className="py-2.5 px-3 font-medium text-slate-800">{st.name}</td>
                <td className="py-2.5 px-3 text-slate-500 text-[11px]">{st.notes || '—'}</td>
                <td className="py-2.5 px-3 text-right">
                  <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                    <button
                      onClick={() => handleToggleStatus(st.id, 'present')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        st.status === 'present'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Geldi
                    </button>
                    <button
                      onClick={() => handleToggleStatus(st.id, 'absent')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        st.status === 'absent'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Gelmedi
                    </button>
                    <button
                      onClick={() => handleToggleStatus(st.id, 'excused')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        st.status === 'excused'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      İzinli
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
