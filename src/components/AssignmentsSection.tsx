import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Assignment, AssignmentSubmission } from '../types';
import { 
  fetchAssignmentsFromDB, 
  saveAssignmentToDB, 
  deleteAssignmentFromDB, 
  submitAssignmentAnswer, 
  gradeSubmissionInDB,
  awardBadgeToStudent
} from '../services/supabaseService';

import { 
  BookMarked, 
  Plus, 
  Calendar, 
  Users, 
  Send, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Award, 
  MessageSquare, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const AssignmentsSection: React.FC = () => {
  const { currentUser, isTeacher, isStudent } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Teacher Creation Modal/Form State
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newGrade, setNewGrade] = useState('Tüm Sınıflar');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Student Submission State
  const [studentAnswerText, setStudentAnswerText] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Teacher Grading State
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await fetchAssignmentsFromDB();
      setAssignments(data);
      if (selectedAssignment) {
        const found = data.find((a) => a.id === selectedAssignment.id);
        if (found) setSelectedAssignment(found);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newAssignment: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject.trim() || 'Genel Ders',
      grade: newGrade,
      description: newDescription.trim(),
      dueDate: newDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      submissions: [],
    };

    await saveAssignmentToDB(newAssignment);
    setNewTitle('');
    setNewSubject('');
    setNewDescription('');
    setNewDueDate('');
    setIsCreating(false);
    await loadAssignments();
  };

  const handleDeleteAssignment = async (id: string) => {
    if (window.confirm('Bu ödevi silmek istediğinize emin misiniz?')) {
      await deleteAssignmentFromDB(id);
      if (selectedAssignment?.id === id) {
        setSelectedAssignment(null);
      }
      await loadAssignments();
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !currentUser || !studentAnswerText.trim()) return;

    setIsSubmittingAnswer(true);
    try {
      await submitAssignmentAnswer(
        selectedAssignment.id,
        currentUser.username,
        studentAnswerText.trim()
      );

      // Award assignment badge
      await awardBadgeToStudent(
        currentUser.username,
        'assignment',
        'Ödev Başarı Rozeti',
        `"${selectedAssignment.title}" ödevini başarıyla teslim ettiniz!`,
        'BookMarked',
        selectedAssignment.title
      );

      setSubmitSuccess(true);
      setStudentAnswerText('');
      setTimeout(() => setSubmitSuccess(false), 4000);
      await loadAssignments();
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleTeacherGrade = async (submissionId: string) => {
    if (!gradeScore.trim()) return;
    await gradeSubmissionInDB(submissionId, gradeScore.trim(), gradeFeedback.trim());
    setGradingSubmissionId(null);
    setGradeScore('');
    setGradeFeedback('');
    await loadAssignments();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BookMarked size={16} />
            <span>{isTeacher ? 'Öğretmen Ödev Yönetim Paneli' : 'Öğrenci Ödevleri & Görevler'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {isTeacher ? 'Sınıf Ödevleri ve Değerlendirme' : 'Ödevlerim ve Teslimat'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTeacher 
              ? 'Tüm sınıflara ödev tanımlayabilir, öğrencilerin cevaplarını inceleyip notlandırabilirsiniz.' 
              : 'Burak Öğretmeninizin verdiği ödevleri inceleyebilir, çözümlerinizi gönderip değerlendirme notunuzu görebilirsiniz.'}
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Plus size={16} />
            <span>{isCreating ? 'Formu Kapat' : 'Yeni Ödev Ekle'}</span>
          </button>
        )}
      </div>

      {/* Teacher: New Assignment Form */}
      {isTeacher && isCreating && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-md transition-all">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-600" />
            <span>Yeni Ödev Tanımla</span>
          </h3>
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ödev Başlığı
                </label>
                <input
                  type="text"
                  required
                  placeholder="örn: 10. Sınıf Kimyasal Tepkimeler Ödev Çalışması"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ders / Alan
                </label>
                <input
                  type="text"
                  required
                  placeholder="örn: Fizik / Fen Bilimleri"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hedef Sınıf Seviyesi
                </label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="Tüm Sınıflar">Tüm Sınıflar</option>
                  <option value="9. Sınıf">9. Sınıf</option>
                  <option value="10. Sınıf">10. Sınıf</option>
                  <option value="11. Sınıf">11. Sınıf</option>
                  <option value="12. Sınıf">12. Sınıf</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Son Teslim Tarihi
                </label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ödev Açıklaması ve Yönergeler
              </label>
              <textarea
                rows={3}
                required
                placeholder="Öğrencilerin çözmesi gereken soruları, sayfa numaralarını veya teslim yönergelerini detaylıca yazınız..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm"
              >
                Ödevi Yayınla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid: List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List: Assignments */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center justify-between">
            <span>Mevcut Ödevler ({assignments.length})</span>
            {loading && <span className="text-xs text-slate-400">Yükleniyor...</span>}
          </h3>

          {assignments.length === 0 && !loading && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs">
              Henüz yayınlanmış bir ödev bulunmamaktadır.
            </div>
          )}

          <div className="space-y-2.5">
            {assignments.map((assignment) => {
              const isSelected = selectedAssignment?.id === assignment.id;
              const subCount = assignment.submissions?.length || 0;
              const mySub = isStudent && currentUser
                ? assignment.submissions?.find(
                    (s) => s.studentUsername.toLowerCase() === currentUser.username.toLowerCase()
                  )
                : null;

              return (
                <div
                  key={assignment.id}
                  onClick={() => setSelectedAssignment(assignment)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {assignment.grade}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                          {assignment.subject}
                        </span>
                        {isStudent && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              mySub
                                ? mySub.score
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {mySub ? (mySub.score ? `Puan: ${mySub.score}` : 'Teslim Edildi') : 'Bekliyor'}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {assignment.title}
                      </h4>
                    </div>

                    {isTeacher && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAssignment(assignment.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Ödevi Sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5">
                    {assignment.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-rose-600 font-semibold">
                      <Calendar size={13} />
                      <span>Son: {assignment.dueDate}</span>
                    </span>

                    {isTeacher ? (
                      <span className="flex items-center gap-1 font-semibold text-indigo-600">
                        <Users size={13} />
                        <span>{subCount} Teslim</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400">
                        <span>Detay</span>
                        <ChevronRight size={13} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail: Assignment Content, Submissions & Form */}
        <div className="lg:col-span-7">
          {selectedAssignment ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Top Meta */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                    {selectedAssignment.subject}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                    {selectedAssignment.grade}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {selectedAssignment.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1 text-rose-600 font-bold">
                    <Clock size={14} />
                    Son Teslim: {selectedAssignment.dueDate}
                  </span>
                  <span>Yayınlanma: {new Date(selectedAssignment.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Ödev Yönergesi
                </h5>
                <p className="whitespace-pre-line">{selectedAssignment.description}</p>
              </div>

              {/* STUDENT VIEW: Submit or View Grade */}
              {isStudent && currentUser && (
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Send size={16} className="text-emerald-600" />
                    <span>Ödev Çözümünüzü Gönderin</span>
                  </h4>

                  {(() => {
                    const mySub = selectedAssignment.submissions?.find(
                      (s) => s.studentUsername.toLowerCase() === currentUser.username.toLowerCase()
                    );

                    return (
                      <>
                        {mySub && (
                          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                                <CheckCircle2 size={15} />
                                Ödevinizi teslim ettiniz ({new Date(mySub.submittedAt).toLocaleString('tr-TR')})
                              </span>
                              {mySub.score && (
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold">
                                  Notunuz: {mySub.score}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-100">
                              <strong>Cevabınız:</strong> {mySub.answer}
                            </p>
                            {mySub.feedback && (
                              <div className="text-xs text-indigo-900 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 flex items-start gap-1.5">
                                <Award size={14} className="shrink-0 mt-0.5 text-indigo-600" />
                                <div>
                                  <strong>Burak Öğretmenin Notu:</strong> {mySub.feedback}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <form onSubmit={handleStudentSubmit} className="space-y-3">
                          <label className="block text-xs font-semibold text-slate-700">
                            {mySub ? 'Cevabınızı Güncellemek İsterseniz Yeniden Yazın:' : 'Çözüm veya Proje Açıklaması:'}
                          </label>
                          <textarea
                            rows={4}
                            required
                            placeholder="Cevabınızı buraya yazınız veya çalışma dokümanınızın bağlantısını ekleyiniz..."
                            value={studentAnswerText}
                            onChange={(e) => setStudentAnswerText(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />

                          {submitSuccess && (
                            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold flex items-center justify-between gap-2 shadow-md">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 size={18} />
                                <span>Ödeviniz başarıyla iletildi ve kaydedildi!</span>
                              </div>
                              <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                +1 Rozet Eklendi! 🏆
                              </span>
                            </div>
                          )}


                          <button
                            type="submit"
                            disabled={isSubmittingAnswer}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-2"
                          >
                            <Send size={15} />
                            <span>{isSubmittingAnswer ? 'İletiliyor...' : (mySub ? 'Cevabı Güncelle' : 'Ödevi Gönder')}</span>
                          </button>
                        </form>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* TEACHER VIEW: Submissions List & Grading */}
              {isTeacher && (
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Users size={16} className="text-indigo-600" />
                      <span>Öğrenci Teslimatları ({selectedAssignment.submissions?.length || 0})</span>
                    </h4>
                  </div>

                  {(!selectedAssignment.submissions || selectedAssignment.submissions.length === 0) ? (
                    <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                      Henüz bu ödeve cevap gönderen öğrenci bulunmuyor.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedAssignment.submissions.map((sub) => {
                        const isGradingThis = gradingSubmissionId === sub.id;

                        return (
                          <div
                            key={sub.id}
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-slate-900">
                                  {sub.studentUsername}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(sub.submittedAt).toLocaleString('tr-TR')}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {sub.score ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                                    Puan: {sub.score}
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs">
                                    Puanlanmadı
                                  </span>
                                )}

                                <button
                                  onClick={() => {
                                    if (isGradingThis) {
                                      setGradingSubmissionId(null);
                                    } else {
                                      setGradingSubmissionId(sub.id);
                                      setGradeScore(sub.score || '');
                                      setGradeFeedback(sub.feedback || '');
                                    }
                                  }}
                                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                                >
                                  {isGradingThis ? 'Kapat' : (sub.score ? 'Puanı Düzenle' : 'Puanla')}
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-line">
                              {sub.answer}
                            </p>

                            {sub.feedback && !isGradingThis && (
                              <p className="text-xs text-indigo-800 bg-indigo-50/80 p-2.5 rounded-lg border border-indigo-100 flex items-start gap-1.5">
                                <MessageSquare size={13} className="shrink-0 mt-0.5 text-indigo-600" />
                                <span><strong>Öğretmen Değerlendirmesi:</strong> {sub.feedback}</span>
                              </p>
                            )}

                            {/* Inline Grading Form */}
                            {isGradingThis && (
                              <div className="mt-3 p-3 bg-white rounded-xl border border-indigo-200 space-y-2">
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                  <div className="sm:col-span-1">
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                      Puan / Not
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="örn: 90"
                                      value={gradeScore}
                                      onChange={(e) => setGradeScore(e.target.value)}
                                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                                    />
                                  </div>
                                  <div className="sm:col-span-3">
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                      Geri Bildirim / Yorum
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Çözüm adımları gayet başarılı..."
                                      value={gradeFeedback}
                                      onChange={(e) => setGradeFeedback(e.target.value)}
                                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-1">
                                  <button
                                    onClick={() => setGradingSubmissionId(null)}
                                    className="px-3 py-1 text-xs text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                                  >
                                    Vazgeç
                                  </button>
                                  <button
                                    onClick={() => handleTeacherGrade(sub.id)}
                                    className="px-4 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
                                  >
                                    Kaydet
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 text-xs">
              Detayları ve teslimatları görüntülemek için soldan bir ödev seçiniz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
