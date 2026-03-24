import { Box, useTheme } from '@mui/system';
import React from 'react';

import {
  EmodeColumnKeys,
  renderEmodeField,
} from '../../helpers/eModeTableHelpers';
import { Emode } from '../../types';
import { TableCol, TableItemWrapper } from '../Table';

interface EmodeItemProps {
  item: Emode;
  selectedColumns: Array<{ key: EmodeColumnKeys; label: string }>;
}

export function TableItem({ item, selectedColumns }: EmodeItemProps) {
  const theme = useTheme();
  return (
    <TableItemWrapper
      sx={{
        '.TableCol': {
          '&:last-of-type, &:nth-last-of-type(2)': {
            minWidth: 180,
            [theme.breakpoints.up('sm')]: {
              minWidth: 220,
            },
          },
        },
      }}>
      {selectedColumns.map((column) => {
        return (
          <TableCol key={column.key}>
            <Box sx={{ p: 4 }}>{renderEmodeField(column.key, item)}</Box>
          </TableCol>
        );
      })}
    </TableItemWrapper>
  );
}
