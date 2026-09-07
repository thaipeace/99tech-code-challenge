import React, { useState } from 'react';

interface TokenIconProps {
  symbol: string;
  iconUrl?: string;
  size?: number;
  className?: string;
}

export const TokenIcon: React.FC<TokenIconProps> = ({
  symbol,
  iconUrl,
  size = 32,
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  // Generate a deterministic gradient based on symbol
  const getGradientColor = (sym: string) => {
    let hash = 0;
    for (let i = 0; i < sym.length; i++) {
      hash = sym.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h1 = Math.abs(hash % 360);
    const h2 = (h1 + 60) % 360;
    return `linear-gradient(135deg, hsl(${h1}, 75%, 55%), hsl(${h2}, 85%, 45%))`;
  };

  if (!iconUrl || hasError) {
    return (
      <div
        className={`token-fallback-avatar ${className}`}
        style={{
          width: size,
          height: size,
          background: getGradientColor(symbol),
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: Math.max(10, Math.floor(size * 0.36)),
          fontWeight: 700,
          color: '#ffffff',
          userSelect: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          flexShrink: 0
        }}
        title={symbol}
      >
        {symbol.slice(0, 3).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={symbol}
      width={size}
      height={size}
      className={`token-icon-img ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'contain',
        flexShrink: 0
      }}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};
