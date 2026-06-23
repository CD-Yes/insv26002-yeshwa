/**
 * Minimal, dependency-free SEO/document-head manager.
 * Each page calls `useSeo({...})`; it sets title + meta tags imperatively and
 * restores nothing (the next page overwrites). Cheap and SSR-free.
 */
import { useEffect } from 'react';
import { SITE_DEFAULTS, BRAND } from '@/data/siteConfig';

export interface SeoInput {
  title: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  /** Optional JSON-LD structured data object. */
  jsonLd?: Record<string, unknown>;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSON_LD_ID = 'y-jsonld';

export function applySeo(input: SeoInput) {
  const title = input.title.includes(BRAND.name)
    ? input.title
    : `${input.title} · ${BRAND.fullName}`;
  document.title = title;

  const description = input.description ?? '';
  const url = `${SITE_DEFAULTS.siteUrl}${input.canonicalPath ?? ''}`;
  const image = input.image ?? `${SITE_DEFAULTS.siteUrl}/uploads/Yeshwa-logo.jpeg`;

  upsertMeta('name', 'description', description);
  upsertMeta('name', 'robots', input.noindex ? 'noindex,nofollow' : 'index,follow');
  upsertLink('canonical', url);

  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:type', input.type ?? 'website');
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:site_name', BRAND.fullName);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', image);

  // JSON-LD structured data.
  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
  if (input.jsonLd) {
    if (!script) {
      script = document.createElement('script');
      script.id = JSON_LD_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(input.jsonLd);
  } else if (script) {
    script.remove();
  }
}

export function useSeo(input: SeoInput) {
  useEffect(() => {
    applySeo(input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.title, input.description, input.canonicalPath, input.image, input.type, input.noindex]);
}

/** Organization JSON-LD used on the home page. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND.fullName,
    url: SITE_DEFAULTS.siteUrl,
    email: SITE_DEFAULTS.email,
    logo: `${SITE_DEFAULTS.siteUrl}/uploads/Yeshwa-logo.jpeg`,
    sameAs: Object.values(SITE_DEFAULTS.social).filter((s) => s && s !== '#'),
  };
}
