import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SwapCard } from './components/SwapCard';
import { TokenSelectModal } from './components/TokenSelectModal';
import { TransactionModal } from './components/TransactionModal';
import { useTokenPrices } from './hooks/useTokenPrices';
import { Token, SlippageConfig, TxStep, SwapReceipt, ActiveField } from './types/token';
import { DEFAULT_MOCK_BALANCES } from './constants/tokens';
import { generateTxHash } from './utils/formatters';

const MOCK_WALLET_ADDRESS = '0x71C8360252cfb58406F1B943A5F8C64426543a94';

export const App: React.FC = () => {
  const [userBalances, setUserBalances] = useState<Record<string, number>>(DEFAULT_MOCK_BALANCES);
  const { tokens, isLoading, isRefreshing, lastUpdated, error, refreshPrices } = useTokenPrices(userBalances);

  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [activeField, setActiveField] = useState<ActiveField>('from');

  const [slippageConfig, setSlippageConfig] = useState<SlippageConfig>({
    value: 0.5,
    isCustom: false
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTargetField, setModalTargetField] = useState<ActiveField>('from');

  // Transaction Simulation State
  const [txStep, setTxStep] = useState<TxStep>('idle');
  const [isTxModalOpen, setIsTxModalOpen] = useState<boolean>(false);
  const [swapReceipt, setSwapReceipt] = useState<SwapReceipt | null>(null);

  // Initialize default token pair once tokens load
  useEffect(() => {
    if (tokens.length > 0 && !fromToken && !toToken) {
      const defaultFrom = tokens.find((t) => t.symbol === 'ETH') || tokens[0];
      const defaultTo = tokens.find((t) => t.symbol === 'USDC') || tokens[1] || tokens[0];
      setFromToken(defaultFrom);
      setToToken(defaultTo);
    } else if (tokens.length > 0) {
      // Keep tokens synchronized with updated prices and balances
      if (fromToken) {
        const updated = tokens.find((t) => t.symbol === fromToken.symbol);
        if (updated) setFromToken(updated);
      }
      if (toToken) {
        const updated = tokens.find((t) => t.symbol === toToken.symbol);
        if (updated) setToToken(updated);
      }
    }
  }, [tokens]);

  // Two-way calculation when amounts or tokens change
  const calculateReceiveAmount = useCallback((sendVal: string, from: Token | null, to: Token | null): string => {
    const num = parseFloat(sendVal);
    if (!from || !to || isNaN(num) || num <= 0 || to.price <= 0) return '';
    const res = (num * from.price) / to.price;
    return parseFloat(res.toFixed(6)).toString();
  }, []);

  const calculateSendAmount = useCallback((receiveVal: string, from: Token | null, to: Token | null): string => {
    const num = parseFloat(receiveVal);
    if (!from || !to || isNaN(num) || num <= 0 || from.price <= 0) return '';
    const res = (num * to.price) / from.price;
    return parseFloat(res.toFixed(6)).toString();
  }, []);

  const handleFromAmountChange = (val: string) => {
    setFromAmount(val);
    setActiveField('from');
    setToAmount(calculateReceiveAmount(val, fromToken, toToken));
  };

  const handleToAmountChange = (val: string) => {
    setToAmount(val);
    setActiveField('to');
    setFromAmount(calculateSendAmount(val, fromToken, toToken));
  };

  const handleSelectFromToken = (newFrom: Token) => {
    // If selecting the same token as "toToken", swap them
    if (toToken && newFrom.symbol === toToken.symbol) {
      setToToken(fromToken);
      if (activeField === 'from') {
        setToAmount(calculateReceiveAmount(fromAmount, newFrom, fromToken));
      } else {
        setFromAmount(calculateSendAmount(toAmount, newFrom, fromToken));
      }
    } else {
      if (activeField === 'from') {
        setToAmount(calculateReceiveAmount(fromAmount, newFrom, toToken));
      } else {
        setFromAmount(calculateSendAmount(toAmount, newFrom, toToken));
      }
    }
    setFromToken(newFrom);
  };

  const handleSelectToToken = (newTo: Token) => {
    // If selecting the same token as "fromToken", swap them
    if (fromToken && newTo.symbol === fromToken.symbol) {
      setFromToken(toToken);
      if (activeField === 'from') {
        setToAmount(calculateReceiveAmount(fromAmount, toToken, newTo));
      } else {
        setFromAmount(calculateSendAmount(toAmount, toToken, newTo));
      }
    } else {
      if (activeField === 'from') {
        setToAmount(calculateReceiveAmount(fromAmount, fromToken, newTo));
      } else {
        setFromAmount(calculateSendAmount(toAmount, fromToken, newTo));
      }
    }
    setToToken(newTo);
  };

  const handleFlipTokens = () => {
    const prevFrom = fromToken;
    const prevTo = toToken;
    const prevFromAmt = fromAmount;
    const prevToAmt = toAmount;

    setFromToken(prevTo);
    setToToken(prevFrom);
    setFromAmount(prevToAmt);
    setToAmount(prevFromAmt);
  };

  const handleOpenSelectModal = (field: ActiveField) => {
    setModalTargetField(field);
    setIsModalOpen(true);
  };

  // Execute Mock Swap Pipeline
  const handleInitiateSwap = () => {
    if (!fromToken || !toToken || !fromAmount || !toAmount) return;

    const currentRate = fromToken.price / toToken.price;
    const feeUsd = (parseFloat(fromAmount) * fromToken.price * 0.0015) + 1.25;

    const receipt: SwapReceipt = {
      txHash: generateTxHash(),
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      rate: currentRate,
      fee: feeUsd,
      slippage: slippageConfig.value,
      timestamp: new Date().toISOString()
    };

    setSwapReceipt(receipt);
    setIsTxModalOpen(true);
    setTxStep('preparing');

    // Multi-stage realistic simulation
    setTimeout(() => {
      setTxStep('signing');
    }, 700);

    setTimeout(() => {
      setTxStep('confirming');
    }, 1600);

    setTimeout(() => {
      // Deduct from balance & credit to balance
      const numFrom = parseFloat(fromAmount);
      const numTo = parseFloat(toAmount);

      setUserBalances((prev) => ({
        ...prev,
        [fromToken.symbol]: Math.max(0, (prev[fromToken.symbol] || 0) - numFrom),
        [toToken.symbol]: (prev[toToken.symbol] || 0) + numTo
      }));

      setTxStep('success');
    }, 3200);
  };

  const handleFinishTransaction = () => {
    setIsTxModalOpen(false);
    setTxStep('idle');
    setFromAmount('');
    setToAmount('');
  };

  return (
    <div className="app-layout">
      {/* Background ambient light orbs */}
      <div className="ambient-glow orb-top-left" />
      <div className="ambient-glow orb-bottom-right" />

      {/* Top Navigation */}
      <Navbar
        walletAddress={MOCK_WALLET_ADDRESS}
        isRefreshing={isRefreshing}
        onRefresh={refreshPrices}
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {error && (
          <div className="offline-notice-banner">
            <span>{error}</span>
          </div>
        )}

        {isLoading && tokens.length === 0 ? (
          <div className="app-loader-card">
            <div className="loader-pulse" />
            <p>Loading live token prices...</p>
          </div>
        ) : (
          <SwapCard
            tokens={tokens}
            fromToken={fromToken}
            toToken={toToken}
            fromAmount={fromAmount}
            toAmount={toAmount}
            onFromAmountChange={handleFromAmountChange}
            onToAmountChange={handleToAmountChange}
            onSelectFromToken={handleSelectFromToken}
            onSelectToToken={handleSelectToToken}
            onFlipTokens={handleFlipTokens}
            onOpenSelectModal={handleOpenSelectModal}
            slippageConfig={slippageConfig}
            onSlippageChange={setSlippageConfig}
            onInitiateSwap={handleInitiateSwap}
            isSubmitting={txStep !== 'idle' && txStep !== 'success'}
          />
        )}
      </main>

      {/* Token Selector Modal */}
      <TokenSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tokens={tokens}
        selectedToken={modalTargetField === 'from' ? fromToken : toToken}
        otherSelectedToken={modalTargetField === 'from' ? toToken : fromToken}
        onSelectToken={modalTargetField === 'from' ? handleSelectFromToken : handleSelectToToken}
        title={modalTargetField === 'from' ? 'Pay with' : 'Receive'}
      />

      {/* Transaction Status & Receipt Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        step={txStep}
        receipt={swapReceipt}
        onClose={() => setIsTxModalOpen(false)}
        onDone={handleFinishTransaction}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>99Tech Code Challenge • Problem 2: Fancy Currency Swap</p>
      </footer>
    </div>
  );
};
