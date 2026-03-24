import { formatUnits } from 'viem';

import { LTV_PRECISION, SECONDS_PER_YEAR } from './constants';
import * as RayMath from './ray-math';
import { RAY, rayPow } from './ray-math';

interface CalculateCompoundedInterestRequest {
  rate: bigint;
  currentTimestamp: number;
  lastUpdateTimestamp: number;
}

export function calculateCompoundedInterest({
  rate,
  currentTimestamp,
  lastUpdateTimestamp,
}: CalculateCompoundedInterestRequest): bigint {
  const exp = BigInt(currentTimestamp - lastUpdateTimestamp);

  if (exp == 0n) {
    return RayMath.RAY;
  }

  const expMinusOne = exp - 1n;
  const expMinusTwo = exp > 2 ? exp - 2n : 0n;
  const basePowerTwo =
    RayMath.rayMul(rate, rate) / (SECONDS_PER_YEAR * SECONDS_PER_YEAR);
  const basePowerThree = RayMath.rayMul(basePowerTwo, rate) / SECONDS_PER_YEAR;

  const secondTerm = (exp * expMinusOne * basePowerTwo) / 2n;
  const thirdTerm = (exp * expMinusOne * expMinusTwo * basePowerThree) / 6n;
  return RayMath.RAY + (rate * exp) / SECONDS_PER_YEAR + secondTerm + thirdTerm;
}

export function calculateCompoundedRate({
  rate,
  duration,
}: {
  rate: bigint;
  duration: bigint;
}) {
  return rayPow(rate / SECONDS_PER_YEAR + RAY, duration) - RAY;
}

interface LinearInterestRequest {
  rate: bigint;
  currentTimestamp: number;
  lastUpdateTimestamp: number;
}

export function calculateLinearInterest({
  rate,
  currentTimestamp,
  lastUpdateTimestamp,
}: LinearInterestRequest): bigint {
  return (
    (rate * BigInt(currentTimestamp - lastUpdateTimestamp)) / SECONDS_PER_YEAR +
    RayMath.RAY
  );
}

interface NormalizedIncomeRequest {
  rate: bigint;
  index: bigint;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}
export function getNormalizedIncome({
  rate,
  index,
  lastUpdateTimestamp,
  currentTimestamp,
}: NormalizedIncomeRequest): bigint {
  if (!rate) {
    return index;
  }

  const cumulatedInterest = calculateLinearInterest({
    rate,
    currentTimestamp,
    lastUpdateTimestamp,
  });

  return RayMath.rayMul(index, cumulatedInterest);
}

export function getNormalizedDebt({
  rate,
  index,
  currentTimestamp,
  lastUpdateTimestamp,
}: NormalizedIncomeRequest): bigint {
  if (currentTimestamp === lastUpdateTimestamp || rate === 0n) {
    return index;
  }
  return RayMath.rayMul(
    index,
    calculateCompoundedInterest({
      rate,
      currentTimestamp,
      lastUpdateTimestamp,
    }),
  );
}

interface CurrentBalanceRequest {
  scaledBalance: bigint;
  index: bigint;
  rate: bigint;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}
export function getCurrentLiquidityBalance({
  scaledBalance,
  index,
  rate,
  lastUpdateTimestamp,
  currentTimestamp,
}: CurrentBalanceRequest) {
  if (!scaledBalance) {
    return 0n;
  }

  return RayMath.rayToWad(
    RayMath.rayMul(
      RayMath.wadToRay(scaledBalance),
      getNormalizedIncome({
        rate,
        index,
        lastUpdateTimestamp,
        currentTimestamp,
      }),
    ),
  );
}

export function getCurrentDebtBalance({
  index,
  scaledBalance,
  rate,
  lastUpdateTimestamp,
  currentTimestamp,
}: CurrentBalanceRequest): bigint {
  if (!scaledBalance) {
    return 0n;
  }

  return RayMath.rayMul(
    scaledBalance,
    getNormalizedDebt({
      index,
      rate,
      currentTimestamp,
      lastUpdateTimestamp,
    }),
  );
}

interface HealthFactorFromBalanceRequest {
  collateralBalanceMarketReferenceCurrency: bigint;
  borrowBalanceMarketReferenceCurrency: bigint;
  averageLiquidationThreshold: bigint;
}

// 1e18 returned means 1HF
export function calculateHealthFactorFromBalances({
  borrowBalanceMarketReferenceCurrency,
  collateralBalanceMarketReferenceCurrency,
  averageLiquidationThreshold,
}: HealthFactorFromBalanceRequest): bigint {
  if (!borrowBalanceMarketReferenceCurrency) {
    return -1n; // Invalid number
  }

  return RayMath.wadDiv(
    (collateralBalanceMarketReferenceCurrency * averageLiquidationThreshold) /
      10n ** LTV_PRECISION,
    borrowBalanceMarketReferenceCurrency,
  );
}

interface AvailableBorrowsMarketReferenceCurrencyRequest {
  collateralBalanceMarketReferenceCurrency: bigint;
  borrowBalanceMarketReferenceCurrency: bigint;
  currentLtv: bigint;
}

export function calculateAvailableBorrowsMarketReferenceCurrency({
  collateralBalanceMarketReferenceCurrency,
  borrowBalanceMarketReferenceCurrency,
  currentLtv,
}: AvailableBorrowsMarketReferenceCurrencyRequest): bigint {
  if (!currentLtv) {
    return 0n;
  }

  const availableBorrowsMarketReferenceCurrency =
    (collateralBalanceMarketReferenceCurrency * currentLtv) /
      10n ** LTV_PRECISION -
    borrowBalanceMarketReferenceCurrency;
  return availableBorrowsMarketReferenceCurrency > 0
    ? availableBorrowsMarketReferenceCurrency
    : 0n;
}

interface MarketReferenceCurrencyAndUsdBalanceRequest {
  balance: bigint;
  priceInMarketReferenceCurrency: bigint;
  marketReferenceCurrencyDecimals: number;
  decimals: number;
  marketReferencePriceInUsdNormalized: number;
}

/**
 * @returns non humanized/normalized values for usd/marketReference
 */
export function getMarketReferenceCurrencyAndUsdBalance({
  balance,
  priceInMarketReferenceCurrency,
  marketReferenceCurrencyDecimals,
  decimals,
  marketReferencePriceInUsdNormalized,
}: MarketReferenceCurrencyAndUsdBalanceRequest) {
  const marketReferenceCurrencyBalance = Number(
    formatUnits(balance * priceInMarketReferenceCurrency, decimals),
  );

  const usdBalance =
    (marketReferenceCurrencyBalance * marketReferencePriceInUsdNormalized) /
    10 ** marketReferenceCurrencyDecimals;

  return { marketReferenceCurrencyBalance, usdBalance };
}
