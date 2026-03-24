import { Box, useTheme } from '@mui/system';
import React from 'react';

import { ArrowAndCross } from './ArrowAndCross';
import { BoxWith3D } from './BoxWith3D';

interface AccordionProps {
  label?: string;
  openLabel?: string;
  children: React.ReactNode;
  onClick?: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function Accordion({
  children,
  onClick,
  label,
  openLabel,
  isOpen,
  setIsOpen,
}: AccordionProps) {
  const theme = useTheme();

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    if (!isOpen && onClick) {
      onClick();
    }
  };

  return (
    <Box sx={{ flexDirection: 'column', width: '100%', position: 'relative' }}>
      {(label || openLabel) && (
        <Box
          sx={{
            mb: 24,
            textAlign: 'center',
          }}>
          {isOpen && openLabel ? openLabel : label}
        </Box>
      )}

      <Box
        sx={{
          height: isOpen ? 'auto' : 0,
          overflow: 'hidden',
        }}>
        {children}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Box
          component="button"
          onClick={toggleAccordion}
          sx={{
            hover: {
              '.ArrowAndCross__line': {
                backgroundColor: theme.palette.$text,
              },
            },
          }}>
          <BoxWith3D
            withActions
            css={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ArrowAndCross
              isTopArrow={isOpen}
              size={12}
              sx={{
                position: 'relative',
                left: 1,
                '.ArrowAndCross__line': { backgroundColor: '$textWhite' },
              }}
            />
          </BoxWith3D>
        </Box>
      </Box>
    </Box>
  );
}
