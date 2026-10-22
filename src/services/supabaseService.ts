import { supabase } from '../lib/supabase';
import { 
  Note, 
  Assignment, 
  AssignmentSubmission, 
  Message, 
  User, 
  EducationalGame, 
  GameCompletion,
  StudentBadge,
  BadgeType,
  StudentBadgeSummary
} from '../types';

// Storage keys for local fallback
const STORAGE_KEYS = {
  NOTES: 'burak_teacher_notes',
  ASSIGNMENTS: 'burak_assignments',
  SUBMISSIONS: 'burak_assignment_submissions',
  MESSAGES: 'burak_messages',
};

// Initial default assignments so students immediately see active homework
const defaultAssignments: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Fizik & Bilim: Vektörler ve Kuvvet Dengesi Problemleri',
    subject: 'Fizik / Fen Bilimleri',
    grade: '10. Sınıf',
    description: 'Ders kitabındaki sayfa 42-45 arasındaki vektör bileşenleri ve serbest cisim diyagramı sorularını çözerek sonuçlarınızı buraya yazınız veya link ekleyiniz.',
    dueDate: '2026-10-30',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'asg-2',
    title: 'Algoritma & Programlama: Döngüler ve Karar Yapıları',
    subject: 'Bilişim Teknolojileri',
    grade: 'Tüm Sınıflar',
    description: '1 den 100 e kadar olan asal sayıları bulan akış diyagramını veya kod bloğunu açıklayarak ödev cevabı olarak sisteme iletiniz.',
    dueDate: '2026-11-05',
    createdAt: new Date().toISOString(),
  },
];

// Initial default messages for realistic feel
const defaultMessages: Message[] = [
  {
    id: 'msg-1',
    senderUsername: 'ahmet',
    receiverUsername: 'burakturgut',
    senderRole: 'student',
    content: 'Hocam merhaba, 10. sınıf vektörler ödevindeki 3. soruda açı değerini nasıl almamız gerekiyor?',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isRead: true,
  },
  {
    id: 'msg-2',
    senderUsername: 'burakturgut',
    receiverUsername: 'ahmet',
    senderRole: 'teacher',
    content: 'Merhaba Ahmet, 3. soruda cos(37) = 0.8 ve sin(37) = 0.6 alabilirsin, derste bahsettiğimiz özel üçgen kuralı geçerli.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
  },
];

// --- 1. NOTES SERVICE ---
export const fetchNotesFromDB = async (): Promise<Note[]> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('date', { ascending: false });

    if (data && !error && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        title: d.title,
        content: d.content,
        category: d.category || 'Genel',
        date: d.date || new Date().toISOString().split('T')[0],
        isPinned: d.is_pinned ?? false,
        color: d.color,
      }));
    }
  } catch (err) {
    console.warn('Supabase fetchNotes fallback:', err);
  }

  // Fallback to localStorage
  const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [];
};

export const saveNoteToDB = async (note: Note): Promise<void> => {
  // Update local storage
  const existing = await fetchNotesFromDB();
  const index = existing.findIndex((n) => n.id === note.id);
  let updated: Note[];
  if (index >= 0) {
    updated = existing.map((n) => (n.id === note.id ? note : n));
  } else {
    updated = [note, ...existing];
  }
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));

  // Try Supabase upsert
  try {
    await supabase.from('notes').upsert({
      id: note.id,
      title: note.title,
      content: note.content,
      category: note.category,
      date: note.date,
      is_pinned: note.isPinned,
      color: note.color,
    });
  } catch (err) {
    console.warn('Supabase saveNote warning:', err);
  }
};

export const deleteNoteFromDB = async (id: string): Promise<void> => {
  const existing = await fetchNotesFromDB();
  const updated = existing.filter((n) => n.id !== id);
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));

  try {
    await supabase.from('notes').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase deleteNote warning:', err);
  }
};

// --- 2. ASSIGNMENTS (ÖDEVLER) SERVICE ---
export const fetchAssignmentsFromDB = async (): Promise<Assignment[]> => {
  let list: Assignment[] = [];
  try {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error && data.length > 0) {
      list = data.map((d: any) => ({
        id: d.id,
        title: d.title,
        subject: d.subject,
        grade: d.grade || 'Tüm Sınıflar',
        description: d.description,
        dueDate: d.due_date || d.dueDate,
        createdAt: d.created_at || d.createdAt,
      }));
    }
  } catch (err) {
    console.warn('Supabase fetchAssignments fallback:', err);
  }

  if (list.length === 0) {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (list.length === 0) {
    list = defaultAssignments;
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(list));
  }

  // Attach submissions
  const allSubmissions = await fetchSubmissionsFromDB();
  return list.map((a) => ({
    ...a,
    submissions: allSubmissions.filter((s) => s.assignmentId === a.id),
  }));
};

export const saveAssignmentToDB = async (assignment: Assignment): Promise<void> => {
  const current = await fetchAssignmentsFromDB();
  const exists = current.some((a) => a.id === assignment.id);
  const updated = exists
    ? current.map((a) => (a.id === assignment.id ? assignment : a))
    : [assignment, ...current];

  localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(updated));

  try {
    await supabase.from('assignments').upsert({
      id: assignment.id,
      title: assignment.title,
      subject: assignment.subject,
      grade: assignment.grade,
      description: assignment.description,
      due_date: assignment.dueDate,
      created_at: assignment.createdAt,
    });
  } catch (err) {
    console.warn('Supabase saveAssignment warning:', err);
  }
};

export const deleteAssignmentFromDB = async (id: string): Promise<void> => {
  const current = await fetchAssignmentsFromDB();
  const updated = current.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(updated));

  try {
    await supabase.from('assignments').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase deleteAssignment warning:', err);
  }
};

// --- SUBMISSIONS (ÖDEV CEVAPLARI) ---
export const fetchSubmissionsFromDB = async (): Promise<AssignmentSubmission[]> => {
  try {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (data && !error && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        assignmentId: d.assignment_id,
        studentUsername: d.student_username,
        answer: d.answer,
        submittedAt: d.submitted_at,
        feedback: d.feedback,
        score: d.score,
      }));
    }
  } catch (err) {
    console.warn('Supabase fetchSubmissions fallback:', err);
  }

  const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [];
};

export const submitAssignmentAnswer = async (
  assignmentId: string,
  studentUsername: string,
  answer: string
): Promise<AssignmentSubmission> => {
  const newSub: AssignmentSubmission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    assignmentId,
    studentUsername,
    answer,
    submittedAt: new Date().toISOString(),
  };

  const existing = await fetchSubmissionsFromDB();
  // Filter out any previous submission by this student for this assignment to allow resubmission
  const filtered = existing.filter(
    (s) => !(s.assignmentId === assignmentId && s.studentUsername.toLowerCase() === studentUsername.toLowerCase())
  );
  const updated = [newSub, ...filtered];
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated));

  try {
    await supabase.from('assignment_submissions').upsert({
      id: newSub.id,
      assignment_id: newSub.assignmentId,
      student_username: newSub.studentUsername,
      answer: newSub.answer,
      submitted_at: newSub.submittedAt,
    });
  } catch (err) {
    console.warn('Supabase submitAssignmentAnswer warning:', err);
  }

  return newSub;
};

export const gradeSubmissionInDB = async (
  submissionId: string,
  score: string,
  feedback: string
): Promise<void> => {
  const current = await fetchSubmissionsFromDB();
  const updated = current.map((s) => (s.id === submissionId ? { ...s, score, feedback } : s));
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated));

  try {
    await supabase
      .from('assignment_submissions')
      .update({ score, feedback })
      .eq('id', submissionId);
  } catch (err) {
    console.warn('Supabase gradeSubmission warning:', err);
  }
};

// --- 3. PRIVATE MESSAGES (ÖZEL MESAJLAŞMA & SORU-CEVAP) ---
export const fetchMessagesFromDB = async (currentUser: User): Promise<Message[]> => {
  let list: Message[] = [];
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (data && !error && data.length > 0) {
      list = data.map((d: any) => ({
        id: d.id,
        senderUsername: d.sender_username,
        receiverUsername: d.receiver_username,
        senderRole: d.sender_role,
        content: d.content,
        createdAt: d.created_at,
        isRead: d.is_read,
      }));
    }
  } catch (err) {
    console.warn('Supabase fetchMessages fallback:', err);
  }

  if (list.length === 0) {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (list.length === 0) {
    list = defaultMessages;
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
  }

  // Filter based on user role:
  // - Teacher sees all messages
  // - Student sees ONLY messages where they are sender or receiver
  if (currentUser.role === 'teacher') {
    return list;
  } else {
    const cleanUser = currentUser.username.toLowerCase();
    return list.filter(
      (m) =>
        m.senderUsername.toLowerCase() === cleanUser ||
        m.receiverUsername.toLowerCase() === cleanUser
    );
  }
};

export const sendMessageToDB = async (
  sender: User,
  receiverUsername: string,
  content: string
): Promise<Message> => {
  const newMsg: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    senderUsername: sender.username,
    receiverUsername: receiverUsername.trim().toLowerCase(),
    senderRole: sender.role,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  // Get raw all messages from local
  let current: Message[] = [];
  const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  if (saved) {
    try {
      current = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  const updated = [...current, newMsg];
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));

  try {
    await supabase.from('messages').insert([
      {
        id: newMsg.id,
        sender_username: newMsg.senderUsername,
        receiver_username: newMsg.receiverUsername,
        sender_role: newMsg.senderRole,
        content: newMsg.content,
        created_at: newMsg.createdAt,
        is_read: false,
      },
    ]);
  } catch (err) {
    console.warn('Supabase sendMessage warning:', err);
  }

  return newMsg;
};

// --- 4. EDUCATIONAL GAMES & COMPLETION TRACKING ---
export const defaultGames: EducationalGame[] = [
  {
    id: 'game-1',
    title: 'Canva Mini Tetris',
    description: 'Blokları yerleştir, satırları tamamla, odaklanma ve uzamsal zekayı geliştir.',
    url: 'https://canvawebsitesi.my.canva.site/mini-tetris',
    category: 'Zeka & Mantık',
    grade: 'Tüm Sınıflar',
    createdAt: new Date().toISOString(),
    createdBy: 'burakturgut',
  },
  {
    id: 'game-2',
    title: 'Canva Bilgi Düellosu',
    description: 'Bilişim, fen ve genel kültür sorularıyla arkadaşlarınla veya zamana karşı yarış.',
    url: 'https://canvawebsitesi.my.canva.site/bilgi-d-ellosu',
    category: 'Quiz & Düello',
    grade: 'Tüm Sınıflar',
    createdAt: new Date().toISOString(),
    createdBy: 'burakturgut',
  },
  {
    id: 'game-3',
    title: 'Wayground Eğlenceli Quiz',
    description: 'Etkileşimli testler ve müfredat pekiştirme sorularıyla yarış.',
    url: 'https://wayground.com',
    category: 'Ders Pekiştirme',
    grade: 'Tüm Sınıflar',
    createdAt: new Date().toISOString(),
    createdBy: 'burakturgut',
  },
];

const GAMES_STORAGE_KEY = 'burak_educational_games';
const COMPLETIONS_STORAGE_KEY = 'burak_game_completions';

export const fetchGamesFromDB = async (): Promise<EducationalGame[]> => {
  let list: EducationalGame[] = [];
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error && data.length > 0) {
      list = data.map((d: any) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        url: d.url,
        category: d.category || 'Genel',
        grade: d.grade || 'Tüm Sınıflar',
        createdAt: d.created_at || d.createdAt,
        createdBy: d.created_by || 'burakturgut',
        thumbnail: d.thumbnail,
      }));
    }
  } catch (err) {
    console.warn('Supabase fetchGames fallback:', err);
  }

  if (list.length === 0) {
    const saved = localStorage.getItem(GAMES_STORAGE_KEY);
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (list.length === 0) {
    list = defaultGames;
    localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(list));
  }

  // Attach completions
  const completions = await fetchGameCompletionsFromDB();
  return list.map((g) => ({
    ...g,
    completions: completions.filter((c) => c.gameId === g.id),
  }));
};

export const saveGameToDB = async (game: EducationalGame): Promise<void> => {
  const current = await fetchGamesFromDB();
  const exists = current.some((g) => g.id === game.id);
  const updated = exists
    ? current.map((g) => (g.id === game.id ? game : g))
    : [game, ...current];

  localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(updated));

  try {
    await supabase.from('games').upsert({
      id: game.id,
      title: game.title,
      description: game.description,
      url: game.url,
      category: game.category,
      grade: game.grade,
      created_by: game.createdBy,
      created_at: game.createdAt,
    });
  } catch (err) {
    console.warn('Supabase saveGame warning:', err);
  }
};

export const deleteGameFromDB = async (id: string): Promise<void> => {
  const current = await fetchGamesFromDB();
  const updated = current.filter((g) => g.id !== id);
  localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(updated));

  try {
    await supabase.from('games').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase deleteGame warning:', err);
  }
};

export const fetchGameCompletionsFromDB = async (): Promise<GameCompletion[]> => {
  try {
    const { data, error } = await supabase
      .from('game_completions')
      .select('*')
      .order('completed_at', { ascending: false });

    if (data && !error && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        gameId: d.game_id,
        studentUsername: d.student_username,
        completedAt: d.completed_at,
        score: d.score,
        notes: d.notes,
      }));
    }
  } catch (err) {
    console.warn('Supabase fetchGameCompletions fallback:', err);
  }

  const saved = localStorage.getItem(COMPLETIONS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [];
};

export const submitGameCompletionToDB = async (
  gameId: string,
  studentUsername: string,
  score?: string,
  notes?: string
): Promise<GameCompletion> => {
  const newComp: GameCompletion = {
    id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    gameId,
    studentUsername,
    completedAt: new Date().toISOString(),
    score: score?.trim() || undefined,
    notes: notes?.trim() || undefined,
  };

  const existing = await fetchGameCompletionsFromDB();
  const updated = [newComp, ...existing];
  localStorage.setItem(COMPLETIONS_STORAGE_KEY, JSON.stringify(updated));

  try {
    await supabase.from('game_completions').insert([
      {
        id: newComp.id,
        game_id: newComp.gameId,
        student_username: newComp.studentUsername,
        completed_at: newComp.completedAt,
        score: newComp.score,
        notes: newComp.notes,
      },
    ]);
  } catch (err) {
    console.warn('Supabase submitGameCompletion warning:', err);
  }

  return newComp;
};

// --- 5. BADGES & GAMIFICATION (ROZET SİSTEMİ & LİDERLİK TABLOSU) ---
const BADGES_STORAGE_KEY = 'burak_student_badges';

export const defaultBadges: StudentBadge[] = [
  {
    id: 'badge-seed-1',
    studentUsername: 'ahmet',
    badgeType: 'assignment',
    title: 'Ödev Şampiyonu',
    description: 'Vektörler ve Kuvvet Dengesi Problemleri ödevini başarıyla tamamladı.',
    iconName: 'BookMarked',
    earnedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    sourceTitle: 'Fizik & Bilim: Vektörler ve Kuvvet Dengesi Problemleri',
  },
  {
    id: 'badge-seed-2',
    studentUsername: 'ahmet',
    badgeType: 'ai_tool',
    title: 'Yapay Zeka Kaşifi',
    description: 'ChatGPT yapay zeka aracını inceleyip ders hazırlığında tecrübe kazandı.',
    iconName: 'Sparkles',
    earnedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    sourceTitle: 'ChatGPT',
  },
  {
    id: 'badge-seed-3',
    studentUsername: 'ahmet',
    badgeType: 'ai_tool',
    title: 'Görsel Tasarım Yıldızı',
    description: 'Canva Tasarımlarım aracını inceleyerek görsel araçları keşfetti.',
    iconName: 'Sparkles',
    earnedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    sourceTitle: 'Canva Tasarımlarım',
  },
  {
    id: 'badge-seed-4',
    studentUsername: 'zeynep',
    badgeType: 'assignment',
    title: 'Ödev Şampiyonu',
    description: 'Algoritma & Programlama: Döngüler ve Karar Yapıları ödevini başarıyla teslim etti.',
    iconName: 'BookMarked',
    earnedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    sourceTitle: 'Algoritma & Programlama: Döngüler ve Karar Yapıları',
  },
  {
    id: 'badge-seed-5',
    studentUsername: 'zeynep',
    badgeType: 'ai_tool',
    title: 'Yapay Zeka Kaşifi',
    description: 'Napkin AI diyagram ve şema aracını keşfetti.',
    iconName: 'Sparkles',
    earnedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    sourceTitle: 'Napkin AI',
  },
  {
    id: 'badge-seed-6',
    studentUsername: 'mehmet',
    badgeType: 'ai_tool',
    title: 'Yapay Zeka Kaşifi',
    description: 'Wayground Quiz yapay zeka değerlendirme aracını keşfetti.',
    iconName: 'Sparkles',
    earnedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    sourceTitle: 'Wayground Quiz',
  },
];

export const fetchBadgesFromDB = async (): Promise<StudentBadge[]> => {
  let list: StudentBadge[] = [];
  try {
    const { data, error } = await supabase
      .from('student_badges')
      .select('*')
      .order('earned_at', { ascending: false });

    if (data && !error && data.length > 0) {
      list = data.map((d: any) => ({
        id: d.id,
        studentUsername: d.student_username,
        badgeType: d.badge_type,
        title: d.title,
        description: d.description,
        iconName: d.icon_name || 'Award',
        earnedAt: d.earned_at || d.earnedAt,
        sourceTitle: d.source_title || d.sourceTitle,
      }));
    }
  } catch (err) {
    console.warn('Supabase fetchBadges fallback:', err);
  }

  if (list.length === 0) {
    const saved = localStorage.getItem(BADGES_STORAGE_KEY);
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (list.length === 0) {
    list = defaultBadges;
    localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(list));
  }

  return list;
};

export const awardBadgeToStudent = async (
  studentUsername: string,
  badgeType: BadgeType,
  title: string,
  description: string,
  iconName: string,
  sourceTitle?: string
): Promise<{ badge: StudentBadge; isNew: boolean; totalBadges: number }> => {
  const cleanUsername = studentUsername.trim().toLowerCase();
  const allBadges = await fetchBadgesFromDB();

  // Check if student already has this badge for the exact same source (e.g. clicked the same AI tool twice)
  const alreadyEarned = allBadges.some(
    (b) =>
      b.studentUsername.toLowerCase() === cleanUsername &&
      b.badgeType === badgeType &&
      (sourceTitle ? b.sourceTitle?.toLowerCase() === sourceTitle.toLowerCase() : true)
  );

  const studentCurrentBadges = allBadges.filter(
    (b) => b.studentUsername.toLowerCase() === cleanUsername
  );

  if (alreadyEarned) {
    return {
      badge: studentCurrentBadges[0],
      isNew: false,
      totalBadges: studentCurrentBadges.length,
    };
  }

  const newBadge: StudentBadge = {
    id: `badge-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    studentUsername: cleanUsername,
    badgeType,
    title,
    description,
    iconName,
    earnedAt: new Date().toISOString(),
    sourceTitle,
  };

  const updatedBadges = [newBadge, ...allBadges];
  localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(updatedBadges));

  // Try Supabase insert
  try {
    await supabase.from('student_badges').insert([
      {
        id: newBadge.id,
        student_username: newBadge.studentUsername,
        badge_type: newBadge.badgeType,
        title: newBadge.title,
        description: newBadge.description,
        icon_name: newBadge.iconName,
        earned_at: newBadge.earnedAt,
        source_title: newBadge.sourceTitle,
      },
    ]);
  } catch (err) {
    console.warn('Supabase awardBadge warning:', err);
  }

  // Dispatch a browser event so listening components (header, toasts) update immediately
  try {
    window.dispatchEvent(
      new CustomEvent('badge-earned', {
        detail: { badge: newBadge, totalBadges: studentCurrentBadges.length + 1 },
      })
    );
  } catch (e) {
    // ignore
  }

  return {
    badge: newBadge,
    isNew: true,
    totalBadges: studentCurrentBadges.length + 1,
  };
};

export const fetchStudentBadges = async (studentUsername: string): Promise<StudentBadge[]> => {
  const allBadges = await fetchBadgesFromDB();
  const clean = studentUsername.trim().toLowerCase();
  return allBadges.filter((b) => b.studentUsername.toLowerCase() === clean);
};

export const fetchLeaderboardFromDB = async (): Promise<StudentBadgeSummary[]> => {
  const allBadges = await fetchBadgesFromDB();
  const studentMap = new Map<string, StudentBadge[]>();

  allBadges.forEach((b) => {
    const user = b.studentUsername.toLowerCase();
    const existing = studentMap.get(user) || [];
    studentMap.set(user, [...existing, b]);
  });

  const summaryList: StudentBadgeSummary[] = [];

  studentMap.forEach((badges, studentUsername) => {
    const assignmentBadges = badges.filter((b) => b.badgeType === 'assignment').length;
    const aiBadges = badges.filter((b) => b.badgeType === 'ai_tool').length;
    const gameBadges = badges.filter((b) => b.badgeType === 'game').length;

    // sort badges of student by earnedAt desc
    badges.sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime());

    summaryList.push({
      studentUsername,
      studentName: studentUsername.charAt(0).toUpperCase() + studentUsername.slice(1),
      totalBadges: badges.length,
      assignmentBadges,
      aiBadges,
      gameBadges,
      badges,
      lastEarnedAt: badges[0]?.earnedAt,
    });
  });

  // Sort descending by totalBadges, then by lastEarnedAt
  summaryList.sort((a, b) => {
    if (b.totalBadges !== a.totalBadges) {
      return b.totalBadges - a.totalBadges;
    }
    return (
      new Date(b.lastEarnedAt || 0).getTime() - new Date(a.lastEarnedAt || 0).getTime()
    );
  });

  // Assign ranks
  return summaryList.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
};

