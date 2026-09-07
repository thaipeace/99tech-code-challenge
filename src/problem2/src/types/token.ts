export interface RawPriceItem {
  currency: string;
  date: string;
  price: number;
}

export interface Token {
  symbol: string;
  name: string;
  price: number;
  iconUrl: string;
  balance: number;
}

export type ActiveField = 'from' | 'to';

export interface SlippageConfig {
  value: number; // in percentage e.g. 0.5 for 0.5%
  isCustom: boolean;
}

export type TxStep = 'idle' | 'preparing' | 'signing' | 'confirming' | 'success' | 'failed';

export interface SwapReceipt {
  txHash: string;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  rate: number;
  fee: number;
  slippage: number;
  timestamp: string;
}
