import type { ReactNode } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useAdminShell } from '@/layouts/AdminLayout';

interface AdminTopbarProps {
  title: string;
  /** Optional small line above the title (e.g. a back link). Omit for a clean header. */
  eyebrow?: ReactNode;
  actions?: ReactNode;
}

/** Sticky admin page header with a mobile hamburger that opens the sidebar drawer. */
export function AdminTopbar({ title, eyebrow, actions }: AdminTopbarProps) {
  const { openSidebar } = useAdminShell();

  return (
    <div
      className="y-fade-in"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: 'clamp(14px, 3vw, 18px) clamp(16px, 4vw, 32px)',
        background: 'rgba(241,234,220,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(45,70,84,0.1)',
        flexWrap: 'wrap',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <button
          type="button"
          className="y-admin-burger"
          onClick={openSidebar}
          aria-label="Open menu"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: 4,
            background: '#fff',
            border: '1px solid rgba(45,70,84,0.15)',
            borderRadius: 10,
            padding: '9px 10px',
            cursor: 'pointer',
            flex: 'none',
          }}
        >
          <span style={burgerBar} />
          <span style={burgerBar} />
          <span style={burgerBar} />
        </button>
        <div style={{ minWidth: 0 }}>
          {eyebrow && <div style={{ fontSize: 12.5, color: COLORS.accent, fontWeight: 600, letterSpacing: '0.02em', marginBottom: 2 }}>{eyebrow}</div>}
          <h1 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 'clamp(21px, 4vw, 26px)', margin: 0, color: COLORS.ink, overflowWrap: 'anywhere', lineHeight: 1.1 }}>{title}</h1>
        </div>
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', minWidth: 0 }}>{actions}</div>}

      <style>{`
        @media (max-width: 900px) { .y-admin-burger { display: flex !important; } }
      `}</style>
    </div>
  );
}

const burgerBar: React.CSSProperties = { width: 18, height: 2, background: COLORS.slate, borderRadius: 2 };
