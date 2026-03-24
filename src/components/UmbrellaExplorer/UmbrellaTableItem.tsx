import { Box } from '@mui/system';
import React from 'react';

import {
  renderUmbrellaField,
  UmbrellaColumnKeys,
} from '../../helpers/umbrellaTableHelpers';
import { UmbrellaItem } from '../../types';
import { TableCol, TableItemWrapper } from '../Table';

interface UmbrellaItemProps {
  item: UmbrellaItem;
  selectedColumns: Array<{ key: UmbrellaColumnKeys; label: string }>;
}

export function UmbrellaTableItem({
  item,
  selectedColumns,
}: UmbrellaItemProps) {
  return (
    <TableItemWrapper
      sx={{
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
      {selectedColumns.map((column) => {
        return (
          <TableCol key={column.key}>
            <Box sx={{ p: 4 }}>{renderUmbrellaField(column.key, item)}</Box>
          </TableCol>
        );
      })}
    </TableItemWrapper>
  );
}
