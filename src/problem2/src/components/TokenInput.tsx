import React from 'react';
import { ChevronDown, Wallet } from 'lucide-react';
import { Token } from '../types/token';
import { TokenIcon } from './TokenIcon';
import { formatUSD, formatNumber } from '../utils/formatters';

interface TokenInputProps {
  label: string;
  amount: string;
  onAmountChange: (val: string) => void;
  token: Token | null;
  onOpenSelectModal: () => void;
  isReadOnly?: boolean;
  showPercentages?: boolean;
  hasInsufficientBalance?: boolean;
  disabled?: boolean;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  label,
  amount,
  onAmountChange,
  token,
  onOpenSelectModal,
  isReadOnly = false,
  showPercentages = false,
  hasInsufficientBalance = false,
  disabled = false
}) => {
  const numericAmount = parseFloat(amount) || 0;
  const usdValue = token ? numericAmount * token.price : 0;

  const handlePercentageClick = (pct: number) => {
    if (!token || token.balance <= 0) return;
    const computed = (token.balance * pct).toFixed(6);
    // Remove trailing zeros after decimal point
    const cleaned = parseFloat(computed).toString();
    onAmountChange(cleaned);
  };

  return (
    <div className={`token-input-card ${hasInsufficientBalance ? 'input-error-border' : ''}`}>
      {/* Top row: Label & Balance */}
      <div className="token-input-top-row">
        <label className="token-input-label">{label}</label>
        {token && (
          <div className="token-input-balance">
            <Wallet size={14} className="balance-icon" />
            <span>Balance: </span>
            <span className="balance-val" onClick={() => handlePercentageClick(1.0)} title="Click to use MAX">
              {formatNumber(token.balance, 4)} {token.symbol}
            </span>
          </div>
        )}
      </div>

      {/* Middle row: Input and Token Selector */}
      <div className="token-input-main-row">
        <input
          type="text"
          inputMode="decimal"
          pattern="^[0-9]*[.,]?[0-9]*$"
          placeholder="0.0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="token-amount-input"
          disabled={disabled}
          readOnly={isReadOnly}
        />

        <button
          type="button"
          className="token-selector-btn"
          onClick={onOpenSelectModal}
          disabled={disabled}
        >
          {token ? (
            <>
              <TokenIcon symbol={token.symbol} iconUrl={token.iconUrl} size={26} />
              <span className="token-selector-symbol">{token.symbol}</span>
            </>
          ) : (
            <span className="token-selector-placeholder">Select token</span>
          )}
          <ChevronDown size={18} className="selector-chevron" />
        </button>
      </div>

      {/* Bottom row: USD value & quick percentage shortcuts */}
      <div className="token-input-bottom-row">
        <span className="token-usd-estimate">
          {token && numericAmount > 0 ? `≈ ${formatUSD(usdValue)}` : '$0.00'}
        </span>

        {showPercentages && token && token.balance > 0 && (
          <div className="percentage-pills-group">
            <button
              type="button"
              className="pct-pill"
              onClick={() => handlePercentageClick(0.25)}
            >
              25%
            </button>
            <button
              type="button"
              className="pct-pill"
              onClick={() => handlePercentageClick(0.5)}
            >
              50%
            </button>
            <button
              type="button"
              className="pct-pill"
              onClick={() => handlePercentageClick(0.75)}
            >
              75%
            </button>
            <button
              type="button"
              className="pct-pill max-pill"
              onClick={() => handlePercentageClick(1.0)}
            >
              MAX
            </button>
          </div>
        )}
      </div>

      {/* Insufficient balance warning indicator */}
      {hasInsufficientBalance && (
        <div className="input-error-msg">
          Exceeds available balance ({formatNumber(token?.balance ?? 0, 4)} {token?.symbol})
        </div>
      )}
    </div>
  );
};
