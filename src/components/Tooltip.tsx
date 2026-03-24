import { Box } from '@mui/system';
import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  tooltipContent: ReactNode;
  position?: 'top';
}

export function Tooltip({ children, tooltipContent, position }: TooltipProps) {
  return (
    <Box
      sx={{
        lineHeight: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '&:hover': {
          '.Tooltip__wrapper': { opacity: 1, zIndex: 5, visibility: 'visible' },
        },
      }}>
      <Box sx={() => ({ lineHeight: 0 })}>{children}</Box>

      <Box
        className="Tooltip__wrapper"
        sx={(theme) => ({
          visibility: 'hidden',
          opacity: 0,
          zIndex: -1,
          transition: 'all 0.2s ease',
          position: 'absolute',
          top: position === 'top' ? 'auto' : 'calc(100% + 3px)',
          bottom: position === 'top' ? 'calc(100% + 3px)' : 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 45,
          backgroundColor: '$paper',
          border: `1px solid ${theme.palette.$middleLight}`,
          p: 8,
          width: 350,
          [theme.breakpoints.up('md')]: {
            width: 260,
          },
          [theme.breakpoints.up('lg')]: {
            width: 320,
          },
        })}>
        {tooltipContent}
      </Box>
    </Box>
  );
}
