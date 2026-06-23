import { useSiteSettings } from '@/hooks/useSiteSettings';

interface WhatsAppButtonProps {
  /** Prefilled message. */
  message?: string;
}

/**
 * Floating WhatsApp CTA with a prefilled message (Phase 7).
 * Hidden when no WhatsApp number is configured.
 */
export function WhatsAppButton({
  message = "Hi Yeshwa! I'd like to know more about your modular furniture.",
}: WhatsAppButtonProps) {
  const { settings } = useSiteSettings();
  const number = settings.whatsapp?.replace(/\D/g, '');
  if (!number) return null;

  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="y-wa"
      style={{
        position: 'fixed',
        right: 22,
        bottom: 22,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#25D366',
        boxShadow: '0 10px 30px -8px rgba(37,211,102,0.6)',
        textDecoration: 'none',
        transition: 'transform .2s ease',
      }}
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="#fff" aria-hidden>
        <path d="M16.04 4C9.94 4 5 8.94 5 15.04c0 2.13.6 4.12 1.64 5.82L5 28l7.32-1.6a11 11 0 0 0 3.72.66h.01c6.1 0 11.04-4.94 11.04-11.04C27.09 8.94 22.15 4 16.04 4Zm0 20.2c-1.18 0-2.34-.32-3.34-.92l-.24-.14-4.34.95.93-4.23-.16-.26a9.13 9.13 0 0 1-1.4-4.86c0-5.05 4.11-9.16 9.18-9.16 2.45 0 4.75.96 6.48 2.69a9.1 9.1 0 0 1 2.68 6.48c0 5.06-4.12 9.17-9.17 9.17Zm5.03-6.86c-.27-.14-1.63-.8-1.88-.9-.25-.09-.44-.14-.62.14-.18.27-.71.9-.87 1.08-.16.18-.32.2-.59.07-.27-.14-1.16-.43-2.2-1.36-.81-.72-1.36-1.62-1.52-1.89-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.99 2.67 1.12 2.85.14.18 1.94 2.96 4.7 4.15.66.28 1.17.45 1.57.58.66.21 1.26.18 1.74.11.53-.08 1.63-.67 1.86-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.18-.52-.32Z" />
      </svg>
      <style>{`.y-wa:hover{ transform: scale(1.08); } @media (prefers-reduced-motion: reduce){ .y-wa{ transition:none } }`}</style>
    </a>
  );
}
