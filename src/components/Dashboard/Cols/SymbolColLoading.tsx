import { Box } from '@mui/system';
import React from 'react';

import { CustomSkeleton } from '../../CustomSkeleton';

export function SymbolColLoading() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <CustomSkeleton circle width={24} height={24} />

      <Box sx={{ ml: 8 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <Box sx={{ typography: 'headline' }}>
            <CustomSkeleton width={40} height={14} />
          </Box>{' '}
          <Box
            component="span"
            sx={{ display: 'inline-block', mx: 4, color: '$textSecondary' }}>
            /
          </Box>{' '}
          <Box>
            <CustomSkeleton width={20} height={14} />
          </Box>
        </Box>
        <CustomSkeleton width={30} height={10} />
      </Box>
    </Box>
  );
}
