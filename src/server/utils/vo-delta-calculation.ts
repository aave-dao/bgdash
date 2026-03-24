import { formatUnits } from 'viem';

import {
  calculateCompoundedInterest,
  calculateLinearInterest,
} from '../../helpers/math-utils/pool-math';
import { rayDiv, rayMul } from '../../helpers/math-utils/ray-math';
import { ReserveItemInitial } from '../types';

export function calculateVODelta({
  item,
  currentTimestamp,
}: {
  item: {
    totalScaledATokenSupply: bigint;
  } & Pick<
    ReserveItemInitial,
    | 'deficit'
    | 'totalScaledATokenSupply'
    | 'accruedToTreasury'
    | 'virtualAccActive'
    | 'virtualUnderlyingBalance'
    | 'liquidityIndex'
    | 'liquidityRate'
    | 'lastUpdateTimestamp'
    | 'decimals'
    | 'totalScaledVariableDebt'
    | 'variableBorrowIndex'
    | 'variableBorrowRate'
  >;
  currentTimestamp: number;
}) {
  if (
    item.virtualUnderlyingBalance &&
    (item.accruedToTreasury !== 0n || item.totalScaledATokenSupply !== 0n)
  ) {
    const lastUpdateTotalDebt = rayMul(
      item.totalScaledVariableDebt,
      item.variableBorrowIndex,
    );

    const availableLiquidityPlusDebt =
      item.virtualUnderlyingBalance +
      (item.deficit || 0n) +
      lastUpdateTotalDebt;

    const variableBorrowCompoundedInterest = calculateCompoundedInterest({
      rate: item.variableBorrowRate,
      currentTimestamp,
      lastUpdateTimestamp: item.lastUpdateTimestamp,
    });

    const totalDebt = rayMul(
      lastUpdateTotalDebt,
      variableBorrowCompoundedInterest,
    );

    const liquidityRate =
      availableLiquidityPlusDebt > 0n
        ? rayDiv(
            rayMul(lastUpdateTotalDebt, item.variableBorrowRate),
            availableLiquidityPlusDebt,
          )
        : 0n;

    const liquidityLinearInterest = calculateLinearInterest({
      rate: liquidityRate,
      currentTimestamp,
      lastUpdateTimestamp: item.lastUpdateTimestamp,
    });
    const extendedATokenSupply = rayMul(
      item.totalScaledATokenSupply + item.accruedToTreasury,
      rayMul(item.liquidityIndex, liquidityLinearInterest),
    );

    const virtualAccountingDelta =
      item.virtualUnderlyingBalance +
      totalDebt +
      (item.deficit ?? 0n) -
      extendedATokenSupply;

    if (Math.abs(Number(virtualAccountingDelta)) >= 0.0000001) {
      const virtualAccountingDeltaPercent =
        (Number(virtualAccountingDelta) /
          Number(item.virtualUnderlyingBalance)) *
        100;

      return {
        virtualAccountingDelta: +formatUnits(
          virtualAccountingDelta,
          Number(item.decimals),
        ),
        virtualAccountingDeltaPercent: Number(virtualAccountingDeltaPercent),
      };
    }
  }

  return {
    virtualAccountingDelta: 0,
    virtualAccountingDeltaPercent: 0,
  };
}
