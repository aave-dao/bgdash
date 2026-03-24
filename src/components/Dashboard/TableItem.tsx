import { Box } from '@mui/system';
import React from 'react';

import { ColumnKeys, renderReserveField } from '../../helpers/tableHelpers';
import { Emode, ReserveItem as TReserveItem } from '../../types';
import { TableCol, TableItemWrapper } from '../Table';

interface ReserveItemProps {
  item: TReserveItem;
  selectedColumns: Array<{ key: ColumnKeys; label: string }>;
  emodes?: Emode[];
  emodesLoading?: boolean;
  path?: string;
}

export function TableItem({
  item,
  selectedColumns,
  emodes,
  emodesLoading,
  path,
}: ReserveItemProps) {
  return (
    <TableItemWrapper item={item} path={path}>
      {selectedColumns.map((column) => {
        return (
          <TableCol key={column.key}>
            <Box sx={{ p: 4 }}>
              {renderReserveField(column.key, item, emodes, emodesLoading)}
            </Box>
          </TableCol>
        );
      })}
    </TableItemWrapper>
  );
}
