import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SEED_GALLERY } from '@/data/staticSeed';
import type { GalleryItem } from '@/lib/types';

type GalleryDisplayItem = GalleryItem & { height?: number; tone?: 'a' | 'b' };

interface GalleryState {
  items: GalleryDisplayItem[];
  loading: boolean;
  isFallback: boolean;
}

/** Published gallery items for the public masonry, with static-seed fallback. */
export function useGallery(): GalleryState {
  const [items, setItems] = useState<GalleryDisplayItem[]>(SEED_GALLERY);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [isFallback, setIsFallback] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase
      .from('gallery_items')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data && data.length) {
          setItems(data as GalleryItem[]);
          setIsFallback(false);
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { items, loading, isFallback };
}
