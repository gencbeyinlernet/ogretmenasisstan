import React, { useState, useEffect } from 'react';
import { AITool } from '../types';
import { useAuth } from '../context/AuthContext';
import { awardBadgeToStudent } from '../services/supabaseService';
import { Sparkles, ExternalLink, Plus, Trash2, Edit2, X, Check, Award } from 'lucide-react';

const defaultAiTools: AITool[] = [
  {
    id: 'ai-1',
    name: 'ChatGPT',
    description: 'Ders planlama, kazanım bazlı soru türetme ve veli mektupları',
    url: 'https://chatgpt.com/',
    badge: 'Metin & Soru',
  },
  {
    id: 'ai-2',
    name: 'Canva Tasarımlarım',
    description: 'Sınıf içi sunumlar, eğitici afişler, çalışma yaprakları ve oyunlar',
    url: 'https://www.canva.com/folder/all-designs',
    badge: 'Görsel & Sunum',
  },
  {
    id: 'ai-3',
    name: 'Napkin AI',
    description: 'Metin ve formülleri saniyeler içinde zihin haritası ve şemaya dönüştürme',
    url: 'https://www.napkin.ai/',
    badge: 'Diyagram & Şema',
  },
  {
    id: 'ai-4',
    name: 'Wayground Quiz',
    description: 'Yapay zeka destekli soru hazırlama, interaktif sınıf quizleri ve değerlendirme',
    url: 'https://wayground.com',
    badge: 'Quiz & Test',
  },
];

export const AiToolsSection: React.FC = () => {
  const { currentUser, isTeacher, isStudent } = useAuth();
  const [tools, setTools] = useState<AITool[]>(() => {
    const saved = localStorage.getItem('burak_ai_tools');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultAiTools;
  });

  const handleToolClick = (tool: AITool) => {
    if (isStudent && currentUser) {
      awardBadgeToStudent(
        currentUser.username,
        'ai_tool',
        'Yapay Zeka Kaşifi',
        `"${tool.name}" yapay zeka aracını incelediniz ve keşif deneyimi kazandınız!`,
        'Sparkles',
        tool.name
      );
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('Yapay Zeka');

  useEffect(() => {
    localStorage.setItem('burak_ai_tools', JSON.stringify(tools));
  }, [tools]);

  const handleOpenAdd = () => {
    setEditingTool(null);
    setName('');
    setUrl('');
    setDescription('');
    setBadge('Yapay Zeka');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tool: AITool, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTool(tool);
    setName(tool.name);
    setUrl(tool.url);
    setDescription(tool.description);
    setBadge(tool.badge || 'Yapay Zeka');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTools((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    if (editingTool) {
      setTools((prev) =>
        prev.map((t) =>
          t.id === editingTool.id
            ? { ...t, name: name.trim(), url: url.trim(), description: description.trim(), badge: badge.trim() }
            : t
        )
      );
    } else {
      const newTool: AITool = {
        id: Date.now().toString(),
        name: name.trim(),
        url: url.trim(),
        description: description.trim(),
        badge: badge.trim() || 'Yapay Zeka',
      };
      setTools((prev) => [...prev, newTool]);
    }
    setIsModalOpen(false);
  };

  const getToolLogoBadge = (toolName: string) => {
    const lower = toolName.toLowerCase();
    if (lower.includes('chatgpt')) return { bg: 'bg-emerald-600', text: 'GPT' };
    if (lower.includes('canva')) return { bg: 'bg-sky-600', text: 'CV' };
    if (lower.includes('napkin')) return { bg: 'bg-indigo-600', text: 'NP' };
    if (lower.includes('wayground')) return { bg: 'bg-amber-600', text: 'WG' };
    return { bg: 'bg-slate-700', text: toolName.substring(0, 2).toUpperCase() };
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">En Çok Kullandığım Yapay Zeka & Quiz Araçları</h3>
            <p className="text-[11px] text-slate-500">Ders hazırlığı, soru tasarımı, quizler ve görsel materyaller için tek tıkla erişim</p>
          </div>
        </div>

        {isTeacher && (
          <button
            onClick={handleOpenAdd}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Plus size={14} /> Yeni Araç Ekle
          </button>
        )}
      </div>

      {/* Grid of AI Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tools.map((tool) => {
          const logo = getToolLogoBadge(tool.name);
          return (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleToolClick(tool)}
              className="group relative p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-md ${logo.bg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                      {logo.text}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {tool.name}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-medium">{tool.badge}</span>
                        {isStudent && (
                          <span className="text-[9px] font-black text-cyan-700 bg-cyan-100/80 px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                            <Sparkles size={8} /> +1 Rozet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>


                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {isTeacher && (
                      <>
                        <button
                          onClick={(e) => handleOpenEdit(tool, e)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200/60 cursor-pointer"
                          title="Düzenle"
                        >
                          <Edit2 size={12} />
                        </button>
                        {tools.length > 1 && (
                          <button
                            onClick={(e) => handleDelete(tool.id, e)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-200/60 cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </>
                    )}
                    <ExternalLink size={13} className="text-slate-400 group-hover:text-indigo-600 ml-0.5" />
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span className="truncate max-w-[170px]">{tool.url.replace(/^https?:\/\//, '')}</span>
                <span className="text-indigo-600 font-medium group-hover:underline">Aç →</span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Modal for adding/editing AI tool */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-semibold text-slate-900">
                {editingTool ? 'Yapay Zeka Aracını Düzenle' : 'Yeni Yapay Zeka Aracı Ekle'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Araç Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Claude AI, Midjourney, Perplexity"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Web Adresi (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Açıklama / Kullanım Amacı</label>
                <input
                  type="text"
                  placeholder="Örn: Akademik makale tarama ve özet çıkarma"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Kategori Rozeti</label>
                <input
                  type="text"
                  placeholder="Örn: Araştırma, Kod, Görsel"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Check size={14} /> Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
