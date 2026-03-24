'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import CloseIcon from '../../assets/images/icons/cross.svg';
import { useStore } from '../../providers/ZustandStoreProvider';
import { media } from '../../styles/themeMUI';
import { useMediaQuery } from '../../styles/useMediaQuery';
import { Branding } from '../Branding';
import { Filter } from '../Filter';
import { IconBox } from '../primitives/IconBox';

export function FiltersPanel({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const router = useRouter();
  const theme = useTheme();

  const md = useMediaQuery(media.md);

  const selectedFilters = useStore((store) => store.emodesSelectedFilters);
  const setFilters = useStore((store) => store.emodesSetFilters);
  const filterOptions = useStore((store) => store.emodesFilterOptions);

  useEffect(() => {
    if (!md) {
      if (isOpen) {
        if (typeof document !== 'undefined') {
          document.body.style.overflow = 'hidden';
        }
      } else {
        if (typeof document !== 'undefined') {
          document.body.style.overflow = 'unset';
        }
      }
    }
  }, [isOpen, md]);

  return (
    <>
      <Box
        onClick={() => setIsOpen(false)}
        sx={{
          position: 'fixed',
          opacity: isOpen ? 1 : 0,
          zIndex: isOpen ? 79 : -1,
          backgroundColor: '$backgroundOverlap',
          transition: 'all 0.35s ease',
          inset: 0,
          [theme.breakpoints.up('md')]: {
            display: 'none',
          },
        }}
        aria-hidden="true"
      />

      <Box
        sx={{
          position: 'fixed',
          zIndex: isOpen ? 80 : -1,
          transition: 'all 0.35s ease',
          top: 0,
          left: isOpen ? 0 : -255,
          width: 255,
          backgroundColor: '$light',
          height: '100dvh',
          borderRight: `1px solid ${theme.palette.$mainBorder}`,
          p: '24px 0 24px 18px',
          display: 'flex',
          flexDirection: 'column',
          [theme.breakpoints.up('sm')]: {
            p: '32px 0 32px 24px',
          },
          [theme.breakpoints.up('lg')]: {
            left: isOpen ? 0 : -320,
            width: 320,
          },
        }}>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 12,
            height: 24,
            width: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            right: 4,
            top: 4,
            border: 'none',
            background: 'none',
            lineHeight: 0,
            hover: {
              opacity: '0.7',
            },
          }}
          component="button"
          type="button"
          onClick={() => {
            setIsOpen(false);
          }}>
          <IconBox
            sx={{
              position: 'fixed',
              height: 16,
              width: 16,
              '> svg': {
                height: 16,
                width: 16,
              },
              path: {
                stroke: theme.palette.$main,
                fill: theme.palette.$main,
              },
            }}>
            <CloseIcon />
          </IconBox>
        </Box>

        <Box
          sx={{
            mt: 8,
            flex: 1,
            overflowY: 'auto',
            pr: 18,
            [theme.breakpoints.up('sm')]: { pr: 24 },
          }}>
          <Filter
            isPanelOpen={isOpen}
            options={filterOptions.emodeChainId}
            label="Network"
            onChange={(selected) =>
              setFilters({ router, key: 'emodeChainId', values: selected })
            }
            selected={selectedFilters.emodeChainId.map((chainId) => {
              return { id: chainId, label: chainId };
            })}
            withClean
            allOptions={filterOptions.emodeChainId.map(
              (emodeChainId) => emodeChainId.id,
            )}
          />
          <Filter
            isPanelOpen={isOpen}
            options={filterOptions.emodePool}
            label="Pool"
            onChange={(selected) =>
              setFilters({ router, key: 'emodePool', values: selected })
            }
            selected={selectedFilters.emodePool.map((pool) => {
              return { id: pool, label: pool };
            })}
            withClean
            allOptions={filterOptions.emodePool.map(
              (emodePool) => emodePool.id,
            )}
          />

          <Filter
            isPanelOpen={isOpen}
            options={filterOptions.collateralAssets}
            label="Collateral assets"
            onChange={(selected) =>
              setFilters({ router, key: 'collateralAssets', values: selected })
            }
            selected={selectedFilters.collateralAssets.map((symbol) => {
              return { id: symbol, label: symbol };
            })}
            withSearch
            withClean
            allOptions={filterOptions.collateralAssets.map((asset) => asset.id)}
          />

          <Filter
            isPanelOpen={isOpen}
            options={filterOptions.borrowableAssets}
            label="Borrowable assets"
            onChange={(selected) =>
              setFilters({ router, key: 'borrowableAssets', values: selected })
            }
            selected={selectedFilters.borrowableAssets.map((symbol) => {
              return { id: symbol, label: symbol };
            })}
            withSearch
            withClean
            allOptions={filterOptions.borrowableAssets.map((asset) => asset.id)}
          />
        </Box>

        <Box sx={{ mt: 24 }}>
          <Branding />
        </Box>
      </Box>
    </>
  );
}
