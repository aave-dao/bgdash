import { Box, SxProps, useTheme } from '@mui/system';
import { ReactNode } from 'react';

import { ReserveItem } from '../../../types';
import { BoxWrapper } from './BoxWrapper';

export interface InfoBoxProps {
  reserve: ReserveItem;
}

interface InfoBoxWrapperProps {
  chart?: ReactNode;
  children: ReactNode;
  title?: string;
  wrappedCss?: SxProps;
  css?: SxProps;
  additionalContent?: ReactNode;
}

export function InfoBoxWrapper({
  chart,
  children,
  title,
  wrappedCss,
  css,
  additionalContent,
}: InfoBoxWrapperProps) {
  const theme = useTheme();

  return (
    <BoxWrapper
      css={{
        display: 'flex',
        flexDirection: 'column',
        p: '18px 8px',
        [theme.breakpoints.up('sm')]: {
          p: '24px 12px',
        },
        [theme.breakpoints.up('md')]: {
          p: '18px 12px',
        },
        [theme.breakpoints.up('lg')]: {
          p: '24px 16px',
        },
        ...css,
      }}
      wrapperCss={{
        width: '100%',
        mb: 16,
        alignSelf: 'stretch',
        [theme.breakpoints.up('md')]: { width: '49%' },
        '> div, .BoxWith3D__content, .BoxWith3D__content--color': {
          height: '100%',
        },
        ...wrappedCss,
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          flex: 1,
          [theme.breakpoints.up('sm')]: { alignItems: 'center' },
        }}>
        {!!chart && (
          <Box
            sx={{
              mx: 0,
              [theme.breakpoints.up('md')]: { mx: 6 },
              [theme.breakpoints.up('lg')]: { mx: 12 },
            }}>
            {chart}
          </Box>
        )}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignSelf: 'stretch',
          }}>
          {!!title && (
            <Box component="strong" sx={{ mb: 16, typography: 'headline' }}>
              {title}
            </Box>
          )}
          {children}
        </Box>
      </Box>
      {additionalContent}
    </BoxWrapper>
  );
}

export function InfoBoxWrapperBig({
  children,
  css,
  wrappedCss,
  ...props
}: InfoBoxWrapperProps) {
  const theme = useTheme();

  return (
    <InfoBoxWrapper
      css={{
        p: '18px 8px',
        [theme.breakpoints.up('sm')]: {
          p: '24px 12px',
        },
        [theme.breakpoints.up('md')]: {
          p: '12px 32px',
        },
        [theme.breakpoints.up('lg')]: {
          p: '16px 50px',
        },
        ...css,
      }}
      wrappedCss={{
        [theme.breakpoints.up('md')]: { width: '100%' },
        ...wrappedCss,
      }}
      {...props}>
      {children}
    </InfoBoxWrapper>
  );
}
