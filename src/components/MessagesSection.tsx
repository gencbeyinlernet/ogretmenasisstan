import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Message } from '../types';
import { fetchMessagesFromDB, sendMessageToDB } from '../services/supabaseService';
import { 
  MessageSquare, 
  Send, 
  User, 
  Shield, 
  GraduationCap, 
  Clock, 
  CheckCheck, 
  Search,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const MessagesSection: React.FC = () => {
  const { currentUser, isTeacher, isStudent } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Teacher specific: Selected student conversation
  const [selectedStudentUsername, setSelectedStudentUsername] = useState<string>('');
  const [searchStudent, setSearchStudent] = useState('');

  const loadMessages = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await fetchMessagesFromDB(currentUser);
      setMessages(data);

      // If teacher and no selected student yet, select first student from messages
      if (isTeacher && !selectedStudentUsername) {
        const studentSenders = data
          .map((m) => (m.senderRole === 'student' ? m.senderUsername : m.receiverUsername))
          .filter((u) => u && u.toLowerCase() !== 'burakturgut');
        const unique = Array.from(new Set(studentSenders));
        if (unique.length > 0) {
          setSelectedStudentUsername(unique[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [currentUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newMessageText.trim()) return;

    setIsSending(true);
    try {
      const receiver = isTeacher ? selectedStudentUsername : 'burakturgut';
      if (!receiver) return;

      await sendMessageToDB(currentUser, receiver, newMessageText.trim());
      setNewMessageText('');
      await loadMessages();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  if (!currentUser) return null;

  // Group messages for Teacher view
  const studentList = isTeacher
    ? Array.from(
        new Set(
          messages
            .map((m) => (m.senderRole === 'student' ? m.senderUsername : m.receiverUsername))
            .filter((u) => u && u.toLowerCase() !== 'burakturgut')
        )
      ).filter((u) => u.toLowerCase().includes(searchStudent.toLowerCase()))
    : [];

  const activeThread = isTeacher
    ? messages.filter(
        (m) =>
          (m.senderUsername.toLowerCase() === selectedStudentUsername.toLowerCase() &&
            m.receiverUsername.toLowerCase() === 'burakturgut') ||
          (m.senderUsername.toLowerCase() === 'burakturgut' &&
            m.receiverUsername.toLowerCase() === selectedStudentUsername.toLowerCase())
      )
    : messages;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <MessageSquare size={16} />
            <span>{isTeacher ? 'Öğretmen Soru-Cevap & İletişim Masası' : 'Öğretmenime Soru Sor'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {isTeacher ? 'Öğrencilerden Gelen Özel Mesajlar' : 'Burak Öğretmen ile Birebir Soru-Cevap'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTeacher
              ? 'Öğrencilerinizin takıldığı konular, sorular veya ödev merakları hakkında özel yanıtlar iletebilirsiniz.'
              : 'Dersler, ödevler veya anlamadığınız konular hakkında Burak Öğretmeninize doğrudan soru sorabilirsiniz.'}
          </p>
        </div>

        <button
          onClick={loadMessages}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold"
          title="Mesajları Yenile"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Yenile</span>
        </button>
      </div>

      {/* Main Messaging Interface */}
      {isTeacher ? (
        /* TEACHER VIEW: Split Layout (Student list on left, Chat on right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
          {/* Left: Students with conversations */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col">
            <div className="mb-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Öğrenci ara..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5">
              {studentList.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Henüz mesaj yazan öğrenci bulunmuyor.
                </div>
              ) : (
                studentList.map((st) => {
                  const isSelected = selectedStudentUsername.toLowerCase() === st.toLowerCase();
                  const lastMsg = [...messages]
                    .reverse()
                    .find(
                      (m) =>
                        m.senderUsername.toLowerCase() === st.toLowerCase() ||
                        m.receiverUsername.toLowerCase() === st.toLowerCase()
                    );

                  return (
                    <div
                      key={st}
                      onClick={() => setSelectedStudentUsername(st)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-400'
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                            <GraduationCap size={15} />
                          </div>
                          <span className="font-bold text-xs text-slate-800">{st}</span>
                        </div>
                        {lastMsg && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(lastMsg.createdAt).toLocaleTimeString('tr-TR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>

                      {lastMsg && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 ml-9">
                          {lastMsg.senderRole === 'teacher' ? 'Siz: ' : ''}
                          {lastMsg.content}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Active Chat Area */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
            {selectedStudentUsername ? (
              <>
                {/* Chat Top Bar */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {selectedStudentUsername[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{selectedStudentUsername}</h4>
                      <p className="text-[10px] text-slate-400">Öğrenci ile Birebir Soru-Cevap Hattı</p>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                  {activeThread.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400">
                      Bu öğrenciyle henüz bir mesajlaşma bulunmuyor.
                    </div>
                  ) : (
                    activeThread.map((msg) => {
                      const isMe = msg.senderRole === 'teacher';

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                            }`}
                          >
                            <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(msg.createdAt).toLocaleTimeString('tr-TR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={`${selectedStudentUsername} adlı öğrenciye cevap yazınız...`}
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !newMessageText.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>{isSending ? 'İletiliyor...' : 'Yanıtla'}</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Görüşme detayını görmek için soldan bir öğrenci seçiniz.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STUDENT VIEW: Single dedicated conversation with Burak Teacher */
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
          {/* Top Bar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Burak Öğretmen</h4>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Özel Soru & Danışma Hattı
                </p>
              </div>
            </div>

            <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Öğrenci: <strong>{currentUser.username}</strong>
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/30">
            {activeThread.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400 text-xs">
                <Sparkles size={24} className="text-indigo-400 mb-1" />
                <p className="font-semibold text-slate-600">Henüz soru sormadınız.</p>
                <p className="max-w-xs">
                  Aşağıdaki alandan Burak Öğretmeninize dersler veya ödevler hakkında merak ettiğiniz her şeyi yazabilirsiniz.
                </p>
              </div>
            ) : (
              activeThread.map((msg) => {
                const isStudentSender = msg.senderRole === 'student';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isStudentSender ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                        isStudentSender
                          ? 'bg-emerald-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <div className="text-[10px] font-bold opacity-80 mb-0.5">
                        {isStudentSender ? 'Siz' : 'Burak Öğretmen'}
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(msg.createdAt).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Student Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              required
              placeholder="Burak Öğretmeninize sormak istediğiniz soruyu buraya yazınız..."
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isSending || !newMessageText.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              <Send size={15} />
              <span>{isSending ? 'Gönderiliyor...' : 'Soruyu Gönder'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
