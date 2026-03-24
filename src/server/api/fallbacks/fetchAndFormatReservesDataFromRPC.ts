import {
  getPoolAddresses,
  marketHelper,
  ReservePool,
  ReserveVersion,
} from '../../../constants';
import { formatReserveDataFromRPC } from './utils/formatReserveData';
import { getReservesData } from './utils/getReservesData';

export async function fetchAndFormatReservesDataFromRPC(
  version: ReserveVersion,
  pool: ReservePool,
  chainId: keyof typeof marketHelper,
  currentTimestamp: number,
) {
  const poolAddresses = getPoolAddresses({ pool, version, chainId });

  if (!poolAddresses) return null;

  const {
    UI_POOL_DATA_PROVIDER,
    POOL_ADDRESSES_PROVIDER,
    AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS,
  } = poolAddresses;

  if (!UI_POOL_DATA_PROVIDER || !POOL_ADDRESSES_PROVIDER) {
    return null;
  }

  const reserves = await getReservesData({
    uiPoolAddress: UI_POOL_DATA_PROVIDER,
    poolAddressProviderAddress: POOL_ADDRESSES_PROVIDER,
    chainId,
    version,
    pool,
  });

  const reservesArray = reserves?.reservesData ?? [];
  const baseCurrencyData = reserves?.baseCurrencyData;

  return await Promise.all(
    reservesArray.map(
      async (reserve, index) =>
        await formatReserveDataFromRPC({
          reserveRaw: reserve,
          chainId,
          version,
          pool,
          index,
          currentTimestamp,
          marketReferenceCurrencyDecimals:
            baseCurrencyData?.marketReferenceCurrencyDecimals,
          marketReferencePriceInUsd:
            baseCurrencyData?.marketReferenceCurrencyPriceInUsd,
          AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS,
        }),
    ),
  );
}
