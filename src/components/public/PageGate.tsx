import type { ReactNode } from 'react';
import { usePublicPages } from '@/hooks/usePublicPages';
import { PageDisabled } from '@/pages/public/PageDisabled';

interface PageGateProps {
  slug: string;
  children: ReactNode;
}

/**
 * Gates a public page behind its `pages.is_published` flag.
 * If the page is toggled off in admin, visitors see a clean unavailable screen.
 * NOTE: admin routes never use this gate — admins always have access.
 */
export function PageGate({ slug, children }: PageGateProps) {
  const { isPageLive, loading } = usePublicPages();

  // While loading, render the page optimistically (avoids a flash of the
  // disabled screen). The DB result settles within one tick.
  if (!loading && !isPageLive(slug)) {
    return <PageDisabled />;
  }
  return <>{children}</>;
}
