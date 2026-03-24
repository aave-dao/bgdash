import { calculateCompoundedInterest } from '../../helpers/math-utils/pool-math';
import { rayMul } from '../../helpers/math-utils/ray-math';
import { ReserveItemInitial } from '../types';

export function calculateReserveDebt({
  reserveRaw,
  currentTimestamp,
}: {
  reserveRaw: Pick<
    ReserveItemInitial,
    | 'totalScaledVariableDebt'
    | 'variableBorrowIndex'
    | 'variableBorrowRate'
    | 'lastUpdateTimestamp'
    | 'availableLiquidity'
    | 'unbacked'
  >;
  currentTimestamp: number;
}) {
  const totalDebt = rayMul(
    rayMul(
      BigInt(reserveRaw.totalScaledVariableDebt),
      BigInt(reserveRaw.variableBorrowIndex),
    ),
    calculateCompoundedInterest({
      rate: BigInt(reserveRaw.variableBorrowRate),
      currentTimestamp,
      lastUpdateTimestamp: reserveRaw.lastUpdateTimestamp,
    }),
  );

  const totalLiquidity = totalDebt + BigInt(reserveRaw.availableLiquidity);

  const borrowUsageRatio =
    totalLiquidity === 0n ? 0n : Number(totalDebt) / Number(totalLiquidity);

  const supplyUsageRatio =
    totalLiquidity === 0n
      ? 0n
      : Number(totalDebt) /
        (Number(totalLiquidity) + Number(reserveRaw.unbacked));

  return {
    totalDebt,
    totalLiquidity,
    borrowUsageRatio,
    supplyUsageRatio,
  };
}
