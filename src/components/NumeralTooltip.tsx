import { Box, useTheme } from '@mui/system';
import Tooltip from 'rc-tooltip';
import React from 'react';

import CopySuccess from '../assets/images/icons/copySuccess.svg';
import { IconBox } from './primitives/IconBox';

interface NumeralTooltipProps {
  value: string | number;
  children: React.ReactElement;
  suffix?: string;
  prefix?: string;
}

export function NumeralTooltip({
  value,
  children,
  suffix = '',
  prefix = '',
}: NumeralTooltipProps) {
  const theme = useTheme();
  const [copied, setCopied] = React.useState<boolean>(false);

  const displayValue = `${prefix}${value}${suffix}`;

  return (
    <Tooltip
      mouseEnterDelay={0}
      mouseLeaveDelay={0.05}
      placement="top"
      styles={{
        root: {
          border: 'none',
        },
        inner: {
          fontSize: 13,
          background: theme.palette.$main,
          color: theme.palette.$textWhite,
          padding: '4px 6px',
          minHeight: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'unset',
          borderRadius: 'unset',
        },
      }}
      align={{
        offset: [0, -4],
      }}
      overlay={
        <>
          <IconBox
            sx={{
              position: 'absolute',
              right: -10,
              top: -10,
              width: 22,
              height: 22,
              transition: 'all 0.3s ease',
              opacity: copied ? 1 : 0,
              '> svg': {
                width: 22,
                height: 22,
                g: {
                  fill: theme.palette.$mainGreen,
                },
              },
            }}>
            <CopySuccess />
          </IconBox>
          <Box
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(String(value));
              setCopied(true);
              setTimeout(() => setCopied(false), 800);
            }}>
            {displayValue}
          </Box>
        </>
      }>
      {children}
    </Tooltip>
  );
}
