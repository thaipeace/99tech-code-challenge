import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Check } from 'lucide-react';
import { Token } from '../types/token';
import { POPULAR_TOKEN_SYMBOLS } from '../constants/tokens';
import { TokenIcon } from './TokenIcon';
import { formatUSD, formatNumber } from '../utils/formatters';

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
  selectedToken: Token | null;
  otherSelectedToken: Token | null;
  onSelectToken: (token: Token) => void;
  title?: string;
}

export const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  isOpen,
  onClose,
  tokens,
  selectedToken,
  otherSelectedToken,
  onSelectToken,
  title = 'Select a token'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTokens = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return tokens;
    return tokens.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
    );
  }, [tokens, searchQuery]);

  const popularTokens = useMemo(() => {
    return tokens.filter((t) => POPULAR_TOKEN_SYMBOLS.includes(t.symbol));
  }, [tokens]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="token-modal-title"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <h3 id="token-modal-title" className="modal-title">{title}</h3>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close token selector"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search by name or symbol (e.g. ETH, Cosmos)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Popular Tokens Row */}
        {!searchQuery && popularTokens.length > 0 && (
          <div className="popular-tokens-section">
            <span className="popular-tokens-label">Popular</span>
            <div className="popular-chips-list">
              {popularTokens.map((tok) => {
                const isCurrent = selectedToken?.symbol === tok.symbol;
                return (
                  <button
                    key={tok.symbol}
                    className={`popular-chip ${isCurrent ? 'active' : ''}`}
                    onClick={() => {
                      onSelectToken(tok);
                      onClose();
                    }}
                  >
                    <TokenIcon symbol={tok.symbol} iconUrl={tok.iconUrl} size={18} />
                    <span>{tok.symbol}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Token List */}
        <div className="token-list-container">
          {filteredTokens.length === 0 ? (
            <div className="token-list-empty">
              <p>No tokens found matching "{searchQuery}"</p>
              <span>Try checking the spelling or search for another currency</span>
            </div>
          ) : (
            filteredTokens.map((tok) => {
              const isSelected = selectedToken?.symbol === tok.symbol;
              const isOtherSelected = otherSelectedToken?.symbol === tok.symbol;

              return (
                <div
                  key={tok.symbol}
                  className={`token-list-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectToken(tok);
                    onClose();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectToken(tok);
                      onClose();
                    }
                  }}
                >
                  <div className="token-item-left">
                    <TokenIcon symbol={tok.symbol} iconUrl={tok.iconUrl} size={36} />
                    <div className="token-item-info">
                      <div className="token-item-symbol-row">
                        <span className="token-item-symbol">{tok.symbol}</span>
                        {isOtherSelected && (
                          <span className="token-badge-swapped">Swaps pair</span>
                        )}
                      </div>
                      <span className="token-item-name">{tok.name}</span>
                    </div>
                  </div>

                  <div className="token-item-right">
                    <span className="token-item-price">{formatUSD(tok.price)}</span>
                    <span className="token-item-balance">
                      {tok.balance > 0 ? `${formatNumber(tok.balance, 4)} ${tok.symbol}` : '0.00'}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="token-item-checked">
                      <Check size={18} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
