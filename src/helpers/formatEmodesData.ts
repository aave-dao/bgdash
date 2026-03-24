import { RouterOutputs } from '../providers/TRPCReactProvider';

export function formatEmodeAPIData({
  emode,
  reserves,
}: {
  emode: RouterOutputs['emodes']['getAll'][number];
  reserves?: { underlyingAsset: string; symbol: string }[];
}) {
  const resolveSymbol = (asset: { id: string; symbol?: string }) => {
    if (asset.symbol) return asset.symbol;
    const match = reserves?.find(
      (r) => r.underlyingAsset.toLowerCase() === asset.id.toLowerCase(),
    );
    return match?.symbol ?? asset.id;
  };

  return {
    poolWithVersion: emode.poolWithVersion,
    chainId: emode.chainId,
    id: emode.categoryId,
    label: emode.label,
    ltv: emode.ltv / 100,
    liquidationThreshold: emode.liquidationThreshold / 100,
    liquidationBonus: (emode.liquidationBonus - 10000) / 100,
    borrowableAssets: emode.assetsEnabledAsBorrowable.map((asset) => ({
      id: asset.id,
      symbol: resolveSymbol(asset),
    })),
    collateralAssets: emode.assetsEnabledAsCollateral.map((asset) => ({
      id: asset.id,
      symbol: resolveSymbol(asset),
    })),
  };
}
