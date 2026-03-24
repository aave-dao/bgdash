import dayjs from 'dayjs';

import { marketHelper, ReservePool, ReserveVersion } from '../../../constants';
import { fetchAndFormatReservesDataFromRPC } from './fetchAndFormatReservesDataFromRPC';

export async function getAllReservesDataRPC() {
  const reserves = await Promise.all(
    Object.keys(marketHelper).map(async (id) => {
      const chainId = Number.parseInt(id, 10) as keyof typeof marketHelper;
      const currentTimestamp = dayjs().unix();

      const allReserves = (
        await Promise.all([
          // TIP: NEW REQUEST TO RPC TO GET INFO ABOUT POOL SHOULD BE HERE
          fetchAndFormatReservesDataFromRPC(
            ReserveVersion.v3,
            ReservePool.aave,
            chainId,
            currentTimestamp,
          ),
          fetchAndFormatReservesDataFromRPC(
            ReserveVersion.v3,
            ReservePool.lido,
            chainId,
            currentTimestamp,
          ),
          fetchAndFormatReservesDataFromRPC(
            ReserveVersion.v3,
            ReservePool.etherfi,
            chainId,
            currentTimestamp,
          ),
          fetchAndFormatReservesDataFromRPC(
            ReserveVersion.v2,
            ReservePool.aave,
            chainId,
            currentTimestamp,
          ),
          fetchAndFormatReservesDataFromRPC(
            ReserveVersion.v2,
            ReservePool.amm,
            chainId,
            currentTimestamp,
          ),
        ])
      ).flatMap((x) => x || []);

      return allReserves;
    }),
  );

  return reserves
    .flat()
    .sort(
      (a, b) => +b.version.split('v').join('') - +a.version.split('v').join(''),
    );
}
