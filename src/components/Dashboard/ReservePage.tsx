'use client';

import { Box } from '@mui/system';
import React, { useEffect } from 'react';

import { formatEmodeAPIData } from '../../helpers/formatEmodesData';
import { RouterOutputs } from '../../providers/TRPCReactProvider';
import { useStore } from '../../providers/ZustandStoreProvider';
import { ReserveItem } from '../../types';
import { ReserveModalContent } from './ReserveModal';

export function ReservePage({
  reserve,
  initialReserves,
  initialEmodes,
}: {
  reserve: ReserveItem;
  initialReserves?: ReserveItem[];
  initialEmodes?: RouterOutputs['emodes']['getAll'];
}) {
  const reserves = useStore((store) => store.initialReserves);
  const fillReserves = useStore((store) => store.fillReserves);
  const emodes = useStore((store) => store.initialEmodes);
  const fillEmodes = useStore((store) => store.fillEmodes);

  useEffect(() => {
    if (
      initialReserves?.length &&
      (!reserves.length || reserves.length < initialReserves?.length)
    ) {
      fillReserves(initialReserves);
    }
  }, [initialReserves?.length]);

  useEffect(() => {
    if (
      initialEmodes?.length &&
      ((reserves.length && !emodes.length) ||
        (reserves.length && emodes.length < initialEmodes?.length))
    ) {
      fillEmodes(initialEmodes);
    }
  }, [reserves.length, initialEmodes?.length]);

  const updatedReserve =
    reserves.find((res) => res.id === reserve.id) ?? reserve;

  const reservesForSymbols = reserves.length ? reserves : initialReserves;

  return initialReserves ? (
    <Box
      sx={(theme) => ({
        overflowX: 'hidden',
        pt: 12,
        pb: 32,
        [theme.breakpoints.up('lg')]: { width: 1228 },
      })}>
      <ReserveModalContent
        reserve={updatedReserve}
        initialEmodes={initialEmodes?.map((emode) =>
          formatEmodeAPIData({
            emode,
            reserves: reservesForSymbols,
          }),
        )}
      />
    </Box>
  ) : (
    <ReserveModalContent
      reserve={updatedReserve}
      initialEmodes={initialEmodes?.map((emode) =>
        formatEmodeAPIData({
          emode,
          reserves: reservesForSymbols,
        }),
      )}
    />
  );
}
