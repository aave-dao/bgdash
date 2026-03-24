import { Address } from 'viem';
import { StoreApi } from 'zustand';

import {
  marketHelper,
  PoolsWithVersions,
  ReservePool,
  ReserveVersion,
} from './constants';
import { EmodeColumnKeys } from './helpers/eModeTableHelpers';
import { ColumnKeys } from './helpers/tableHelpers';
import { ReserveEvent } from './server/api/fallbacks/fetchEvents';

export type StoreSlice<T extends object, E extends object = T> = (
  set: StoreApi<E extends T ? E : E & T>['setState'],
  get: StoreApi<E extends T ? E : E & T>['getState'],
) => T;

export enum SortDirection {
  Ascending = 'ascending',
  Descending = 'descending',
}

export type SortConfig = {
  key: ColumnKeys | EmodeColumnKeys | null;
  direction: SortDirection;
};

export type ReserveItem = {
  poolIndex: number;
  chainId: keyof typeof marketHelper;
  version: ReserveVersion;
  pool: ReservePool;
  virtualAccountingDelta: number;
  virtualAccountingDeltaPercent: number;
  liquidationProtocolFee?: number;
  id: string;
  reserveId?: number;
  underlyingAsset: string;
  name: string;
  symbol: string;
  decimals: number;
  baseLTVasCollateral: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  reserveFactor: string;
  usageAsCollateralEnabled: boolean;
  borrowingEnabled: boolean;
  isActive: boolean;
  isFrozen: boolean;
  liquidityIndex: string;
  variableBorrowIndex: string;
  liquidityRate: string;
  variableBorrowRate: string;
  lastUpdateTimestamp: number;
  aTokenAddress: string;
  variableDebtTokenAddress: string;
  interestRateStrategyAddress: string;
  availableLiquidity: string;
  totalScaledVariableDebt: string;
  priceInMarketReferenceCurrency?: string;
  priceOracle?: string;
  variableRateSlope1: bigint;
  variableRateSlope2: bigint;
  baseVariableBorrowRate: bigint;
  optimalUsageRatio: bigint;
  isPaused: boolean;
  isSiloedBorrowing: boolean;
  accruedToTreasury: string;
  unbacked: string;
  isolationModeTotalDebt: string;
  debtCeiling: string;
  debtCeilingDecimals: number;
  borrowCap: string;
  supplyCap: string;
  borrowableInIsolation: boolean;
  flashLoanEnabled: boolean;
  virtualAccActive: boolean;
  virtualUnderlyingBalance: string;
  pendingLTV: string;
  totalScaledATokenSupply: string;
  liquidationGracePeriodUntil: number;
  deficit: string;
  // after formatting
  isIsolated: boolean;
  totalLiquidity: string;
  totalDebt: string;
  supplyAPY: string;
  supplyAPR: string;
  variableBorrowAPY: string;
  variableBorrowAPR: string;
  borrowUsageRatio: string;
  supplyUsageRatio: string;
  // usd values after calculation
  isolationModeTotalDebtUSD: string;
  debtCeilingUSD: string;
  availableDebtCeilingUSD: string;
  borrowCapUSD: string;
  supplyCapUSD: string;
  unbackedUSD: string;
  totalLiquidityUSD: string;
  availableLiquidityUSD: string;
  totalDebtUSD: string;
  priceInUSD: string;
  deficitUSD: string;
  // Add new field here
};

export type Events = {
  loading: boolean;
  lastBlockNumber: number;
  events: {
    supplyEvents: Record<Address, ReserveEvent>;
    borrowEvents: Record<Address, ReserveEvent>;
    repayEvents: Record<Address, ReserveEvent>;
    liquidationEvents: Record<Address, ReserveEvent>;
  };
};

export type EmodeAsset = {
  symbol: string;
  id: string;
};

export type Emode = {
  chainId: number;
  poolWithVersion: PoolsWithVersions;
  id: number;
  ltv: number;
  label: string;
  liquidationThreshold: number;
  liquidationBonus: number;
  borrowableAssets: EmodeAsset[];
  collateralAssets: EmodeAsset[];
};

export interface FilterOption {
  id: string;
  label: string;
}

export type TokenData = {
  token: Address;
  price: bigint;
  name: string;
  symbol: string;
  decimals: number;
};

export type StakeTokenConfig = {
  stakeToken: TokenData;
  totalAssets: bigint;
  totalSupply: bigint;
  cooldown: bigint;
  unstakeWindow: bigint;
};

export type RewardConfig = {
  reward: TokenData;
  maxEmissionPerSecond: bigint;
  distributionEnd: bigint;
};

export type RewardsControllerConfigs = {
  targetLiquidity: bigint;
  rewardConfigs: RewardConfig[];
};

export type UmbrellaConfig = {
  reserve: Address;
  deficitOffset: bigint;
  pendingDeficit: bigint;
};

export type UmbrellaData = {
  stakeTokenConfig: StakeTokenConfig;
  rewardsControllerConfigs: RewardsControllerConfigs;
  umbrellaConfig: UmbrellaConfig;
};

export type UmbrellaMarket = {
  market: string;
  umbrella: Address;
  oracle: Address;
  umbrellaData: UmbrellaData[];
};

export type UmbrellaItem = UmbrellaData & {
  market: string;
  umbrella: Address;
  oracle: Address;
  id: string;
};
