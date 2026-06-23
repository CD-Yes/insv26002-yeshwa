import type { ReactNode } from 'react';
import { COLORS } from '@/data/siteConfig';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';

export interface Column<T> {
  header: string;
  /** Grid track width, e.g. '1.4fr' or '120px'. */
  width: string;
  render: (row: T) => ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

/** Generic admin data table — ported styling from Yeshwa-Enquiries.dc.html. */
export function AdminTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  loading,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
}: AdminTableProps<T>) {
  const template = columns.map((c) => c.width).join(' ');

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 720 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: template,
              gap: 16,
              padding: '15px 24px',
              background: '#FBF7EF',
              borderBottom: '1px solid rgba(45,70,84,0.1)',
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: COLORS.warm,
            }}
          >
            {columns.map((c) => (
              <span key={c.header}>{c.header}</span>
            ))}
          </div>

          {loading ? (
            <LoadingState minHeight={180} />
          ) : rows.length === 0 ? (
            <EmptyState title={emptyTitle} description={emptyDescription} minHeight={180} />
          ) : (
            rows.map((row) => (
              <div
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'y-admin-row' : undefined}
                style={{
                  display: 'grid',
                  gridTemplateColumns: template,
                  gap: 16,
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(45,70,84,0.07)',
                  cursor: onRowClick ? 'pointer' : 'default',
                  alignItems: 'center',
                  transition: 'background .15s',
                }}
              >
                {columns.map((c) => (
                  <div key={c.header} style={{ minWidth: 0 }}>{c.render(row)}</div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`.y-admin-row:hover { background: #FBF7EF; }`}</style>
    </div>
  );
}
