import { Box } from '@mui/system';

import { useStore } from '../../providers/ZustandStoreProvider';
import { NoData } from '../NoData';
import { TableContentLoading } from '../Table';
import { TableItem } from './TableItem';

interface TableContentProps {
  selectedSymbols: string[];
}

export function TableContent({ selectedSymbols }: TableContentProps) {
  const sortedFilteredReserves = useStore(
    (store) => store.sortedFilteredReserves,
  );
  const selectedFilters = useStore((store) => store.selectedFilters);
  const reservesAreLoading = useStore((store) => store.reservesAreLoading);
  const emodes = useStore((store) => store.sortedFilteredEmodes);
  const emodesAreLoading = useStore((store) => store.emodesAreLoading);

  if (reservesAreLoading)
    return (
      <Box sx={{ pt: 18 }}>
        <TableContentLoading selectedColumns={selectedFilters.columns} />
      </Box>
    );

  if (!sortedFilteredReserves.length) {
    return <NoData />;
  }

  return (
    <Box sx={{ pt: 18 }}>
      {sortedFilteredReserves
        .filter(
          (item) =>
            selectedSymbols.length === 0 ||
            selectedSymbols.includes(item.symbol.toString()),
        )
        .map((item) => (
          <TableItem
            key={item.id}
            item={item}
            selectedColumns={selectedFilters.columns}
            emodes={emodes}
            emodesLoading={emodesAreLoading}
            path={`/reserve/${item.id}`}
          />
        ))}
    </Box>
  );
}
