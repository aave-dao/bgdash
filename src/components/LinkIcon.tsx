import { Box, useTheme } from '@mui/system';
import React from 'react';

import ShareIcon from '../assets/images/icons/link.svg';
import CopiedIcon from '../assets/images/icons/success.svg';
import { IconBox } from './primitives/IconBox';

interface LinkIconProps {
  onClick?: () => void;
  color?: string;
  isCopied?: boolean;
  size?: number;
}

export const linkIconHoverStyles = {
  '> div': {
    '> svg': {
      '.arrow_group': {
        transform: 'translate(2px, -2px)',
      },
    },
  },
};

export function LinkIcon({
  onClick,
  isCopied,
  color,
  size = 19,
}: LinkIconProps) {
  const theme = useTheme();

  return (
    <IconBox
      className="LinkIcon"
      as="button"
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        marginLeft: 12,
        cursor: 'pointer',
        [theme.breakpoints.up('sm')]: {
          marginLeft: 16,
        },
        hover: linkIconHoverStyles,
      }}>
      <Box
        sx={(theme) => ({
          transition: 'all 0.3s ease',
          '> svg': {
            width: size,
            height: size,
            transition: 'all 0.3s ease',
            path: {
              stroke:
                color ||
                (isCopied ? theme.palette.$mainGreen : theme.palette.$main),
            },
            '.arrow_group': {
              transition: 'all 0.2s ease',
            },
          },
        })}>
        {isCopied ? <CopiedIcon /> : <ShareIcon />}
      </Box>
    </IconBox>
  );
}
