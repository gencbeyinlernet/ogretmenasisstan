import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { initialNotes } from '../data/initialData';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Pin, Trash2, Edit3, Check, X, Tag, Eye } from 'lucide-react';
import { saveNoteToDB, deleteNoteFromDB } from '../services/supabaseService';

interface NotesSectionProps {
  onOpenQuickAddModal?: () => void;
}

export const NotesSection: React.FC<NotesSectionProps> = () => {
  const { isTeacher } = useAuth();
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('burak_teacher_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialNotes;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Form states
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<Note['category']>('Ders Notu');
  const [noteColor, setNoteColor] = useState('blue');

  useEffect(() => {
    localStorage.setItem('burak_teacher_notes', JSON.stringify(notes));
  }, [notes]);

  const categories = ['Tümü', 'Ders Notu', 'Veli Görüşmesi', 'Sınav & Ödev', 'Zümre & İdari', 'Genel'];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort pinned first, then by date/id
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleSaveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    let updatedNote: Note;
    if (editingNoteId) {
      updatedNote = {
        id: editingNoteId,
        title: noteTitle,
        content: noteContent,
        category: noteCategory,
        date: new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
        color: noteColor,
      };
      setNotes((prev) =>
        prev.map((n) => (n.id === editingNoteId ? { ...n, ...updatedNote } : n))
      );
      setEditingNoteId(null);
    } else {
      updatedNote = {
        id: Date.now().toString(),
        title: noteTitle,
        content: noteContent,
        category: noteCategory,
        date: new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
        isPinned: false,
        color: noteColor,
      };
      setNotes((prev) => [updatedNote, ...prev]);
    }

    // Persist to Supabase
    saveNoteToDB(updatedNote).catch((e) => console.warn(e));

    setNoteTitle('');
    setNoteContent('');
    setIsAddingNote(false);
  };

  const handleStartEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setNoteColor(note.color || 'blue');
    setIsAddingNote(true);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    deleteNoteFromDB(id).catch((e) => console.warn(e));
  };

  const handleTogglePin = (id: string) => {
    setNotes((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
      const target = next.find((n) => n.id === id);
      if (target) {
        saveNoteToDB(target).catch((e) => console.warn(e));
      }
      return next;
    });
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'amber':
        return 'border-amber-200 bg-amber-50/40';
      case 'emerald':
        return 'border-emerald-200 bg-emerald-50/40';
      case 'purple':
        return 'border-purple-200 bg-purple-50/40';
      case 'rose':
        return 'border-rose-200 bg-rose-50/40';
      case 'blue':
      default:
        return 'border-blue-200 bg-blue-50/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action row */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Notlarda ve ders ajandasında ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-800 bg-slate-50/50"
            />
          </div>

          {isTeacher ? (
            <button
              onClick={() => {
                setEditingNoteId(null);
                setNoteTitle('');
                setNoteContent('');
                setIsAddingNote(true);
              }}
              className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Plus size={15} /> Yeni Not Ekle
            </button>
          ) : (
            <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600 text-[11px] font-medium flex items-center gap-1">
              <Eye size={13} className="text-slate-400" />
              <span>Öğrenci Görüntüleme Modu</span>
            </div>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 mt-3 border-t border-slate-100 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Add / Edit Form Modal / Accordion */}
      {isAddingNote && (
        <div className="bg-white rounded-xl border border-indigo-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-semibold text-slate-900">
              {editingNoteId ? 'Notu Düzenle' : 'Yeni Not & Hatırlatıcı Oluştur'}
            </h4>
            <button
              onClick={() => {
                setIsAddingNote(false);
                setEditingNoteId(null);
              }}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Not Başlığı</label>
              <input
                type="text"
                placeholder="Örn: 9-A Sınıfı Yazılı Soruları Dağıtımı"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Kategori</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as Note['category'])}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="Ders Notu">Ders Notu</option>
                  <option value="Veli Görüşmesi">Veli Görüşmesi</option>
                  <option value="Sınav & Ödev">Sınav & Ödev</option>
                  <option value="Zümre & İdari">Zümre & İdari</option>
                  <option value="Genel">Genel</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Vurgu Rengi</label>
                <div className="flex items-center gap-2 pt-1">
                  {[
                    { id: 'blue', bg: 'bg-blue-500' },
                    { id: 'amber', bg: 'bg-amber-500' },
                    { id: 'emerald', bg: 'bg-emerald-500' },
                    { id: 'purple', bg: 'bg-purple-500' },
                    { id: 'rose', bg: 'bg-rose-500' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNoteColor(c.id)}
                      className={`w-5 h-5 rounded-full ${c.bg} cursor-pointer flex items-center justify-center transition-transform ${
                        noteColor === c.id ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : ''
                      }`}
                    >
                      {noteColor === c.id && <Check size={10} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Detaylar & İçerik</label>
              <textarea
                rows={3}
                placeholder="Önemli noktalar, ödev ayrıntıları veya randevu saati..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setIsAddingNote(false);
                  setEditingNoteId(null);
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
              >
                {editingNoteId ? 'Değişiklikleri Kaydet' : 'Notu Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {sortedNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`rounded-xl border p-4 transition-all hover:shadow-xs relative flex flex-col justify-between ${getColorClasses(
                note.color
              )}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{note.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{note.date}</span>
                  </div>

                  {isTeacher ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTogglePin(note.id)}
                        className={`p-1 rounded hover:bg-white/60 transition-colors cursor-pointer ${
                          note.isPinned ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title={note.isPinned ? 'Sabitlemeyi kaldır' : 'Üste sabitle'}
                      >
                        <Pin size={14} className={note.isPinned ? 'fill-amber-500' : ''} />
                      </button>
                      <button
                        onClick={() => handleStartEdit(note)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-white/60 transition-colors cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-white/60 transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    note.isPinned && (
                      <div className="p-1 text-amber-600" title="Öğretmen tarafından sabitlendi">
                        <Pin size={13} className="fill-amber-500" />
                      </div>
                    )
                  )}
                </div>

                <h4 className="text-sm font-semibold text-slate-900 mb-1.5">{note.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{note.content}</p>
              </div>

              {note.isPinned && (
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                  <Pin size={11} className="fill-amber-600" />
                  <span>Önemli / Sabitlendi</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-sm font-medium text-slate-700">Bu aramaya uygun not bulunamadı</p>
          <p className="text-xs text-slate-500 mt-1">Farklı bir arama terimi deneyebilir veya yeni bir not ekleyebilirsiniz.</p>
        </div>
      )}
    </div>
  );
};
