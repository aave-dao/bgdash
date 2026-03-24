'use client';

import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useStore } from '../../providers/ZustandStoreProvider';
import { UmbrellaMarket } from '../../types';
import { UmbrellaFiltersPanel } from './UmbrellaFiltersPanel';
import { UmbrellaTableContent } from './UmbrellaTableContent';
import { UmbrellaTableHeader } from './UmbrellaTableHeader';
import { UmbrellaTopPanel } from './UmbrellaTopPanel';

export const UmbrellaExplorerPage = ({
  initialUmbrellas,
}: {
  initialUmbrellas?: (UmbrellaMarket | null)[];
}) => {
  const router = useRouter();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const umbrellas = useStore((store) => store.initialUmbrellas);
  const fillUmbrellas = useStore((store) => store.fillUmbrellas);
  const selectedFilters = useStore((store) => store.umbrellaSelectedFilters);
  const initUmbrellaSelectedColumns = useStore(
    (store) => store.initUmbrellaSelectedColumns,
  );
  const setIsFiltersOpenForLayout = useStore(
    (store) => store.setIsFiltersOpenForLayout,
  );

  useEffect(() => {
    if (
      initialUmbrellas &&
      (!umbrellas.length || umbrellas.length < initialUmbrellas.length)
    ) {
      fillUmbrellas(initialUmbrellas);
    }
  }, [initialUmbrellas?.length, umbrellas.length, fillUmbrellas]);

  useEffect(() => {
    initUmbrellaSelectedColumns(router);
  }, [initUmbrellaSelectedColumns, router]);

  useEffect(() => {
    return () => {
      setIsFiltersOpenForLayout(false);
    };
  }, [setIsFiltersOpenForLayout]);

  const setFiltersOpen = (value: boolean) => {
    setIsFiltersOpen(value);
    setIsFiltersOpenForLayout(value);
  };

  return (
    <Box>
      <UmbrellaTopPanel
        isFiltersOpen={isFiltersOpen}
        setIsFiltersOpen={setFiltersOpen}
      />

      <Box
        onScroll={(e) => {
          if (typeof document !== 'undefined') {
            const tableBody = document.getElementById('umbrellaTableBody');
            if (tableBody) {
              tableBody.scrollLeft = e.currentTarget.scrollLeft;
            }
          }
        }}
        id="umbrellaTableHeaders"
        sx={{
          maxWidth: '100%',
          overflowX: 'auto',
          position: 'sticky',
          zIndex: 12,
          top: 0,
          mt: 15,
        }}>
        <Box
          sx={{
            minWidth: 'fit-content',
          }}>
          <UmbrellaTableHeader selectedColumns={selectedFilters.columns} />
        </Box>
      </Box>

      <Box
        onScroll={(e) => {
          if (typeof document !== 'undefined') {
            const tableHeader = document.getElementById('umbrellaTableHeaders');
            if (tableHeader) {
              tableHeader.scrollLeft = e.currentTarget.scrollLeft;
            }
          }
        }}
        id="umbrellaTableBody"
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
          <UmbrellaTableContent selectedColumns={selectedFilters.columns} />
        </Box>
      </Box>

      <UmbrellaFiltersPanel isOpen={isFiltersOpen} setIsOpen={setFiltersOpen} />
    </Box>
  );
};
