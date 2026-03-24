import { bisector } from 'd3-array';
import { formatUnits, parseUnits } from 'viem';

import { RAY, rayDiv, rayMul } from '../../../helpers/math-utils/ray-math';

export type TooltipData = Rate;

export type InterestRateModelType = {
  variableRateSlope1: bigint;
  variableRateSlope2: bigint;
  optimalUsageRatio: bigint;
  baseVariableBorrowRate: bigint;
};

export type Rate = {
  variableRate: number;
  supplyRate: number;
  utilization: number;
};

// accessors
export const getDate = (d: Rate) => d.utilization;
export const bisectDate = bisector<Rate, number>((d) => d.utilization).center;
export const getVariableBorrowRate = (d: Rate) => d.variableRate * 100;
export const getSupplyRate = (d: Rate) => d.supplyRate * 100;

const resolution = 200;
const step = 100 / resolution;

export const tooltipValueAccessors = {
  variableBorrowRate: getVariableBorrowRate,
  supplyRate: getSupplyRate,
  utilizationRate: () => 38,
};

export function getRates({
  variableRateSlope1,
  variableRateSlope2,
  optimalUsageRatio,
  baseVariableBorrowRate,
  reserveFactor = 0n,
}: InterestRateModelType & { reserveFactor?: bigint }): Rate[] {
  const rates: Rate[] = [];
  const formattedOptimalUtilizationRate = Number(
    formatUnits(optimalUsageRatio, 25),
  );

  const formattedReserveFactor = Number(formatUnits(reserveFactor, 4));

  for (let i = 0; i <= resolution; i++) {
    const utilization = i * step;

    const theoreticalVariableAPY = Number(
      formatUnits(
        baseVariableBorrowRate +
          rayDiv(
            rayMul(
              variableRateSlope1,
              parseUnits(String(utilization > 0 ? utilization : 0.00001), 25),
            ),
            optimalUsageRatio,
          ),
        27,
      ),
    );

    const supplyRate =
      theoreticalVariableAPY *
      (utilization / 100) *
      (1 - formattedReserveFactor);

    // When zero
    if (utilization === 0) {
      rates.push({
        variableRate: theoreticalVariableAPY,
        supplyRate: 0,
        utilization,
      });
    }
    // When hovering below optimal utilization rate, actual data
    else if (utilization < formattedOptimalUtilizationRate) {
      rates.push({
        variableRate: theoreticalVariableAPY,
        supplyRate,
        utilization,
      });
    }
    // When hovering above optimal utilization rate, hypothetical predictions
    else {
      const excess = rayDiv(
        parseUnits(String(utilization), 25) - optimalUsageRatio,
        RAY - optimalUsageRatio,
      );

      const theoreticalVariableAPY = Number(
        formatUnits(
          baseVariableBorrowRate +
            variableRateSlope1 +
            rayMul(variableRateSlope2, excess),
          27,
        ),
      );

      const supplyRateAboveOptimal =
        theoreticalVariableAPY *
        (utilization / 100) *
        (1 - formattedReserveFactor);

      rates.push({
        variableRate: theoreticalVariableAPY,
        supplyRate: supplyRateAboveOptimal,
        utilization,
      });
    }
  }

  return rates;
}
