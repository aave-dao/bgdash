import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';

import { ReserveVersion } from '../constants';
import { Emode, ReserveItem, SortConfig, SortDirection } from '../types';
import { EmodeColumnKeys } from './eModeTableHelpers';
import { calculateUtilization, ColumnKeys } from './tableHelpers';

export const compareValues = (aValue: unknown, bValue: unknown): number => {
  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return aValue - bValue;
  }

  if (typeof aValue === 'bigint' && typeof bValue === 'bigint') {
    return Number(aValue) - Number(bValue);
  }

  if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
    return aValue === bValue ? 0 : aValue ? -1 : 1;
  }

  if (typeof aValue === 'string' && typeof bValue === 'string') {
    return aValue.localeCompare(bValue);
  }

  return 0; // Return 0 as a fallback
};

export const sortItems = <T>(
  items: T[],
  sortConfig: SortConfig,
  customSortFn?: (
    key: ColumnKeys | EmodeColumnKeys,
    a: T,
    b: T,
    emodes?: Emode[],
  ) => number,
  emodes?: Emode[],
): T[] => {
  const itemsForSorting = [...items];
  return itemsForSorting && !!itemsForSorting?.length
    ? itemsForSorting?.sort((a, b) => {
        if (customSortFn && sortConfig.key) {
          return (
            customSortFn(sortConfig.key, a, b, emodes) *
            (sortConfig.direction === SortDirection.Ascending ? 1 : -1)
          );
        }
        return 0;
      })
    : [];
};

// mapping of sort functions for custom fields
export const sortFunctions: Record<
  string,
  (a: ReserveItem, b: ReserveItem) => number
> = {
  [ColumnKeys.SUPPLY_USAGE_RATIO]: (a, b) =>
    compareValues(+a.supplyUsageRatio, +b.supplyUsageRatio),
  [ColumnKeys.BASE_VARIABLE_BORROW_RATE]: (a, b) =>
    compareValues(a.baseVariableBorrowRate, b.baseVariableBorrowRate),
  [ColumnKeys.TOTAL_LIQUIDITY]: (a, b) =>
    compareValues(+a.totalLiquidityUSD, +b.totalLiquidityUSD),
  [ColumnKeys.AVAILABLE_LIQUIDITY]: (a, b) =>
    compareValues(+a.availableLiquidityUSD, +b.availableLiquidityUSD),
  [ColumnKeys.BORROW_CAP]: (a, b) =>
    compareValues(+a.borrowCapUSD * 100, +b.borrowCapUSD * 100),
  [ColumnKeys.SUPPLY_CAP]: (a, b) =>
    compareValues(+a.supplyCapUSD * 100, +b.supplyCapUSD * 100),
  [ColumnKeys.SUPPLY_UTIL]: (a, b) =>
    compareValues(
      +calculateUtilization(+a.totalLiquidity, +a.supplyCap),
      +calculateUtilization(+b.totalLiquidity, +b.supplyCap),
    ),
  [ColumnKeys.BORROW_UTIL]: (a, b) =>
    compareValues(
      +calculateUtilization(+a.totalDebt, +a.borrowCap),
      +calculateUtilization(+b.totalDebt, +b.borrowCap),
    ),
  [ColumnKeys.TOTAL_DEBT]: (a, b) =>
    compareValues(+a.totalDebtUSD, +b.totalDebtUSD),
  [ColumnKeys.RESERVE_LIQUIDATION_BONUS]: (a, b) =>
    compareValues(
      a.reserveLiquidationBonus === '0'
        ? 0
        : parseInt(a.reserveLiquidationBonus.substring(1)) / 100,
      b.reserveLiquidationBonus === '0'
        ? 0
        : parseInt(b.reserveLiquidationBonus.substring(1)) / 100,
    ),
  [ColumnKeys.LIQUIDITY_RATE]: (a, b) =>
    compareValues(
      Number(a.liquidityRate) / 1e27,
      Number(b.liquidityRate) / 1e27,
    ),
  [ColumnKeys.DEBT_CEILING]: (a, b) =>
    compareValues(+a.debtCeiling, +b.debtCeiling),
  [ColumnKeys.ASSET_PRICE]: (a, b) =>
    compareValues(+a.priceInUSD, +b.priceInUSD),
  [ColumnKeys.ACCRUED_TO_TREASURY]: (a, b) =>
    compareValues(a.accruedToTreasury, b.accruedToTreasury),
  [ColumnKeys.VARIABLE_BORROW_INDEX]: (a, b) =>
    compareValues(+a.variableBorrowIndex / 1e27, +b.variableBorrowIndex / 1e27),
  [ColumnKeys.VARIABLE_BORROW_APY]: (a, b) =>
    compareValues(+a.variableBorrowAPY * 100, +b.variableBorrowAPY * 100),
  [ColumnKeys.Liquidation_Protocol_Fee]: (a, b) =>
    compareValues(
      a.version === ReserveVersion.v3 && a.liquidationProtocolFee
        ? +a.liquidationProtocolFee
        : 0,
      b.version === ReserveVersion.v3 && b.liquidationProtocolFee
        ? +b.liquidationProtocolFee
        : 0,
    ),
  [ColumnKeys.TOTAL_SCALED_ATOKEN_SUPPLY]: (a, b) =>
    compareValues(a.totalScaledATokenSupply, b.totalScaledATokenSupply),
  [ColumnKeys.VIRTUAL_UNDERLYING_BALANCE]: (a, b) =>
    compareValues(a.virtualUnderlyingBalance, b.virtualUnderlyingBalance),
  [ColumnKeys.LIQUIDATION_GRACE_PERIOD_UTIL]: (a, b) =>
    compareValues(a.liquidationGracePeriodUntil, b.liquidationGracePeriodUntil),
  [ColumnKeys.VO_DELTA]: (a, b) => {
    return compareValues(a.virtualAccountingDelta, b.virtualAccountingDelta);
  },
  [ColumnKeys.VO_DELTA_PERCENT]: (a, b) => {
    return compareValues(
      a.virtualAccountingDeltaPercent,
      b.virtualAccountingDeltaPercent,
    );
  },
  [ColumnKeys.DEFICIT]: (a, b) => {
    return compareValues(+a.deficitUSD, +b.deficitUSD);
  },
};

// mapping of sort functions for custom fields
export const emodesSortFunctions: Record<
  string,
  (a: Emode, b: Emode) => number
> = {
  [EmodeColumnKeys.poolWithVersion]: (a, b) =>
    compareValues(getChainName(a.chainId), getChainName(b.chainId)),
  [EmodeColumnKeys.id]: (a, b) => compareValues(a.id, b.id),
  [EmodeColumnKeys.ltv]: (a, b) => compareValues(a.ltv, b.ltv),
  [EmodeColumnKeys.liquidationThreshold]: (a, b) =>
    compareValues(a.liquidationThreshold, b.liquidationThreshold),
  [EmodeColumnKeys.liquidationBonus]: (a, b) =>
    compareValues(a.liquidationBonus, b.liquidationBonus),
};

// function to sort reserves by custom key
export const customReservesSorting = (
  key: ColumnKeys | EmodeColumnKeys,
  a: ReserveItem,
  b: ReserveItem,
) => {
  const sortFunction = sortFunctions[key];
  if (sortFunction) {
    return sortFunction(a, b);
  }
  return compareValues(
    a[key as keyof ReserveItem],
    b[key as keyof ReserveItem],
  );
};
// function to sort emodes by custom key
export const customEmodesSorting = (
  key: ColumnKeys | EmodeColumnKeys,
  a: Emode,
  b: Emode,
) => {
  const sortFunction = emodesSortFunctions[key];
  if (sortFunction) {
    return sortFunction(a, b);
  }
  return compareValues(a[key as keyof Emode], b[key as keyof Emode]);
};
