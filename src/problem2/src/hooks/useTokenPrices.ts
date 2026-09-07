import { useState, useEffect, useCallback } from 'react';
import { RawPriceItem, Token } from '../types/token';
import {
  PRICES_API_URL,
  TOKEN_ICON_BASE_URL,
  TOKEN_NAMES,
  DEFAULT_MOCK_BALANCES
} from '../constants/tokens';

const FALLBACK_PRICES: RawPriceItem[] = [
  { currency: 'ETH', date: '2023-08-29T07:10:52.000Z', price: 1645.93 },
  { currency: 'WBTC', date: '2023-08-29T07:10:52.000Z', price: 26002.82 },
  { currency: 'USDC', date: '2023-08-29T07:10:40.000Z', price: 1.0 },
  { currency: 'BUSD', date: '2023-08-29T07:10:40.000Z', price: 0.9998 },
  { currency: 'ATOM', date: '2023-08-29T07:10:50.000Z', price: 7.18 },
  { currency: 'OSMO', date: '2023-08-29T07:10:50.000Z', price: 0.377 },
  { currency: 'SWTH', date: '2023-08-29T07:10:45.000Z', price: 0.00404 },
  { currency: 'GMX', date: '2023-08-29T07:10:40.000Z', price: 36.35 },
  { currency: 'BLUR', date: '2023-08-29T07:10:40.000Z', price: 0.208 }
];

export function useTokenPrices(userBalances: Record<string, number> = DEFAULT_MOCK_BALANCES) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processPriceData = useCallback((data: RawPriceItem[], balances: Record<string, number>): Token[] => {
    // Deduplicate currencies by keeping the most recent date
    const latestMap = new Map<string, RawPriceItem>();

    for (const item of data) {
      if (!item.currency || typeof item.price !== 'number' || item.price <= 0) continue;
      const existing = latestMap.get(item.currency);
      if (!existing || new Date(item.date).getTime() > new Date(existing.date).getTime()) {
        latestMap.set(item.currency, item);
      }
    }

    const tokenList: Token[] = [];
    latestMap.forEach((item) => {
      tokenList.push({
        symbol: item.currency,
        name: TOKEN_NAMES[item.currency] || item.currency,
        price: item.price,
        iconUrl: `${TOKEN_ICON_BASE_URL}/${item.currency}.svg`,
        balance: balances[item.currency] ?? 0
      });
    });

    // Sort tokens: prioritize tokens with balance > 0, then by market price descending
    return tokenList.sort((a, b) => {
      if (a.balance > 0 && b.balance === 0) return -1;
      if (a.balance === 0 && b.balance > 0) return 1;
      return b.price - a.price;
    });
  }, []);

  const fetchPrices = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(PRICES_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: RawPriceItem[] = await response.json();
      const processed = processPriceData(data, userBalances);
      setTokens(processed);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      console.warn('Failed to fetch live prices, falling back to local dataset:', err);
      const processed = processPriceData(FALLBACK_PRICES, userBalances);
      setTokens(processed);
      setLastUpdated(new Date());
      setError('Using cached rates (API offline or unreachable)');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [processPriceData, userBalances]);

  useEffect(() => {
    fetchPrices();
    // Auto-refresh prices every 60 seconds
    const interval = setInterval(() => {
      fetchPrices(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return {
    tokens,
    isLoading,
    isRefreshing,
    lastUpdated,
    error,
    refreshPrices: () => fetchPrices(true)
  };
}
