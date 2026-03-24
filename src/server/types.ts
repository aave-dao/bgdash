// Generic types for requests

import { Address } from 'viem';

export type ReserveItemInitial = {
  id?: number;
  underlyingAsset: Address;
  name: string;
  symbol: string;
  decimals: bigint;
  baseLTVasCollateral: bigint;
  reserveLiquidationThreshold: bigint;
  reserveLiquidationBonus: bigint;
  reserveFactor: bigint;
  usageAsCollateralEnabled: boolean;
  borrowingEnabled: boolean;
  isActive: boolean;
  isFrozen: boolean;
  liquidityIndex: bigint;
  variableBorrowIndex: bigint;
  liquidityRate: bigint;
  variableBorrowRate: bigint;
  lastUpdateTimestamp: number;
  aTokenAddress: Address;
  variableDebtTokenAddress: Address;
  interestRateStrategyAddress: Address;
  availableLiquidity: bigint;
  totalScaledVariableDebt: bigint;
  priceInMarketReferenceCurrency: bigint;
  variableRateSlope1: bigint;
  variableRateSlope2: bigint;
  borrowCap: bigint;
  supplyCap: bigint;
  debtCeiling: bigint;
  debtCeilingDecimals: bigint;
  isolationModeTotalDebt: bigint;
  unbacked: bigint;
  virtualUnderlyingBalance?: bigint;
  liquidationGracePeriodUntil?: number;
  virtualAccActive?: boolean;
  pendingLtv?: bigint;
  totalScaledATokenSupply?: bigint;
  baseVariableBorrowRate: bigint;
  optimalUsageRatio: bigint;
  isSiloedBorrowing: boolean;
  priceOracle: Address;
  isPaused: boolean;
  accruedToTreasury: bigint;
  borrowableInIsolation: boolean;
  flashLoanEnabled: boolean;
  deficit?: bigint;
};

export const notNull = <T>(value: T): value is NonNullable<T> => {
  return value != null;
};
