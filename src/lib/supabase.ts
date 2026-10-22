import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ylxavscavnzztjyexwjs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlseGF2c2Nhdm56enRqeWV4d2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2OTAwMDksImV4cCI6MjEwODI2NjAwOX0.lcXbk3plcOVjHy6DIMFKTfhCcAgvzPZh7xjGgEEV59E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('students').select('count', { count: 'exact', head: true });
    // If table doesn't exist yet, it's still reachable as long as it's not a network error
    if (error && error.code === 'PGRST116') {
      return true;
    }
    return !error || error.code !== 'ENOTFOUND';
  } catch (err) {
    console.warn('Supabase connection check warning:', err);
    return false;
  }
};
