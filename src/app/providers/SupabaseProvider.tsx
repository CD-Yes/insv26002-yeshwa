import { createContext, useContext, type ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

interface SupabaseContextValue {
  client: SupabaseClient | null;
  configured: boolean;
}

const SupabaseContext = createContext<SupabaseContextValue>({
  client: supabase,
  configured: isSupabaseConfigured,
});

export function SupabaseProvider({ children }: { children: ReactNode }) {
  return (
    <SupabaseContext.Provider value={{ client: supabase, configured: isSupabaseConfigured }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSupabase() {
  return useContext(SupabaseContext);
}
