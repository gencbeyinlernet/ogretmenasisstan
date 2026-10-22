import React, { useState } from 'react';
import { classGradesData } from '../data/initialData';
import { ClassGradeContent } from '../types';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, FileText, Download, ExternalLink, Plus, Calendar, CheckCircle2, X } from 'lucide-react';

export const ClassesSection: React.FC = () => {
  const { isTeacher } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<number>(9);
  const [customMaterials, setCustomMaterials] = useState<Record<number, { id: string; title: string; url: string; type: string }[]>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialUrl, setNewMaterialUrl] = useState('');
  const [newMaterialType, setNewMaterialType] = useState('pdf');

  const currentGradeData = classGradesData[selectedGrade];
  const currentCustom = customMaterials[selectedGrade] || [];

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialTitle.trim() || !newMaterialUrl.trim()) return;

    setCustomMaterials((prev) => ({
      ...prev,
      [selectedGrade]: [
        ...(prev[selectedGrade] || []),
        {
          id: Date.now().toString(),
          title: newMaterialTitle.trim(),
          url: newMaterialUrl.trim(),
          type: newMaterialType,
        },
      ],
    }));

    setNewMaterialTitle('');
    setNewMaterialUrl('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      {/* Header & Grade Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="text-indigo-600" size={20} />
            <h3 className="text-lg font-bold text-slate-900">Sınıflarımız (9, 10, 11 ve 12. Sınıf)</h3>
          </div>
          <p className="text-xs text-slate-500">Müfredat üniteleri, çalışma yaprakları, deneme sınavları ve ders dokümanları</p>
        </div>

        {/* Grade Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[9, 10, 11, 12].map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedGrade === grade
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {grade}. Sınıf
            </button>
          ))}
        </div>
      </div>

      {/* Grade Overview Strip */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">{currentGradeData.title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{currentGradeData.description}</p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
          >
            <Plus size={14} /> Bu Sınıfa Materyal / Link Ekle
          </button>
        )}
      </div>

      {/* 2-Column Split: Left = Units & Topics, Right = Materials & Exam Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Units & Syllabus Topics */}
        <div className="lg:col-span-2 space-y-3">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Yıllık Üniteler & Kazanım Başlıkları
          </h5>

          <div className="space-y-3">
            {currentGradeData.units.map((unit, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-700">{unit.title}</span>
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {unit.durationWeeks} Hafta
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  {unit.topics.map((topic, tIdx) => (
                    <div key={tIdx} className="text-xs text-slate-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                      <span className="truncate">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Materials, Worksheets, Exam Dates */}
        <div className="space-y-4">
          <div>
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Çalışma Kağıtları & Testler
            </h5>

            <div className="space-y-2">
              {currentGradeData.materials.map((mat) => (
                <a
                  key={mat.id}
                  href={mat.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={16} className="text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600">
                        {mat.title}
                      </p>
                      {mat.size && <span className="text-[10px] text-slate-400">{mat.size}</span>}
                    </div>
                  </div>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                </a>
              ))}

              {/* Custom Teacher Added Materials */}
              {currentCustom.map((cMat) => (
                <a
                  key={cMat.id}
                  href={cMat.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-lg border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={16} className="text-amber-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-amber-700">
                        {cMat.title}
                      </p>
                      <span className="text-[10px] text-amber-700 font-medium">Öğretmen Özel Ekledi</span>
                    </div>
                  </div>
                  <ExternalLink size={13} className="text-amber-600 shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>

          {/* Exam Dates */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4">
            <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
              <Calendar size={14} className="text-indigo-600" />
              Sınav & Değerlendirme Tarihleri
            </h5>
            <div className="space-y-2">
              {currentGradeData.examDates.map((exam, eIdx) => (
                <div key={eIdx} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-b-0">
                  <span className="text-slate-700 font-medium">{exam.name}</span>
                  <span className="font-mono text-slate-500 tabular-nums">{exam.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal to add class material */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-semibold text-slate-900">
                {selectedGrade}. Sınıfa Materyal / Link Ekle
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddMaterial} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Materyal / Belge Adı</label>
                <input
                  type="text"
                  placeholder="Örn: 9. Sınıf Kümeler Soru Fasikülü"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Google Drive veya Web Linki</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={newMaterialUrl}
                  onChange={(e) => setNewMaterialUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
