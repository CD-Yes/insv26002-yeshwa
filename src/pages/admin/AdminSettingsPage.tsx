import { useEffect, useState } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { supabase } from '@/lib/supabaseClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { AdminButton } from '@/components/admin/AdminButton';
import { LoadingState } from '@/components/common/LoadingState';
import type { SiteSettingRow } from '@/lib/types';

interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
  group: string;
  textarea?: boolean;
}

const FIELDS: FieldDef[] = [
  { key: 'phone', label: 'Phone number', group: 'Contact', placeholder: '+1 000 000 0000' },
  { key: 'phone_raw', label: 'Phone (digits only, for tel: links)', group: 'Contact', placeholder: '+10000000000' },
  { key: 'whatsapp', label: 'WhatsApp number (digits)', group: 'Contact', placeholder: '10000000000' },
  { key: 'email', label: 'Email', group: 'Contact', placeholder: 'hello@yeshwa.studio' },
  { key: 'address', label: 'Address', group: 'Contact', textarea: true },
  { key: 'business_hours', label: 'Business hours', group: 'Contact', placeholder: 'Open 7 days · 10am–8pm' },
  { key: 'google_maps_embed_url', label: 'Google Maps embed URL', group: 'Google', textarea: true },
  { key: 'google_reviews_url', label: 'Google Reviews link', group: 'Google' },
  { key: 'social_linkedin', label: 'LinkedIn URL', group: 'Social' },
  { key: 'social_instagram', label: 'Instagram URL', group: 'Social' },
  { key: 'social_facebook', label: 'Facebook URL', group: 'Social' },
];

export function AdminSettingsPage() {
  useSeo({ title: 'Settings · Admin', noindex: true });
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(Boolean(supabase));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_settings').select('key,value').then(({ data }) => {
      const v: Record<string, string> = {};
      (data as Pick<SiteSettingRow, 'key' | 'value'>[] | null)?.forEach((r) => { v[r.key] = r.value ?? ''; });
      setValues(v);
      setLoading(false);
    });
  }, []);

  async function save() {
    if (!supabase) return;
    setSaving(true);
    const rows = FIELDS.map((f) => ({ key: f.key, value: values[f.key] ?? '' }));
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    setSaving(false);
    setToast(error ? error.message : 'Settings saved.');
    setTimeout(() => setToast(null), 2400);
  }

  const groups = Array.from(new Set(FIELDS.map((f) => f.group)));

  if (loading) return <LoadingState minHeight="60vh" label="Loading settings…" />;

  return (
    <div>
      <AdminTopbar title="Site settings" actions={<AdminButton onClick={save} disabled={saving} icon="✓" label={saving ? 'Saving…' : 'Save changes'} alwaysLabel />} />

      <div style={{ padding: '30px 32px', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {!supabase && <p style={{ color: '#C26E38' }}>Supabase is not configured — settings cannot be saved.</p>}
        {groups.map((group) => (
          <div key={group} style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 20, margin: '0 0 18px', color: COLORS.ink }}>{group}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {FIELDS.filter((f) => f.group === group).map((f) => (
                <label key={f.key} style={{ display: 'block' }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: COLORS.slate, marginBottom: 7 }}>{f.label}</span>
                  {f.textarea ? (
                    <textarea className="ya-field" rows={2} placeholder={f.placeholder} value={values[f.key] ?? ''} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />
                  ) : (
                    <input className="ya-field" placeholder={f.placeholder} value={values[f.key] ?? ''} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {toast && <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 80, background: COLORS.ink, color: COLORS.cream, fontSize: 14, fontWeight: 600, padding: '14px 24px', borderRadius: 999 }}>{toast}</div>}
    </div>
  );
}
