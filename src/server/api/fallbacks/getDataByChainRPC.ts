import { marketHelper, ReservePool, ReserveVersion } from '../../../constants';
import { fetchAndFormatReservesDataFromRPC } from './fetchAndFormatReservesDataFromRPC';
import { getEmodesDataRPC } from './getEmodesDataRPC';

export async function getDataByChainRPC({
  version,
  pool,
  chainId,
  currentTimestamp,
  reserveId,
}: {
  version: ReserveVersion;
  pool: ReservePool;
  chainId: keyof typeof marketHelper;
  currentTimestamp: number;
  reserveId: string;
}) {
  const [reservesData, emodesData] = await Promise.all([
    fetchAndFormatReservesDataFromRPC(version, pool, chainId, currentTimestamp),
    getEmodesDataRPC().then((data) =>
      data.filter(
        (e) =>
          e.chainId === chainId && e.poolWithVersion === `${pool}_${version}`,
      ),
    ),
  ]);

  if (reservesData && emodesData) {
    return {
      reserve: reservesData.filter((reserve) => reserve.id === reserveId)[0],
      reservesData,
      emodesData,
    };
  }
}
