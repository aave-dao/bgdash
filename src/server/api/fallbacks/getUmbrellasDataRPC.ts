import {
  // AaveV3BaseSepolia,
  AaveV3Ethereum,
  // UmbrellaBaseSepolia,
  UmbrellaEthereum,
} from '@aave-dao/aave-address-book';
import { Address } from 'viem';
import { readContract } from 'viem/actions';

import { UmbrellaMarket } from '../../../types';
import { UMBRELLA_DATA_AGGREGATION_HELPER_ABI } from './abis/umbrellaDataAggregationHelper';
import { serverViemPublicClient } from './utils/chains';

const MARKETS = [
  // {
  //   id: `${AaveV3BaseSepolia.CHAIN_ID}-${AaveV3BaseSepolia.POOL}`,
  //   name: 'Base Sepolia',
  //   chainId: AaveV3BaseSepolia.CHAIN_ID,
  //   poolProvider: AaveV3BaseSepolia.POOL_ADDRESSES_PROVIDER,
  //   uiPoolDataProvider: AaveV3BaseSepolia.UI_POOL_DATA_PROVIDER,
  //   oracle: AaveV3BaseSepolia.ORACLE,
  //   rewardsController: UmbrellaBaseSepolia.UMBRELLA_REWARDS_CONTROLLER,
  //   umbrella: UmbrellaBaseSepolia.UMBRELLA,
  //   batchHelper: UmbrellaBaseSepolia.UMBRELLA_BATCH_HELPER,
  //   // umbrellaDataAggregationHelper: UmbrellaBaseSepolia.DATA_AGGREGATION_HELPER,
  //   umbrellaDataAggregationHelper: '0x139FAF11d09605d840cBd1b1FBE4Adf5FEac70a2',
  //   wrapNativeTokenAddress: AaveV3BaseSepolia.ASSETS.WETH.UNDERLYING,
  // },
  {
    id: `${AaveV3Ethereum.CHAIN_ID}-${AaveV3Ethereum.POOL}`,
    name: 'Ethereum',
    chainId: AaveV3Ethereum.CHAIN_ID,
    poolProvider: AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
    uiPoolDataProvider: AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
    oracle: AaveV3Ethereum.ORACLE,
    rewardsController: UmbrellaEthereum.UMBRELLA_REWARDS_CONTROLLER,
    umbrella: UmbrellaEthereum.UMBRELLA,
    batchHelper: UmbrellaEthereum.UMBRELLA_BATCH_HELPER,
    // umbrellaDataAggregationHelper: UmbrellaEthereum.DATA_AGGREGATION_HELPER,
    umbrellaDataAggregationHelper: '0x5061c5aaea55442a886fbc77dfd40e8489d1c07c',
    wrapNativeTokenAddress: AaveV3Ethereum.ASSETS.WETH.UNDERLYING,
  },
];

export const getUmbrellasDataRPC = async (): Promise<
  (UmbrellaMarket | null)[]
> => {
  try {
    const results = await Promise.allSettled(
      MARKETS.map(async (market) => {
        const umbrellaData = await readContract(
          serverViemPublicClient[market.chainId],
          {
            address: market.umbrellaDataAggregationHelper as Address,
            abi: UMBRELLA_DATA_AGGREGATION_HELPER_ABI,
            functionName: 'getUmbrellaData',
            args: [market.umbrella as Address, market.oracle as Address],
          },
        );

        const transformedUmbrellaData = umbrellaData.map((data) => ({
          stakeTokenConfig: {
            stakeToken: {
              token: data.stakeTokenConfig.stakeToken.token,
              price: data.stakeTokenConfig.stakeToken.price,
              name: data.stakeTokenConfig.stakeToken.name,
              symbol: data.stakeTokenConfig.stakeToken.symbol,
              decimals: data.stakeTokenConfig.stakeToken.decimals,
            },
            totalAssets: data.stakeTokenConfig.totalAssets,
            totalSupply: data.stakeTokenConfig.totalSupply,
            cooldown: data.stakeTokenConfig.cooldown,
            unstakeWindow: data.stakeTokenConfig.unstakeWindow,
          },
          rewardsControllerConfigs: {
            targetLiquidity: data.rewardsControllerConfigs.targetLiquidity,
            rewardConfigs: data.rewardsControllerConfigs.rewardConfigs.map(
              (reward) => ({
                reward: {
                  token: reward.reward.token,
                  price: reward.reward.price,
                  name: reward.reward.name,
                  symbol: reward.reward.symbol,
                  decimals: reward.reward.decimals,
                },
                maxEmissionPerSecond: reward.maxEmissionPerSecond,
                distributionEnd: reward.distributionEnd,
              }),
            ),
          },
          umbrellaConfig: {
            reserve: data.umbrellaConfig.reserve,
            deficitOffset: data.umbrellaConfig.deficitOffset,
            pendingDeficit: data.umbrellaConfig.pendingDeficit,
          },
        }));

        return {
          market: market.name,
          umbrella: market.umbrella as Address,
          oracle: market.oracle as Address,
          umbrellaData: transformedUmbrellaData,
        };
      }),
    );

    const allMarkets: (UmbrellaMarket | null)[] = results.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return null;
    });
    return allMarkets;
  } catch (error) {
    console.error('Error fetching umbrella data:', error);
    throw error;
  }
};
