import { zeroAddress } from 'viem';

import { getEventsKey, getPoolAddresses } from '../../constants';
import { ReserveItem } from '../../types';
import { IReserveModalSlice } from '../reservesModalSlice';

export const selectReserveEvents = (
  store: IReserveModalSlice,
  reserve: ReserveItem,
) => {
  const address = getPoolAddresses(reserve)?.POOL || zeroAddress;
  const objectName = getEventsKey(address, reserve.chainId);
  const poolEventsData = store[objectName];

  if (!!poolEventsData && poolEventsData?.lastBlockNumber > 0) {
    return {
      loading: poolEventsData.loading,
      events: {
        supplyEvents: Object.values(poolEventsData.events.supplyEvents).filter(
          (event) =>
            event.address.toLowerCase() ===
            reserve.underlyingAsset.toLowerCase(),
        ),
        borrowEvents: Object.values(poolEventsData.events.borrowEvents).filter(
          (event) =>
            event.address.toLowerCase() ===
            reserve.underlyingAsset.toLowerCase(),
        ),
        repayEvents: Object.values(poolEventsData.events.repayEvents).filter(
          (event) =>
            event.address.toLowerCase() ===
            reserve.underlyingAsset.toLowerCase(),
        ),
        liquidationEvents: Object.values(
          poolEventsData.events.liquidationEvents,
        ).filter(
          (event) =>
            event.address.toLowerCase() ===
            reserve.underlyingAsset.toLowerCase(),
        ),
      },
    };
  } else {
    return {
      loading: poolEventsData ? poolEventsData.loading : true,
      events: {
        supplyEvents: [],
        borrowEvents: [],
        repayEvents: [],
        liquidationEvents: [],
      },
    };
  }
};
