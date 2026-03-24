import {
  Address,
  formatUnits,
  getContract,
  parseUnits,
  zeroAddress,
} from 'viem';

import {
  marketHelper,
  ReservePool,
  ReserveVersion,
} from '../../../../constants';
import {
  LTV_PRECISION,
  RAY_DECIMALS,
  SECONDS_PER_YEAR,
  USD_DECIMALS,
} from '../../../../helpers/math-utils/constants';
import {
  calculateCompoundedRate,
  getMarketReferenceCurrencyAndUsdBalance,
} from '../../../../helpers/math-utils/pool-math';
import { ReserveItem } from '../../../../types';
import { ReserveItemInitial } from '../../../types';
import { calculateReserveDebt } from '../../../utils/debt-calculation';
import { normalizedToUsd } from '../../../utils/usd-calculation';
import { calculateVODelta } from '../../../utils/vo-delta-calculation';
import { AaveProtocolDataProviderABI } from '../abis';
import { serverViemPublicClient } from './chains';

const ammSymbolMap: Record<string, string> = {
  '0xae461ca67b15dc8dc81ce7615e0320da1a9ab8d5': 'UNIDAIUSDC',
  '0x004375dff511095cc5a197a54140a24efef3a416': 'UNIWBTCUSDC',
  '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11': 'UNIDAIWETH',
  '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc': 'UNIUSDCWETH',
  '0xdfc14d2af169b0d36c4eff567ada9b2e0cae044f': 'UNIAAVEWETH',
  '0xb6909b960dbbe7392d405429eb2b3649752b4838': 'UNIBATWETH',
  '0x3da1313ae46132a397d90d95b1424a9a7e3e0fce': 'UNICRVWETH',
  '0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974': 'UNILINKWETH',
  '0xc2adda861f89bbb333c90c492cb837741916a225': 'UNIMKRWETH',
  '0x8bd1661da98ebdd3bd080f0be4e6d9be8ce9858c': 'UNIRENWETH',
  '0x43ae24960e5534731fc831386c07755a2dc33d47': 'UNISNXWETH',
  '0xd3d2e2692501a5c9ca623199d38826e513033a17': 'UNIUNIWETH',
  '0xbb2b8038a1640196fbe3e38816f3e67cba72d940': 'UNIWBTCWETH',
  '0x2fdbadf3c4d5a8666bc06645b8358ab803996e28': 'UNIYFIWETH',
  '0x1eff8af5d577060ba4ac8a29a13525bb0ee2a3d5': 'BPTWBTCWETH',
  '0x59a19d8c652fa0284f44113d0ff9aba70bd46fb4': 'BPTBALWETH',
};

export async function formatReserveDataFromRPC({
  reserveRaw,
  chainId,
  version,
  pool,
  index,
  currentTimestamp,
  marketReferenceCurrencyDecimals,
  marketReferencePriceInUsd,
  AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS,
}: {
  reserveRaw: ReserveItemInitial;
  chainId: keyof typeof marketHelper;
  version: ReserveVersion;
  pool: ReservePool;
  currentTimestamp: number;
  marketReferenceCurrencyDecimals: number;
  marketReferencePriceInUsd: bigint;
  AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS?: Address;
  index?: number;
}): Promise<ReserveItem> {
  const normalizeWithReserve = (n: bigint) =>
    formatUnits(n, Number(reserveRaw.decimals));

  const aaveProtocolDataProviderContract = AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS
    ? getContract({
        address: AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS || zeroAddress,
        abi: AaveProtocolDataProviderABI,
        client: serverViemPublicClient[chainId],
      })
    : undefined;

  const { totalDebt, totalLiquidity, borrowUsageRatio, supplyUsageRatio } =
    calculateReserveDebt({
      reserveRaw,
      currentTimestamp,
    });

  const { virtualAccountingDelta, virtualAccountingDeltaPercent } =
    calculateVODelta({
      item: {
        ...reserveRaw,
        totalScaledATokenSupply: reserveRaw.totalScaledATokenSupply ?? 0n,
      },
      // totalDebt,
      currentTimestamp,
    });

  const supplyAPY = calculateCompoundedRate({
    rate: reserveRaw.liquidityRate,
    duration: SECONDS_PER_YEAR,
  });
  const variableBorrowAPY = calculateCompoundedRate({
    rate: reserveRaw.variableBorrowRate,
    duration: SECONDS_PER_YEAR,
  });

  const isIsolated = reserveRaw.debtCeiling !== 0n;
  const availableDebtCeilingUSD = isIsolated
    ? formatUnits(
        reserveRaw.debtCeiling - reserveRaw.isolationModeTotalDebt,
        Number(reserveRaw.debtCeilingDecimals),
      )
    : '0';

  const availableLiquidity =
    reserveRaw.borrowCap === 0n
      ? reserveRaw.availableLiquidity
      : parseUnits(
          Math.max(
            // To avoid negative values
            Math.min(
              +formatUnits(
                reserveRaw.availableLiquidity,
                Number(reserveRaw.decimals),
              ),
              Number(reserveRaw.borrowCap) -
                (+formatUnits(totalDebt, Number(reserveRaw.decimals)) + 1),
            ),
            0,
          ).toFixed(Number(reserveRaw.decimals)),
          Number(reserveRaw.decimals),
        );

  const marketReferencePriceInUsdNormalized = Number(
    formatUnits(marketReferencePriceInUsd, Number(USD_DECIMALS)),
  );
  const formattedPriceInMarketReferenceCurrency = Number(
    formatUnits(
      reserveRaw.priceInMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
  );

  const reserve = {
    // custom values
    pool,
    version,
    chainId,
    poolIndex: reserveRaw?.id ?? index ?? -1,
    id: `${chainId}-${reserveRaw.underlyingAsset}-${pool}-${version}`.toLowerCase(),
    reserveId: reserveRaw.id,
    symbol: ammSymbolMap[reserveRaw.underlyingAsset.toLowerCase()]
      ? ammSymbolMap[reserveRaw.underlyingAsset.toLowerCase()]
      : reserveRaw.symbol,
    // addresses
    underlyingAsset: reserveRaw.underlyingAsset.toLowerCase(),
    aTokenAddress: reserveRaw.aTokenAddress.toString(),
    variableDebtTokenAddress: reserveRaw.variableDebtTokenAddress.toString(),
    interestRateStrategyAddress:
      reserveRaw.interestRateStrategyAddress.toString(),
    // bool values
    isIsolated,
    isPaused: reserveRaw.isPaused,
    borrowableInIsolation: reserveRaw.borrowableInIsolation,
    flashLoanEnabled: reserveRaw.flashLoanEnabled,
    isSiloedBorrowing: reserveRaw.isSiloedBorrowing,
    virtualAccActive: reserveRaw?.virtualAccActive ?? false,
    usageAsCollateralEnabled: reserveRaw.usageAsCollateralEnabled,
    borrowingEnabled: reserveRaw.borrowingEnabled,
    isActive: reserveRaw.isActive,
    isFrozen: reserveRaw.isFrozen,
    // values from contract
    name: reserveRaw.name,
    decimals: Number(reserveRaw.decimals),
    baseLTVasCollateral: reserveRaw.baseLTVasCollateral.toString(),
    reserveLiquidationThreshold:
      reserveRaw.reserveLiquidationThreshold.toString(),
    reserveLiquidationBonus: reserveRaw.reserveLiquidationBonus.toString(),
    liquidityIndex: reserveRaw.liquidityIndex.toString(),
    variableBorrowIndex: reserveRaw.variableBorrowIndex.toString(),
    liquidityRate: reserveRaw.liquidityRate.toString(),
    variableBorrowRate: reserveRaw.variableBorrowRate.toString(),
    lastUpdateTimestamp: reserveRaw.lastUpdateTimestamp,
    variableRateSlope1: reserveRaw.variableRateSlope1,
    variableRateSlope2: reserveRaw.variableRateSlope2,
    borrowCap: reserveRaw.borrowCap.toString(),
    supplyCap: reserveRaw.supplyCap.toString(),
    debtCeiling: reserveRaw.debtCeiling.toString(),
    debtCeilingDecimals: Number(reserveRaw.debtCeilingDecimals),
    isolationModeTotalDebt: reserveRaw.isolationModeTotalDebt.toString(),
    unbacked: reserveRaw.unbacked.toString(),
    virtualUnderlyingBalance: (
      reserveRaw?.virtualUnderlyingBalance ?? '0'
    ).toString(),
    liquidationGracePeriodUntil: Number(
      reserveRaw?.liquidationGracePeriodUntil ?? 0,
    ),
    pendingLTV: (reserveRaw?.pendingLtv ?? '0').toString(),
    totalScaledATokenSupply: (
      reserveRaw?.totalScaledATokenSupply ?? '0'
    ).toString(),
    baseVariableBorrowRate: reserveRaw.baseVariableBorrowRate,
    optimalUsageRatio: reserveRaw.optimalUsageRatio,
    priceOracle: reserveRaw.priceOracle,
    // formatted values
    deficit: normalizeWithReserve(reserveRaw?.deficit ?? 0n),
    availableLiquidity: normalizeWithReserve(availableLiquidity),
    accruedToTreasury: normalizeWithReserve(reserveRaw.accruedToTreasury),
    totalLiquidity: normalizeWithReserve(totalLiquidity),
    totalDebt: normalizeWithReserve(totalDebt),
    reserveFactor: formatUnits(reserveRaw.reserveFactor, Number(LTV_PRECISION)),
    supplyAPY: formatUnits(supplyAPY, Number(RAY_DECIMALS)),
    supplyAPR: formatUnits(reserveRaw.liquidityRate, Number(RAY_DECIMALS)),
    variableBorrowAPY: formatUnits(variableBorrowAPY, Number(RAY_DECIMALS)),
    variableBorrowAPR: formatUnits(
      reserveRaw.variableBorrowRate,
      Number(RAY_DECIMALS),
    ),
    totalScaledVariableDebt: normalizeWithReserve(
      reserveRaw.totalScaledVariableDebt,
    ),
    debtCeilingUSD: isIsolated
      ? formatUnits(
          reserveRaw.debtCeiling,
          Number(reserveRaw.debtCeilingDecimals),
        )
      : '0',
    isolationModeTotalDebtUSD: isIsolated
      ? formatUnits(
          reserveRaw.isolationModeTotalDebt,
          Number(reserveRaw.debtCeilingDecimals),
        )
      : '0',
    virtualAccountingDelta,
    virtualAccountingDeltaPercent,
    borrowUsageRatio: borrowUsageRatio.toString(),
    supplyUsageRatio: supplyUsageRatio.toString(),
    // usd values
    availableDebtCeilingUSD,
    borrowCapUSD: normalizedToUsd(
      Number(reserveRaw.borrowCap),
      marketReferenceCurrencyDecimals,
      formattedPriceInMarketReferenceCurrency,
    ).toString(),
    supplyCapUSD: normalizedToUsd(
      Number(reserveRaw.supplyCap),
      marketReferenceCurrencyDecimals,
      formattedPriceInMarketReferenceCurrency,
    ).toString(),
    unbackedUSD: normalizedToUsd(
      Number(reserveRaw.unbacked),
      marketReferenceCurrencyDecimals,
      formattedPriceInMarketReferenceCurrency,
    ).toString(),
    deficitUSD: getMarketReferenceCurrencyAndUsdBalance({
      balance: reserveRaw.deficit ?? 0n,
      decimals: Number(reserveRaw.decimals),
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserveRaw.priceInMarketReferenceCurrency,
      marketReferencePriceInUsdNormalized,
    }).usdBalance.toString(10),
    totalLiquidityUSD: getMarketReferenceCurrencyAndUsdBalance({
      balance: totalLiquidity,
      decimals: Number(reserveRaw.decimals),
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserveRaw.priceInMarketReferenceCurrency,
      marketReferencePriceInUsdNormalized,
    }).usdBalance.toString(10),
    availableLiquidityUSD: getMarketReferenceCurrencyAndUsdBalance({
      balance: availableLiquidity,
      decimals: Number(reserveRaw.decimals),
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserveRaw.priceInMarketReferenceCurrency,
      marketReferencePriceInUsdNormalized,
    }).usdBalance.toString(10),
    totalDebtUSD: getMarketReferenceCurrencyAndUsdBalance({
      balance: totalDebt,
      decimals: Number(reserveRaw.decimals),
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserveRaw.priceInMarketReferenceCurrency,
      marketReferencePriceInUsdNormalized,
    }).usdBalance.toString(10),
    priceInUSD: getMarketReferenceCurrencyAndUsdBalance({
      balance: parseUnits('1', Number(reserveRaw.decimals)),
      decimals: Number(reserveRaw.decimals),
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserveRaw.priceInMarketReferenceCurrency,
      marketReferencePriceInUsdNormalized,
    }).usdBalance.toString(10),
  };

  if (aaveProtocolDataProviderContract) {
    const liquidationProtocolFee =
      await aaveProtocolDataProviderContract.read.getLiquidationProtocolFee([
        reserve.underlyingAsset as Address,
      ]);
    return {
      liquidationProtocolFee: Number(liquidationProtocolFee),
      ...reserve,
    };
  } else {
    return reserve;
  }
}
