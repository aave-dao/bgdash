import { Box } from '@mui/system';
import React from 'react';

import { BoxWith3D } from './BoxWith3D';

export function NoData() {
  return (
    <Box sx={{ pt: 18 }}>
      <BoxWith3D
        className="NoDataWrapper"
        borderSize={10}
        contentColor="$mainLight"
        css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 16,
          py: 40,
          minHeight: '40vh',
        }}>
        <Box sx={{ typography: 'headline' }}>
          There is no data with the specified filter parameters. Try changing
          the filter
        </Box>
      </BoxWith3D>
    </Box>
  );
}
