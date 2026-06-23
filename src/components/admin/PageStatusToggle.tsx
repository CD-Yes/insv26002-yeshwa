interface PageStatusToggleProps {
  on: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
}

/** iOS-style toggle — ported from the admin reference "Page status" control. */
export function PageStatusToggle({ on, onChange, disabled, label }: PageStatusToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!on)}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        width: 54,
        height: 30,
        borderRadius: 999,
        position: 'relative',
        transition: 'background .2s',
        background: on ? '#3FA66A' : '#C4B59C',
        opacity: disabled ? 0.5 : 1,
        flex: 'none',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 27 : 3,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left .2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  );
}
