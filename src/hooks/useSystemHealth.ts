import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface HealthCheck {
  key: string;
  label: string;
  status: 'ok' | 'warn' | 'down' | 'unknown';
  detail: string;
}

export interface SystemHealth {
  checks: HealthCheck[];
  loading: boolean;
  version: string;
  builtAt: string | null;
}

interface BuildInfo {
  version?: string;
  builtAt?: string;
  commit?: string;
}

/**
 * Aggregates connected-system health for the admin:
 *  - Supabase connectivity + env presence
 *  - R2 upload endpoint reachability (HEAD the function)
 *  - latest enquiry / latest media timestamps
 *  - published page count
 *  - build/deploy version from /build-info.json
 * Secrets are never read here — only presence/last-success signals.
 */
export function useSystemHealth(): SystemHealth {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState('dev');
  const [builtAt, setBuiltAt] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const next: HealthCheck[] = [];

      // Build info
      try {
        const res = await fetch('/build-info.json', { cache: 'no-store' });
        if (res.ok) {
          const info = (await res.json()) as BuildInfo;
          if (active) {
            setVersion(info.version ?? 'unknown');
            setBuiltAt(info.builtAt ?? null);
          }
          next.push({ key: 'build', label: 'Build / deploy version', status: 'ok', detail: `${info.version ?? 'unknown'}${info.commit ? ` · ${info.commit}` : ''}` });
        } else {
          next.push({ key: 'build', label: 'Build / deploy version', status: 'unknown', detail: 'build-info.json not found' });
        }
      } catch {
        next.push({ key: 'build', label: 'Build / deploy version', status: 'unknown', detail: 'No build info available' });
      }

      // Env presence (no secret values revealed)
      next.push({
        key: 'env',
        label: 'Environment variables',
        status: isSupabaseConfigured ? 'ok' : 'warn',
        detail: isSupabaseConfigured ? 'Supabase URL + anon key present' : 'Supabase env not set',
      });

      // Supabase connectivity + page count
      if (supabase) {
        const { error, count } = await supabase
          .from('pages')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', true);
        next.push({
          key: 'supabase',
          label: 'Supabase connection',
          status: error ? 'down' : 'ok',
          detail: error ? error.message : 'Connected',
        });
        next.push({
          key: 'pages',
          label: 'Published pages',
          status: 'ok',
          detail: `${count ?? 0} live`,
        });

        // Latest enquiry
        const { data: enq } = await supabase.from('enquiries').select('created_at').order('created_at', { ascending: false }).limit(1);
        next.push({
          key: 'enquiry',
          label: 'Last enquiry submission',
          status: enq && enq.length ? 'ok' : 'warn',
          detail: enq && enq.length ? new Date(enq[0].created_at as string).toLocaleString() : 'No enquiries yet',
        });

        // Latest media
        const { data: media } = await supabase.from('media_assets').select('created_at').order('created_at', { ascending: false }).limit(1);
        next.push({
          key: 'media',
          label: 'Latest media upload',
          status: media && media.length ? 'ok' : 'warn',
          detail: media && media.length ? new Date(media[0].created_at as string).toLocaleString() : 'No uploads yet',
        });
      } else {
        next.push({ key: 'supabase', label: 'Supabase connection', status: 'down', detail: 'Not configured' });
      }

      // R2 upload endpoint reachability
      try {
        const res = await fetch('/api/system-health', { cache: 'no-store' });
        if (res.ok) {
          const info = await res.json().catch(() => ({}));
          next.push({ key: 'r2', label: 'R2 upload endpoint', status: info.r2 ? 'ok' : 'warn', detail: info.r2 ? 'Configured' : 'Function up, R2 env missing' });
        } else {
          next.push({ key: 'r2', label: 'R2 upload endpoint', status: 'warn', detail: 'Health function not deployed' });
        }
      } catch {
        next.push({ key: 'r2', label: 'R2 upload endpoint', status: 'unknown', detail: 'Endpoint unreachable (local dev)' });
      }

      if (active) {
        setChecks(next);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { checks, loading, version, builtAt };
}
