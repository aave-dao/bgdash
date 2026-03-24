'use client';

import { Box, useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';

import { UmbrellaColumnKeys } from '../../helpers/umbrellaTableHelpers';
import { BoxWith3D } from '../BoxWith3D';
import { TableCol } from '../Table';

export function UmbrellaTableHeader({
  selectedColumns,
}: {
  selectedColumns: Array<{ key: UmbrellaColumnKeys; label: string }>;
}) {
  const theme = useTheme();
  const [isBottomBorderHidden, setBottomBorderHidden] = useState(false);

  const eventFunc = () => {
    const tableHeader = document.getElementById('umbrellaTableHeaders');

    if (tableHeader) {
      if (tableHeader.clientHeight >= 80) {
        if (tableHeader.offsetTop > 5) {
          setBottomBorderHidden(true);
        } else if (tableHeader && tableHeader.scrollTop <= 5) {
          setBottomBorderHidden(false);
        }
      }
      if (tableHeader.clientHeight <= 79 && window.innerWidth > 1023) {
        if (tableHeader.offsetTop > 3) {
          setBottomBorderHidden(true);
        } else if (tableHeader && tableHeader.scrollTop <= 3) {
          setBottomBorderHidden(false);
        }
      }
      if (tableHeader.clientHeight >= 70 && window.innerWidth <= 1023) {
        if (tableHeader.offsetTop > 8) {
          setBottomBorderHidden(true);
        } else if (tableHeader && tableHeader.scrollTop <= 8) {
          setBottomBorderHidden(false);
        }
      }
      if (tableHeader.clientHeight < 70) {
        if (tableHeader.offsetTop > 5) {
          setBottomBorderHidden(true);
        } else if (tableHeader && tableHeader.scrollTop <= 5) {
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
        '.TableCol': {
          [`&:nth-of-type(${selectedColumns.findIndex((col) => col.key === UmbrellaColumnKeys.ASSETS) + 1})`]:
            {
              minWidth: 180,
              flex: 1.4,
            },
          [`&:nth-of-type(${selectedColumns.findIndex((col) => col.key === UmbrellaColumnKeys.ACTIVE_REWARDS) + 1})`]:
            {
              minWidth: 200,
              flex: 1.5,
            },
        },
      }}>
      {selectedColumns.map((column) => (
        <TableCol key={column.key}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 4,
            }}>
            {column.label}
          </Box>
        </TableCol>
      ))}
    </BoxWith3D>
  );
}
