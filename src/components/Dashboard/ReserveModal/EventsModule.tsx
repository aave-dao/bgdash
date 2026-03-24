import { Box } from '@mui/system';
import React from 'react';

import { ReserveEvent } from '../../../server/api/fallbacks/fetchEvents';
import { ReserveItem } from '../../../types';
import { EventsBox } from './EventsBox';

export function EventsModule({
  reserve,
  reserveEvents,
}: {
  reserve: ReserveItem;
  reserveEvents: {
    loading: boolean;
    events: {
      supplyEvents: ReserveEvent[];
      borrowEvents: ReserveEvent[];
      repayEvents: ReserveEvent[];
      liquidationEvents: ReserveEvent[];
    };
  };
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
      <EventsBox
        reserve={reserve}
        title="Supply"
        loading={reserveEvents.loading}
        events={reserveEvents.events.supplyEvents}
      />
      <EventsBox
        reserve={reserve}
        title="Borrow"
        loading={reserveEvents.loading}
        events={reserveEvents.events.borrowEvents}
      />
      <EventsBox
        reserve={reserve}
        title="Repay"
        loading={reserveEvents.loading}
        events={reserveEvents.events.repayEvents}
      />
      <EventsBox
        reserve={reserve}
        title="Liquidations"
        loading={reserveEvents.loading}
        events={reserveEvents.events.liquidationEvents}
      />
    </Box>
  );
}
