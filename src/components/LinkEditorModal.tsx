import React, { useState } from 'react';
import { QuickLink } from '../types';
import { X, ExternalLink, Link2, Check } from 'lucide-react';

interface LinkEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: QuickLink | null;
  onSave: (updated: QuickLink) => void;
}

export const LinkEditorModal: React.FC<LinkEditorModalProps> = ({
  isOpen,
  onClose,
  link,
  onSave,
}) => {
  if (!isOpen || !link) return null;

  const [title, setTitle] = useState(link.title);
  const [description, setDescription] = useState(link.description || '');
  const [url, setUrl] = useState(link.url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...link,
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Link2 size={16} className="text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-900">Bağlantı Ayarları & URL Düzenle</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Bu butona tıkladığınızda açılmasını istediğiniz Google Drive, E-Okul veya kişisel doküman linkinizi buraya yapıştırabilirsiniz.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Bağlantı Başlığı</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Açıklama (İsteğe Bağlı)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Örn: 2026-2027 Matematik Yıllık Planı"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Hedef Web / Belge URL Linki</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://drive.google.com/... veya https://..."
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <a
              href={url.startsWith('http') ? url : '#'}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              <ExternalLink size={13} /> Test Et / Aç
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer flex items-center gap-1"
              >
                <Check size={14} /> Kaydet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
