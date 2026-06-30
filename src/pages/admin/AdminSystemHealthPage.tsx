import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SystemHealthCard } from '@/components/admin/SystemHealthCard';
import { LoadingState } from '@/components/common/LoadingState';
import { useSystemHealth } from '@/hooks/useSystemHealth';

export function AdminSystemHealthPage() {
  useSeo({ title: 'System health · Admin', noindex: true });
  const { checks, loading, version, builtAt } = useSystemHealth();

  return (
    <div>
      <AdminTopbar title="System health" />
      <div style={{ padding: '30px 32px', maxWidth: 760 }}>
        <div style={{ background: COLORS.ink, color: COLORS.cream, borderRadius: 16, padding: 24, marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12.5, color: COLORS.onDarkMuted }}>Build / deploy version</div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 30, marginTop: 4 }}>{version}</div>
          </div>
          {builtAt && <div style={{ fontSize: 13, color: COLORS.onDarkMuted }}>Built {new Date(builtAt).toLocaleString()}</div>}
        </div>

        {loading ? (
          <LoadingState minHeight={200} label="Running checks…" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {checks.map((c) => <SystemHealthCard key={c.key} check={c} />)}
          </div>
        )}

        <p style={{ fontSize: 12.5, color: COLORS.warm, marginTop: 18 }}>
          Secrets are never displayed — only presence and last-success signals.
        </p>
      </div>
    </div>
  );
}
