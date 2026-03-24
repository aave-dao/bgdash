'use client';

import { Box } from '@mui/system';

import { Loader } from './Loader';

export function PreLoading() {
  return (
    <Box
      sx={(theme) => ({
        minHeight: '80dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '98dvw',
        [theme.breakpoints.up('sm')]: {
          width: '96dvw',
        },
        [theme.breakpoints.up('md')]: {
          width: 'unset',
        },
      })}>
      <Loader size={120} />
      <Box sx={{ typography: 'main', fontWeight: '700', mt: 24 }}>
        Loading initial data, please wait...
      </Box>
    </Box>
  );
}
