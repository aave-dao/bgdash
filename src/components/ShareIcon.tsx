import { Box, useTheme } from '@mui/system';
import React from 'react';

import ShareIconI from '../assets/images/icons/share.svg';
import ShareIconH from '../assets/images/icons/shareHover.svg';
import CopiedIcon from '../assets/images/icons/success.svg';
import { IconBox } from './primitives/IconBox';

interface LinkIconProps {
  onClick?: () => void;
  color?: string;
  isCopied?: boolean;
  size?: number;
}

export function ShareIcon({
  onClick,
  isCopied,
  color,
  size = 17,
}: LinkIconProps) {
  const theme = useTheme();

  return (
    <IconBox
      className="ShareIcon"
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
        hover: {
          '.ShareIcon__share': {
            svg: {
              '&:first-of-type': {
                opacity: 0,
              },
              '&:last-of-type': {
                opacity: 1,
              },
            },
          },
        },
      }}>
      <Box
        sx={(theme) => ({
          transition: 'all 0.3s ease',
          svg: {
            width: size,
            height: size,
            transition: 'all 0.3s ease',
            path: {
              stroke:
                color ||
                (isCopied ? theme.palette.$mainGreen : theme.palette.$main),
            },
            circle: {
              stroke:
                color ||
                (isCopied ? theme.palette.$mainGreen : theme.palette.$main),
              fill:
                color ||
                (isCopied ? theme.palette.$mainGreen : theme.palette.$main),
            },
          },
        })}>
        {isCopied ? (
          <CopiedIcon />
        ) : (
          <Box
            className="ShareIcon__share"
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              svg: {
                transition: 'all 0.2s ease',
                '&:last-of-type': {
                  opacity: 0,
                  position: 'absolute',
                },
              },
            }}>
            <ShareIconI />
            <ShareIconH />
          </Box>
        )}
      </Box>
    </IconBox>
  );
}
