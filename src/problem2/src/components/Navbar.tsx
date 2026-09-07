import React from 'react';
import { RefreshCw, Coins, Circle } from 'lucide-react';
import { truncateAddress } from '../utils/formatters';

interface NavbarProps {
  walletAddress: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  lastUpdated: Date | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  walletAddress,
  isRefreshing,
  onRefresh,
  lastUpdated
}) => {
  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <div className="brand-logo-icon">
          <Coins size={22} className="brand-icon-svg" />
        </div>
        <div className="brand-text-group">
          <span className="brand-title">FancySwap</span>
          <span className="brand-subtitle">99Tech DeFi</span>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Price Refresh Button */}
        <button
          type="button"
          className={`nav-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
          onClick={onRefresh}
          title={lastUpdated ? `Prices updated at ${lastUpdated.toLocaleTimeString()}` : 'Refresh live prices'}
          disabled={isRefreshing}
          aria-label="Refresh exchange rates"
        >
          <RefreshCw size={16} />
          <span className="nav-refresh-text">Live Rates</span>
        </button>

        {/* Network Badge */}
        <div className="network-pill">
          <Circle size={8} className="network-status-dot" fill="currentColor" />
          <span>Ethereum</span>
        </div>

        {/* Mock Connected Wallet */}
        <div className="wallet-pill" title={`Connected: ${walletAddress}`}>
          <div className="wallet-avatar" />
          <span className="wallet-addr">{truncateAddress(walletAddress)}</span>
        </div>
      </div>
    </header>
  );
};
