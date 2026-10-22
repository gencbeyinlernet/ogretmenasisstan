import React, { useState } from 'react';
import { X, Calendar, ExternalLink, Download, FileText, CheckCircle2, Edit2 } from 'lucide-react';
import { classGradesData } from '../data/initialData';

interface AnnualPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLinkEditor: () => void;
  annualPlanUrl: string;
}

export const AnnualPlansModal: React.FC<AnnualPlansModalProps> = ({
  isOpen,
  onClose,
  onOpenLinkEditor,
  annualPlanUrl,
}) => {
  const [activeGrade, setActiveGrade] = useState<number>(9);

  if (!isOpen) return null;

  const currentGradeData = classGradesData[activeGrade];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">MEB Yıllık Çerçeve Planları</h3>
              <p className="text-xs text-slate-500">2026-2027 Eğitim Öğretim Yılı Ünitelendirilmiş Kazanım Planı</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Grade tabs & Quick Action buttons */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
            {[9, 10, 11, 12].map((g) => (
              <button
                key={g}
                onClick={() => setActiveGrade(g)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  activeGrade === g
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {g}. Sınıf
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLinkEditor}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer"
              title="Drive veya Belge Linkinizi Tanımlayın"
            >
              <Edit2 size={13} /> Linki Özelleştir
            </button>
            <a
              href={annualPlanUrl || 'https://mufredat.meb.gov.tr'}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink size={13} /> Belgeyi Aç
            </a>
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">{currentGradeData.title}</h4>
            <span className="text-xs text-slate-500 font-mono tabular-nums">Toplam 36 Hafta</span>
          </div>

          <div className="space-y-3">
            {currentGradeData.units.map((unit, index) => (
              <div key={index} className="p-3.5 bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-indigo-700">{unit.title}</span>
                  <span className="text-[11px] text-slate-500 font-mono tabular-nums bg-slate-100 px-2 py-0.5 rounded">
                    {unit.durationWeeks} Hafta
                  </span>
                </div>
                <ul className="space-y-1">
                  {unit.topics.map((topic, tIdx) => (
                    <li key={tIdx} className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>* MEB Talim ve Terbiye Kurulu Başkanlığı Tebliğler Dergisi yönergesine uygundur.</span>
          <span className="text-indigo-600 font-medium">Haftalık Kazanım Defteri Uyumlu</span>
        </div>
      </div>
    </div>
  );
};
