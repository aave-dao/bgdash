import { Address, getContract } from 'viem';

import {
  PoolsWithVersions,
  ReservePool,
  ReserveVersion,
} from '../../../../constants';
import { UIDataHelperABI } from '../abis';
import { serverViemPublicClient } from './chains';

function bitMapToIndexes(bitmap: bigint) {
  const reserveIndexes = [];
  for (let i = 0; bitmap != 0n; i++) {
    if (bitmap & 0x1n) reserveIndexes.push(i);
    bitmap = bitmap >> 1n;
  }
  return reserveIndexes;
}

export async function getEmodesData({
  uiPoolAddress,
  poolAddressProviderAddress,
  chainId,
  version,
  pool,
}: {
  uiPoolAddress: Address;
  poolAddressProviderAddress: Address;
  chainId: number;
  version: ReserveVersion;
  pool: ReservePool;
}) {
  if (version === ReserveVersion.v2) return null;

  const contract = getContract({
    address: uiPoolAddress,
    abi: UIDataHelperABI,
    client: serverViemPublicClient[chainId],
  });

  try {
    const emodesRaw = await contract.read.getEModes([
      poolAddressProviderAddress,
    ]);
    return emodesRaw.map((emode) => ({
      chainId,
      poolWithVersion: `${pool}_${version}` as PoolsWithVersions,
      id: emode.id,
      label: emode.eMode.label,
      ltv: emode.eMode.ltv,
      liquidationThreshold: emode.eMode.liquidationThreshold,
      liquidationBonus: emode.eMode.liquidationBonus,
      borrowableAssets: bitMapToIndexes(emode.eMode.borrowableBitmap),
      collateralAssets: bitMapToIndexes(emode.eMode.collateralBitmap),
    }));
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    throw new Error(`Error: ${errorMessage}`);
  }
}
