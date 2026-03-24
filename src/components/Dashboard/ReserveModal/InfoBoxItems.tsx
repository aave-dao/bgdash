import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { ReserveVersion } from '../../../constants';

interface InfoBoxItemsProps {
  children: ReactNode;
  version: ReserveVersion;
  withoutMargin?: boolean;
}

export function InfoBoxItem({
  value,
  isBig,
  withoutMargin,
  secondary,
}: {
  value: string | number | boolean | JSX.Element | undefined | bigint;
  isBig?: boolean;
  withoutMargin?: boolean;
  secondary?: boolean;
}) {
  return (
    <Box
      className={`InfoBoxItem  ${isBig ? 'InfoBoxItem_bold' : ''} ${secondary ? 'InfoBoxItem_secondary' : ''}`}
      sx={{
        lineHeight: 1,
        typography: secondary ? 'descriptor' : 'body',
        fontWeight: isBig ? 'bold' : 'normal',
        color: isBig || secondary ? '$textSecondary' : '$text',
        mb: withoutMargin ? 0 : 8,
      }}>
      {value}
    </Box>
  );
}

export function InfoBoxItemsWrapper({
  children,
  version,
  withoutMargin,
}: InfoBoxItemsProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        marginRight: withoutMargin ? 0 : 15,
        alignItems: 'flex-start',
        [theme.breakpoints.up('md')]: {
          marginRight: withoutMargin
            ? 0
            : version === ReserveVersion.v3
              ? 20
              : 30,
        },
        [theme.breakpoints.up('lg')]: {
          marginRight: withoutMargin
            ? 0
            : version === ReserveVersion.v3
              ? 40
              : 100,
        },
        '&:last-of-type': {
          mr: 0,
        },
      }}>
      {children}
    </Box>
  );
}
