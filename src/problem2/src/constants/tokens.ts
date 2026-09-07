export const TOKEN_NAMES: Record<string, string> = {
  ETH: 'Ethereum',
  WBTC: 'Wrapped Bitcoin',
  USDC: 'USD Coin',
  BUSD: 'Binance USD',
  USD: 'US Dollar',
  ATOM: 'Cosmos',
  OSMO: 'Osmosis',
  SWTH: 'Carbon',
  rSWTH: 'Reward SWTH',
  GMX: 'GMX',
  LUNA: 'Terra Luna',
  KUJI: 'Kujira',
  ZIL: 'Zilliqa',
  bNEO: 'Burger NEO',
  OKB: 'OKB',
  OKT: 'OKT Chain',
  EVMOS: 'Evmos',
  BLUR: 'Blur',
  wstETH: 'Wrapped Staked ETH',
  YieldUSD: 'Yield USD',
  USC: 'Carbon USC',
  axlUSDC: 'Axelar USDC',
  STATOM: 'Stride Staked ATOM',
  STOSMO: 'Stride Staked OSMO',
  STLUNA: 'Stride Staked LUNA',
  STEVMOS: 'Stride Staked EVMOS',
  ampLUNA: 'Amplify LUNA',
  RATOM: 'StaFi Staked ATOM',
  STRD: 'Stride',
  IBCX: 'IBC Index',
  IRIS: 'IRISnet',
  LSI: 'Liquid Staking Index'
};

export const DEFAULT_MOCK_BALANCES: Record<string, number> = {
  ETH: 4.852,
  WBTC: 0.285,
  USDC: 2450.0,
  BUSD: 1200.5,
  ATOM: 85.4,
  OSMO: 450.0,
  SWTH: 25000.0,
  GMX: 12.5,
  BLUR: 1500.0,
  wstETH: 1.5,
  ZIL: 12000.0
};

// Popular tokens shown at the top of the selector modal
export const POPULAR_TOKEN_SYMBOLS = ['ETH', 'WBTC', 'USDC', 'BUSD', 'ATOM', 'OSMO', 'SWTH'];

export const SWAP_FEE_PERCENTAGE = 0.15; // 0.15% fee
export const ESTIMATED_GAS_FEE_USD = 1.25;

export const TOKEN_ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';
export const PRICES_API_URL = 'https://interview.switcheo.com/prices.json';
