import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import numeral from 'numeral';
import React from 'react';
import { formatUnits } from 'viem';

import { BoolCol } from '../components/Dashboard/Cols/BoolCol';
import { NumeralCol } from '../components/Dashboard/Cols/NumeralCol';
import { SymbolCol } from '../components/Dashboard/Cols/SymbolCol';
import { ReserveVersion } from '../constants';
import { Emode, ReserveItem } from '../types';

// enum of all available columns
export enum ColumnKeys {
  SYMBOL = 'symbol',
  SUPPLY_USAGE_RATIO = 'supplyUsageRatio',
  TOTAL_LIQUIDITY = 'totalLiquidity',
  AVAILABLE_LIQUIDITY = 'availableLiquidity',
  TOTAL_SCALED_ATOKEN_SUPPLY = 'totalScaledATokenSupply',
  VIRTUAL_UNDERLYING_BALANCE = 'virtualUnderlyingBalance',
  ACCRUED_TO_TREASURY = 'accruedToTreasury',
  VO_DELTA = 'VODelta',
  VO_DELTA_PERCENT = 'VODeltaPercent',
  SUPPLY_CAP = 'supplyCap',
  SUPPLY_UTIL = 'supplyUtil',
  BORROW_CAP = 'borrowCap',
  BORROW_UTIL = 'borrowUtil',
  DECIMALS = 'decimals',
  RESERVE_ID = 'reserveId',
  TOTAL_DEBT = 'totalDebt',

  LIQUIDATION_GRACE_PERIOD_UTIL = 'liquidationGracePeriodUntil',
  RESERVE_LIQUIDATION_THRESHOLD = 'reserveLiquidationThreshold',
  RESERVE_LIQUIDATION_BONUS = 'reserveLiquidationBonus',
  RESERVE_FACTOR = 'reserveFactor',

  OPTIMAL_USAGE_RATIO = 'optimalUsageRatio',
  LIQUIDITY_INDEX = 'liquidityIndex',
  LIQUIDITY_RATE = 'liquidityRate',
  VARIABLE_BORROW_INDEX = 'variableBorrowIndex',
  VARIABLE_BORROW_APY = 'variableBorrowAPY',
  VARIABLE_BORROW_APR = 'variableBorrowAPR',

  BASE_VARIABLE_BORROW_RATE = 'baseVariableBorrowRate',
  BASE_LTV_AS_COLLATERAL = 'baseLTVasCollateral',
  PENDING_LTV = 'pendingLtv',

  USAGE_AS_COLLATERAL_ENABLED = 'usageAsCollateralEnabled',
  BORROWING_ENABLED = 'borrowingEnabled',
  BORROWABLE_IN_ISOLATION = 'borrowableInIsolation',
  IS_SILOED_BORROWING = 'isSiloedBorrowing',
  FLASH_LOAN_ENABLED = 'flashLoanEnabled',
  IS_ISOLATED = 'isIsolated',
  IS_PAUSED = 'isPaused',
  Liquidation_Protocol_Fee = 'liquidationProtocolFee',
  IS_FROZEN = 'isFrozen',
  VIRTUAL_ACC_ACTIVE = 'virtualAccActive',
  DEBT_CEILING = 'debtCeiling',
  ASSET_PRICE = 'assetPrice',

  DEFICIT = 'deficit',

  // modal
  TOTAL_SUPPLY = 'totalSupply',
  TOTAL_SUPPLY_USD = 'totalSupplyUSD',
  SUPPLY_CAP_MODAL = 'supplyCapModal',
  SUPPLY_CAP_USD = 'supplyCapUSD',
  TOTAL_DEBT_MODAL = 'totalDebtModal',
  TOTAL_DEBT_USD = 'totalDebtUSD',
  BORROW_CAP_MODAL = 'borrowCapModal',
  BORROW_CAP_USD = 'borrowCapUSD',
  SUPPLY_APY = 'supplyAPY',

  // interest rate params
  VARIABLE_RATE_SLOPE_1 = 'variableRateSlope1',
  VARIABLE_RATE_SLOPE_2 = 'variableRateSlope2',
}

// list of all available columns, key is the name of the property from enum
export const columns = [
  { key: ColumnKeys.SYMBOL, label: 'Asset' },
  { key: ColumnKeys.ASSET_PRICE, label: 'Price' },

  { key: ColumnKeys.SUPPLY_USAGE_RATIO, label: 'Utilization' },
  { key: ColumnKeys.TOTAL_LIQUIDITY, label: 'Reserve size' },
  { key: ColumnKeys.AVAILABLE_LIQUIDITY, label: 'Available liquidity' },
  {
    key: ColumnKeys.TOTAL_SCALED_ATOKEN_SUPPLY,
    label: 'Total scaled AToken supply',
  },
  {
    key: ColumnKeys.VIRTUAL_UNDERLYING_BALANCE,
    label: 'Virtual underlying balance',
  },
  { key: ColumnKeys.ACCRUED_TO_TREASURY, label: 'Accrued to treasury' },
  { key: ColumnKeys.VO_DELTA, label: 'VB delta' },
  { key: ColumnKeys.VO_DELTA_PERCENT, label: 'VB delta %' },

  { key: ColumnKeys.SUPPLY_CAP, label: 'Supply Cap' },
  { key: ColumnKeys.SUPPLY_UTIL, label: 'Supply Utilization' },
  { key: ColumnKeys.BORROW_CAP, label: 'Borrow Cap' },
  { key: ColumnKeys.BORROW_UTIL, label: 'Borrow Utilization' },

  { key: ColumnKeys.TOTAL_DEBT, label: 'Total debt' },
  { key: ColumnKeys.DEBT_CEILING, label: 'Debt ceiling' },
  { key: ColumnKeys.DECIMALS, label: 'Decimals' },

  {
    key: ColumnKeys.LIQUIDATION_GRACE_PERIOD_UTIL,
    label: 'Liquidation grace period until',
  },
  {
    key: ColumnKeys.RESERVE_LIQUIDATION_THRESHOLD,
    label: 'Liquidation threshold',
  },
  { key: ColumnKeys.RESERVE_LIQUIDATION_BONUS, label: 'Liquidation bonus' },
  {
    key: ColumnKeys.Liquidation_Protocol_Fee,
    label: 'Liquidation protocol fee',
  },
  { key: ColumnKeys.RESERVE_FACTOR, label: 'Reserve factor' },
  { key: ColumnKeys.OPTIMAL_USAGE_RATIO, label: 'Optimal utilization' },
  { key: ColumnKeys.LIQUIDITY_INDEX, label: 'Liquidity index' },
  { key: ColumnKeys.LIQUIDITY_RATE, label: 'Liquidity rate' },
  { key: ColumnKeys.VARIABLE_BORROW_INDEX, label: 'Variable borrow index' },
  { key: ColumnKeys.VARIABLE_BORROW_APY, label: 'Variable borrow rate' },

  {
    key: ColumnKeys.BASE_VARIABLE_BORROW_RATE,
    label: 'Base variable borrow rate',
  },
  { key: ColumnKeys.BASE_LTV_AS_COLLATERAL, label: 'LTV' },
  { key: ColumnKeys.PENDING_LTV, label: 'Pending LTV' },

  { key: ColumnKeys.VARIABLE_RATE_SLOPE_1, label: 'Variable rate slope 1' },
  { key: ColumnKeys.VARIABLE_RATE_SLOPE_2, label: 'Variable rate slope 2' },

  { key: ColumnKeys.USAGE_AS_COLLATERAL_ENABLED, label: 'Can be collateral' },
  { key: ColumnKeys.BORROWING_ENABLED, label: 'Borrowing enabled' },
  { key: ColumnKeys.BORROWABLE_IN_ISOLATION, label: 'Borrowable in isolation' },
  {
    key: ColumnKeys.VIRTUAL_ACC_ACTIVE,
    label: 'Virtual account is active',
  },
  { key: ColumnKeys.IS_SILOED_BORROWING, label: 'Is Siloed Borrowing' },
  { key: ColumnKeys.FLASH_LOAN_ENABLED, label: 'Flashloan Enabled' },
  { key: ColumnKeys.IS_ISOLATED, label: 'Is Isolated' },
  { key: ColumnKeys.IS_PAUSED, label: 'Paused' },
  { key: ColumnKeys.IS_FROZEN, label: 'Frozen' },
  { key: ColumnKeys.DEFICIT, label: 'Deficit' },
  { key: ColumnKeys.RESERVE_ID, label: 'Reserve ID' },
];

export const calculateUtilization = (total: number, cap: number) => {
  if (cap === 0) return 0;
  return (total / cap) * 100;
};

const renderSupplyCap = (item: ReserveItem) => {
  const { version, supplyCap, supplyCapUSD } = item;
  if (version !== ReserveVersion.v3) return 'N/A';
  return <NumeralCol value={supplyCap} valueUSD={supplyCapUSD} />;
};

const renderBorrowCap = (item: ReserveItem) => {
  const { version, borrowCap, borrowCapUSD } = item;
  if (version !== ReserveVersion.v3) return 'N/A';
  return <NumeralCol value={borrowCap} valueUSD={borrowCapUSD} />;
};

const renderSupplyUtilization = (item: ReserveItem) => {
  const { version, totalLiquidity, supplyCap } = item;
  if (version !== ReserveVersion.v3) return 'N/A';
  return `${+calculateUtilization(+totalLiquidity, +supplyCap).toFixed(2)}%`;
};

const renderBorrowUtilization = (item: ReserveItem) => {
  const { version, totalDebt, borrowCap } = item;
  if (version !== ReserveVersion.v3) return 'N/A';
  return `${+calculateUtilization(+totalDebt, +borrowCap).toFixed(2)}%`;
};

const renderAccruedToTreasury = (item: ReserveItem) => {
  const { version, accruedToTreasury } = item;
  if (version !== ReserveVersion.v3) return 'N/A';
  return <NumeralCol value={accruedToTreasury} />;
};

export const renderFunctions: Record<
  ColumnKeys,
  (
    item: ReserveItem,
    emodes?: Emode[],
    emodeLoading?: boolean,
  ) => string | number | JSX.Element
> = {
  [ColumnKeys.SUPPLY_USAGE_RATIO]: (item) =>
    `${(+item.supplyUsageRatio * 100).toFixed(2)}%`,
  [ColumnKeys.AVAILABLE_LIQUIDITY]: (item) => {
    return (
      <NumeralCol
        value={Number(item.availableLiquidity)}
        valueUSD={Math.max(Number(item.availableLiquidityUSD), 0)}
      />
    );
  },
  [ColumnKeys.SUPPLY_CAP]: renderSupplyCap,
  [ColumnKeys.BORROW_CAP]: renderBorrowCap,
  [ColumnKeys.SUPPLY_UTIL]: renderSupplyUtilization,
  [ColumnKeys.BORROW_UTIL]: renderBorrowUtilization,
  [ColumnKeys.TOTAL_DEBT]: (item) => (
    <NumeralCol value={item.totalDebt} valueUSD={item.totalDebtUSD} />
  ),
  [ColumnKeys.ASSET_PRICE]: (item) => (
    <NumeralCol value={item.priceInUSD} isFirstUSD />
  ),
  [ColumnKeys.VO_DELTA]: (item) =>
    numeral(item.virtualAccountingDelta).format('0.[000000]') === 'NaN' ? (
      '0'
    ) : (
      <NumeralCol
        value={item.virtualAccountingDelta}
        withoutNegativeBlock
        decimals={'000000'}
      />
    ),
  [ColumnKeys.DECIMALS]: (item) => item.decimals,
  [ColumnKeys.VO_DELTA_PERCENT]: (item) =>
    numeral(item.virtualAccountingDeltaPercent).format('0.[00000]') === 'NaN'
      ? '0%'
      : `${numeral(item.virtualAccountingDeltaPercent.toFixed(7)).format('0.[00000]')}%`,
  [ColumnKeys.ACCRUED_TO_TREASURY]: renderAccruedToTreasury,
  [ColumnKeys.TOTAL_LIQUIDITY]: (item) => (
    <NumeralCol value={item.totalLiquidity} valueUSD={item.totalLiquidityUSD} />
  ),
  [ColumnKeys.VIRTUAL_UNDERLYING_BALANCE]: (item) => {
    if (item.version !== ReserveVersion.v3) return 'N/A';
    else
      return (
        <NumeralCol
          value={formatUnits(
            BigInt(item.virtualUnderlyingBalance),
            item.decimals,
          ).toString()}
        />
      );
  },
  [ColumnKeys.TOTAL_SCALED_ATOKEN_SUPPLY]: (item) => {
    if (item.version !== ReserveVersion.v3) return 'N/A';
    else
      return (
        <NumeralCol
          value={formatUnits(
            BigInt(item.totalScaledATokenSupply),
            item.decimals,
          ).toString()}
        />
      );
  },
  [ColumnKeys.LIQUIDATION_GRACE_PERIOD_UTIL]: (item) => {
    if (item.version !== ReserveVersion.v3) return 'N/A';
    if (+item.liquidationGracePeriodUntil === 0) return '0';
    return `${dayjs.unix(+item.liquidationGracePeriodUntil).format('HH:mm | DD MMMM')}`;
  },
  [ColumnKeys.RESERVE_LIQUIDATION_THRESHOLD]: (item) =>
    `${+item.reserveLiquidationThreshold / 100}%`,
  [ColumnKeys.BASE_LTV_AS_COLLATERAL]: (item) =>
    `${+item.baseLTVasCollateral / 100}%`,
  [ColumnKeys.PENDING_LTV]: (item) => `${+item.pendingLTV / 100}%`,
  [ColumnKeys.IS_FROZEN]: (item) => <BoolCol isChecked={item.isFrozen} />,
  [ColumnKeys.IS_PAUSED]: (item) => <BoolCol isChecked={item.isPaused} />,
  [ColumnKeys.BORROWABLE_IN_ISOLATION]: (item) => (
    <BoolCol isChecked={item.borrowableInIsolation} />
  ),
  [ColumnKeys.FLASH_LOAN_ENABLED]: (item) => (
    <BoolCol isChecked={item.flashLoanEnabled} />
  ),
  [ColumnKeys.USAGE_AS_COLLATERAL_ENABLED]: (item) => (
    <BoolCol isChecked={item.usageAsCollateralEnabled} />
  ),
  [ColumnKeys.BORROWING_ENABLED]: (item) => (
    <BoolCol isChecked={item.isFrozen ? false : item.borrowingEnabled} />
  ),
  [ColumnKeys.IS_ISOLATED]: (item) => <BoolCol isChecked={item.isIsolated} />,
  [ColumnKeys.DEBT_CEILING]: (item) => {
    if (+item.debtCeiling > 0) {
      return (
        <Box
          sx={{
            px: 4,
            display: 'inline-flex',
            i: {
              fontStyle: 'normal',
              display: 'inline-block',
              mx: 2,
              '&:last-of-type': {
                typography: 'descriptor',
              },
            },
          }}>
          <i>$</i>{' '}
          <Box>{numeral(item.isolationModeTotalDebtUSD).format('0.0a')}</Box>
          <i>of</i> <Box>{numeral(item.debtCeilingUSD).format('0.0a')}</Box>
        </Box>
      );
    } else {
      return <>-</>;
    }
  },
  [ColumnKeys.RESERVE_ID]: (item) => item.reserveId ?? 'N/A',
  [ColumnKeys.IS_SILOED_BORROWING]: (item) => (
    <BoolCol isChecked={item.isSiloedBorrowing} />
  ),
  [ColumnKeys.VIRTUAL_ACC_ACTIVE]: (item) => (
    <BoolCol isChecked={item.virtualAccActive} />
  ),
  [ColumnKeys.RESERVE_LIQUIDATION_BONUS]: (item) =>
    `${
      item.reserveLiquidationBonus === '0'
        ? 0
        : parseInt(item.reserveLiquidationBonus.substring(1)) / 100
    }%`,
  [ColumnKeys.RESERVE_FACTOR]: (item) =>
    `${+(+item.reserveFactor * 100).toFixed(2)}%`,
  [ColumnKeys.VARIABLE_BORROW_APY]: (item) =>
    `${+(+item.variableBorrowAPY * 100).toFixed(2)}%`,
  [ColumnKeys.VARIABLE_BORROW_APR]: (item) =>
    `${+(+item.variableBorrowAPR * 100).toFixed(2)}%`,
  [ColumnKeys.LIQUIDITY_INDEX]: (item) => (
    <NumeralCol value={Number(item.liquidityIndex) / 1e27} />
  ),
  [ColumnKeys.VARIABLE_BORROW_INDEX]: (item) => (
    <NumeralCol value={Number(item.variableBorrowIndex) / 1e27} />
  ),
  [ColumnKeys.LIQUIDITY_RATE]: (item) =>
    +((Number(item.liquidityRate) / 1e27) * 100).toFixed(2) + '%',

  [ColumnKeys.BASE_VARIABLE_BORROW_RATE]: (item) =>
    +((Number(item.baseVariableBorrowRate) / 1e27) * 100).toFixed(2) + '%',
  [ColumnKeys.OPTIMAL_USAGE_RATIO]: (item) =>
    +((Number(item.optimalUsageRatio) / 1e27) * 100).toFixed(2) + '%',

  [ColumnKeys.SYMBOL]: (item) => (
    <SymbolCol
      initSymbol={item.symbol}
      initName={item.name}
      version={item.version}
      chainId={item.chainId}
      pool={item.pool}
    />
  ),
  [ColumnKeys.Liquidation_Protocol_Fee]: (item) =>
    item.liquidationProtocolFee
      ? `${+(+item.liquidationProtocolFee / 100).toFixed(2)}%`
      : '-',
  [ColumnKeys.DEFICIT]: (item) => {
    if (item.version !== ReserveVersion.v3) return 'N/A';
    return (
      <NumeralCol
        value={item.deficit}
        valueUSD={item.deficitUSD}
        toolTipSuffix={' ' + item.symbol}
      />
    );
  },

  // modal
  [ColumnKeys.TOTAL_SUPPLY]: (item) =>
    numeral(+item.totalLiquidity).format('0.00a'),
  [ColumnKeys.TOTAL_SUPPLY_USD]: (item) =>
    numeral(+item.totalLiquidityUSD).format('0.00a'),
  [ColumnKeys.SUPPLY_CAP_MODAL]: (item) =>
    item.version === ReserveVersion.v3
      ? numeral(+item.supplyCap).format('0.[00]a')
      : 'N/A',
  [ColumnKeys.SUPPLY_CAP_USD]: (item) =>
    numeral(+item.supplyCapUSD).format('0.[00]a'),
  [ColumnKeys.TOTAL_DEBT_MODAL]: (item) =>
    numeral(+item.totalDebt).format('0.[00]a'),
  [ColumnKeys.TOTAL_DEBT_USD]: (item) =>
    numeral(+item.totalDebtUSD).format('0.[00]a'),
  [ColumnKeys.BORROW_CAP_MODAL]: (item) =>
    numeral(+item.borrowCap).format('0.[00]a'),
  [ColumnKeys.BORROW_CAP_USD]: (item) =>
    numeral(+item.borrowCapUSD).format('0.[00]a'),
  [ColumnKeys.SUPPLY_APY]: (item) => `${+(+item.supplyAPY * 100).toFixed(2)}%`,
  [ColumnKeys.VARIABLE_RATE_SLOPE_1]: (item) =>
    `${formatUnits(item.variableRateSlope1, 25)}%`,
  [ColumnKeys.VARIABLE_RATE_SLOPE_2]: (item) =>
    `${formatUnits(item.variableRateSlope2, 25)}%`,

};

// render reserve field in specific format based on the key
export const renderReserveField = (
  key: ColumnKeys,
  item: ReserveItem,
  emodes?: Emode[],
  emodesLoading?: boolean,
) => {
  const renderFn = renderFunctions[key];
  return renderFn
    ? renderFn(item, emodes, emodesLoading)
    : item[key as keyof ReserveItem];
};

export const compareArrays = (array1: string[], array2: string[]) => {
  return (
    array1.length === array2.length &&
    array1.every((item1) => array2.some((item2) => item1 === item2))
  );
};

export const updateUrlParams = (
  router: AppRouterInstance,
  params: Record<string, string[]>,
  pathName?: string,
  fromEmpty?: boolean,
) => {
  const search = window.location.search.substr(1);
  const queryParams = new URLSearchParams(fromEmpty ? '' : search);
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      queryParams.set(key, value.join(','));
    } else {
      queryParams.set(key, value);
    }
  }
  router.push(
    (pathName ?? window.location.pathname) + '?' + queryParams.toString(),
    {
      scroll: false,
    },
  );
};

export const getTextWidth = (text: string, font: string) => {
  if (typeof document === 'undefined') return 0;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context === null) return 0;
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};
