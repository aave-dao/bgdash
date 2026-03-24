import { Box } from '@mui/system';
import React from 'react';

import { ReserveItem } from '../../../types';
import { BorrowInfoBox } from './BorrowInfoBox';
import { SupplyInfoBox } from './SupplyInfoBox';

export function ReserveHiddenContent({ reserve }: { reserve: ReserveItem }) {
  return (
    <Box sx={{ opacity: 0 }}>
      <SupplyInfoBox reserve={reserve} />
      <BorrowInfoBox reserve={reserve} />
    </Box>
  );
}
