import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Enquiry, EnquiryStatus } from '@/lib/types';

interface EnquiriesState {
  enquiries: Enquiry[];
  loading: boolean;
  error: string | null;
  newCount: number;
  refetch: () => void;
  updateStatus: (id: string, status: EnquiryStatus) => Promise<void>;
}

/** Admin enquiries: full list + status mutation. Returns empty list off-DB. */
export function useEnquiries(): EnquiriesState {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setEnquiries((data as Enquiry[]) ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const updateStatus = useCallback(async (id: string, status: EnquiryStatus) => {
    if (!supabase) return;
    // Optimistic update.
    setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
    if (error) {
      setError(error.message);
      refetch();
    }
  }, [refetch]);

  return {
    enquiries,
    loading,
    error,
    newCount: enquiries.filter((e) => e.status === 'new').length,
    refetch,
    updateStatus,
  };
}
