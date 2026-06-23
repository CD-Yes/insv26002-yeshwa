import { useState, type CSSProperties } from 'react';

interface SmoothImageProps {
  src?: string | null;
  alt: string;
  /** Background placeholder (diagonal stripe) shown when no src / while loading. */
  placeholder?: string;
  /** Optional caption text rendered centered over the placeholder. */
  placeholderLabel?: string;
  className?: string;
  style?: CSSProperties;
  /** Hero images should load eagerly; everything else lazy. */
  eager?: boolean;
  imgStyle?: CSSProperties;
}

/**
 * Image with a graceful placeholder + fade-in. When `src` is absent it renders
 * the original diagonal-stripe placeholder slot (preserving the export look),
 * which is exactly what the seed data uses until real photos are uploaded.
 */
export function SmoothImage({
  src,
  alt,
  placeholder = 'repeating-linear-gradient(135deg,#E6DAC6 0 1px,#EFE5D5 1px 15px)',
  placeholderLabel,
  className,
  style,
  eager = false,
  imgStyle,
}: SmoothImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: placeholder,
        ...style,
      }}
    >
      {!src && placeholderLabel && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: 'rgba(45,70,84,0.42)' }}>
            {placeholderLabel}
          </span>
        </div>
      )}
      {src && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
            ...imgStyle,
          }}
        />
      )}
    </div>
  );
}
