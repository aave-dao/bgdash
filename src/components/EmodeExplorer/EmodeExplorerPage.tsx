'use client';

import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { EmodeColumnKeys, emodeColumns } from '../../helpers/eModeTableHelpers';
import { RouterOutputs } from '../../providers/TRPCReactProvider';
import { useStore } from '../../providers/ZustandStoreProvider';
import { ReserveItem, SortDirection } from '../../types';
import { PreLoading } from '../PreLoading';
import { ToTopButton } from '../ToTopButton';
import { FiltersPanel } from './FiltersPanel';
import { TableContent } from './TableContent';
import { TableHeader } from './TableHeader';
import { TopPanel } from './TopPanel';

export function EmodeExplorerPage({
  initialReserves,
  initialEmodes,
}: {
  initialReserves: ReserveItem[];
  initialEmodes: RouterOutputs['emodes']['getAll'];
}) {
  const router = useRouter();

  const reserves = useStore((store) => store.initialReserves);
  const fillReserves = useStore((store) => store.fillReserves);
  const fillEmodes = useStore((store) => store.fillEmodes);
  const selectedFilters = useStore((store) => store.selectedFilters);
  const emodesSortConfig = useStore((store) => store.emodesSortConfig);
  const setEmodesSortConfig = useStore((store) => store.setEmodesSortConfig);
  const emodes = useStore((store) => store.initialEmodes);
  const setIsFiltersOpenForLayout = useStore(
    (store) => store.setIsFiltersOpenForLayout,
  );

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    setIsFiltersOpen(false);
    setIsFiltersOpenForLayout(false);
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
      fillEmodes(initialEmodes, router);
    }
  }, [reserves.length, initialEmodes.length, emodes.length]);

  useEffect(() => {
    const search = window.location.search.substr(1);
    const queryParams = new URLSearchParams(search);
    for (const [key, value] of queryParams.entries()) {
      if (value && emodesSortConfig.key === null) {
        const values = value.split(',');
        if (key === 'emodesSortConfig') {
          const columnKey = values[0] as EmodeColumnKeys;
          const direction = values[1] as SortDirection;
          setEmodesSortConfig({ key: columnKey, direction, router });
        }
      }
    }
  }, [emodes.length]);

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
            <TableHeader selectedColumns={emodeColumns} />
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
          sx={{
            maxWidth: '100%',
            overflowX: 'auto',
            pb: 24,
            mb: 24,
          }}>
          <Box
            sx={{
              minWidth: 'fit-content',
            }}>
            <TableContent selectedColumns={emodeColumns} />
          </Box>
        </Box>
      </Box>

      <FiltersPanel isOpen={isFiltersOpen} setIsOpen={setFiltersOpen} />
      <ToTopButton />
    </>
  );
}
