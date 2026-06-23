import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useAuth } from '@/app/providers/AuthProvider';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export function AdminLoginPage() {
  const { signIn, session, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Already signed in as staff — go to dashboard.
  if (session && isAdmin) {
    navigate('/admin', { replace: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) setError(error);
    else navigate('/admin', { replace: true });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: COLORS.creamAdmin, fontFamily: FONTS.sans, padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 18, padding: 36, boxShadow: '0 30px 60px -34px rgba(22,36,43,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 26 }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: COLORS.accent, color: COLORS.ink, fontFamily: FONTS.serif, fontWeight: 500, fontSize: 26, lineHeight: 1, paddingBottom: 3 }}>Y</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.14em', color: COLORS.ink }}>YESHWA</div>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', color: COLORS.warm }}>CONTENT STUDIO</div>
          </div>
        </div>

        <h1 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 26, margin: '0 0 6px', color: COLORS.ink }}>Sign in</h1>
        <p style={{ fontSize: 14, color: COLORS.muted, margin: '0 0 24px' }}>Admin & editors only.</p>

        {!isSupabaseConfigured && (
          <p style={{ fontSize: 13, color: '#C26E38', background: 'rgba(229,145,90,0.12)', padding: '10px 12px', borderRadius: 9, margin: '0 0 18px' }}>
            Supabase is not configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable login.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={lbl}>Email</span>
            <input className="ya-field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yeshwa.studio" />
          </label>
          <label style={{ display: 'block', marginBottom: 22 }}>
            <span style={lbl}>Password</span>
            <input className="ya-field" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>

          {error && <p style={{ color: '#C0392B', fontSize: 13.5, margin: '0 0 14px' }}>{error}</p>}

          <button type="submit" disabled={busy} style={{ width: '100%', cursor: busy ? 'wait' : 'pointer', border: 'none', background: COLORS.accent, color: '#fff', fontSize: 15, fontWeight: 600, padding: 14, borderRadius: 999 }}>
            {busy ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: 18, fontSize: 13.5, color: COLORS.muted, textDecoration: 'none' }}>← Back to website</a>
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: COLORS.slate, marginBottom: 7 };
