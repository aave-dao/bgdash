import { Box, useTheme } from '@mui/system';
import { useRouter as useRouterWithLoader } from 'nextjs-toploader/app';
import React from 'react';

import { PoolsWithVersions } from '../../../constants';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { selectEmodeCategory } from '../../../store/selectors/emodesSelectors';
import { Emode } from '../../../types';
import { CustomSkeleton } from '../../CustomSkeleton';
import { Link } from '../../Link';
import { TokenIcon } from '../../TokenIcon';
import { InfoBoxWrapperBig } from './InfoBoxWrapper';

export const ParameterItem: React.FC<{
  title?: string;
  parameter: string | React.ReactNode;
}> = ({ title, parameter }) => {
  return (
    <Box
      className="ParameterItem"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        gap: '4px',
      }}>
      {title && (
        <Box component="p" sx={{ color: '$textSecondary' }}>
          {title}
        </Box>
      )}
      {typeof parameter !== 'string' ? parameter : <b>{parameter}</b>}
    </Box>
  );
};

const AssetsBlock = ({
  title,
  assets,
}: {
  title: string;
  assets: { symbol: string; id: string }[];
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        mb: 12,
        flexWrap: 'wrap',
        alignItems: 'center',
        '&:last-of-type': {
          mb: 0,
        },
      }}>
      <Box sx={{ mr: 12 }}>{title}:</Box>
      {assets.map((asset) => (
        <Link
          key={asset.id}
          href={`/reserve/${asset.id}`}
          scroll={false}
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
              background: theme.palette.$mainLight,
              opacity: 0,
              position: 'absolute',
              cursor: 'default',
              bottom: 'calc(100% + 2px)',
              typography: 'descriptor',
              zIndex: -1,
              visibility: 'hidden',
            }}>
            {asset.symbol}
          </Box>
          <TokenIcon symbol={asset.symbol} size={16} />
        </Link>
      ))}
    </Box>
  );
};

const Loading = () => {
  return (
    <InfoBoxWrapperBig wrappedCss={{ position: 'relative', zIndex: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <Box sx={{ typography: 'headline' }}>E-Mode Categories</Box>
      </Box>

      <Box
        sx={{
          mt: 12,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        <Box>
          <Box
            sx={{
              mb: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}>
            <ParameterItem parameter={'-'} />
            <ParameterItem title="Max LTV" parameter={`-%`} />
            <ParameterItem title="Liquidation threshold" parameter={`-%`} />
            <ParameterItem title="Liquidation bonus" parameter={`-%`} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              mb: 12,
              flexWrap: 'wrap',
              alignItems: 'center',
              '&:last-of-type': {
                mb: 0,
              },
            }}>
            <Box sx={{ mr: 12 }}>Borrowable:</Box>
            <Box
              sx={{
                ml: -6,
              }}>
              <CustomSkeleton circle width={16} height={16} />
            </Box>
            <Box
              sx={{
                ml: -6,
              }}>
              <CustomSkeleton circle width={16} height={16} />
            </Box>
            <Box
              sx={{
                ml: -6,
              }}>
              <CustomSkeleton circle width={16} height={16} />
            </Box>
            <Box
              sx={{
                ml: -6,
              }}>
              <CustomSkeleton circle width={16} height={16} />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
            <Box sx={{ mr: 12 }}>Collateral:</Box>
            <Box
              sx={{
                ml: -6,
              }}>
              <CustomSkeleton circle width={16} height={16} />
            </Box>
            <Box
              sx={{
                ml: -6,
              }}>
              <CustomSkeleton circle width={16} height={16} />
            </Box>
          </Box>
        </Box>
      </Box>
    </InfoBoxWrapperBig>
  );
};

export function EmodesDataBox({
  id,
  chainId,
  poolWithVersion,
  initialEmodes,
}: {
  id: string;
  chainId: number;
  poolWithVersion: PoolsWithVersions;
  initialEmodes?: Emode[];
}) {
  const routerWithLoading = useRouterWithLoader();
  const theme = useTheme();

  const categories = useStore((store) =>
    selectEmodeCategory(
      initialEmodes?.length ? initialEmodes : store.initialEmodes,
      id,
      chainId,
      poolWithVersion,
    ),
  );
  const emodesAreLoading = useStore((store) => store.emodesAreLoading);
  const emodesSetSelectedFiltersToQuery = useStore(
    (store) => store.emodesSetSelectedFiltersToQuery,
  );

  if (emodesAreLoading) return <Loading />;
  if (!categories.length) return null;

  return (
    <InfoBoxWrapperBig wrappedCss={{ position: 'relative', zIndex: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <Box sx={{ typography: 'headline' }}>E-Mode Categories</Box>
        <Box
          onClick={() => {
            emodesSetSelectedFiltersToQuery({
              router: routerWithLoading,
              pathName: '/emode-explorer/',
              fromEmpty: true,
            });
          }}
          sx={{
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            hover: { opacity: 0.5 },
          }}>
          View all categories
        </Box>
      </Box>

      <Box
        sx={{
          mt: 12,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 24,
        }}>
        {categories.map((category) => (
          <Box
            key={category.id}
            sx={{
              width: '100%',
              [theme.breakpoints.up('lg')]: { width: '48%' },
              '&:last-of-type': { mb: 0 },
            }}>
            <Box
              sx={{
                mb: 22,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
                [theme.breakpoints.up('sm')]: { gap: 16 },
              }}>
              <ParameterItem
                parameter={`${category.label} (id: ${category.id})`}
              />
              <ParameterItem title="Max LTV" parameter={`${category.ltv}%`} />
              <ParameterItem
                title="Liquidation threshold"
                parameter={`${category.liquidationThreshold}%`}
              />
              <ParameterItem
                title="Liquidation bonus"
                parameter={`${category.liquidationBonus}%`}
              />
            </Box>

            <AssetsBlock
              title="Borrowable"
              assets={category.borrowableAssets}
            />
            <AssetsBlock
              title="Collateral"
              assets={category.collateralAssets}
            />
          </Box>
        ))}
      </Box>
    </InfoBoxWrapperBig>
  );
}
