import { Box, useTheme } from '@mui/system';
import React from 'react';

import CustomizeIcon from '../../assets/images/icons/customize.svg';
import CustomizeActiveIcon from '../../assets/images/icons/customizeActive.svg';
import { exportReservesToCSV } from '../../helpers/csvExport';
import { useStore } from '../../providers/ZustandStoreProvider';
import { AssetsSearchField } from '../AssetsSearchField';
import { Button } from '../Button';
import { CsvIcon } from '../CsvIcon';
import { IconBox } from '../primitives/IconBox';
import { TopPanelContainer } from '../TopPanelContainer';
import { GlobalPresetSelect } from './GlobalPresetSelect';

interface TopPanelProps {
  isFiltersOpen: boolean;
  setIsFiltersOpen: (value: boolean) => void;
  setSavePresetModalIsOpen: (value: boolean) => void;
  setGlobalPresetName: (presetName: string) => void;
  selectedSymbols: string[];
  setSelectedSymbols: (value: string[]) => void;
}

export function TopPanel({
  isFiltersOpen,
  setIsFiltersOpen,
  setSavePresetModalIsOpen,
  setGlobalPresetName,
  selectedSymbols,
  setSelectedSymbols,
}: TopPanelProps) {
  const theme = useTheme();
  const filterOptions = useStore((store) => store.filterOptions);
  const sortedFilteredReserves = useStore(
    (store) => store.sortedFilteredReserves,
  );
  const selectedFilters = useStore((store) => store.selectedFilters);

  const handleExportCSV = () => {
    try {
      const filteredReserves = sortedFilteredReserves.filter(
        (item) =>
          selectedSymbols.length === 0 ||
          selectedSymbols.includes(item.symbol.toString()),
      );

      const hasFilters =
        selectedSymbols.length > 0 ||
        selectedFilters.chainId.length > 0 ||
        selectedFilters.pool.length > 0 ||
        selectedFilters.version.length > 0;

      exportReservesToCSV(filteredReserves, selectedFilters.columns, {
        symbols: selectedSymbols,
        chains: selectedFilters.chainId.map(Number),
        hasFilters,
      });
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  return (
    <TopPanelContainer>
      <Box
        sx={{
          flexGrow: 1,
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
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

        <GlobalPresetSelect
          savePreset={() => setSavePresetModalIsOpen(true)}
          presetChangeCallback={setGlobalPresetName}
        />

        <IconBox
          as="button"
          onClick={handleExportCSV}
          sx={{
            display: 'none',
            width: 24,
            height: 24,
            ml: 'auto',
            cursor: 'pointer',
            [theme.breakpoints.up('sm')]: {
              display: 'block',
            },
            '> svg': {
              width: 24,
              height: 24,
              path: {
                fill: theme.palette.$main,
              },
              rect: {
                fill: theme.palette.$main,
              },
            },
            hover: {
              '> svg': {
                path: {
                  fill: theme.palette.$text,
                },
                rect: {
                  fill: theme.palette.$text,
                },
              },
            },
          }}>
          <CsvIcon />
        </IconBox>
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
        }}>
        <AssetsSearchField
          selectedSymbols={selectedSymbols}
          setSelectedSymbols={setSelectedSymbols}
          symbols={filterOptions.symbol}
        />
      </Box>
    </TopPanelContainer>
  );
}
