import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SEED_BLOG } from '@/data/staticSeed';
import type { BlogPost } from '@/lib/types';

interface BlogsState {
  posts: BlogPost[];
  loading: boolean;
  isFallback: boolean;
}

/** Published blog posts (newest first) with static-seed fallback. */
export function useBlogs(): BlogsState {
  const [posts, setPosts] = useState<BlogPost[]>(SEED_BLOG);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [isFallback, setIsFallback] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data && data.length) {
          setPosts(data as BlogPost[]);
          setIsFallback(false);
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { posts, loading, isFallback };
}

/** Single published post by slug (used by BlogDetailPage). */
export function useBlogPost(slug: string | undefined) {
  const seed = SEED_BLOG.find((p) => p.slug === slug) ?? null;
  const [post, setPost] = useState<BlogPost | null>(seed);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [notFound, setNotFound] = useState(!supabase && !seed);

  useEffect(() => {
    if (!supabase || !slug) return;
    let active = true;
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (data) setPost(data as BlogPost);
        else if (!seed) setNotFound(true);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return { post, loading, notFound };
}
