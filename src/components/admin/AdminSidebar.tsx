import { NavLink, useNavigate } from 'react-router-dom';
import { ADMIN_NAV } from '@/data/navigation';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useAuth } from '@/app/providers/AuthProvider';

interface AdminSidebarProps {
  newEnquiries?: number;
}

/** Admin sidebar — ported from YeshwaAdminSidebar.dc.html, wired to real routes. */
export function AdminSidebar({ newEnquiries = 0 }: AdminSidebarProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const groups: Array<'Website' | 'Insights' | 'Settings'> = ['Website', 'Insights', 'Settings'];

  return (
    <aside
      className="y-admin-sidebar"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 264,
        background: COLORS.ink,
        color: '#C9D2D6',
        fontFamily: FONTS.sans,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ padding: '24px 22px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 9, background: COLORS.accent, color: COLORS.ink, fontFamily: FONTS.serif, fontWeight: 500, fontSize: 24, lineHeight: 1, paddingBottom: 3 }}>Y</span>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.14em', color: COLORS.cream }}>YESHWA</div>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', color: '#7E8C93', marginTop: 2 }}>CONTENT STUDIO</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '18px 14px' }}>
        {groups.map((group) => (
          <div key={group}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.muted, margin: '14px 12px 10px' }}>{group}</p>
            {ADMIN_NAV.filter((i) => i.group === group).map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.to === '/admin'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 13px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontSize: 14.5,
                  fontWeight: 500,
                  marginBottom: 3,
                  color: isActive ? COLORS.cream : '#9DB0B8',
                  background: isActive ? 'rgba(217,130,74,0.16)' : 'transparent',
                  boxShadow: isActive ? 'inset 3px 0 0 #D9824A' : 'none',
                })}
              >
                <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
                {item.badgeKey === 'newEnquiries' && newEnquiries > 0 && (
                  <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, background: COLORS.accent, color: COLORS.ink, borderRadius: 999, padding: '2px 8px' }}>{newEnquiries}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 11, borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600, color: COLORS.ink, background: COLORS.accentLight, marginBottom: 12 }}>↗ View live site</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 4px 2px' }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: COLORS.slate, color: COLORS.cream, fontSize: 13, fontWeight: 700 }}>
            {(profile?.full_name || profile?.email || 'A').slice(0, 2).toUpperCase()}
          </span>
          <div style={{ lineHeight: 1.2, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.cream, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.full_name || profile?.email || 'Admin'}</div>
            <div style={{ fontSize: 11, color: '#7E8C93', textTransform: 'capitalize' }}>{profile?.role ?? 'admin'}</div>
          </div>
          <button
            onClick={async () => { await signOut(); navigate('/admin/login'); }}
            title="Sign out"
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#7E8C93', cursor: 'pointer', fontSize: 16 }}
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
