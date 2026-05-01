import React from 'react';

interface SimulateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
}

export const SimulateButton: React.FC<SimulateButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  label = 'Simulate Next Event',
}) => {
  return (
    <button
      className={`simulate-btn${loading ? ' simulate-btn--loading' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <span className="simulate-btn__spinner" aria-hidden="true" />
          Processing…
        </>
      ) : (
        <>
          <span className="simulate-btn__icon" aria-hidden="true">▶</span>
          {label}
        </>
      )}
    </button>
  );
};
