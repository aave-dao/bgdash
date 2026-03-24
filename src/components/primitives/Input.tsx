import { styled } from '@mui/system';

export const Input = styled('input')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  lineHeight: '1',
  fontWeight: '400',
  transition: 'all 0.2s ease',
  fontSize: 11,
  border: 'unset',
  background: 'transparent',
  outline: 'unset',
  boxShadow: 'unset',
  height: 36,
  padding: '7px 23px 7px 5px',
  color: theme.palette.$text,
  [theme.breakpoints.up('xsm')]: {
    fontSize: 12,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 13,
  },
  '&::placeholder': {
    color: theme.palette.$textDisabled,
  },
}));
