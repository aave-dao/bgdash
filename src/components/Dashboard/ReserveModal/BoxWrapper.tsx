import { SxProps, useTheme } from '@mui/system';
import { ReactNode } from 'react';

import { BoxWith3D } from '../../BoxWith3D';

interface BoxWrapperProps {
  children: ReactNode;
  css?: SxProps;
  wrapperCss?: SxProps;
  forLoading?: boolean;
}

export function BoxWrapper({
  children,
  css,
  wrapperCss,
  forLoading,
}: BoxWrapperProps) {
  const theme = useTheme();
  return (
    <BoxWith3D
      borderSize={4}
      contentColor="$mainLight"
      wrapperCss={{ mb: 24, ...wrapperCss }}
      css={{
        p: '8px',
        [theme.breakpoints.up('sm')]: {
          p: forLoading ? '9.5px 18px' : '12px 12px',
        },
        [theme.breakpoints.up('lg')]: {
          p: forLoading ? '9.5px 18px' : '12px 18px',
        },
        ...css,
      }}>
      {children}
    </BoxWith3D>
  );
}
