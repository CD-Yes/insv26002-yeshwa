import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import type { PageRow } from '@/lib/types';
import { PUBLIC_NAV } from '@/data/navigation';

/** All public page slugs default to live until the DB says otherwise. */
const DEFAULT_LIVE: Record<string, boolean> = Object.fromEntries(
  PUBLIC_NAV.map((p) => [p.pageSlug, true]),
);

interface PagesState {
  pages: Record<string, boolean>;
  loading: boolean;
  /** The admin page is NEVER gated by this control. */
  isPageLive: (slug: string) => boolean;
}

/**
 * Reads the `pages` table to determine which public pages are live.
 * Falls back to "all live" when Supabase is not configured (static mode).
 */
export function usePublicPages(): PagesState {
  const [pages, setPages] = useState<Record<string, boolean>>(DEFAULT_LIVE);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase
      .from('pages')
      .select('slug,is_published')
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) {
          const next = { ...DEFAULT_LIVE };
          (data as Pick<PageRow, 'slug' | 'is_published'>[]).forEach((r) => {
            next[r.slug] = r.is_published;
          });
          setPages(next);
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return {
    pages,
    loading,
    isPageLive: (slug: string) => pages[slug] ?? true,
  };
}
