import { Box, useTheme } from '@mui/system';
import React from 'react';

import { Link } from '../../Link';
import { LinkIcon } from '../../LinkIcon';
import { InfoBoxItem } from './InfoBoxItems';

interface ReserveHeaderInfoItemProps {
  info: {
    title: string;
    // eslint-disable-next-line
    value: any;
  };
  link?: string;
}

export function ReserveHeaderInfoItem({
  info,
  link,
}: ReserveHeaderInfoItemProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        color: '$textSecondary',
        mr: 20,
        display: 'inline-flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        mt: 8,
        [theme.breakpoints.up('md')]: {
          mt: 0,
          mr: 12,
        },
        [theme.breakpoints.up('lg')]: {
          mr: 24,
        },
        '&:last-of-type': {
          mr: 0,
        },
      }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          mb: 4,
        }}>
        <InfoBoxItem withoutMargin value={info.title} isBig />{' '}
        {info.title === 'Price' && link && (
          <Link
            inNewWindow
            css={{
              ml: 5,
              lineHeight: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              '.LinkIcon': { marginLeft: 0, lineHeight: 0 },
            }}
            href={link}>
            <LinkIcon color={theme.palette.$textSecondary} size={14} />
          </Link>
        )}
      </Box>{' '}
      <Box
        sx={{
          color: `${theme.palette.$text}`,
          display: 'inline-flex',
        }}>
        {info.value}
      </Box>
    </Box>
  );
}
