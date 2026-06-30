import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SITE_DEFAULTS, type SiteSettings } from '@/data/siteConfig';
import type { SiteSettingRow } from '@/lib/types';

/**
 * Merges the `site_settings` key/value rows over the static defaults.
 * Anything not yet set in the DB keeps its default, so the site always renders.
 */
export function useSiteSettings(): { settings: SiteSettings; loading: boolean } {
  const [settings, setSettings] = useState<SiteSettings>(SITE_DEFAULTS);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase
      .from('site_settings')
      .select('key,value')
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data && data.length) {
          const overrides: Record<string, string> = {};
          (data as Pick<SiteSettingRow, 'key' | 'value'>[]).forEach((r) => {
            if (r.value != null) overrides[r.key] = r.value;
          });
          setSettings(mergeSettings(SITE_DEFAULTS, overrides));
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { settings, loading };
}

/** Flat key/value overrides → structured SiteSettings. */
function mergeSettings(base: SiteSettings, o: Record<string, string>): SiteSettings {
  return {
    ...base,
    email: o.email ?? base.email,
    phone: o.phone ?? base.phone,
    phoneRaw: o.phone_raw ?? o.phone?.replace(/[^\d+]/g, '') ?? base.phoneRaw,
    whatsapp: o.whatsapp ?? base.whatsapp,
    address: o.address ?? base.address,
    hours: o.business_hours ?? base.hours,
    googleMapsEmbedUrl: o.google_maps_embed_url ?? base.googleMapsEmbedUrl,
    googleReviewsUrl: o.google_reviews_url ?? base.googleReviewsUrl,
    social: {
      // linkedin: o.social_linkedin ?? base.social.linkedin,
      instagram: o.social_instagram ?? base.social.instagram,
      facebook: o.social_facebook ?? base.social.facebook,
    },
  };
}
