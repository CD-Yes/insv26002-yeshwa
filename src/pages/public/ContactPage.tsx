import { useState } from 'react';
import { COLORS, FONTS, REQUIREMENT_TYPES, BUDGET_RANGES } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { GoogleMapEmbed } from '@/components/public/GoogleMapEmbed';
import { GoogleBusinessLinks } from '@/components/public/GoogleBusinessLinks';
import { submitEnquiry } from '@/lib/enquiry';

const FIELD: React.CSSProperties = {
  width: '100%',
  fontSize: 15,
  padding: '13px 15px',
  borderRadius: 10,
  border: '1px solid rgba(45,70,84,0.18)',
  background: '#FBF7EF',
  color: COLORS.slate,
  outline: 'none',
};
const LABEL: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: COLORS.slate, marginBottom: 8 };

export function ContactPage() {
  useSeo({
    title: 'Contact & Quote',
    description: "Tell us about your project and we'll book a free consultation within one business day.",
    canonicalPath: '/contact',
  });

  const { settings } = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', location: '',
    requirement_type: REQUIREMENT_TYPES[0] as string,
    budget_range: BUDGET_RANGES[0] as string,
    message: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await submitEnquiry({ ...form, source: 'contact-page' });
    setSubmitting(false);
    if (res.ok) setSubmitted(true);
    else setError(res.error ?? 'Something went wrong. Please try again.');
  }

  return (
    <div>
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '80px 40px 40px' }}>
        <div className="y-contact-grid" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 64, alignItems: 'start' }}>
          {/* LEFT */}
          <div>
            <p style={eyebrow}>Get a quote</p>
            <h1 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 50, lineHeight: 1.06, letterSpacing: '-0.015em', margin: '0 0 22px', color: '#22353F' }} className="y-hero-title">
              Let's design your<br />space together.
            </h1>
            <p style={{ fontSize: 16.5, lineHeight: 1.7, color: COLORS.muted, margin: '0 0 40px', maxWidth: 400 }}>
              Tell us a little about your project. Our design team will get back within one business day to book a free consultation.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <ContactRow icon="☎" label="Call us" value={<a href={`tel:${settings.phoneRaw}`} style={valueLink}>{settings.phone}</a>} />
              <ContactRow icon="✉" label="Email" value={<a href={`mailto:${settings.email}`} style={valueLink}>{settings.email}</a>} />
              <ContactRow icon="⌖" label="Studios" value={<span style={{ fontSize: 16, fontWeight: 600, color: '#22353F', lineHeight: 1.5 }}>{settings.studios.slice(0, 3).join(' · ')}<br />{settings.studios.slice(3).join(' · ')}</span>} />
            </div>

            <GoogleMapEmbed height={240} style={{ marginTop: 36 }} />
            <GoogleBusinessLinks />
          </div>

          {/* RIGHT: FORM */}
          <div style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 18, padding: 40, boxShadow: '0 24px 60px -30px rgba(34,53,63,0.25)' }}>
            {submitted ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 20px', minHeight: 480 }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: '50%', background: COLORS.creamPanel, color: COLORS.accent, fontSize: 34, fontFamily: FONTS.serif, marginBottom: 24 }}>✓</span>
                <h2 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 30, margin: '0 0 12px', color: '#22353F' }}>Thank you — we've got it.</h2>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.muted, margin: 0, maxWidth: 340 }}>
                  Our design team will reach out within one business day to schedule your free consultation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 26, margin: '0 0 26px', color: '#22353F' }}>Request your free quote</h2>
                <div className="y-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                  <label style={{ display: 'block' }}><span style={LABEL}>Full name</span><input required type="text" placeholder="Your name" value={form.name} onChange={set('name')} style={FIELD} /></label>
                  <label style={{ display: 'block' }}><span style={LABEL}>Phone</span><input required type="tel" placeholder="Include country code" value={form.phone} onChange={set('phone')} style={FIELD} /></label>
                </div>
                <div className="y-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                  <label style={{ display: 'block' }}><span style={LABEL}>Email</span><input required type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} style={FIELD} /></label>
                  <label style={{ display: 'block' }}><span style={LABEL}>Location</span><input type="text" placeholder="City" value={form.location} onChange={set('location')} style={FIELD} /></label>
                </div>
                <div className="y-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                  <label style={{ display: 'block' }}>
                    <span style={LABEL}>Requirement type</span>
                    <select value={form.requirement_type} onChange={set('requirement_type')} style={FIELD}>
                      {REQUIREMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </label>
                  <label style={{ display: 'block' }}>
                    <span style={LABEL}>Approx. budget</span>
                    <select value={form.budget_range} onChange={set('budget_range')} style={FIELD}>
                      {BUDGET_RANGES.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </label>
                </div>
                <label style={{ display: 'block', marginBottom: 24 }}>
                  <span style={LABEL}>Tell us about your space</span>
                  <textarea rows={4} placeholder="Apartment / house, city, what you're looking for…" value={form.message} onChange={set('message')} style={{ ...FIELD, resize: 'vertical' }} />
                </label>

                {error && <p style={{ color: '#C0392B', fontSize: 13.5, margin: '0 0 14px' }}>{error}</p>}

                <button type="submit" disabled={submitting} className="y-submit" style={{ width: '100%', cursor: submitting ? 'wait' : 'pointer', border: 'none', background: COLORS.accent, color: COLORS.cream, fontSize: 16, fontWeight: 600, padding: 16, borderRadius: 999, transition: 'background .2s', opacity: submitting ? 0.8 : 1 }}>
                  {submitting ? 'Sending…' : 'Send my request →'}
                </button>
                <p style={{ textAlign: 'center', fontSize: 12.5, color: '#9aa6ac', margin: '16px 0 0' }}>
                  We'll never share your details. Free consultation, no obligation.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <div style={{ height: 80 }} />

      <style>{`
        .y-submit:hover:not(:disabled) { background: ${COLORS.accentHover}; }
        @media (max-width: 900px) {
          .y-contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 560px) { .y-form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

const eyebrow: React.CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.accent, margin: '0 0 16px' };
const valueLink: React.CSSProperties = { textDecoration: 'none', fontSize: 16, fontWeight: 600, color: '#22353F' };

function ContactRow({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <span style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 46, height: 46, borderRadius: 12, background: COLORS.creamPanel, color: COLORS.accent, fontSize: 18 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.warm, marginBottom: 4 }}>{label}</div>
        {value}
      </div>
    </div>
  );
}
