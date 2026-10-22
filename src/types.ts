export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'Ders Notu' | 'Veli Görüşmesi' | 'Sınav & Ödev' | 'Zümre & İdari' | 'Genel';
  date: string;
  isPinned?: boolean;
  color?: string;
}

export interface Student {
  id: string;
  number: string;
  name: string;
  status: 'present' | 'absent' | 'excused';
  notes?: string;
}

export interface ClassGradeContent {
  grade: number;
  title: string;
  description: string;
  units: {
    title: string;
    topics: string[];
    durationWeeks: number;
  }[];
  materials: {
    id: string;
    title: string;
    type: 'pdf' | 'link' | 'video' | 'test';
    url: string;
    size?: string;
  }[];
  examDates: {
    name: string;
    date: string;
  }[];
}

export interface QuickLink {
  id: string;
  title: string;
  description?: string;
  url: string;
  category: 'meb' | 'plan' | 'yoklama' | 'arac' | 'oyun';
  iconName?: string;
}

export type UserRole = 'teacher' | 'student';

export interface User {
  username: string;
  role: UserRole;
  name?: string;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  iconName?: string;
  badge?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  category: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentUsername: string;
  answer: string;
  submittedAt: string;
  feedback?: string;
  score?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string; // 'Tüm Sınıflar' | '9. Sınıf' | '10. Sınıf' | '11. Sınıf' | '12. Sınıf'
  description: string;
  dueDate: string;
  createdAt: string;
  submissions?: AssignmentSubmission[];
}

export interface Message {
  id: string;
  senderUsername: string;
  receiverUsername: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
  isRead?: boolean;
}
