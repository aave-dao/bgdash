import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { BoxWith3D } from './BoxWith3D';

export function TopPanelContainer({
  children,
  row,
}: {
  children: ReactNode;
  row?: boolean;
}) {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative', zIndex: 15 }}>
      <BoxWith3D
        borderSize={10}
        wrapperCss={{
          my: 18,
          width: '100%',
          [theme.breakpoints.up('lg')]: { my: 24 },
        }}
        contentColor="$mainLight"
        disableActiveState
        css={{
          minHeight: row ? 'unset' : 70,
          display: 'flex',
          p: '10px',
          flexDirection: row ? 'row' : 'column',
          [theme.breakpoints.up('sm')]: {
            p: '10px 17px',
          },
          [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 70,
          },
        }}>
        {children}
      </BoxWith3D>
    </Box>
  );
}
