import { Box, useTheme } from '@mui/system';
import { useTheme as useThemeNext } from 'next-themes';
import React from 'react';

import DarkThemeIcon from '../assets/images/icons/darkTheme.svg';
import LightThemeIcon from '../assets/images/icons/lightTheme.svg';
import { IconBox } from './primitives/IconBox';
import NoSSR from './primitives/NoSSR';

export function ThemeSwitcher() {
  const themeMUI = useTheme();
  const { theme, setTheme } = useThemeNext();

  return (
    <NoSSR>
      <Box
        component="button"
        type="button"
        onClick={() => {
          setTimeout(() => setTheme(theme === 'light' ? 'dark' : 'light'), 10);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 24,
          height: 24,
          position: 'relative',
        }}>
        <IconBox
          sx={{
            '@keyframes iconAnimation': {
              '0%': {
                transform: 'rotate(0)',
              },
              '100%': {
                transform: 'rotate(360deg)',
              },
            },
            position: 'absolute',
            left: 0,
            opacity: themeMUI.palette.mode === 'light' ? 1 : 0,
            width: 24,
            height: 24,
            '> svg': {
              width: 24,
              height: 24,
            },
            animation:
              themeMUI.palette.mode === 'light' ? `iconAnimation 1.5s` : '',
            path: { fill: themeMUI.palette.$text },
          }}>
          <LightThemeIcon />
        </IconBox>
        <IconBox
          sx={{
            '@keyframes iconAnimation': {
              '0%': {
                transform: 'rotate(0)',
              },
              '100%': {
                transform: 'rotate(360deg)',
              },
            },
            position: 'absolute',
            left: 0,
            opacity: themeMUI.palette.mode === 'dark' ? 1 : 0,
            animation:
              themeMUI.palette.mode === 'dark' ? `iconAnimation 1.5s` : '',
            width: 24,
            height: 24,
            '> svg': {
              width: 24,
              height: 24,
            },
            path: {
              fill: themeMUI.palette.$text,
            },
          }}>
          <DarkThemeIcon />
        </IconBox>
      </Box>
    </NoSSR>
  );
}
