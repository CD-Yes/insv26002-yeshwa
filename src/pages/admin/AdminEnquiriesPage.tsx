import { useMemo, useState } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useEnquiries } from '@/hooks/useEnquiries';
import { formatShortDate } from '@/lib/formatDate';
import type { Enquiry, EnquiryStatus } from '@/lib/types';

const STATUS_FILTERS: Array<{ key: 'all' | EnquiryStatus; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'converted', label: 'Converted' },
  { key: 'closed', label: 'Closed' },
];

const AV_COLORS = ['#D9824A', '#5E8B7E', '#2D4654', '#B0633F', '#6E7F9A'];
const avColor = (name: string) => AV_COLORS[name.charCodeAt(0) % AV_COLORS.length];

function toCsv(rows: Enquiry[]): string {
  const head = ['Name', 'Phone', 'Email', 'Location', 'Requirement', 'Budget', 'Status', 'Date', 'Message'];
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map((r) => [r.name, r.phone, r.email, r.location, r.requirement_type, r.budget_range, r.status, r.created_at, r.message].map(esc).join(','));
  return [head.join(','), ...lines].join('\n');
}

export function AdminEnquiriesPage() {
  useSeo({ title: 'Enquiries · Admin', noindex: true });
  const { enquiries, loading, updateStatus } = useEnquiries();
  const [filter, setFilter] = useState<'all' | EnquiryStatus>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Enquiry | null>(null);

  const filtered = useMemo(() => {
    let list = enquiries;
    if (filter !== 'all') list = list.filter((e) => e.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q) || (e.requirement_type ?? '').toLowerCase().includes(q) || (e.email ?? '').toLowerCase().includes(q));
    }
    return list;
  }, [enquiries, filter, search]);

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yeshwa-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const columns: Column<Enquiry>[] = [
    {
      header: 'Client', width: '1.5fr', render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: avColor(r.name), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flex: 'none' }}>{r.name.slice(0, 1).toUpperCase()}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.ink }}>{r.name}</div>
            <div style={{ fontSize: 12, color: COLORS.warm, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.email}</div>
          </div>
        </div>
      ),
    },
    { header: 'Requirement', width: '1.3fr', render: (r) => <span style={{ fontSize: 14, color: COLORS.slate }}>{r.requirement_type ?? '—'}</span> },
    { header: 'Budget', width: '1fr', render: (r) => <span style={{ fontSize: 14, color: COLORS.slate }}>{r.budget_range ?? '—'}</span> },
    { header: 'City', width: '1fr', render: (r) => <span style={{ fontSize: 14, color: COLORS.muted }}>{r.location ?? '—'}</span> },
    { header: 'Date', width: '0.8fr', render: (r) => <span style={{ fontSize: 13, color: COLORS.warm }}>{formatShortDate(r.created_at)}</span> },
    { header: 'Status', width: '1fr', render: (r) => <StatusBadge label={r.status} /> },
  ];

  const total = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === 'new').length;
  const converted = enquiries.filter((e) => e.status === 'converted').length;
  const rate = total ? Math.round((converted / total) * 100) : 0;

  return (
    <div>
      <AdminTopbar
        eyebrow="Insights"
        title="Enquiries"
        actions={
          <>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or project…" style={{ fontSize: 14, padding: '10px 15px', borderRadius: 999, border: '1px solid #D8CDB6', background: '#fff', width: 240, outline: 'none' }} />
            <button onClick={exportCsv} style={{ cursor: 'pointer', border: '1px solid #D8CDB6', background: '#fff', color: COLORS.ink, fontSize: 14, fontWeight: 600, padding: '10px 18px', borderRadius: 999 }}>Export CSV</button>
          </>
        }
      />

      <div style={{ padding: '30px 32px' }}>
        <div className="y-enq-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 26 }}>
          <AdminStatCard label="Total enquiries" value={total} />
          <AdminStatCard label="New" value={newCount} hint="awaiting first contact" hintTone="accent" />
          <AdminStatCard label="In pipeline" value={enquiries.filter((e) => e.status === 'contacted').length} hint="being followed up" />
          <AdminStatCard dark label="Conversion" value={`${rate}%`} hint={`${converted} won`} />
        </div>

        <div style={{ display: 'flex', gap: 9, marginBottom: 18, flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map((f) => {
            const active = f.key === filter;
            return (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{ cursor: 'pointer', fontSize: 13.5, fontWeight: 600, padding: '9px 16px', borderRadius: 999, border: '1px solid #D8CDB6', background: active ? COLORS.ink : '#fff', color: active ? COLORS.cream : COLORS.ink, borderColor: active ? COLORS.ink : '#D8CDB6' }}>{f.label}</button>
            );
          })}
        </div>

        <AdminTable columns={columns} rows={filtered} rowKey={(r) => r.id} onRowClick={setSelected} loading={loading} emptyTitle="No enquiries" emptyDescription="New enquiries from the contact form will appear here." />
      </div>

      {selected && (
        <EnquiryDrawer
          enquiry={selected}
          onClose={() => setSelected(null)}
          onStatus={(s) => { updateStatus(selected.id, s); setSelected({ ...selected, status: s }); }}
        />
      )}

      <style>{`@media (max-width: 1000px){ .y-enq-kpis { grid-template-columns: 1fr 1fr !important; } } @media (max-width:560px){ .y-enq-kpis{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}

function EnquiryDrawer({ enquiry, onClose, onStatus }: { enquiry: Enquiry; onClose: () => void; onStatus: (s: EnquiryStatus) => void }) {
  const statuses: EnquiryStatus[] = ['new', 'contacted', 'converted', 'closed'];
  const waNumber = (enquiry.phone ?? '').replace(/\D/g, '');
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(22,36,43,0.4)', zIndex: 60 }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, maxWidth: '92vw', background: COLORS.cream, zIndex: 70, boxShadow: '-24px 0 60px -30px rgba(0,0,0,0.4)', overflowY: 'auto' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(45,70,84,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.warm }}>Enquiry detail</span>
          <button onClick={onClose} style={{ cursor: 'pointer', border: 'none', background: 'none', fontSize: 22, color: COLORS.warm, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <span style={{ width: 54, height: 54, borderRadius: '50%', background: avColor(enquiry.name), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>{enquiry.name.slice(0, 1).toUpperCase()}</span>
            <div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 24, color: COLORS.ink }}>{enquiry.name}</div>
              <div style={{ fontSize: 13.5, color: COLORS.warm }}>{enquiry.location ?? ''}</div>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 12, padding: 18, marginBottom: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Email" value={enquiry.email} />
            <Field label="Phone" value={enquiry.phone} />
            <Field label="Requirement" value={enquiry.requirement_type} />
            <Field label="Budget" value={enquiry.budget_range} />
          </div>

          {enquiry.message && (
            <div style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 12, padding: 18, marginBottom: 22 }}>
              <div style={fieldLabel}>Their message</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: COLORS.ink, margin: 0 }}>{enquiry.message}</p>
            </div>
          )}

          <div style={fieldLabel}>Update status</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '11px 0 24px' }}>
            {statuses.map((s) => {
              const active = enquiry.status === s;
              return (
                <button key={s} onClick={() => onStatus(s)} style={{ cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 999, border: '1px solid #D8CDB6', textTransform: 'capitalize', background: active ? COLORS.accent : '#fff', color: active ? '#fff' : COLORS.ink, borderColor: active ? COLORS.accent : '#D8CDB6' }}>{s}</button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {enquiry.email && <a href={`mailto:${enquiry.email}`} style={{ flex: 1, textAlign: 'center', textDecoration: 'none', background: COLORS.accent, color: '#fff', fontSize: 14.5, fontWeight: 600, padding: 14, borderRadius: 999 }}>Reply by email →</a>}
            {waNumber && <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" style={{ flex: 'none', textDecoration: 'none', background: '#25D366', color: '#fff', fontSize: 14.5, fontWeight: 600, padding: '14px 18px', borderRadius: 999 }}>WhatsApp</a>}
          </div>
        </div>
      </div>
    </>
  );
}

const fieldLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.warm, marginBottom: 5 };
function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div style={fieldLabel}>{label}</div>
      <div style={{ fontSize: 13.5, color: COLORS.ink, wordBreak: 'break-word' }}>{value || '—'}</div>
    </div>
  );
}
