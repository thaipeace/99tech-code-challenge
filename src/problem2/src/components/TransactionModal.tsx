import React, { useEffect } from 'react';
import { CheckCircle2, ExternalLink, Loader2, X, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TxStep, SwapReceipt } from '../types/token';
import { TokenIcon } from './TokenIcon';
import { formatUSD, truncateAddress } from '../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  step: TxStep;
  receipt: SwapReceipt | null;
  onClose: () => void;
  onDone: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  step,
  receipt,
  onClose,
  onDone
}) => {
  useEffect(() => {
    if (step === 'success') {
      // Trigger festive confetti
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981']
      });
    }
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={step === 'success' ? onClose : undefined}>
      <div
        className="modal-card tx-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {step === 'success' ? 'Swap Completed' : 'Swapping Assets'}
          </h3>
          {step === 'success' && (
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content based on transaction step */}
        {step !== 'success' ? (
          <div className="tx-status-body">
            <div className="tx-spinner-wrapper">
              <div className="pulse-glow-ring" />
              <Loader2 size={54} className="tx-loading-spinner" />
            </div>

            <div className="tx-status-text-group">
              <h4 className="tx-status-title">
                {step === 'preparing' && 'Optimizing Best Route...'}
                {step === 'signing' && 'Waiting for Wallet Approval...'}
                {step === 'confirming' && 'Broadcasting to Blockchain...'}
              </h4>
              <p className="tx-status-subtitle">
                {step === 'preparing' && 'Finding liquidity pools and calculating minimal price impact.'}
                {step === 'signing' && 'Please confirm the swap signature in your Web3 wallet.'}
                {step === 'confirming' && 'Confirming block inclusions. This usually takes 2-3 seconds.'}
              </p>
            </div>

            {receipt && (
              <div className="tx-swap-preview-pill">
                <span>{receipt.fromAmount} {receipt.fromToken.symbol}</span>
                <ArrowRight size={16} />
                <span>{receipt.toAmount} {receipt.toToken.symbol}</span>
              </div>
            )}
          </div>
        ) : (
          receipt && (
            <div className="tx-success-body">
              <div className="tx-success-icon-wrapper">
                <CheckCircle2 size={56} className="tx-success-checkmark" />
              </div>

              <h4 className="tx-success-title">Swap Successful!</h4>
              <p className="tx-success-subtitle">
                Successfully exchanged your {receipt.fromToken.symbol} for {receipt.toToken.symbol}.
              </p>

              {/* Receipt Summary Card */}
              <div className="receipt-card">
                <div className="receipt-exchange-row">
                  <div className="receipt-token-item">
                    <TokenIcon symbol={receipt.fromToken.symbol} iconUrl={receipt.fromToken.iconUrl} size={32} />
                    <div className="receipt-token-text">
                      <span className="receipt-amount">-{receipt.fromAmount}</span>
                      <span className="receipt-symbol">{receipt.fromToken.symbol}</span>
                    </div>
                  </div>

                  <div className="receipt-arrow-icon">
                    <ArrowRight size={20} />
                  </div>

                  <div className="receipt-token-item">
                    <TokenIcon symbol={receipt.toToken.symbol} iconUrl={receipt.toToken.iconUrl} size={32} />
                    <div className="receipt-token-text">
                      <span className="receipt-amount positive">+{receipt.toAmount}</span>
                      <span className="receipt-symbol">{receipt.toToken.symbol}</span>
                    </div>
                  </div>
                </div>

                <div className="receipt-divider" />

                <div className="receipt-detail-rows">
                  <div className="receipt-row">
                    <span className="receipt-label">Execution Rate</span>
                    <span className="receipt-value">
                      1 {receipt.fromToken.symbol} = {receipt.rate.toFixed(6)} {receipt.toToken.symbol}
                    </span>
                  </div>

                  <div className="receipt-row">
                    <span className="receipt-label">Transaction Fee</span>
                    <span className="receipt-value">{formatUSD(receipt.fee)}</span>
                  </div>

                  <div className="receipt-row">
                    <span className="receipt-label">Slippage Tolerance</span>
                    <span className="receipt-value">{receipt.slippage}%</span>
                  </div>

                  <div className="receipt-row">
                    <span className="receipt-label">Transaction Hash</span>
                    <a
                      href={`https://etherscan.io/tx/${receipt.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="receipt-tx-link"
                      title="View on Block Explorer"
                    >
                      <span>{truncateAddress(receipt.txHash)}</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="tx-security-badge">
                <ShieldCheck size={16} />
                <span>Simulated on Ethereum Mainnet Fork</span>
              </div>

              <button type="button" className="btn-primary tx-done-btn" onClick={onDone}>
                Done
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
