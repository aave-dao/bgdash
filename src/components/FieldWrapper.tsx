import { Box, SxProps, useTheme } from '@mui/system';
import { ReactNode } from 'react';

interface FieldWrapperProps {
  children: ReactNode;
  isFocused?: boolean;
  sx?: SxProps;
  small?: boolean;
}
export function FieldWrapper({
  children,
  isFocused,
  sx,
  small,
}: FieldWrapperProps) {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', pr: 2, ...sx }}>
      <Box
        className="FieldWrapper__wrapper"
        sx={{
          position: 'relative',
          cursor: 'pointer',
          minWidth: 140,
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            minWidth: 200,
          },
          [theme.breakpoints.up('md')]: {
            minWidth: small ? 140 : 200,
          },
          [theme.breakpoints.up('lg')]: {
            minWidth: 200,
          },
          hover: {
            '.FieldWrapper__content': {
              background: theme.palette.$light,
            },
            '.ArrowAndCross': {
              div: {
                height: 2,
              },
            },
          },
          '&:focus-within': {
            '.FieldWrapper__content': {
              background: theme.palette.$light,
            },
            '.ArrowAndCross': {
              div: {
                height: 2,
              },
            },
          },
        }}>
        <Box
          className="FieldWrapper__content"
          sx={{
            position: 'relative',
            zIndex: 2,
            background: isFocused ? theme.palette.$light : theme.palette.$paper,
            minHeight: 36,
            width: '100%',
            transition: 'all 0.2s ease',
          }}>
          {children}
        </Box>

        <Box
          className="FieldWrapper__border"
          sx={{
            position: 'absolute',
            inset: -1,
            background: theme.palette.$mainBorder,
            transition: 'all 0.2s ease',
          }}
        />
      </Box>
    </Box>
  );
}
