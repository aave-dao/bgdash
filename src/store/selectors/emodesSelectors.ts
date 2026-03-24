import { PoolsWithVersions } from '../../constants';
import { Emode } from '../../types';

export const selectEmodeCategory = (
  emodes: Emode[],
  id: string,
  chainId: number,
  poolWithVersion: PoolsWithVersions,
) => {
  return emodes.filter(
    (emode) =>
      emode.chainId === chainId &&
      emode.poolWithVersion === poolWithVersion &&
      (emode.collateralAssets.map((emode) => emode.id).includes(id) ||
        emode.borrowableAssets.map((emode) => emode.id).includes(id)),
  );
};
