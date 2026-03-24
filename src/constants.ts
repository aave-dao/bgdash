import * as markets from '@bgd-labs/aave-address-book';
import { Address, Chain } from 'viem';
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
  fantom,
  gnosis,
  ink,
  linea,
  mainnet,
  mantle,
  megaeth,
  metis,
  optimism,
  plasma,
  polygon,
  scroll,
  soneium,
  sonic,
  zksync,
} from 'viem/chains';

import { Events, ReserveItem } from './types';

const allChains = [
  mainnet, optimism, gnosis, polygon, fantom, metis, base, arbitrum,
  avalanche, bsc, scroll, zksync, linea, sonic, celo, soneium, ink,
  plasma, mantle, megaeth,
] as const;

export const viemChains: Record<number, Chain> = Object.fromEntries(
  allChains.map((chain) => [chain.id, chain]),
);

// period per block in seconds
export const BlockPeriod: Record<number, number> = {
  [mainnet.id]: 12,
  [optimism.id]: 2,
  [gnosis.id]: 5,
  [polygon.id]: 2,
  [fantom.id]: 1,
  [metis.id]: 3,
  [base.id]: 2,
  [arbitrum.id]: 0.5,
  [avalanche.id]: 3,
  [bsc.id]: 3,
  [scroll.id]: 13,
  [zksync.id]: 0.9,
  [linea.id]: 2,
  [sonic.id]: 1,
  [celo.id]: 5,
  [soneium.id]: 2,
  [ink.id]: 1,
  [plasma.id]: 1,
  [mantle.id]: 1,
  [megaeth.id]: 1,
  // TIP: average block time for NEW CHAIN SHOULD BE HERE
};

export enum ReserveVersion {
  v2 = 'v2',
  v3 = 'v3',
  // TIP: NEW VERSION SHOULD BE HERE
}

export enum ReservePool {
  aave = 'aave',
  amm = 'amm',
  lido = 'lido',
  etherfi = 'etherfi',
  // TIP: NEW POOL NAME SHOULD BE HERE
}

export enum PoolsWithVersions {
  AAVEV2 = `${ReservePool.aave}_${ReserveVersion.v2}`,
  AMMV2 = `${ReservePool.amm}_${ReserveVersion.v2}`,
  AAVEV3 = `${ReservePool.aave}_${ReserveVersion.v3}`,
  LIDOV3 = `${ReservePool.lido}_${ReserveVersion.v3}`,
  ETHERFIV3 = `${ReservePool.etherfi}_${ReserveVersion.v3}`,
  // TIP: NEW POOL NAME WITH VERSION SHOULD BE HERE
}

type Addresses = {
  POOL: Address;
  UI_POOL_DATA_PROVIDER: Address;
  POOL_ADDRESSES_PROVIDER: Address;
  COLLECTOR?: Address;
  AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS?: Address;
  LENDING_RATE_ORACLE?: Address;
};

export const marketHelper = {
  [mainnet.id]: {
    [PoolsWithVersions.AAVEV2]: {
      POOL: markets.AaveV2Ethereum.POOL,
      UI_POOL_DATA_PROVIDER: markets.AaveV2Ethereum.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV2Ethereum.POOL_ADDRESSES_PROVIDER,
      LENDING_RATE_ORACLE: markets.AaveV2Ethereum.LENDING_RATE_ORACLE,
      COLLECTOR: markets.AaveV2Ethereum.COLLECTOR,
    },
    [PoolsWithVersions.AMMV2]: {
      POOL: markets.AaveV2EthereumAMM.POOL,
      UI_POOL_DATA_PROVIDER: markets.AaveV2EthereumAMM.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER:
        markets.AaveV2EthereumAMM.POOL_ADDRESSES_PROVIDER,
      LENDING_RATE_ORACLE: markets.AaveV2EthereumAMM.LENDING_RATE_ORACLE,
      COLLECTOR: markets.AaveV2EthereumAMM.COLLECTOR,
    },
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Ethereum.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x457f4b1Fe6a32DCe780482aE009F2f37d3638d1E' as const, // markets.AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Ethereum.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Ethereum.COLLECTOR,
    },
    [PoolsWithVersions.LIDOV3]: {
      POOL: markets.AaveV3EthereumLido.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x457f4b1Fe6a32DCe780482aE009F2f37d3638d1E' as const, // markets.AaveV3EthereumLido.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER:
        markets.AaveV3EthereumLido.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3EthereumLido.AAVE_PROTOCOL_DATA_PROVIDER,
    },
    [PoolsWithVersions.ETHERFIV3]: {
      POOL: markets.AaveV3EthereumEtherFi.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x457f4b1Fe6a32DCe780482aE009F2f37d3638d1E' as const,
      // markets.AaveV3EthereumEtherFi.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER:
        markets.AaveV3EthereumEtherFi.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3EthereumEtherFi.AAVE_PROTOCOL_DATA_PROVIDER,
    },
    // TIP: NEW POOL ADDRESSES FOR MAINNET SHOULD BE HERE
  },
  [optimism.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Optimism.POOL,
      UI_POOL_DATA_PROVIDER:
        '0xf127003b4e8884F76097988D0BC386Ee10360941' as const, // markets.AaveV3Optimism.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Optimism.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Optimism.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Optimism.COLLECTOR,
    },
    // ... for OPTIMISM ...
  },
  [gnosis.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Gnosis.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A' as const, // markets.AaveV3Gnosis.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Gnosis.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Gnosis.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Gnosis.COLLECTOR,
    },
    // ... for GNOSIS ...
  },
  [polygon.id]: {
    [PoolsWithVersions.AAVEV2]: {
      POOL: markets.AaveV2Polygon.POOL,
      UI_POOL_DATA_PROVIDER: markets.AaveV2Polygon.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV2Polygon.POOL_ADDRESSES_PROVIDER,
      LENDING_RATE_ORACLE: markets.AaveV2Polygon.LENDING_RATE_ORACLE,
      COLLECTOR: markets.AaveV2Polygon.COLLECTOR,
    },
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Polygon.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x9528E529CCBE1Fe062f876E11bB0dF6589CE9C6d' as const, // markets.AaveV3Polygon.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Polygon.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Polygon.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Polygon.COLLECTOR,
    },
    // ... for POLYGON ...
  },
  [metis.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Metis.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x2a323be63e08E08536Fc3b5d8C6f24825e68895e' as const, // markets.AaveV3Metis.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Metis.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Metis.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Metis.COLLECTOR,
    },
    // ... for METIS ...
  },
  [base.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Base.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x0Bf5bbfaE7808D329e0Ba8277e0b746BbfDA68f1' as const, // markets.AaveV3Base.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Base.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Base.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Base.COLLECTOR,
    },
    // ... for BASE ...
  },
  [arbitrum.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Arbitrum.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A' as const, // markets.AaveV3Arbitrum.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Arbitrum.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Arbitrum.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Arbitrum.COLLECTOR,
    },
    // ... for ARBITRUM ...
  },
  [avalanche.id]: {
    [PoolsWithVersions.AAVEV2]: {
      POOL: markets.AaveV2Avalanche.POOL,
      UI_POOL_DATA_PROVIDER: markets.AaveV2Avalanche.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV2Avalanche.POOL_ADDRESSES_PROVIDER,
      LENDING_RATE_ORACLE: markets.AaveV2Avalanche.LENDING_RATE_ORACLE,
      COLLECTOR: markets.AaveV2Avalanche.COLLECTOR,
    },
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Avalanche.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x9dEaa0e33F48530BE923d85f8FA7B7e2580e6089' as const, // markets.AaveV3Avalanche.UI_POOL_DATA_PROVIDER
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Avalanche.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Avalanche.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Avalanche.COLLECTOR,
    },
    // ... for AVALANCHE ...
  },
  [bsc.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3BNB.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x617332a777780F546261247F621051d0b98975Eb' as const, // markets.AaveV3BNB.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3BNB.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3BNB.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3BNB.COLLECTOR,
    },
    // ... for BINANCE ...
  },
  [scroll.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Scroll.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x8A6eD7ce6345b551b2E7f88cA3785F9331c9A99c' as const, // markets.AaveV3Scroll.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Scroll.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Scroll.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Scroll.COLLECTOR,
    },
    // ... for SCROLL ...
  },
  [zksync.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3ZkSync.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x318944d36993f61ea80f78f1edf69d5ea437dea6' as const, // markets.AaveV3ZkSync.UI_POOL_DATA_PROVIDER,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3ZkSync.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3ZkSync.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3ZkSync.COLLECTOR,
    },
    // ... for ZKSync ...
  },
  [linea.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Linea.POOL,
      UI_POOL_DATA_PROVIDER:
        '0xAE93BEa44dcbE52B625169588574d31e36fb3A67' as const,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Linea.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Linea.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Linea.COLLECTOR,
    },
  },
  [sonic.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Sonic.POOL,
      UI_POOL_DATA_PROVIDER:
        '0xd0929668178973d5994D5654929aCB3d6c2b9949' as const,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Sonic.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Sonic.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Sonic.COLLECTOR,
    },
  },
  [celo.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Celo.POOL,
      UI_POOL_DATA_PROVIDER:
        '0xb4F72E539E18f80b557D4C6bc5CD9C1A4d4afFaF' as const,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Celo.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Celo.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Celo.COLLECTOR,
    },
  },
  [soneium.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Soneium.POOL,
      UI_POOL_DATA_PROVIDER:
        '0xf6D7b72362c9E30ca5FfB02C0f8b21FeBC36B743' as const,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Soneium.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Soneium.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Soneium.COLLECTOR,
    },
  },
  [ink.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3InkWhitelabel.POOL,
      UI_POOL_DATA_PROVIDER:
        '0x6d4F341d8Bb3Dc5ABe822Aa940F1884508C13f99' as const,
      POOL_ADDRESSES_PROVIDER:
        markets.AaveV3InkWhitelabel.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3InkWhitelabel.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3InkWhitelabel.COLLECTOR,
    },
  },
  [plasma.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Plasma.POOL,
      UI_POOL_DATA_PROVIDER:
        '0xa7b40ed4dfAC9255EA9Dd218A3874f380D9FbBEB' as const,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Plasma.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Plasma.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Plasma.COLLECTOR,
    },
  },
  [mantle.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3Mantle.POOL,
      UI_POOL_DATA_PROVIDER:
        '0xf41193E25408F652AF878c47E4401A01B5E4B682' as const,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3Mantle.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3Mantle.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3Mantle.COLLECTOR,
    },
  },
  [megaeth.id]: {
    [PoolsWithVersions.AAVEV3]: {
      POOL: markets.AaveV3MegaEth.POOL,
      UI_POOL_DATA_PROVIDER:
        '0xa3255CfE96D192dDe036c30b10AF9a29bb358157' as const,
      POOL_ADDRESSES_PROVIDER: markets.AaveV3MegaEth.POOL_ADDRESSES_PROVIDER,
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS:
        markets.AaveV3MegaEth.AAVE_PROTOCOL_DATA_PROVIDER,
      COLLECTOR: markets.AaveV3MegaEth.COLLECTOR,
    },
  },
  // TIP: NEW CHAIN WITH POOL ADDRESSES SHOULD BE HERE
} satisfies Record<
  `${number}`,
  {
    [PoolsWithVersions.AAVEV2]?: Addresses;
    [PoolsWithVersions.AMMV2]?: Addresses;
    [PoolsWithVersions.AAVEV3]?: Addresses;
    [PoolsWithVersions.LIDOV3]?: Addresses;
    [PoolsWithVersions.ETHERFIV3]?: Addresses;
    // TIP: NEW POOL WITH VERSION TYPE SHOULD BE HERE
  }
>;

// need for events, to avoid invalid array length
export const poolsWithChainId = {
  AaveV2Ethereum: `${markets.AaveV2Ethereum.POOL}_${markets.AaveV2Ethereum.CHAIN_ID}`,
  AaveV2EthereumAMM: `${markets.AaveV2EthereumAMM.POOL}_${markets.AaveV2EthereumAMM.CHAIN_ID}`,
  AaveV3Ethereum: `${markets.AaveV3Ethereum.POOL}_${markets.AaveV3Ethereum.CHAIN_ID}`,
  AaveV3EthereumLido: `${markets.AaveV3EthereumLido.POOL}_${markets.AaveV3EthereumLido.CHAIN_ID}`,
  AaveV3EthereumEtherFi: `${markets.AaveV3EthereumEtherFi.POOL}_${markets.AaveV3EthereumEtherFi.CHAIN_ID}`,
  AaveV3Optimism: `${markets.AaveV3Optimism.POOL}_${markets.AaveV3Optimism.CHAIN_ID}`,
  AaveV3Gnosis: `${markets.AaveV3Gnosis.POOL}_${markets.AaveV3Gnosis.CHAIN_ID}`,
  AaveV2Polygon: `${markets.AaveV2Polygon.POOL}_${markets.AaveV2Polygon.CHAIN_ID}`,
  AaveV3Polygon: `${markets.AaveV3Polygon.POOL}_${markets.AaveV3Polygon.CHAIN_ID}`,
  AaveV3Metis: `${markets.AaveV3Metis.POOL}_${markets.AaveV3Metis.CHAIN_ID}`,
  AaveV3Base: `${markets.AaveV3Base.POOL}_${markets.AaveV3Base.CHAIN_ID}`,
  AaveV3Arbitrum: `${markets.AaveV3Arbitrum.POOL}_${markets.AaveV3Arbitrum.CHAIN_ID}`,
  AaveV2Avalanche: `${markets.AaveV2Avalanche.POOL}_${markets.AaveV2Avalanche.CHAIN_ID}`,
  AaveV3Avalanche: `${markets.AaveV3Avalanche.POOL}_${markets.AaveV3Avalanche.CHAIN_ID}`,
  AaveV3BNB: `${markets.AaveV3BNB.POOL}_${markets.AaveV3BNB.CHAIN_ID}`,
  AaveV3Scroll: `${markets.AaveV3Scroll.POOL}_${markets.AaveV3Scroll.CHAIN_ID}`,
  AaveV3ZkSync: `${markets.AaveV3ZkSync.POOL}_${markets.AaveV3ZkSync.CHAIN_ID}`,
  AaveV3Linea: `${markets.AaveV3Linea.POOL}_${markets.AaveV3Linea.CHAIN_ID}`,
  AaveV3Sonic: `${markets.AaveV3Sonic.POOL}_${markets.AaveV3Sonic.CHAIN_ID}`,
  AaveV3Celo: `${markets.AaveV3Celo.POOL}_${markets.AaveV3Celo.CHAIN_ID}`,
  AaveV3Soneium: `${markets.AaveV3Soneium.POOL}_${markets.AaveV3Soneium.CHAIN_ID}`,
  AaveV3InkWhitelabel: `${markets.AaveV3InkWhitelabel.POOL}_${markets.AaveV3InkWhitelabel.CHAIN_ID}`,
  AaveV3Plasma: `${markets.AaveV3Plasma.POOL}_${markets.AaveV3Plasma.CHAIN_ID}`,
  AaveV3Mantle: `${markets.AaveV3Mantle.POOL}_${markets.AaveV3Mantle.CHAIN_ID}`,
  AaveV3Megaeth: `${markets.AaveV3MegaEth.POOL}_${markets.AaveV3MegaEth.CHAIN_ID}`,
  // TIP: NEW POOL WITH CHAIN ID SHOULD BE HERE
} as const;

export type PoolsWithEvents = {
  [poolsWithChainId.AaveV2Ethereum]: Events;
  [poolsWithChainId.AaveV2EthereumAMM]: Events;
  [poolsWithChainId.AaveV3Ethereum]: Events;
  [poolsWithChainId.AaveV3EthereumLido]: Events;
  [poolsWithChainId.AaveV3EthereumEtherFi]: Events;
  [poolsWithChainId.AaveV3Optimism]: Events;
  [poolsWithChainId.AaveV3Gnosis]: Events;
  [poolsWithChainId.AaveV2Polygon]: Events;
  [poolsWithChainId.AaveV3Polygon]: Events;
  [poolsWithChainId.AaveV3Metis]: Events;
  [poolsWithChainId.AaveV3Base]: Events;
  [poolsWithChainId.AaveV3Arbitrum]: Events;
  [poolsWithChainId.AaveV2Avalanche]: Events;
  [poolsWithChainId.AaveV3Avalanche]: Events;
  [poolsWithChainId.AaveV3BNB]: Events;
  [poolsWithChainId.AaveV3Scroll]: Events;
  [poolsWithChainId.AaveV3ZkSync]: Events;
  [poolsWithChainId.AaveV3Linea]: Events;
  [poolsWithChainId.AaveV3Sonic]: Events;
  [poolsWithChainId.AaveV3Celo]: Events;
  [poolsWithChainId.AaveV3Soneium]: Events;
  [poolsWithChainId.AaveV3InkWhitelabel]: Events;
  [poolsWithChainId.AaveV3Plasma]: Events;
  [poolsWithChainId.AaveV3Mantle]: Events;
  [poolsWithChainId.AaveV3Megaeth]: Events;
  // TIP: NEED TO ADD TYPE FOR EVENTS FOR EVERY NEW POOL
};

// helper functions
export const getPoolAddresses = ({
  pool,
  version,
  chainId,
}: Pick<ReserveItem, 'pool' | 'version' | 'chainId'>) => {
  const chainConfig = marketHelper[`${chainId}`];
  const poolKey = `${pool}_${version}` as const;

  if (chainConfig && poolKey in chainConfig) {
    return chainConfig[poolKey as keyof typeof chainConfig];
  }

  return undefined;
};

export function getEventsKey(poolAddress: string, chainId: number) {
  return Object.entries(poolsWithChainId).filter(([key, value]) =>
    value === `${poolAddress}_${chainId}` ? key : undefined,
  )[0][1];
}
