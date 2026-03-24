import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils/index';

import { marketHelper, ReservePool, ReserveVersion } from '../constants';
import { formatSymbol } from '../helpers/formatSymbol';
import { Emode, ReserveItem } from '../types';
import { EmodesSelectedFilters } from './emodesSlice';
import { ReservesSelectedFilters } from './reservesSlice';

// generic functions
const getOption = (id: string | number) => {
  return {
    id: id.toString(),
    label: typeof id === 'number' ? getChainName(id) : id.toString(),
  };
};
const getOptions = (ids: (string | number)[]) => {
  return ids.map((id) => getOption(id));
};

// reserves utils
export const getReservesFiltersOptions = (reserves: ReserveItem[]) => {
  const chainIds = getOptions(Object.keys(marketHelper).map((id) => +id));
  const versions = getOptions([
    ...new Set(reserves.map((reserve) => reserve.version)),
  ]);
  const pools = getOptions([
    ...new Set(reserves.map((reserve) => reserve.pool)),
  ]);
  const assets = getOptions([
    ...new Set(reserves.map((reserve) => reserve.symbol)),
  ]);

  return {
    chainIds,
    versions,
    pools,
    assets,
  };
};

export const filteredReserves = (
  reserves: ReserveItem[],
  filters: ReservesSelectedFilters,
) =>
  reserves.filter((reserve) => {
    return (
      filters.chainId.includes(reserve.chainId.toString()) &&
      filters.version.includes(reserve.version.toString() as ReserveVersion) &&
      (filters.symbol.length === 0 ||
        filters.symbol
          .map((symbol) => formatSymbol(symbol))
          .includes(formatSymbol(reserve.symbol))) &&
      filters.pool.includes(reserve.pool.toString() as ReservePool)
    );
  });

// emodes utils
export const getEmodesFiltersOptions = (emodes: Emode[]) => {
  const emodeChainId = getOptions([
    ...new Set(emodes.map((emode) => emode.chainId)),
  ]);
  const emodePool = getOptions([
    ...new Set(emodes.map((emode) => emode.poolWithVersion.split('_')[0])),
  ]);
  const collateralAssets = getOptions([
    ...new Set(
      emodes
        .map((emode) => emode.collateralAssets.map((asset) => asset.symbol))
        .flat(),
    ),
  ]);
  const borrowableAssets = getOptions([
    ...new Set(
      emodes
        .map((emode) => emode.borrowableAssets.map((asset) => asset.symbol))
        .flat(),
    ),
  ]);

  return {
    emodeChainId,
    emodePool,
    collateralAssets,
    borrowableAssets,
  };
};

export const filteredEmodes = (
  emodes: Emode[],
  filters: EmodesSelectedFilters,
) =>
  emodes.filter((emode) => {
    return (
      filters.emodeChainId.includes(emode.chainId.toString()) &&
      filters.emodePool.includes(
        emode.poolWithVersion.split('_')[0].toString() as ReservePool,
      ) &&
      (filters.collateralAssets.length === 0 ||
        filters.collateralAssets.some((asset) =>
          emode.collateralAssets.map((asset) => asset.symbol).includes(asset),
        )) &&
      (filters.borrowableAssets.length === 0 ||
        filters.borrowableAssets.some((asset) =>
          emode.borrowableAssets.map((asset) => asset.symbol).includes(asset),
        ))
    );
  });
