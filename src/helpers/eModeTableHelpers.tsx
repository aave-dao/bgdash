'use client';

import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
import { Box } from '@mui/system';
import React from 'react';

import BrandIcon from '../components/BrandIcon';
import ChainIcon from '../components/ChainIcon';
import { Link } from '../components/Link';
import { TokenIcon } from '../components/TokenIcon';
import { Emode } from '../types';

export enum EmodeColumnKeys {
  poolWithVersion = 'poolWithVersion',
  id = 'id',
  ltv = 'ltv',
  liquidationThreshold = 'liquidationThreshold',
  liquidationBonus = 'liquidationBonus',
  collateralAssets = 'collateralAssets',
  borrowableAssets = 'borrowableAssets',
}

export const emodeColumns = [
  { key: EmodeColumnKeys.poolWithVersion, label: 'Network' },
  { key: EmodeColumnKeys.id, label: 'Category id' },
  { key: EmodeColumnKeys.ltv, label: 'LTV' },
  { key: EmodeColumnKeys.liquidationThreshold, label: 'Liquidation threshold' },
  { key: EmodeColumnKeys.liquidationBonus, label: 'Liquidation bonus' },
  { key: EmodeColumnKeys.collateralAssets, label: 'Collateral assets' },
  { key: EmodeColumnKeys.borrowableAssets, label: 'Borrowable assets' },
];

const Assets = ({ assets }: { assets: { symbol: string; id: string }[] }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        pl: 6,
      }}>
      {assets.map((asset) => (
        <Link
          key={asset.id}
          scroll={false}
          href={`/reserve/${asset.id}`}
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ml: -6,
            transition: 'all 0.1s ease',
            position: 'relative',
            cursor: 'pointer',
            zIndex: 1,
            hover: {
              ml: 0,
              transform: 'scale(1.2)',
              zIndex: 2,
              '.EmodesDataBox__asset-name': {
                opacity: 1,
                visibility: 'visible',
                zIndex: 1,
              },
            },
          }}>
          <Box
            className="EmodesDataBox__asset-name"
            sx={{
              p: 2,
              backgroundColor: '$mainLight',
              opacity: 0,
              position: 'absolute',
              cursor: 'default',
              bottom: 'calc(100% + 2px)',
              typography: 'descriptor',
              zIndex: -1,
              visibility: 'hidden',
              whiteSpace: 'nowrap',
            }}>
            {asset.symbol}
          </Box>
          <TokenIcon symbol={asset.symbol} size={16} />
        </Link>
      ))}
    </Box>
  );
};

export const renderFunctions: Record<
  EmodeColumnKeys,
  (item: Emode) => string | number | JSX.Element
> = {
  [EmodeColumnKeys.poolWithVersion]: (item) => {
    const poolNameAndVersion = item.poolWithVersion.split('_');
    const poolName =
      poolNameAndVersion[0].charAt(0).toUpperCase() +
      poolNameAndVersion[0].slice(1);

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          width: '100%',
        }}>
        <Box sx={{ mr: 12, position: 'relative' }}>
          <ChainIcon chainId={item.chainId} size={26} />
          {poolNameAndVersion[0] !== 'aave' && (
            <BrandIcon
              css={{ position: 'absolute', bottom: -4, right: -4, zIndex: 2 }}
              addressOrName={poolNameAndVersion[0]}
              size={14}
            />
          )}
        </Box>
        <Box>
          <Box sx={{ mb: 1 }}>{getChainName(item.chainId)}</Box>
          <Box
            sx={{
              color: '$textSecondary',
              typography: 'descriptor',
            }}>
            <Box component="p" sx={{ display: 'inline' }}>
              {poolName} <span>/</span>{' '}
            </Box>
            <Box component="p" sx={{ display: 'inline' }}>
              {poolNameAndVersion[1]}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  },
  [EmodeColumnKeys.id]: (item) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
      }}>
      <Box sx={{ mb: 1 }}>{item.id}</Box>
      <Box sx={{ color: '$textSecondary', typography: 'descriptor' }}>
        {item.label}
      </Box>
    </Box>
  ),
  [EmodeColumnKeys.ltv]: (item) => `${item.ltv}%`,
  [EmodeColumnKeys.liquidationThreshold]: (item) =>
    `${item.liquidationThreshold}%`,
  [EmodeColumnKeys.liquidationBonus]: (item) => `${item.liquidationBonus}%`,
  [EmodeColumnKeys.collateralAssets]: (item) => (
    <Assets assets={item.collateralAssets} />
  ),
  [EmodeColumnKeys.borrowableAssets]: (item) => (
    <Assets assets={item.borrowableAssets} />
  ),
};

export const renderEmodeField = (key: EmodeColumnKeys, item: Emode) => {
  const renderFn = renderFunctions[key];
  return renderFn(item);
};
