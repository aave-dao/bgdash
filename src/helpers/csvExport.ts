import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
import dayjs from 'dayjs';
import { formatUnits } from 'viem';

import { ReserveVersion } from '../constants';
import { ReserveItem } from '../types';
import { ColumnKeys } from './tableHelpers';

export const getRawValueForCSV = (
  key: ColumnKeys,
  item: ReserveItem,
): string | number | boolean => {
  switch (key) {
    case ColumnKeys.SYMBOL:
      return item.symbol;

    case ColumnKeys.ASSET_PRICE:
      return item.priceInUSD;

    case ColumnKeys.SUPPLY_USAGE_RATIO:
      return Number(item.supplyUsageRatio);

    case ColumnKeys.RESERVE_LIQUIDATION_THRESHOLD:
      return Number(item.reserveLiquidationThreshold) / 100;

    case ColumnKeys.BASE_LTV_AS_COLLATERAL:
      return Number(item.baseLTVasCollateral) / 100;

    case ColumnKeys.PENDING_LTV:
      return Number(item.pendingLTV) / 100;

    case ColumnKeys.RESERVE_FACTOR:
      return Number(item.reserveFactor);

    case ColumnKeys.VARIABLE_BORROW_APY:
      return Number(item.variableBorrowAPY);

    case ColumnKeys.VARIABLE_BORROW_APR:
      return Number(item.variableBorrowAPR);

    case ColumnKeys.SUPPLY_APY:
      return Number(item.supplyAPY);

    case ColumnKeys.LIQUIDITY_RATE:
      return Number(item.liquidityRate) / 1e27;

    case ColumnKeys.BASE_VARIABLE_BORROW_RATE:
      return Number(item.baseVariableBorrowRate) / 1e27;

    case ColumnKeys.OPTIMAL_USAGE_RATIO:
      return Number(item.optimalUsageRatio) / 1e27;

    case ColumnKeys.LIQUIDITY_INDEX:
      return Number(item.liquidityIndex) / 1e27;

    case ColumnKeys.VARIABLE_BORROW_INDEX:
      return Number(item.variableBorrowIndex) / 1e27;

    case ColumnKeys.AVAILABLE_LIQUIDITY:
      return item.availableLiquidity;

    case ColumnKeys.TOTAL_LIQUIDITY:
      return item.totalLiquidity;

    case ColumnKeys.TOTAL_DEBT:
      return item.totalDebt;

    case ColumnKeys.ACCRUED_TO_TREASURY:
      return item.version !== ReserveVersion.v3
        ? 'N/A'
        : item.accruedToTreasury;

    case ColumnKeys.DEFICIT:
      return item.version !== ReserveVersion.v3 ? 'N/A' : item.deficit;

    case ColumnKeys.SUPPLY_CAP:
      return item.version !== ReserveVersion.v3 ? 'N/A' : item.supplyCap;

    case ColumnKeys.BORROW_CAP:
      return item.version !== ReserveVersion.v3 ? 'N/A' : item.borrowCap;

    case ColumnKeys.SUPPLY_UTIL: {
      if (item.version !== ReserveVersion.v3) return 'N/A';
      const supplyCap = Number(item.supplyCap);
      if (supplyCap === 0) return 0;
      return Number(item.totalLiquidity) / supplyCap;
    }

    case ColumnKeys.BORROW_UTIL: {
      if (item.version !== ReserveVersion.v3) return 'N/A';
      const borrowCap = Number(item.borrowCap);
      if (borrowCap === 0) return 0;
      return Number(item.totalDebt) / borrowCap;
    }

    // Virtual accounting fields
    case ColumnKeys.VIRTUAL_UNDERLYING_BALANCE:
      if (item.version !== ReserveVersion.v3) return 'N/A';
      return formatUnits(BigInt(item.virtualUnderlyingBalance), item.decimals);

    case ColumnKeys.TOTAL_SCALED_ATOKEN_SUPPLY:
      if (item.version !== ReserveVersion.v3) return 'N/A';
      return formatUnits(BigInt(item.totalScaledATokenSupply), item.decimals);

    case ColumnKeys.VO_DELTA:
      return item.virtualAccountingDelta;

    case ColumnKeys.VO_DELTA_PERCENT:
      return item.virtualAccountingDeltaPercent;

    case ColumnKeys.IS_FROZEN:
      return item.isFrozen;

    case ColumnKeys.IS_PAUSED:
      return item.isPaused;

    case ColumnKeys.BORROWABLE_IN_ISOLATION:
      return item.borrowableInIsolation;

    case ColumnKeys.FLASH_LOAN_ENABLED:
      return item.flashLoanEnabled;

    case ColumnKeys.USAGE_AS_COLLATERAL_ENABLED:
      return item.usageAsCollateralEnabled;

    case ColumnKeys.BORROWING_ENABLED:
      return item.isFrozen ? false : item.borrowingEnabled;

    case ColumnKeys.IS_ISOLATED:
      return item.isIsolated;

    case ColumnKeys.IS_SILOED_BORROWING:
      return item.isSiloedBorrowing;

    case ColumnKeys.VIRTUAL_ACC_ACTIVE:
      return item.virtualAccActive;

    case ColumnKeys.LIQUIDATION_GRACE_PERIOD_UTIL:
      if (item.version !== ReserveVersion.v3) return 'N/A';
      if (Number(item.liquidationGracePeriodUntil) === 0) return 0;
      return dayjs.unix(Number(item.liquidationGracePeriodUntil)).toISOString();

    case ColumnKeys.RESERVE_LIQUIDATION_BONUS:
      if (item.reserveLiquidationBonus === '0') return 0;
      return parseInt(item.reserveLiquidationBonus.substring(1)) / 100;

    case ColumnKeys.Liquidation_Protocol_Fee:
      return item.liquidationProtocolFee
        ? Number(item.liquidationProtocolFee) / 100
        : 0;

    case ColumnKeys.DECIMALS:
      return item.decimals;

    case ColumnKeys.RESERVE_ID:
      return item.reserveId ?? 'N/A';

    case ColumnKeys.DEBT_CEILING:
      if (Number(item.debtCeiling) > 0) {
        return `${item.isolationModeTotalDebtUSD} of ${item.debtCeilingUSD}`;
      }
      return 'N/A';

    case ColumnKeys.VARIABLE_RATE_SLOPE_1:
      return formatUnits(item.variableRateSlope1, 25);

    case ColumnKeys.VARIABLE_RATE_SLOPE_2:
      return formatUnits(item.variableRateSlope2, 25);

    case ColumnKeys.TOTAL_SUPPLY_USD:
      return item.totalLiquidityUSD;

    case ColumnKeys.SUPPLY_CAP_USD:
      return item.supplyCapUSD;

    case ColumnKeys.TOTAL_DEBT_USD:
      return item.totalDebtUSD;

    case ColumnKeys.BORROW_CAP_USD:
      return item.borrowCapUSD;

    case ColumnKeys.TOTAL_SUPPLY:
      return item.totalLiquidity;

    case ColumnKeys.SUPPLY_CAP_MODAL:
      return item.version === ReserveVersion.v3 ? item.supplyCap : 'N/A';

    case ColumnKeys.TOTAL_DEBT_MODAL:
      return item.totalDebt;

    case ColumnKeys.BORROW_CAP_MODAL:
      return item.borrowCap;

    default: {
      const value = item[key as keyof ReserveItem];
      return value !== undefined ? String(value) : 'N/A';
    }
  }
};

const escapeCSVField = (value: string | number | boolean): string => {
  const stringValue = String(value);

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

export const convertReservesToCSV = (
  reserves: ReserveItem[],
  selectedColumns: { key: ColumnKeys; label: string }[],
): string => {
  if (reserves.length === 0) {
    return '';
  }

  const headers = [
    'Network',
    'Pool',
    ...selectedColumns.map((col) => escapeCSVField(col.label)),
  ];
  const csvRows = [headers.join(',')];

  reserves.forEach((reserve) => {
    const row = [
      escapeCSVField(getChainName(reserve.chainId)),
      escapeCSVField(reserve.pool),
      ...selectedColumns.map((col) => {
        const value = getRawValueForCSV(col.key, reserve);
        return escapeCSVField(value);
      }),
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

export const generateCSVFilename = (filters?: {
  symbols?: string[];
  chains?: number[];
  hasFilters?: boolean;
}): string => {
  const timestamp = dayjs().format('YYYY-MM-DD-HH-mm-ss');
  let filename = 'aave-reserves';

  if (filters?.hasFilters) {
    if (
      filters.symbols &&
      filters.symbols.length > 0 &&
      filters.symbols.length <= 3
    ) {
      filename += `-${filters.symbols.join('-').toLowerCase()}`;
    }
    filename += '-filtered';
  }

  return `${filename}-${timestamp}.csv`;
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const exportReservesToCSV = (
  reserves: ReserveItem[],
  selectedColumns: { key: ColumnKeys; label: string }[],
  filters?: {
    symbols?: string[];
    chains?: number[];
    hasFilters?: boolean;
  },
): void => {
  if (reserves.length === 0) {
    console.warn('No reserves to export');
    return;
  }

  if (selectedColumns.length === 0) {
    console.warn('No columns selected for export');
    return;
  }

  try {
    const csvContent = convertReservesToCSV(reserves, selectedColumns);
    const filename = generateCSVFilename(filters);
    downloadCSV(csvContent, filename);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw new Error('Failed to export CSV file');
  }
};
