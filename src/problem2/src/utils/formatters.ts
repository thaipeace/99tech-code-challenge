export function formatNumber(val: number, maxDecimals = 6): string {
  if (isNaN(val) || val === 0) return '0';
  if (val < 0.000001) return val.toExponential(4);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: val < 1 ? 2 : 2
  }).format(val);
}

export function formatUSD(val: number): string {
  if (isNaN(val) || val === 0) return '$0.00';
  if (val < 0.01) return '< $0.01';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(val);
}

export function sanitizeNumericInput(val: string): string {
  // Allow only digits and a single decimal dot
  let clean = val.replace(/[^0-9.]/g, '');
  const parts = clean.split('.');
  if (parts.length > 2) {
    clean = parts[0] + '.' + parts.slice(1).join('');
  }
  return clean;
}

export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function truncateAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
