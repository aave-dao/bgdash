'use client';

import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { PresetType } from '../../helpers/presetsHelpers';
import { ColumnKeys } from '../../helpers/tableHelpers';
import { RouterOutputs } from '../../providers/TRPCReactProvider';
import { useStore } from '../../providers/ZustandStoreProvider';
import { ReserveItem, SortDirection } from '../../types';
import { PreLoading } from '../PreLoading';
import { ToTopButton } from '../ToTopButton';
import { FiltersPanel } from './FiltersPanel';
import { SavePresetModal } from './SavePresetModal';
import { TableContent } from './TableContent';
import { TableHeader } from './TableHeader';
import { TopPanel } from './TopPanel';

export function DashboardPage({
  initialReserves,
  initialEmodes,
}: {
  initialReserves: ReserveItem[];
  initialEmodes: RouterOutputs['emodes']['getAll'];
}) {
  const router = useRouter();

  const reserves = useStore((store) => store.initialReserves);
  const emodes = useStore((store) => store.initialEmodes);
  const setFilters = useStore((store) => store.setFilters);
  const initFieldsPreset = useStore((store) => store.initFieldsPreset);
  const initAssetsPreset = useStore((store) => store.initAssetsPreset);
  const initChainIdsPreset = useStore((store) => store.initChainIdsPreset);
  const initGlobalPreset = useStore((store) => store.initGlobalPreset);
  const selectedFilters = useStore((store) => store.selectedFilters);
  const fillReserves = useStore((store) => store.fillReserves);
  const setSortConfig = useStore((store) => store.setSortConfig);
  const fillEmodes = useStore((store) => store.fillEmodes);
  const sortConfig = useStore((store) => store.sortConfig);
  const startReservesDataPolling = useStore(
    (store) => store.startReservesDataPolling,
  );
  const stopReservesDataPolling = useStore(
    (store) => store.stopReservesDataPolling,
  );
  const setIsFiltersOpenForLayout = useStore(
    (store) => store.setIsFiltersOpenForLayout,
  );

  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [globalPresetName, setGlobalPresetName] = useState<PresetType | string>(
    PresetType.Default,
  );

  useEffect(() => {
    initFieldsPreset();
    initAssetsPreset();
    initChainIdsPreset();
    initGlobalPreset();
    setIsFiltersOpen(false);
    setIsFiltersOpenForLayout(false);
    startReservesDataPolling();

    return () => stopReservesDataPolling();
  }, []);

  useEffect(() => {
    if (!reserves.length || reserves.length < initialReserves.length) {
      fillReserves(initialReserves, router);
    }
  }, [initialReserves.length]);

  useEffect(() => {
    if (
      (reserves.length && !emodes.length) ||
      (reserves.length && emodes.length < initialEmodes.length)
    ) {
      fillEmodes(initialEmodes);
    }
  }, [reserves.length, initialEmodes.length]);

  useEffect(() => {
    const search = window.location.search.substr(1);
    const queryParams = new URLSearchParams(search);
    for (const [key, value] of queryParams.entries()) {
      if (value && sortConfig.key === null) {
        const values = value.split(',');
        if (key === 'sortConfig') {
          const columnKey = values[0] as ColumnKeys;
          const direction = values[1] as SortDirection;
          setSortConfig({ key: columnKey, direction, router });
        }
      }
    }
  }, [reserves.length]);

  if (!selectedFilters.columns.length) return <PreLoading />;

  const setFiltersOpen = (value: boolean) => {
    setIsFiltersOpen(value);
    setIsFiltersOpenForLayout(value);
  };

  return (
    <>
      <Box>
        <TopPanel
          isFiltersOpen={isFiltersOpen}
          setIsFiltersOpen={setFiltersOpen}
          setSavePresetModalIsOpen={setIsPresetModalOpen}
          setGlobalPresetName={setGlobalPresetName}
          selectedSymbols={selectedFilters.symbol}
          setSelectedSymbols={(values: string[]) =>
            setFilters({ router, key: 'symbol', values })
          }
        />

        <Box
          onScroll={(e) => {
            if (typeof document !== 'undefined') {
              const tableBody = document.getElementById('tableBody');
              if (tableBody) {
                tableBody.scrollLeft = e.currentTarget.scrollLeft;
              }
            }
          }}
          id="tableHeaders"
          sx={{
            maxWidth: '100%',
            overflowX: 'auto',
            position: 'sticky',
            zIndex: 12,
            top: 0,
          }}>
          <Box
            sx={{
              minWidth: 'fit-content',
            }}>
            <TableHeader />
          </Box>
        </Box>

        <Box
          onScroll={(e) => {
            if (typeof document !== 'undefined') {
              const tableHeader = document.getElementById('tableHeaders');
              if (tableHeader) {
                tableHeader.scrollLeft = e.currentTarget.scrollLeft;
              }
            }
          }}
          id="tableBody"
          sx={{ maxWidth: '100%', overflowX: 'auto', pb: 24, mb: 24 }}>
          <Box
            sx={{
              minWidth: 'fit-content',
            }}>
            <TableContent selectedSymbols={selectedFilters.symbol} />
          </Box>
        </Box>
      </Box>

      <FiltersPanel isOpen={isFiltersOpen} setIsOpen={setFiltersOpen} />
      <ToTopButton />

      <SavePresetModal
        isPresetModalOpen={isPresetModalOpen}
        setIsPresetModalOpen={setIsPresetModalOpen}
        presetName={
          globalPresetName === 'custom' ? '' : `${globalPresetName}_1`
        }
      />
    </>
  );
}
