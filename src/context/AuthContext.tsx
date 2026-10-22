import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase, checkSupabaseConnection } from '../lib/supabase';

interface StudentAccount {
  username: string;
  password: string;
}

interface AuthContextType {
  currentUser: User | null;
  isTeacher: boolean;
  isStudent: boolean;
  isCloudConnected: boolean;
  loginTeacher: (username: string, password: string) => { success: boolean; error?: string };
  loginStudent: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRoleQuick: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TEACHER_USERNAME = 'burakturgut';
const TEACHER_PASSWORD = '123456';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);

  // Stored registered students (Local cache & fallback)
  const [students, setStudents] = useState<StudentAccount[]>(() => {
    const saved = localStorage.getItem('burak_registered_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { username: 'ahmet', password: '123' },
      { username: 'ayse', password: '123' },
    ];
  });

  // Current session user: Default to null so the app opens to the simple Login/Register screen
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('burak_session_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Check Supabase connectivity on mount
  useEffect(() => {
    checkSupabaseConnection().then((connected) => {
      setIsCloudConnected(connected);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('burak_registered_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('burak_session_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('burak_session_user');
    }
  }, [currentUser]);

  const loginTeacher = (username: string, password: string) => {
    const cleanUser = username.trim().toLowerCase();
    if (cleanUser === TEACHER_USERNAME && password === TEACHER_PASSWORD) {
      const user: User = {
        username: TEACHER_USERNAME,
        role: 'teacher',
        name: 'Burak Turgut (Öğretmen)',
      };
      setCurrentUser(user);
      return { success: true };
    }
    return { 
      success: false, 
      error: 'Kullanıcı adı veya şifre hatalı! (Öğretmen: burakturgut, şifre: 123456)' 
    };
  };

  const loginStudent = async (username: string, password: string) => {
    const cleanUser = username.trim().toLowerCase();
    
    // 1. Try Supabase remote database first
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('username', cleanUser)
        .eq('password', password)
        .maybeSingle();

      if (data && !error) {
        const user: User = {
          username: data.username,
          role: 'student',
          name: `${data.username} (Öğrenci)`,
        };
        setCurrentUser(user);
        return { success: true };
      }
    } catch (err) {
      console.warn('Supabase query error, fallback to local accounts:', err);
    }

    // 2. Check local accounts
    const found = students.find((s) => s.username.toLowerCase() === cleanUser && s.password === password);
    if (found) {
      const user: User = {
        username: found.username,
        role: 'student',
        name: `${found.username} (Öğrenci)`,
      };
      setCurrentUser(user);
      return { success: true };
    }

    return { success: false, error: 'Öğrenci bulunamadı veya şifre hatalı. Lütfen önce kayıt olunuz.' };
  };

  const registerStudent = async (username: string, password: string) => {
    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser || !password) {
      return { success: false, error: 'Kullanıcı adı ve şifre zorunludur.' };
    }
    if (cleanUser === TEACHER_USERNAME) {
      return { success: false, error: 'Bu kullanıcı adı öğretmen hesabı için ayrılmıştır.' };
    }
    if (students.some((s) => s.username.toLowerCase() === cleanUser)) {
      return { success: false, error: 'Bu kullanıcı adı zaten alınmış. Farklı bir kullanıcı adı seçiniz.' };
    }

    // 1. Try to persist into Supabase table 'students'
    try {
      await supabase.from('students').insert([
        {
          username: cleanUser,
          password: password,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.warn('Supabase registration sync warning:', err);
    }

    // 2. Always persist to local state
    const newStudent: StudentAccount = { username: cleanUser, password };
    setStudents((prev) => [...prev, newStudent]);

    const user: User = {
      username: cleanUser,
      role: 'student',
      name: `${cleanUser} (Öğrenci)`,
    };
    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRoleQuick = (role: UserRole) => {
    if (role === 'teacher') {
      setCurrentUser({
        username: 'burakturgut',
        role: 'teacher',
        name: 'Burak Turgut (Öğretmen)',
      });
    } else {
      setCurrentUser({
        username: 'ogrenci',
        role: 'student',
        name: 'Öğrenci Portalı',
      });
    }
  };

  const isTeacher = currentUser?.role === 'teacher';
  const isStudent = currentUser?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isTeacher,
        isStudent,
        isCloudConnected,
        loginTeacher,
        loginStudent,
        registerStudent,
        logout,
        switchRoleQuick,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
