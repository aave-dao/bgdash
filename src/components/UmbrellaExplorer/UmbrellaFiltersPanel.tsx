'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import CloseIcon from '../../assets/images/icons/cross.svg';
import {
  UmbrellaColumnKeys,
  umbrellaColumns,
} from '../../helpers/umbrellaTableHelpers';
import { useStore } from '../../providers/ZustandStoreProvider';
import { media } from '../../styles/themeMUI';
import { useMediaQuery } from '../../styles/useMediaQuery';
import { Branding } from '../Branding';
import { Filter } from '../Filter';
import { IconBox } from '../primitives/IconBox';

interface UmbrellaFiltersPanelProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function UmbrellaFiltersPanel({
  isOpen,
  setIsOpen,
}: UmbrellaFiltersPanelProps) {
  const router = useRouter();
  const theme = useTheme();
  const md = useMediaQuery(media.md);

  const selectedFilters = useStore((store) => store.umbrellaSelectedFilters);
  const setFilters = useStore((store) => store.setUmbrellaFilters);

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
            options={umbrellaColumns
              .filter(
                (column) =>
                  column.key !== UmbrellaColumnKeys.STAKE_TOKEN_SYMBOL,
              )
              .map((column) => ({
                id: column.key,
                label: column.label,
              }))}
            label="Fields"
            onChange={(selected) => {
              setFilters({
                router,
                key: 'columns',
                values: [UmbrellaColumnKeys.STAKE_TOKEN_SYMBOL, ...selected], // Always include stake token symbol
              });
            }}
            selected={selectedFilters.columns
              .filter(
                (column) =>
                  column.key !== UmbrellaColumnKeys.STAKE_TOKEN_SYMBOL,
              )
              .map((column) => ({
                id: column.key,
                label: column.label,
              }))}
            withSearch
            withClean
            allOptions={umbrellaColumns.map((column) => column.key)}
          />
        </Box>

        <Box sx={{ mt: 24 }}>
          <Branding />
        </Box>
      </Box>
    </>
  );
}
