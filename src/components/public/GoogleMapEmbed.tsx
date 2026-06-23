import type { CSSProperties } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface GoogleMapEmbedProps {
  height?: number | string;
  grayscale?: number;
  style?: CSSProperties;
  title?: string;
}

/** Google Map iframe driven by the `google_maps_embed_url` site setting. */
export function GoogleMapEmbed({
  height = 240,
  grayscale = 0,
  style,
  title = 'Yeshwa studio location',
}: GoogleMapEmbedProps) {
  const { settings } = useSiteSettings();
  return (
    <div
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid rgba(45,70,84,0.12)',
        height,
        background: '#e8e0d2',
        ...style,
      }}
    >
      <iframe
        title={title}
        src={settings.googleMapsEmbedUrl}
        style={{ width: '100%', height: '100%', border: 0, filter: grayscale ? `grayscale(${grayscale})` : undefined }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
