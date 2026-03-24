import { Box } from '@mui/system';
import prettyMs from 'pretty-ms';
import React from 'react';
import { formatUnits } from 'viem';

import { NumeralCol } from '../components/Dashboard/Cols/NumeralCol';
import { TokenIcon } from '../components/TokenIcon';
import { UmbrellaItem } from '../types';
import { calculateRewardApy } from '../utils/apy';
import { getCurrentUnixTimestamp } from '../utils/date';

// TODO: do something with this before a new market is added
const getDisplaySymbol = (symbol: string | undefined): string => {
  if (!symbol) return 'N/A';

  const match = symbol.match(/^stk(?:waEth)?([A-Z]+)\.v\d+$/);

  return match ? match[1] : symbol;
};

export enum UmbrellaColumnKeys {
  STAKE_TOKEN_SYMBOL = 'stakeTokenSymbol',
  STAKE_TOKEN_NAME = 'stakeTokenName',
  ASSETS = 'assets',
  TOTAL_ASSETS = 'totalAssets',
  TOTAL_SUPPLY = 'totalSupply',
  TARGET_LIQUIDITY = 'targetLiquidity',
  COOLDOWN = 'cooldown',
  UNSTAKE_WINDOW = 'unstakeWindow',
  DEFICIT_OFFSET = 'deficitOffset',
  PENDING_DEFICIT = 'pendingDeficit',
  ACTIVE_REWARDS = 'activeRewards',
}

export const umbrellaColumns = [
  { key: UmbrellaColumnKeys.STAKE_TOKEN_SYMBOL, label: 'Stake Token' },
  { key: UmbrellaColumnKeys.TOTAL_ASSETS, label: 'Total Assets' },
  { key: UmbrellaColumnKeys.TOTAL_SUPPLY, label: 'Total Supply' },
  { key: UmbrellaColumnKeys.TARGET_LIQUIDITY, label: 'Target Liquidity' },
  { key: UmbrellaColumnKeys.COOLDOWN, label: 'Cooldown' },
  { key: UmbrellaColumnKeys.UNSTAKE_WINDOW, label: 'Unstake Window' },
  { key: UmbrellaColumnKeys.DEFICIT_OFFSET, label: 'Deficit Offset' },
  { key: UmbrellaColumnKeys.PENDING_DEFICIT, label: 'Pending Deficit' },
  { key: UmbrellaColumnKeys.ACTIVE_REWARDS, label: 'Active Rewards' },
];

export const renderUmbrellaField = (
  key: UmbrellaColumnKeys,
  item: UmbrellaItem,
) => {
  switch (key) {
    case UmbrellaColumnKeys.STAKE_TOKEN_SYMBOL:
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <TokenIcon
            symbol={getDisplaySymbol(item.stakeTokenConfig?.stakeToken?.symbol)}
            size={28}
            stkStataToken={
              getDisplaySymbol(item.stakeTokenConfig?.stakeToken?.symbol) !==
              'GHO'
            }
            stkToken={
              getDisplaySymbol(item.stakeTokenConfig?.stakeToken?.symbol) ===
              'GHO'
            }
          />
          {item.stakeTokenConfig?.stakeToken?.symbol}
        </Box>
      );
    case UmbrellaColumnKeys.STAKE_TOKEN_NAME:
      return item.stakeTokenConfig?.stakeToken?.name || 'N/A';
    case UmbrellaColumnKeys.TOTAL_ASSETS: {
      const totalAssets = item.stakeTokenConfig?.totalAssets;
      const decimals = item.stakeTokenConfig?.stakeToken?.decimals || 18;
      const price = item.stakeTokenConfig?.stakeToken?.price;

      if (!totalAssets) {
        return <NumeralCol value={0} valueUSD={0} />;
      }

      const totalAssetsFormatted = formatUnits(BigInt(totalAssets), decimals);
      const totalAssetsNumber = Number(totalAssetsFormatted);

      let totalAssetsUSD = 0;
      if (price) {
        const priceNormalized = Number(formatUnits(BigInt(price), 8));
        totalAssetsUSD = totalAssetsNumber * priceNormalized;
      }

      return <NumeralCol value={totalAssetsNumber} valueUSD={totalAssetsUSD} />;
    }
    case UmbrellaColumnKeys.TOTAL_SUPPLY: {
      const totalSupply = item.stakeTokenConfig?.totalSupply;
      const decimals = item.stakeTokenConfig?.stakeToken?.decimals || 18;
      const price = item.stakeTokenConfig?.stakeToken?.price;

      if (!totalSupply) {
        return <NumeralCol value={0} valueUSD={0} />;
      }

      const totalSupplyFormatted = formatUnits(BigInt(totalSupply), decimals);
      const totalSupplyNumber = Number(totalSupplyFormatted);

      let totalSupplyUSD = 0;
      if (price) {
        const priceNormalized = Number(formatUnits(BigInt(price), 8));
        totalSupplyUSD = totalSupplyNumber * priceNormalized;
      }

      return <NumeralCol value={totalSupplyNumber} valueUSD={totalSupplyUSD} />;
    }
    case UmbrellaColumnKeys.ASSETS: {
      const totalAssets = item.stakeTokenConfig?.totalAssets;
      const totalSupply = item.stakeTokenConfig?.totalSupply;
      const decimals = item.stakeTokenConfig?.stakeToken?.decimals || 18;
      const price = item.stakeTokenConfig?.stakeToken?.price;

      if (!totalAssets && !totalSupply) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <NumeralCol value={0} valueUSD={0} />
            <Box sx={{ opacity: 0.2, fontWeight: 'bold' }}>/</Box>
            <NumeralCol value={0} valueUSD={0} />
          </Box>
        );
      }

      let totalAssetsNumber = 0;
      let totalAssetsUSD = 0;
      if (totalAssets) {
        const totalAssetsFormatted = formatUnits(BigInt(totalAssets), decimals);
        totalAssetsNumber = Number(totalAssetsFormatted);
        if (price) {
          const priceNormalized = Number(formatUnits(BigInt(price), 8));
          totalAssetsUSD = totalAssetsNumber * priceNormalized;
        }
      }

      let totalSupplyNumber = 0;
      let totalSupplyUSD = 0;
      if (totalSupply) {
        const totalSupplyFormatted = formatUnits(BigInt(totalSupply), decimals);
        totalSupplyNumber = Number(totalSupplyFormatted);
        if (price) {
          const priceNormalized = Number(formatUnits(BigInt(price), 8));
          totalSupplyUSD = totalSupplyNumber * priceNormalized;
        }
      }

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <NumeralCol value={totalAssetsNumber} valueUSD={totalAssetsUSD} />
          <Box sx={{ opacity: 0.2, fontWeight: 'bold' }}>/</Box>
          <NumeralCol value={totalSupplyNumber} valueUSD={totalSupplyUSD} />
        </Box>
      );
    }
    case UmbrellaColumnKeys.TARGET_LIQUIDITY: {
      const targetLiquidity = item.rewardsControllerConfigs?.targetLiquidity;
      const decimals = item.stakeTokenConfig?.stakeToken?.decimals || 18;
      const price = item.stakeTokenConfig?.stakeToken?.price;

      if (!targetLiquidity) {
        return <NumeralCol value={0} valueUSD={0} />;
      }

      const targetLiquidityFormatted = formatUnits(
        BigInt(targetLiquidity),
        decimals,
      );
      const targetLiquidityNumber = Number(targetLiquidityFormatted);

      let targetLiquidityUSD = 0;
      if (price) {
        const priceNormalized = Number(formatUnits(BigInt(price), 8));
        targetLiquidityUSD = targetLiquidityNumber * priceNormalized;
      }

      return (
        <NumeralCol
          value={targetLiquidityNumber}
          valueUSD={targetLiquidityUSD}
        />
      );
    }
    case UmbrellaColumnKeys.COOLDOWN: {
      const cooldown = item.stakeTokenConfig?.cooldown;
      if (!cooldown) return '0s';

      const cooldownSeconds = Number(cooldown);
      const cooldownMs = cooldownSeconds * 1000;

      return prettyMs(cooldownMs, { compact: true });
    }
    case UmbrellaColumnKeys.UNSTAKE_WINDOW: {
      const unstakeWindow = item.stakeTokenConfig?.unstakeWindow;
      if (!unstakeWindow) return '0s';

      const unstakeWindowSeconds = Number(unstakeWindow);
      const unstakeWindowMs = unstakeWindowSeconds * 1000;

      return prettyMs(unstakeWindowMs, { compact: true });
    }
    case UmbrellaColumnKeys.ACTIVE_REWARDS: {
      const activeRewards = item.rewardsControllerConfigs?.rewardConfigs || [];
      const stakeTokenConfig = item.stakeTokenConfig;

      const activeRewardsList = activeRewards.filter(
        (reward) =>
          reward.maxEmissionPerSecond && reward.maxEmissionPerSecond !== 0n,
      );

      if (activeRewardsList.length === 0) {
        return (
          <Box sx={{ color: '$textSecondary', typography: 'descriptor' }}>
            No active rewards
          </Box>
        );
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
          {activeRewardsList.map((reward, index) => {
            let apy = 0;

            if (
              stakeTokenConfig?.totalAssets &&
              stakeTokenConfig?.stakeToken?.price &&
              item.rewardsControllerConfigs?.targetLiquidity &&
              reward.reward?.price &&
              reward.maxEmissionPerSecond &&
              reward.distributionEnd
            ) {
              try {
                const rewardData = {
                  maxEmissionPerSecond: reward.maxEmissionPerSecond,
                  targetLiquidity:
                    item.rewardsControllerConfigs.targetLiquidity,
                  totalAssets: stakeTokenConfig.totalAssets,
                  distributionEnd: reward.distributionEnd,
                  decimals: stakeTokenConfig.stakeToken?.decimals || 18,
                  price: stakeTokenConfig.stakeToken.price,
                  priceFeedDecimals: 8,
                  token: {
                    decimals: reward.reward?.decimals || 18,
                    price: reward.reward.price,
                    priceFeedDecimals: 8,
                  },
                };

                const now = getCurrentUnixTimestamp();
                if (now < Number(rewardData.distributionEnd)) {
                  apy = calculateRewardApy(rewardData);
                }
              } catch (error) {
                console.warn('Error calculating reward APY:', error);
              }
            }

            return (
              <Box
                key={`${reward.reward?.symbol || 'reward'}-${index}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  typography: 'descriptor',
                }}>
                <TokenIcon
                  symbol={reward.reward?.symbol || 'TOKEN'}
                  size={16}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Box sx={{ fontWeight: 500 }}>
                    {reward.reward?.symbol || 'TOKEN'}
                  </Box>
                  <Box sx={{ color: '$textSecondary' }}>
                    {apy > 0 ? `${apy.toFixed(2)}%` : '-'}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      );
    }
    case UmbrellaColumnKeys.DEFICIT_OFFSET: {
      const deficitOffset = item.umbrellaConfig?.deficitOffset;
      const decimals = item.stakeTokenConfig?.stakeToken?.decimals || 18;
      const price = item.stakeTokenConfig?.stakeToken?.price;

      if (!deficitOffset || deficitOffset === 0n) {
        return <NumeralCol value={0} valueUSD={0} />;
      }

      const deficitOffsetFormatted = formatUnits(
        BigInt(deficitOffset),
        decimals,
      );
      const deficitOffsetNumber = Number(deficitOffsetFormatted);

      let deficitOffsetUSD = 0;
      if (price) {
        const priceNormalized = Number(formatUnits(BigInt(price), 8));
        deficitOffsetUSD = deficitOffsetNumber * priceNormalized;
      }

      return (
        <NumeralCol value={deficitOffsetNumber} valueUSD={deficitOffsetUSD} />
      );
    }
    case UmbrellaColumnKeys.PENDING_DEFICIT: {
      const pendingDeficit = item.umbrellaConfig?.pendingDeficit;
      const decimals = item.stakeTokenConfig?.stakeToken?.decimals || 18;
      const price = item.stakeTokenConfig?.stakeToken?.price;

      if (!pendingDeficit || pendingDeficit === 0n) {
        return <NumeralCol value={0} valueUSD={0} />;
      }

      const pendingDeficitFormatted = formatUnits(
        BigInt(pendingDeficit),
        decimals,
      );
      const pendingDeficitNumber = Number(pendingDeficitFormatted);

      let pendingDeficitUSD = 0;
      if (price) {
        const priceNormalized = Number(formatUnits(BigInt(price), 8));
        pendingDeficitUSD = pendingDeficitNumber * priceNormalized;
      }

      return (
        <NumeralCol value={pendingDeficitNumber} valueUSD={pendingDeficitUSD} />
      );
    }
    default:
      return 'N/A';
  }
};
