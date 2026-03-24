import {
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
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

import { ReservePool, ReserveVersion } from '../constants';
import { SortConfig, SortDirection } from '../types';
import { ColumnKeys, columns } from './tableHelpers';

export const assetsPresets = {
  stablecoins: [
    'DAI',
    'USDC',
    'USDT',
    'sUSD',
    'LUSD',
    'MAI',
    'EURS',
    'jEUR',
    'agEUR',
    'fUSDT',
    'm.DAI',
    'm.USDC',
    'm.USDT',
    'DAI.e',
    'USDt',
    'FRAX',
    'USDT.e',
    'USDC.e',
    'sDAI',
    'GHO',
    'crvUSD',
    'PYUSD',
    'BUSD',
    'TUSD',
    'USDP',
    'FDUSD',
    'EURe',
    'EURA',
    'USDbC',
    'GUSD',
    'WXDAI',
    'USDt',
    'miMATIC',
  ],
  LST: ['wstETH', 'rETH', 'stETH', 'stETH.e', 'wstETH.e', 'stMATIC'],
  collateral: [
    'WETH',
    'WBTC',
    'USDC',
    'DAI',
    'AAVE',
    'USDT',
    'BUSD',
    'TUSD',
    'LINK',
    'sUSD',
    'GUSD',
  ],
};

export const chainIdsPresets = {
  all: [
    `${mainnet.id}`,
    `${optimism.id}`,
    `${polygon.id}`,
    `${metis.id}`,
    `${base.id}`,
    `${arbitrum.id}`,
    `${avalanche.id}`,
    `${gnosis.id}`,
    `${bsc.id}`,
    `${scroll.id}`,
    `${zksync.id}`,
    `${linea.id}`,
    `${sonic.id}`,
    `${celo.id}`,
    `${soneium.id}`,
    `${ink.id}`,
    `${plasma.id}`,
    `${mantle.id}`,
    `${megaeth.id}`,
  ],
};

export const versionsPresets = {
  all: [ReserveVersion.v2, ReserveVersion.v3],
};

export const fieldsPresets = {
  basic: [
    ColumnKeys.SYMBOL,
    ColumnKeys.SUPPLY_USAGE_RATIO,
    ColumnKeys.TOTAL_LIQUIDITY,
    ColumnKeys.AVAILABLE_LIQUIDITY,
    ColumnKeys.BORROWING_ENABLED,
  ],
  empty: [ColumnKeys.SYMBOL],
  risk: [
    ColumnKeys.SYMBOL,
    ColumnKeys.SUPPLY_CAP,
    ColumnKeys.BORROW_CAP,
    ColumnKeys.USAGE_AS_COLLATERAL_ENABLED,
    ColumnKeys.RESERVE_FACTOR,
    ColumnKeys.BASE_LTV_AS_COLLATERAL,
    ColumnKeys.RESERVE_LIQUIDATION_THRESHOLD,
    ColumnKeys.RESERVE_LIQUIDATION_BONUS,
    ColumnKeys.BORROWING_ENABLED,
    ColumnKeys.IS_ISOLATED,
    ColumnKeys.BORROWABLE_IN_ISOLATION,
  ],
  cap: [
    ColumnKeys.SYMBOL,
    ColumnKeys.SUPPLY_CAP,
    ColumnKeys.SUPPLY_UTIL,
    ColumnKeys.BORROW_CAP,
    ColumnKeys.BORROW_UTIL,
  ],
  supply: [
    ColumnKeys.SYMBOL,
    ColumnKeys.SUPPLY_USAGE_RATIO,
    ColumnKeys.SUPPLY_CAP,
    ColumnKeys.SUPPLY_UTIL,
    ColumnKeys.LIQUIDITY_INDEX,
    ColumnKeys.LIQUIDITY_RATE,
  ],
  borrow: [
    ColumnKeys.SYMBOL,
    ColumnKeys.BORROW_CAP,
    ColumnKeys.BORROW_UTIL,
    ColumnKeys.BORROWING_ENABLED,
    ColumnKeys.TOTAL_DEBT,
    ColumnKeys.VARIABLE_BORROW_INDEX,
    ColumnKeys.BASE_VARIABLE_BORROW_RATE,
    ColumnKeys.VARIABLE_BORROW_APY,
  ],
  utilization: [
    ColumnKeys.SYMBOL,
    ColumnKeys.SUPPLY_USAGE_RATIO,
    ColumnKeys.SUPPLY_UTIL,
    ColumnKeys.BORROW_UTIL,
    ColumnKeys.OPTIMAL_USAGE_RATIO,
  ],
};

export enum PresetType {
  Default = 'Default',
  Empty = 'Empty',
  Supply = 'Supply',
  Borrow = 'Borrow',
  Utilization = 'Utilization',
  StablecoinsV3 = 'StablecoinsV3',
  StablecoinsV2 = 'StablecoinsV2',
  LST = 'LST',
  CollateralRiskV3 = 'CollateralRiskV3',
  CollateralRiskV2 = 'CollateralRiskV2',
  Risk = 'Risk',
  CapsV3 = 'CapsV3',
}

export type GlobalPresets = Record<
  PresetType | string,
  {
    assets: string[];
    fields: string[];
    chainIds: string[];
    version: ReserveVersion[];
    pool: ReservePool[];
    sortConfig: SortConfig;
  }
>;

export const globalPresets: GlobalPresets = {
  [PresetType.Default]: {
    assets: [],
    fields: fieldsPresets.basic,
    chainIds: chainIdsPresets.all,
    version: [ReserveVersion.v3],
    pool: [ReservePool.aave],
    sortConfig: { key: null, direction: SortDirection.Ascending },
  },
  [PresetType.Empty]: {
    assets: [],
    fields: fieldsPresets.empty,
    chainIds: [],
    version: [],
    pool: [],
    sortConfig: { key: null, direction: SortDirection.Ascending },
  },
  [PresetType.Supply]: {
    assets: [],
    fields: fieldsPresets.supply,
    chainIds: chainIdsPresets.all,
    version: versionsPresets.all,
    pool: [
      ReservePool.aave,
      ReservePool.lido,
      ReservePool.etherfi,
      ReservePool.amm,
    ],
    sortConfig: { key: null, direction: SortDirection.Ascending },
  },
  [PresetType.Borrow]: {
    assets: [],
    fields: fieldsPresets.borrow,
    chainIds: chainIdsPresets.all,
    version: versionsPresets.all,
    pool: [
      ReservePool.aave,
      ReservePool.lido,
      ReservePool.etherfi,
      ReservePool.amm,
    ],
    sortConfig: { key: null, direction: SortDirection.Ascending },
  },
  [PresetType.Utilization]: {
    assets: [],
    fields: fieldsPresets.utilization,
    chainIds: chainIdsPresets.all,
    version: versionsPresets.all,
    pool: [
      ReservePool.aave,
      ReservePool.lido,
      ReservePool.etherfi,
      ReservePool.amm,
    ],
    sortConfig: { key: null, direction: SortDirection.Ascending },
  },
  [PresetType.StablecoinsV3]: {
    assets: assetsPresets.stablecoins,
    fields: fieldsPresets.basic,
    chainIds: chainIdsPresets.all,
    version: [ReserveVersion.v3],
    pool: [ReservePool.aave, ReservePool.lido, ReservePool.etherfi],
    sortConfig: { key: null, direction: SortDirection.Ascending },
  },
  [PresetType.StablecoinsV2]: {
    assets: assetsPresets.stablecoins,
    fields: fieldsPresets.basic,
    chainIds: chainIdsPresets.all,
    version: [ReserveVersion.v2],
    pool: [ReservePool.aave, ReservePool.amm],
    sortConfig: { key: null, direction: SortDirection.Ascending },
  },
  [PresetType.LST]: {
    assets: assetsPresets.LST,
    fields: fieldsPresets.basic,
    chainIds: chainIdsPresets.all,
    version: versionsPresets.all,
    pool: [
      ReservePool.aave,
      ReservePool.lido,
      ReservePool.etherfi,
      ReservePool.amm,
    ],
    sortConfig: { key: null, direction: SortDirection.Ascending },
  },
  [PresetType.CollateralRiskV3]: {
    assets: assetsPresets.collateral,
    fields: fieldsPresets.risk,
    chainIds: chainIdsPresets.all,
    version: [ReserveVersion.v3],
    pool: [ReservePool.aave, ReservePool.lido, ReservePool.etherfi],
    sortConfig: { key: null, direction: SortDirection.Ascending },
  },
  [PresetType.CollateralRiskV2]: {
    assets: assetsPresets.collateral,
    fields: fieldsPresets.risk
      .filter((field) => field !== ColumnKeys.SUPPLY_CAP)
      .filter((field) => field !== ColumnKeys.BORROW_CAP),
    chainIds: chainIdsPresets.all,
    version: [ReserveVersion.v2],
    pool: [ReservePool.aave, ReservePool.amm],
    sortConfig: { key: null, direction: SortDirection.Ascending },
  },
  [PresetType.Risk]: {
    assets: [],
    fields: fieldsPresets.risk,
    chainIds: chainIdsPresets.all,
    version: versionsPresets.all,
    pool: [
      ReservePool.aave,
      ReservePool.lido,
      ReservePool.etherfi,
      ReservePool.amm,
    ],
    sortConfig: { key: null, direction: SortDirection.Ascending },
  },
  [PresetType.CapsV3]: {
    assets: assetsPresets.stablecoins,
    fields: fieldsPresets.cap,
    chainIds: chainIdsPresets.all,
    version: [ReserveVersion.v3],
    pool: [ReservePool.aave, ReservePool.lido, ReservePool.etherfi],
    sortConfig: { key: null, direction: SortDirection.Ascending },
  },
};

// list of columns that are shown by default on first load
export const initialColumns = fieldsPresets.basic
  .map((columnKey) => {
    return columns.filter((column) => column.key === columnKey)[0];
  })
  .filter(Boolean);
