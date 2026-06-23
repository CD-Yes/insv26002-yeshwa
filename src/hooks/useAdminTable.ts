import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Options {
  orderBy?: string;
  ascending?: boolean;
}

interface AdminTableState<T> {
  rows: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setRows: React.Dispatch<React.SetStateAction<T[]>>;
}

/**
 * Generic admin fetch for a table (reads ALL rows incl. drafts — staff RLS).
 * Mutations are done directly via supabase in the calling page, then refetch().
 */
export function useAdminTable<T>(table: string, opts: Options = {}): AdminTableState<T> {
  const { orderBy = 'created_at', ascending = false } = opts;
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from(table)
      .select('*')
      .order(orderBy, { ascending })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRows((data as T[]) ?? []);
        setLoading(false);
      });
  }, [table, orderBy, ascending]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { rows, loading, error, refetch, setRows };
}
