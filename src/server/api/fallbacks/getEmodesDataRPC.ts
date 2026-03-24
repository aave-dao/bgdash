import type { Address } from 'viem';

import { marketHelper, ReservePool, ReserveVersion } from '../../../constants';
import { fetchEmodesData } from './fetchEmodesData';
import { getAllReservesDataRPC } from './getAllReservesDataRPC';

let reservesData: Awaited<ReturnType<typeof getAllReservesDataRPC>>;

export const getEmodesDataRPC = async () => {
  reservesData = reservesData ?? (await getAllReservesDataRPC());
  const emodes = await Promise.all(
    Object.keys(marketHelper).flatMap(async (id) => {
      const chainId = Number.parseInt(id, 10) as keyof typeof marketHelper;

      const allEmodes = (
        await Promise.all([
          // TIP: NEW REQUEST TO RPC TO GET INFO ABOUT EMODES BY POOL SHOULD BE HERE
          fetchEmodesData(ReserveVersion.v3, ReservePool.aave, chainId),
          fetchEmodesData(ReserveVersion.v3, ReservePool.lido, chainId),
          fetchEmodesData(ReserveVersion.v3, ReservePool.etherfi, chainId),
        ])
      ).flatMap((v) => v ?? []);

      return allEmodes;
    }),
  );

  const updatedAt = Date.now();

  return emodes
    .flat()
    .map(({ id, chainId, borrowableAssets, collateralAssets, ...emode }) => ({
      ...emode,
      chainId: chainId as keyof typeof marketHelper,
      categoryId: id,
      updatedAt,
      assetsEnabledAsBorrowable: borrowableAssets.map((index) => {
        const reserve = reservesData.find(
          (reserve) =>
            reserve.poolIndex === index &&
            reserve.chainId === chainId &&
            `${reserve.pool}_${reserve.version}` === emode.poolWithVersion,
        );
        return {
          symbol: reserve?.symbol ?? 'Unknown',
          id: (reserve?.id ?? '0x') as Address,
        };
      }),
      assetsEnabledAsCollateral: collateralAssets.map((index) => {
        const reserve = reservesData.find(
          (reserve) =>
            reserve.poolIndex === index &&
            reserve.chainId === chainId &&
            `${reserve.pool}_${reserve.version}` === emode.poolWithVersion,
        );
        return {
          symbol: reserve?.symbol ?? 'Unknown',
          id: (reserve?.id ?? '0x') as Address,
        };
      }),
      assetsEnabledAsLtvZero: [] as { symbol: string; id: Address }[],
    }));
};
