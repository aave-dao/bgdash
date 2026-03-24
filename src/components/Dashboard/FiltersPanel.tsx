'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import CloseIcon from '../../assets/images/icons/cross.svg';
import { ColumnKeys, columns } from '../../helpers/tableHelpers';
import { useStore } from '../../providers/ZustandStoreProvider';
import { media } from '../../styles/themeMUI';
import { useMediaQuery } from '../../styles/useMediaQuery';
import { Branding } from '../Branding';
import { Filter } from '../Filter';
import { IconBox } from '../primitives/IconBox';

interface FiltersPanelProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function FiltersPanel({ isOpen, setIsOpen }: FiltersPanelProps) {
  const theme = useTheme();
  const router = useRouter();

  const md = useMediaQuery(media.md);

  const selectedFilters = useStore((store) => store.selectedFilters);
  const setFilters = useStore((store) => store.setFilters);
  const filterOptions = useStore((store) => store.filterOptions);

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
            options={filterOptions.version}
            label="Version"
            onChange={(selected) =>
              setFilters({ router, key: 'version', values: selected })
            }
            selected={selectedFilters.version.map((ver) => {
              return { id: ver, label: ver };
            })}
            withClean
            allOptions={filterOptions.version.map((version) => version.id)}
          />
          <Filter
            isPanelOpen={isOpen}
            options={filterOptions.pool}
            label="Pool"
            onChange={(selected) =>
              setFilters({ router, key: 'pool', values: selected })
            }
            selected={selectedFilters.pool.map((pool) => {
              return { id: pool, label: pool };
            })}
            withClean
            allOptions={filterOptions.pool.map((pool) => pool.id)}
          />
          <Filter
            isPanelOpen={isOpen}
            options={filterOptions.chainId}
            label="Network"
            onChange={(selected) =>
              setFilters({ router, key: 'chainId', values: selected })
            }
            selected={selectedFilters.chainId.map((chainId) => {
              return { id: chainId, label: chainId };
            })}
            withClean
            allOptions={filterOptions.chainId.map((chain) => chain.id)}
          />
          <Filter
            isPanelOpen={isOpen}
            options={filterOptions.symbol}
            label="Asset"
            onChange={(selected) =>
              setFilters({ router, key: 'symbol', values: selected })
            }
            selected={selectedFilters.symbol.map((symbol) => {
              return { id: symbol, label: symbol };
            })}
            withSearch
            withClean
            allOptions={filterOptions.symbol.map((symbol) => symbol.id)}
          />
          <Filter
            isPanelOpen={isOpen}
            options={columns
              .filter((column) => column.key !== ColumnKeys.SYMBOL)
              .map((column) => ({
                id: column.key,
                label: column.label,
              }))}
            label="Fields"
            onChange={(selected) => {
              setFilters({
                router,
                key: 'columns',
                values: selected,
                withDataRefresh: true,
              });
            }}
            selected={selectedFilters.columns.map((column) => {
              return {
                id: column.key,
                label: column.label,
              };
            })}
            withSearch
            withClean
            allOptions={columns.map((column) => column.key)}
          />
        </Box>

        <Box sx={{ mt: 24 }}>
          <Branding />
        </Box>
      </Box>
    </>
  );
}
