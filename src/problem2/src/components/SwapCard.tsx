import React, { useState } from 'react';
import {
  ArrowDownUp,
  Settings2,
  ChevronDown,
  Info,
  Zap,
  ArrowRightLeft
} from 'lucide-react';
import { Token, SlippageConfig, ActiveField } from '../types/token';
import { TokenInput } from './TokenInput';
import { SlippageSettings } from './SlippageSettings';
import { formatNumber, sanitizeNumericInput, formatUSD } from '../utils/formatters';
import { ESTIMATED_GAS_FEE_USD, SWAP_FEE_PERCENTAGE } from '../constants/tokens';

interface SwapCardProps {
  tokens: Token[];
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  onFromAmountChange: (val: string) => void;
  onToAmountChange: (val: string) => void;
  onSelectFromToken: (token: Token) => void;
  onSelectToToken: (token: Token) => void;
  onFlipTokens: () => void;
  onOpenSelectModal: (field: ActiveField) => void;
  slippageConfig: SlippageConfig;
  onSlippageChange: (config: SlippageConfig) => void;
  onInitiateSwap: () => void;
  isSubmitting: boolean;
}

export const SwapCard: React.FC<SwapCardProps> = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  onFromAmountChange,
  onToAmountChange,
  onFlipTokens,
  onOpenSelectModal,
  slippageConfig,
  onSlippageChange,
  onInitiateSwap,
  isSubmitting
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isRateInverted, setIsRateInverted] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Parse numeric values
  const numFromAmount = parseFloat(fromAmount) || 0;
  const numToAmount = parseFloat(toAmount) || 0;

  // Insufficient balance check
  const hasInsufficientBalance = Boolean(
    fromToken && numFromAmount > fromToken.balance
  );

  // Exchange rate calculation
  const exchangeRate = fromToken && toToken && toToken.price > 0
    ? fromToken.price / toToken.price
    : 0;

  const invertedRate = exchangeRate > 0 ? 1 / exchangeRate : 0;

  // Minimum received with slippage
  const minimumReceived = numToAmount > 0
    ? numToAmount * (1 - slippageConfig.value / 100)
    : 0;

  // Button state logic
  const getButtonState = () => {
    if (!fromToken || !toToken) {
      return { disabled: true, text: 'Select a token' };
    }
    if (fromToken.symbol === toToken.symbol) {
      return { disabled: true, text: 'Tokens must be different' };
    }
    if (!numFromAmount || numFromAmount <= 0) {
      return { disabled: true, text: 'Enter an amount' };
    }
    if (hasInsufficientBalance) {
      return { disabled: true, text: `Insufficient ${fromToken.symbol} balance` };
    }
    if (isSubmitting) {
      return { disabled: true, text: 'Processing Swap...' };
    }
    return {
      disabled: false,
      text: `Swap ${fromToken.symbol} for ${toToken.symbol}`
    };
  };

  const buttonState = getButtonState();

  const handleFlip = () => {
    setIsRotating(true);
    onFlipTokens();
    setTimeout(() => setIsRotating(false), 350);
  };

  return (
    <div className="swap-card-container">
      {/* Card Header */}
      <div className="swap-card-header">
        <div className="swap-title-group">
          <h2 className="swap-main-title">Swap</h2>
          <span className="swap-tagline">Trade tokens at optimal rates</span>
        </div>

        <div className="swap-header-actions">
          <button
            type="button"
            className={`settings-toggle-btn ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings((prev) => !prev)}
            aria-label="Swap Settings"
            title="Transaction Settings"
          >
            <Settings2 size={18} />
          </button>
        </div>
      </div>

      {/* Slippage Settings Drawer */}
      <SlippageSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        config={slippageConfig}
        onChangeConfig={onSlippageChange}
      />

      {/* From Token Box */}
      <div className="swap-input-section">
        <TokenInput
          label="Amount to send"
          amount={fromAmount}
          onAmountChange={(val) => onFromAmountChange(sanitizeNumericInput(val))}
          token={fromToken}
          onOpenSelectModal={() => onOpenSelectModal('from')}
          showPercentages={true}
          hasInsufficientBalance={hasInsufficientBalance}
          disabled={isSubmitting}
        />

        {/* Flip Direction Button */}
        <div className="swap-divider-wrapper">
          <div className="divider-line" />
          <button
            type="button"
            className={`swap-flip-btn ${isRotating ? 'rotating' : ''}`}
            onClick={handleFlip}
            aria-label="Switch swap direction"
            title="Switch swap direction"
            disabled={isSubmitting}
          >
            <ArrowDownUp size={18} />
          </button>
          <div className="divider-line" />
        </div>

        {/* To Token Box */}
        <TokenInput
          label="Amount to receive"
          amount={toAmount}
          onAmountChange={(val) => onToAmountChange(sanitizeNumericInput(val))}
          token={toToken}
          onOpenSelectModal={() => onOpenSelectModal('to')}
          showPercentages={false}
          disabled={isSubmitting}
        />
      </div>

      {/* Exchange Rate Bar */}
      {fromToken && toToken && exchangeRate > 0 && (
        <div className="rate-bar-container">
          <div className="rate-info-left">
            <Zap size={14} className="rate-zap-icon" />
            <span className="rate-text">
              {isRateInverted ? (
                <>1 {toToken.symbol} ≈ {formatNumber(invertedRate, 6)} {fromToken.symbol}</>
              ) : (
                <>1 {fromToken.symbol} ≈ {formatNumber(exchangeRate, 6)} {toToken.symbol}</>
              )}
            </span>
          </div>

          <button
            type="button"
            className="rate-invert-btn"
            onClick={() => setIsRateInverted((prev) => !prev)}
            title="Invert rate comparison"
          >
            <ArrowRightLeft size={13} />
            <span>({formatUSD(isRateInverted ? toToken.price : fromToken.price)})</span>
          </button>
        </div>
      )}

      {/* Route & Fee Breakdown Accordion */}
      {fromToken && toToken && numFromAmount > 0 && (
        <div className="details-accordion">
          <button
            type="button"
            className="details-toggle-row"
            onClick={() => setShowDetails((prev) => !prev)}
          >
            <div className="details-toggle-left">
              <Info size={14} />
              <span>Slippage & Network details</span>
            </div>
            <div className="details-toggle-right">
              <span className="details-preview-gas">Gas ~{formatUSD(ESTIMATED_GAS_FEE_USD)}</span>
              <ChevronDown size={16} className={`details-chevron ${showDetails ? 'expanded' : ''}`} />
            </div>
          </button>

          {showDetails && (
            <div className="details-content-body">
              <div className="details-item-row">
                <span className="details-item-label">Slippage Tolerance</span>
                <span className="details-item-val">{slippageConfig.value}%</span>
              </div>
              <div className="details-item-row">
                <span className="details-item-label">Minimum Received</span>
                <span className="details-item-val">
                  {formatNumber(minimumReceived, 6)} {toToken.symbol}
                </span>
              </div>
              <div className="details-item-row">
                <span className="details-item-label">Liquidity Provider Fee</span>
                <span className="details-item-val">
                  {SWAP_FEE_PERCENTAGE}% (~{formatUSD(numFromAmount * fromToken.price * (SWAP_FEE_PERCENTAGE / 100))})
                </span>
              </div>
              <div className="details-item-row">
                <span className="details-item-label">Network Estimated Gas</span>
                <span className="details-item-val">{formatUSD(ESTIMATED_GAS_FEE_USD)}</span>
              </div>
              <div className="details-item-row">
                <span className="details-item-label">Order Routing</span>
                <span className="details-item-val route-highlight">Uniswap v3 + Curve</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Primary Swap Button */}
      <button
        type="button"
        id="confirm-swap-btn"
        className={`btn-primary swap-action-btn ${buttonState.disabled ? 'btn-disabled' : 'btn-glow'}`}
        disabled={buttonState.disabled}
        onClick={onInitiateSwap}
      >
        <span>{buttonState.text}</span>
      </button>
    </div>
  );
};
