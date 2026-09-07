import React from 'react';
import { AlertCircle, SlidersHorizontal, X } from 'lucide-react';
import { SlippageConfig } from '../types/token';

interface SlippageSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  config: SlippageConfig;
  onChangeConfig: (config: SlippageConfig) => void;
}

const PRESET_OPTIONS = [0.1, 0.5, 1.0];

export const SlippageSettings: React.FC<SlippageSettingsProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig
}) => {
  if (!isOpen) return null;

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      onChangeConfig({ value: 0.5, isCustom: true });
    } else {
      onChangeConfig({ value: Math.min(Math.max(val, 0.01), 50), isCustom: true });
    }
  };

  const isHighSlippage = config.value > 3.0;
  const isLowSlippage = config.value < 0.05;

  return (
    <div className="slippage-card">
      <div className="slippage-header">
        <div className="slippage-title-row">
          <SlidersHorizontal size={16} />
          <span>Slippage Tolerance</span>
        </div>
        <button className="slippage-close-btn" onClick={onClose} aria-label="Close settings">
          <X size={16} />
        </button>
      </div>

      <div className="slippage-presets-row">
        {PRESET_OPTIONS.map((pct) => {
          const isActive = !config.isCustom && config.value === pct;
          return (
            <button
              key={pct}
              type="button"
              className={`slippage-btn ${isActive ? 'active' : ''}`}
              onClick={() => onChangeConfig({ value: pct, isCustom: false })}
            >
              {pct}%
            </button>
          );
        })}

        <div className={`slippage-custom-wrapper ${config.isCustom ? 'active' : ''}`}>
          <input
            type="number"
            step="0.1"
            min="0.01"
            max="50"
            placeholder="Custom"
            value={config.isCustom ? config.value : ''}
            onChange={handleCustomChange}
            onFocus={() => {
              if (!config.isCustom) {
                onChangeConfig({ value: config.value, isCustom: true });
              }
            }}
            className="slippage-custom-input"
          />
          <span className="slippage-custom-percent">%</span>
        </div>
      </div>

      {isHighSlippage && (
        <div className="slippage-warning high">
          <AlertCircle size={14} />
          <span>High slippage may result in unfavorable rates or frontrunning.</span>
        </div>
      )}

      {isLowSlippage && (
        <div className="slippage-warning low">
          <AlertCircle size={14} />
          <span>Slippage below 0.05% might cause the transaction to revert.</span>
        </div>
      )}
    </div>
  );
};
