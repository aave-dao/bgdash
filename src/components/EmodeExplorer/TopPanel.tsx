import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import SearchIcon from '../../assets/images/icons/search.svg';
import { useStore } from '../../providers/ZustandStoreProvider';
import { media } from '../../styles/themeMUI';
import { useMediaQuery } from '../../styles/useMediaQuery';
import { AssetsSearchField } from '../AssetsSearchField';
import { Button } from '../Button';
import { IconBox } from '../primitives/IconBox';
import { TopPanelContainer } from '../TopPanelContainer';

export function TopPanel({
  isFiltersOpen,
  setIsFiltersOpen,
}: {
  isFiltersOpen: boolean;
  setIsFiltersOpen: (value: boolean) => void;
}) {
  const router = useRouter();
  const theme = useTheme();

  const md = useMediaQuery(media.md);

  const emodesSelectedFilters = useStore(
    (store) => store.emodesSelectedFilters,
  );
  const emodesSetFilters = useStore((store) => store.emodesSetFilters);
  const emodesFilterOptions = useStore((store) => store.emodesFilterOptions);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setIsSearchOpen(false);
  }, [md]);

  return (
    <TopPanelContainer row={!isSearchOpen}>
      <Box
        sx={{
          width: '100%',
          flex: 1,
          display: 'flex',
        }}>
        <Box
          sx={{
            width: '100%',
            flex: 1,
          }}>
          <Button
            pressed={isFiltersOpen}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            color="white">
            Filters
          </Button>
        </Box>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { display: 'none' },
          }}>
          <Button
            css={{ '.BoxWith3D__content--color': { '> div': { p: 0 } } }}
            customWidth={36}
            pressed={isSearchOpen}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            color="white">
            <IconBox
              sx={{
                width: 22,
                height: 22,
                '> svg': { width: 22, height: 22, path: { strokeWidth: 1 } },
              }}>
              <SearchIcon />
            </IconBox>
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          alignItems: 'center',
          display: isSearchOpen ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 12,
          mt: 16,
          [theme.breakpoints.up('md')]: {
            mt: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            gap: 16,
            ml: 24,
          },
        }}>
        <Box
          sx={{
            display: 'flex',
            p: { mr: 8 },
            position: 'relative',
            zIndex: 2,
            width: '100%',
            justifyContent: 'flex-end',
            flexDirection: 'column',
            gap: 8,
            alignItems: 'flex-end',
            [theme.breakpoints.up('md')]: {
              flexDirection: 'row',
              alignItems: 'center',
            },
          }}>
          <Box component="p">Collateral</Box>
          <AssetsSearchField
            selectedSymbols={emodesSelectedFilters.collateralAssets}
            setSelectedSymbols={(values: string[]) =>
              emodesSetFilters({ router, key: 'collateralAssets', values })
            }
            symbols={emodesFilterOptions.collateralAssets}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            width: '100%',
            position: 'relative',
            zIndex: 1,
            justifyContent: 'flex-end',
            flexDirection: 'column',
            gap: 8,
            alignItems: 'flex-end',
            [theme.breakpoints.up('md')]: {
              flexDirection: 'row',
              alignItems: 'center',
            },
          }}>
          <Box component="p">Borrowable</Box>
          <AssetsSearchField
            selectedSymbols={emodesSelectedFilters.borrowableAssets}
            setSelectedSymbols={(values: string[]) =>
              emodesSetFilters({ router, key: 'borrowableAssets', values })
            }
            symbols={emodesFilterOptions.borrowableAssets}
          />
        </Box>
      </Box>
    </TopPanelContainer>
  );
}
