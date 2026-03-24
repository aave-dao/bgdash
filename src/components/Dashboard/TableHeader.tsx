'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useStore } from '../../providers/ZustandStoreProvider';
import { BoxWith3D } from '../BoxWith3D';
import { renderSortingIcon, TableCol } from '../Table';

export function TableHeader() {
  const theme = useTheme();
  const router = useRouter();

  const sortConfig = useStore((store) => store.sortConfig);
  const setSortConfig = useStore((store) => store.setSortConfig);
  const selectedFilters = useStore((store) => store.selectedFilters);

  const [isBottomBorderHidden, setBottomBorderHidden] = useState(false);

  const eventFunc = () => {
    const tableHeader = document.getElementById('tableHeaders');

    if (tableHeader) {
      if (tableHeader.clientHeight >= 80) {
        if (tableHeader.offsetTop > 145) {
          setBottomBorderHidden(true);
        } else if (tableHeader && tableHeader.scrollTop <= 145) {
          setBottomBorderHidden(false);
        }
      }
      if (tableHeader.clientHeight <= 79 && window.innerWidth > 1023) {
        if (tableHeader.offsetTop > 130) {
          setBottomBorderHidden(true);
        } else if (tableHeader && tableHeader.scrollTop <= 130) {
          setBottomBorderHidden(false);
        }
      }
      if (tableHeader.clientHeight >= 70 && window.innerWidth <= 1023) {
        if (tableHeader.offsetTop > 180) {
          setBottomBorderHidden(true);
        } else if (tableHeader && tableHeader.scrollTop <= 180) {
          setBottomBorderHidden(false);
        }
      }
      if (tableHeader.clientHeight < 70) {
        if (tableHeader.offsetTop > 170) {
          setBottomBorderHidden(true);
        } else if (tableHeader && tableHeader.scrollTop <= 170) {
          setBottomBorderHidden(false);
        }
      }
    }
  };

  useEffect(() => {
    if (window) {
      window.addEventListener('scroll', eventFunc);
    }
    return () => window?.removeEventListener('scroll', eventFunc);
  }, []);

  return (
    <BoxWith3D
      borderSize={10}
      leftBorderColor="$secondary"
      bottomBorderColor="$headerGray"
      wrapperCss={{
        '.BoxWith3D__bottom-shadow': {
          display: isBottomBorderHidden ? 'none' : 'block',
        },
      }}
      css={{
        color: '$textWhite',
        minHeight: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: '10px 6px',
        [theme.breakpoints.up('sm')]: {
          minHeight: 70,
        },
      }}>
      {selectedFilters.columns.map((column) => (
        <TableCol key={column.key}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              p: 4,
              hover: {
                color: theme.palette.$textSecondary,
                span: {
                  color: theme.palette.$textSecondary,
                },
              },
            }}
            onClick={() => setSortConfig({ key: column.key, router })}>
            {column.label === 'Asset' ? (
              <Box
                component="p"
                sx={{
                  span: { color: '$middleLight', transition: 'all 0.2s ease' },
                }}>
                Asset
              </Box>
            ) : (
              column.label
            )}
            <Box sx={{ ml: 2 }}>
              {renderSortingIcon(sortConfig, column.key)}
            </Box>
          </Box>
        </TableCol>
      ))}
    </BoxWith3D>
  );
}
