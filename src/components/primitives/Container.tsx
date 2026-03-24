import { styled } from '@mui/system';

export const Container = styled('div')(({ theme }) => ({
  margin: '0 auto',
  position: 'relative',
  zIndex: 2,
  paddingLeft: 8,
  paddingRight: 8,
  [theme.breakpoints.up('sm')]: {
    paddingLeft: 24,
    paddingRight: 24,
  },
}));
