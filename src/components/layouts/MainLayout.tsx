import { Box, useTheme } from '@mui/system';
import { ReactNode } from 'react';

import { useStore } from '../../providers/ZustandStoreProvider';
import { Container } from '../primitives/Container';
import { AppHeader } from './AppHeader';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();

  const isFiltersOpenForLayout = useStore(
    (store) => store.isFiltersOpenForLayout,
  );

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.2s ease',
          [theme.breakpoints.up('md')]: {
            pl: isFiltersOpenForLayout ? 255 : 0,
          },
          [theme.breakpoints.up('lg')]: {
            pl: isFiltersOpenForLayout ? 320 : 0,
          },
        }}>
        <Box
          sx={(theme) => ({
            display: 'inline-block',
            maxWidth: '100%',
            minWidth: '90%',
            [theme.breakpoints.up('lg')]: {
              minWidth: isFiltersOpenForLayout ? 'calc(1228px - 320px)' : 1228,
            },
          })}>
          <Box
            sx={{
              maxWidth: '100%',
              transition: 'all 0.2s ease',
              width: '100%',
              [theme.breakpoints.up('md')]: {
                maxWidth: 1800,
              },
            }}>
            <AppHeader />
            <Box component="main" sx={{ position: 'relative', zIndex: 2 }}>
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
