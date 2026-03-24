'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React from 'react';

import { EmodeColumnKeys } from '../../helpers/eModeTableHelpers';
import { useStore } from '../../providers/ZustandStoreProvider';
import { BoxWith3D } from '../BoxWith3D';
import { renderSortingIcon, TableCol } from '../Table';

const isSortingAvailable = (column: EmodeColumnKeys) => {
  return (
    column !== EmodeColumnKeys.collateralAssets &&
    column !== EmodeColumnKeys.borrowableAssets
  );
};

export function TableHeader({
  selectedColumns,
}: {
  selectedColumns: Array<{ key: EmodeColumnKeys; label: string }>;
}) {
  const theme = useTheme();
  const router = useRouter();

  const emodesSortConfig = useStore((store) => store.emodesSortConfig);
  const setEmodesSortConfig = useStore((store) => store.setEmodesSortConfig);

  return (
    <BoxWith3D
      borderSize={10}
      leftBorderColor="$secondary"
      bottomBorderColor="$headerGray"
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
        '.TableCol': {
          '&:last-of-type, &:nth-last-of-type(2)': {
            minWidth: 180,
            [theme.breakpoints.up('sm')]: {
              minWidth: 220,
            },
          },
        },
      }}>
      {selectedColumns.map((column) => (
        <TableCol key={column.key}>
          <Box
            onClick={() =>
              isSortingAvailable(column.key)
                ? setEmodesSortConfig({ key: column.key, router })
                : undefined
            }
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: isSortingAvailable(column.key) ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              p: 4,
              hover: isSortingAvailable(column.key)
                ? {
                    color: theme.palette.$textSecondary,
                    span: {
                      color: theme.palette.$textSecondary,
                    },
                  }
                : undefined,
            }}>
            {column.label}
            {isSortingAvailable(column.key) && (
              <Box sx={{ ml: 2 }}>
                {renderSortingIcon(emodesSortConfig, column.key)}
              </Box>
            )}
          </Box>
        </TableCol>
      ))}
    </BoxWith3D>
  );
}
