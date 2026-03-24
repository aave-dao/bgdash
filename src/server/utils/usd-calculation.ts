import { parseUnits } from 'viem';

export function normalizedToUsd(
  value: number,
  marketReferenceCurrencyDecimals: number,
  marketReferencePriceInUsd: number,
) {
  return value > 0
    ? parseUnits(
        String(value * marketReferencePriceInUsd),
        marketReferenceCurrencyDecimals * -1,
      )
    : BigInt(0);
}

export function valueToUsd(value: number, marketReferencePriceInUsd: number) {
  return value * marketReferencePriceInUsd;
}
