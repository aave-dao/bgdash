import { Box, useTheme } from '@mui/system';
import React from 'react';

import CustomizeIcon from '../../assets/images/icons/customize.svg';
import CustomizeActiveIcon from '../../assets/images/icons/customizeActive.svg';
import { Button } from '../Button';
import { IconBox } from '../primitives/IconBox';
import { TopPanelContainer } from '../TopPanelContainer';

interface UmbrellaTopPanelProps {
  isFiltersOpen: boolean;
  setIsFiltersOpen: (value: boolean) => void;
}

export function UmbrellaTopPanel({
  isFiltersOpen,
  setIsFiltersOpen,
}: UmbrellaTopPanelProps) {
  const theme = useTheme();

  return (
    <TopPanelContainer>
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          mb: 12,
          flexDirection: 'row-reverse',
          [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
          },
          [theme.breakpoints.up('md')]: {
            justifyContent: 'flex-start',
            width: 'auto',
            mb: 0,
          },
        }}>
        <Box
          sx={{
            display: 'none',
            [theme.breakpoints.up('sm')]: { display: 'block' },
          }}>
          <Button
            pressed={isFiltersOpen}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            color="white">
            Customize
          </Button>
        </Box>
        <Box
          sx={{
            [theme.breakpoints.up('sm')]: { display: 'none' },
          }}>
          <Button
            css={{ '.BoxWith3D__content--color': { '> div': { p: 0 } } }}
            customWidth={36}
            disabled={isFiltersOpen}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            color="black">
            <IconBox
              sx={{
                width: 32,
                height: 32,
                '> svg': { width: 32, height: 32 },
              }}>
              {isFiltersOpen ? <CustomizeActiveIcon /> : <CustomizeIcon />}
            </IconBox>
          </Button>
        </Box>
      </Box>
    </TopPanelContainer>
  );
}
