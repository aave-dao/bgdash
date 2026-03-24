import { Box } from '@mui/system';
import React from 'react';

import { EmodeColumnKeys } from '../../helpers/eModeTableHelpers';
import { useStore } from '../../providers/ZustandStoreProvider';
import { NoData } from '../NoData';
import { TableContentLoading } from '../Table';
import { TableItem } from './TableItem';

interface TableContentProps {
  selectedColumns: Array<{ key: EmodeColumnKeys; label: string }>;
}

export function TableContent({ selectedColumns }: TableContentProps) {
  const sortedFilteredEmodes = useStore((store) => store.sortedFilteredEmodes);

  const emodesAreLoading = useStore((store) => store.emodesAreLoading);
  const reservesAreLoading = useStore((store) => store.reservesAreLoading);

  if (reservesAreLoading || emodesAreLoading)
    return (
      <Box sx={{ pt: 18 }}>
        <TableContentLoading selectedColumns={selectedColumns} forEmodes />
      </Box>
    );

  if (!sortedFilteredEmodes.length) {
    return <NoData />;
  }

  return (
    <Box sx={{ pt: 18 }}>
      {sortedFilteredEmodes.map((item) => (
        <TableItem
          key={`${item.id}_${item.chainId}_${item.poolWithVersion}`}
          item={item}
          selectedColumns={selectedColumns}
        />
      ))}
    </Box>
  );
}
