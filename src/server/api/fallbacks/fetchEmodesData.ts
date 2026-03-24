import {
  getPoolAddresses,
  marketHelper,
  ReservePool,
  ReserveVersion,
} from '../../../constants';
import { getEmodesData } from './utils/getEmodes';

export async function fetchEmodesData(
  version: ReserveVersion,
  pool: ReservePool,
  chainId: keyof typeof marketHelper,
) {
  const poolAddresses = getPoolAddresses({ pool, version, chainId });
  if (!poolAddresses) return null;
  const { UI_POOL_DATA_PROVIDER, POOL_ADDRESSES_PROVIDER } = poolAddresses;
  if (!UI_POOL_DATA_PROVIDER || !POOL_ADDRESSES_PROVIDER) {
    return null;
  }
  const data = await getEmodesData({
    uiPoolAddress: UI_POOL_DATA_PROVIDER,
    poolAddressProviderAddress: POOL_ADDRESSES_PROVIDER,
    chainId,
    version,
    pool,
  });

  return data;
}
