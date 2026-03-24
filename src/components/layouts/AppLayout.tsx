'use client';

import { Box } from '@mui/system';
import { ReactNode } from 'react';

import { MainLayout } from './MainLayout';

export default function AppLayout({
  children,
  fontFamily,
}: {
  children: ReactNode;
  fontFamily: string;
}) {
  return (
    <Box
      sx={{
        'input, button': {
          fontFamily,
        },
      }}>
      <MainLayout>{children}</MainLayout>
    </Box>
  );
}
