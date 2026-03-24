import { Box, SxProps, useTheme } from '@mui/system';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

import { EmodeColumnKeys } from '../helpers/eModeTableHelpers';
import { ColumnKeys } from '../helpers/tableHelpers';
import { ReserveItem, SortConfig, SortDirection } from '../types';
import { BoxWith3D } from './BoxWith3D';
import { CustomSkeleton } from './CustomSkeleton';
import { SymbolColLoading } from './Dashboard/Cols/SymbolColLoading';
import { Link } from './Link';

export const renderSortingIcon = (
  sortConfig: SortConfig,
  columnKey: string,
) => {
  if (sortConfig.key !== columnKey) return null;
  return sortConfig.direction === SortDirection.Ascending ? ' ↑' : ' ↓';
};

export function TableCol({ children }: { children: ReactNode }) {
  return (
    <Box
      className="TableCol"
      sx={(theme) => ({
        flex: 1,
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 110,
        position: 'relative',
        '&:first-of-type': {
          justifyContent: 'flex-start',
          textAlign: 'left',
          minWidth: 180,
          [theme.breakpoints.up('sm')]: {
            minWidth: 220,
          },
        },
        '&:last-of-type': {
          '.TableCol__divider': {
            display: 'none',
          },
        },
      })}>
      {children}

      <Box
        className="TableCol__divider"
        sx={{
          position: 'absolute',
          width: '1px',
          height: 12,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '$textSecondary',
        }}
      />
    </Box>
  );
}

type TableWrapper = {
  children: ReactNode;
  item?: ReserveItem;
  path?: string;
  sx?: SxProps;
};

function TableItemContent({ children, item, path, sx }: TableWrapper) {
  const theme = useTheme();
  const pathname = usePathname();

  const pathnameArray = (pathname ?? '').split('/');
  const selectedReserveId = pathnameArray[pathnameArray.length - 2];

  const [clicked, setClicked] = React.useState(false);

  return (
    <Box
      onClick={() => {
        setClicked(true);
        setTimeout(() => setClicked(false), 1000);
      }}>
      <BoxWith3D
        withActions={!!(path && item)}
        disabled={item ? item.id === selectedReserveId || clicked : false}
        borderSize={10}
        wrapperCss={{
          cursor: path && item ? 'pointer' : 'default',
          width: '100%',
          mt: -11,
          position: 'relative',
          '.BoxWith3D__content': {
            zIndex: item && item.id === selectedReserveId ? 0 : 3,
          },
          '&:hover': {
            '.BoxWith3D__content': {
              zIndex: 0,
            },
          },
        }}
        contentColor="$mainLight"
        css={{
          minHeight: 45,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '10px 6px',
          [theme.breakpoints.up('sm')]: {
            minHeight: 65,
          },
          ...sx,
        }}>
        {children}
      </BoxWith3D>
    </Box>
  );
}

export function TableItemWrapper({ path, children, ...props }: TableWrapper) {
  return (
    <>
      {path ? (
        <Link href={path} scroll={false}>
          <TableItemContent path={path} children={children} {...props} />
        </Link>
      ) : (
        <Box>
          <TableItemContent path={path} children={children} {...props} />
        </Box>
      )}
    </>
  );
}

export function TableContentLoading<T = ColumnKeys | EmodeColumnKeys>({
  selectedColumns,
  forEmodes,
}: {
  selectedColumns: { key: T; label: string }[];
  forEmodes?: boolean;
}) {
  const theme = useTheme();
  return (
    <Box sx={{ '*': { lineHeight: 'normal !important' } }}>
      {Array.from(Array(12).keys()).map((value, index) => (
        <TableItemWrapper
          key={index}
          sx={
            forEmodes
              ? {
                  '.TableCol': {
                    '&:last-of-type, &:nth-last-of-type(2)': {
                      minWidth: 180,
                      [theme.breakpoints.up('sm')]: {
                        minWidth: 220,
                      },
                    },
                  },
                }
              : undefined
          }>
          {selectedColumns.map((column) => {
            return (
              <TableCol key={column.key as string}>
                <Box sx={{ p: 4 }}>
                  {column.key === ColumnKeys.SYMBOL ? (
                    <SymbolColLoading />
                  ) : (
                    <CustomSkeleton width={45} height={14} />
                  )}
                </Box>
              </TableCol>
            );
          })}
        </TableItemWrapper>
      ))}
    </Box>
  );
}
