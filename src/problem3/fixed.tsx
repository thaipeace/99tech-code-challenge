import React, { useMemo } from 'react';

// --- Interfaces & Types ---

type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo' | string;

interface WalletBalance {
  blockchain: Blockchain;
  currency: string;
  amount: number;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface BoxProps {
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

interface Props extends BoxProps { }

// --- Helpers & Constants ---

// Lookup dictionary for O(1) priority resolution; placed outside to avoid recreation on each render
const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20
};

const getPriority = (blockchain: Blockchain): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? -99;
};

// --- Component ---

export const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Filter and sort balances
  // Note: Only depends on `balances`, removed unrelated `prices` dependency
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        // Kept valid blockchain (priority > -99) and positive balance (> 0)
        return priority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // Sort descending: higher priority first
        return rightPriority - leftPriority;
      });
  }, [balances]);

  // Combine formatting and USD calculation in one memoized pass
  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      const price = prices[balance.currency] ?? 0;
      return {
        ...balance,
        formatted: balance.amount.toFixed(2),
        usdValue: price * balance.amount
      };
    });
  }, [sortedBalances, prices]);

  return (
    <div {...rest}>
      {formattedBalances.map((balance: FormattedWalletBalance) => (
        <WalletRow
          className={classes.row}
          // Use unique identifier instead of array index for key
          key={`${balance.blockchain}-${balance.currency}`}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};