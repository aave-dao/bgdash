import { Box, SxProps, useTheme } from '@mui/system';
import { MouseEventHandler, ReactNode } from 'react';

import { BoxWith3D } from './BoxWith3D';

export interface ButtonProps {
  type?: 'button' | 'submit';
  color?: 'black' | 'white';
  children: string | ReactNode;
  disabled?: boolean;
  pressed?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  css?: SxProps;
  withoutActions?: boolean;
  customWidth?: number;
}

export function Button({
  type = 'button',
  color = 'black',
  children,
  disabled,
  loading,
  onClick,
  css,
  withoutActions,
  customWidth,
  pressed,
}: ButtonProps) {
  const theme = useTheme();

  const borderSize = 4;
  const mobileWidth = customWidth ? `${customWidth}px` : '130px';
  const mobileHeight = '36px';
  const tabletWidth = customWidth ? `${customWidth}px` : '130px';
  const tabletHeight = '36px';
  const width = customWidth ? `${customWidth}px` : '130px';
  const height = '36px';

  const contentColor = color === 'black' ? '$mainButton' : '$whiteButton';
  const textColor = color === 'black' ? '$textWhite' : '$text';

  return (
    <Box className="Button" sx={{ display: 'inline-flex', ...css }}>
      <Box
        component="button"
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        sx={{
          minWidth: `calc(${mobileWidth} + ${borderSize}px)`,
          height: `calc(${mobileHeight} + ${borderSize}px)`,
          cursor: withoutActions
            ? 'default'
            : loading
              ? 'not-allowed'
              : 'pointer',
          '&:disabled': { cursor: 'not-allowed' },
          hover: {
            '.Button__children': {
              color: theme.palette.$text,
            },
          },
          '&:active': {
            '.Button__children': {
              color: theme.palette.$text,
            },
          },
          [theme.breakpoints.up('sm')]: {
            minWidth: `calc(${tabletWidth} + ${borderSize}px)`,
            height: `calc(${tabletHeight} + ${borderSize}px)`,
          },
          [theme.breakpoints.up('lg')]: {
            minWidth: `calc(${width} + ${borderSize}px)`,
            height: `calc(${height} + ${borderSize}px)`,
          },
        }}>
        <BoxWith3D
          borderSize={borderSize}
          leftBorderColor={
            color === 'black' ? '$buttonBorderLeft' : '$whiteButtonBorderLeft'
          }
          bottomBorderColor={
            color === 'black'
              ? '$buttonBorderBottom'
              : '$whiteButtonBorderBottom'
          }
          contentColor={
            pressed ? '$light' : disabled ? '$buttonDisabled' : contentColor
          }
          borderLinesColor={disabled ? '$disabledBorder' : '$mainBorder'}
          disabled={pressed || disabled || loading}
          withActions={!withoutActions}
          wrapperCss={{
            '.BoxWith3D__content--activeShadow': pressed
              ? {
                  width: 'calc(100% + 2px)',
                  height: 'calc(100% + 2px)',
                }
              : {},
          }}
          css={{
            padding: 2,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: '5px 10px',
            minWidth: mobileWidth,
            height: mobileHeight,
            [theme.breakpoints.up('sm')]: {
              minWidth: tabletWidth,
              height: tabletHeight,
            },
            [theme.breakpoints.up('lg')]: {
              minWidth: width,
              height,
            },
          }}>
          <Box
            className="Button__children"
            sx={{
              typography: 'body',
              position: 'relative',
              zIndex: 5,
              whiteSpace: 'nowrap',
              color: disabled ? '$disabled' : textColor,
              transition: 'all 0.1s ease',
            }}>
            {children}
          </Box>

          {loading && (
            <Box
              sx={{
                backgroundColor: disabled ? '$buttonDisabled' : contentColor,
                ml: 5,
                position: 'relative',
                top: 0.5,
              }}>
              <h1>Loading: TODO</h1>
            </Box>
          )}
        </BoxWith3D>
      </Box>
    </Box>
  );
}
