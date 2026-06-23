import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SEED_PROJECTS } from '@/data/staticSeed';
import type { Project } from '@/lib/types';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  /** True when showing static seed (no DB / empty table). */
  isFallback: boolean;
}

/**
 * Published projects for the public site. Falls back to static seed content so
 * the Products page renders identically before the DB is populated.
 */
export function useProjects(): ProjectsState {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setError(error.message);
        else if (data && data.length) {
          setProjects(data as Project[]);
          setIsFallback(false);
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { projects, loading, error, isFallback };
}
