import { produce } from 'immer';
import { Address, createPublicClient, http, zeroAddress } from 'viem';

import { viemChains } from '../constants';

import {
  getEventsKey,
  getPoolAddresses,
  poolsWithChainId,
  PoolsWithEvents,
} from '../constants';
import {
  calculateApproximateTimestampByBlockNumber,
  ReserveEvent,
} from '../server/api/fallbacks/fetchEvents';
import { api } from '../trpc/client';
import { ReserveItem, StoreSlice } from '../types';

export interface IReserveModalSlice extends PoolsWithEvents {
  getEvents: (reserve: ReserveItem) => Promise<void>;

  setEventsTimestamp: ({
    storeEvents,
    initialEvents,
    currentBlockNumber,
    currentBlockTimestamp,
  }: {
    storeEvents: Record<Address, ReserveEvent>;
    initialEvents: ReserveEvent[];
    currentBlockNumber: number;
    currentBlockTimestamp: number;
  }) => Record<Address, ReserveEvent>;
  updateEventsTimestamp: ({
    reserve,
    events,
  }: {
    reserve: ReserveItem;
    events: {
      supplyEvents: ReserveEvent[];
      borrowEvents: ReserveEvent[];
      repayEvents: ReserveEvent[];
      liquidationEvents: ReserveEvent[];
    };
  }) => Promise<void>;
}

const eventsBaseState = {
  loading: false,
  lastBlockNumber: 0,
  events: {
    supplyEvents: {},
    borrowEvents: {},
    repayEvents: {},
    liquidationEvents: {},
  },
};

export const createReservesModalSlice: StoreSlice<IReserveModalSlice> = (
  set,
  get,
) => ({
  [poolsWithChainId.AaveV2Ethereum]: eventsBaseState,
  [poolsWithChainId.AaveV2EthereumAMM]: eventsBaseState,
  [poolsWithChainId.AaveV3Ethereum]: eventsBaseState,
  [poolsWithChainId.AaveV3EthereumLido]: eventsBaseState,
  [poolsWithChainId.AaveV3EthereumEtherFi]: eventsBaseState,
  [poolsWithChainId.AaveV3Optimism]: eventsBaseState,
  [poolsWithChainId.AaveV3Gnosis]: eventsBaseState,
  [poolsWithChainId.AaveV2Polygon]: eventsBaseState,
  [poolsWithChainId.AaveV3Polygon]: eventsBaseState,
  [poolsWithChainId.AaveV3Metis]: eventsBaseState,
  [poolsWithChainId.AaveV3Base]: eventsBaseState,
  [poolsWithChainId.AaveV3Arbitrum]: eventsBaseState,
  [poolsWithChainId.AaveV2Avalanche]: eventsBaseState,
  [poolsWithChainId.AaveV3Avalanche]: eventsBaseState,
  [poolsWithChainId.AaveV3BNB]: eventsBaseState,
  [poolsWithChainId.AaveV3Scroll]: eventsBaseState,
  [poolsWithChainId.AaveV3ZkSync]: eventsBaseState,
  [poolsWithChainId.AaveV3Linea]: eventsBaseState,
  [poolsWithChainId.AaveV3Sonic]: eventsBaseState,
  [poolsWithChainId.AaveV3Celo]: eventsBaseState,
  [poolsWithChainId.AaveV3Soneium]: eventsBaseState,
  [poolsWithChainId.AaveV3InkWhitelabel]: eventsBaseState,
  [poolsWithChainId.AaveV3Plasma]: eventsBaseState,
  [poolsWithChainId.AaveV3Mantle]: eventsBaseState,
  [poolsWithChainId.AaveV3Megaeth]: eventsBaseState,
  [poolsWithChainId.AaveV3XLayer]: eventsBaseState,
  // TIP: EVENTS FOR NEW POOL SHOULD BE HERE

  setEventsTimestamp: ({
    storeEvents,
    initialEvents,
    currentBlockNumber,
    currentBlockTimestamp,
  }) => {
    const events = { ...storeEvents };
    initialEvents
      .filter((event) => !(!!event.timestamp && event.timestamp > 0))
      .forEach((event) => {
        events[event.transactionHash] = {
          ...event,
          timestamp: calculateApproximateTimestampByBlockNumber({
            blockNumber: event.blockNumber,
            currentBlockNumber,
            currentBlockTimestamp,
            chainId: event.chainId,
          }),
        };
      });

    return events;
  },

  updateEventsTimestamp: async ({ reserve, events }) => {
    const address = getPoolAddresses(reserve)?.POOL || zeroAddress;
    const objectName = getEventsKey(address, reserve.chainId);

    if (get()[objectName] && get()[objectName]?.events) {
      const publicClient = createPublicClient({
        chain: viemChains[reserve.chainId],
        transport: http(),
      });

      const currentBlock = await publicClient.getBlock();
      const currentBlockNumber = Number(currentBlock.number);
      const currentBlockTimestamp = Number(currentBlock.timestamp);

      const borrowEvents = get().setEventsTimestamp({
        storeEvents: get()[objectName].events.borrowEvents,
        initialEvents: events.borrowEvents,
        currentBlockNumber,
        currentBlockTimestamp,
      });
      const supplyEvents = get().setEventsTimestamp({
        storeEvents: get()[objectName].events.supplyEvents,
        initialEvents: events.supplyEvents,
        currentBlockNumber,
        currentBlockTimestamp,
      });
      const repayEvents = get().setEventsTimestamp({
        storeEvents: get()[objectName].events.repayEvents,
        initialEvents: events.repayEvents,
        currentBlockNumber,
        currentBlockTimestamp,
      });
      const liquidationEvents = get().setEventsTimestamp({
        storeEvents: get()[objectName].events.liquidationEvents,
        initialEvents: events.liquidationEvents,
        currentBlockNumber,
        currentBlockTimestamp,
      });

      set((state) =>
        produce(state, (draft) => {
          draft[objectName] = {
            loading: false,
            lastBlockNumber: draft[objectName].lastBlockNumber,
            events: {
              borrowEvents,
              supplyEvents,
              repayEvents,
              liquidationEvents,
            },
          };
        }),
      );
    }
  },

  getEvents: async (reserve) => {
    const address = getPoolAddresses(reserve)?.POOL || zeroAddress;
    const objectName = getEventsKey(address, reserve.chainId);

    set((state) =>
      produce(state, (draft) => {
        draft[objectName] = {
          loading: true,
          lastBlockNumber: draft[objectName]?.lastBlockNumber || 0,
          events: {
            borrowEvents: draft[objectName]?.events.borrowEvents || {},
            supplyEvents: draft[objectName]?.events.supplyEvents || {},
            repayEvents: draft[objectName]?.events.repayEvents || {},
            liquidationEvents:
              draft[objectName]?.events.liquidationEvents || {},
          },
        };
      }),
    );

    const reserveEvents = get()[objectName]?.events || {};

    const borrowEventsLatestBlock = Math.max(
      ...Object.values(reserveEvents.borrowEvents).map(
        (event) => event.blockNumber,
      ),
    );
    const supplyEventsLatestBlock = Math.max(
      ...Object.values(reserveEvents.supplyEvents).map(
        (event) => event.blockNumber,
      ),
    );
    const repayEventsLatestBlock = Math.max(
      ...Object.values(reserveEvents.repayEvents).map(
        (event) => event.blockNumber,
      ),
    );
    const liquidationEventsLatestBlock = Math.max(
      ...Object.values(reserveEvents.liquidationEvents).map(
        (event) => event.blockNumber,
      ),
    );

    const latestBlock = Math.max(
      ...[
        borrowEventsLatestBlock,
        supplyEventsLatestBlock,
        repayEventsLatestBlock,
        liquidationEventsLatestBlock,
      ],
    );

    const { startBlock, events } = await api.reserves.getEventsByPool.query({
      latestBlock,
      reserve,
    });
    const {
      newBorrowEvents,
      newSupplyEvents,
      newRepayEvents,
      newLiquidationEvents,
    } = events;

    const borrowEventsLatestBlockNew = Math.max(
      ...Object.values(newBorrowEvents).map((event) => event.blockNumber),
    );
    const supplyEventsLatestBlockNew = Math.max(
      ...Object.values(newSupplyEvents).map((event) => event.blockNumber),
    );
    const repayEventsLatestBlockNew = Math.max(
      ...Object.values(newRepayEvents).map((event) => event.blockNumber),
    );
    const liquidationEventsLatestBlockNew = Math.max(
      ...Object.values(newLiquidationEvents).map((event) => event.blockNumber),
    );

    const latestNewBlock = Math.max(
      ...[
        borrowEventsLatestBlockNew,
        supplyEventsLatestBlockNew,
        repayEventsLatestBlockNew,
        liquidationEventsLatestBlockNew,
      ],
    );

    const borrowEvents = { ...reserveEvents?.borrowEvents };
    newBorrowEvents.forEach((event) => {
      borrowEvents[event.transactionHash] = event;
    });
    const supplyEvents = { ...reserveEvents?.supplyEvents };
    newSupplyEvents.forEach((event) => {
      supplyEvents[event.transactionHash] = event;
    });
    const repayEvents = { ...reserveEvents?.repayEvents };
    newRepayEvents.forEach((event) => {
      repayEvents[event.transactionHash] = event;
    });
    const liquidationEvents = { ...reserveEvents?.liquidationEvents };
    newLiquidationEvents.forEach((event) => {
      liquidationEvents[event.transactionHash] = event;
    });

    const lastBlockNumber =
      latestNewBlock > 0 && latestNewBlock > startBlock
        ? latestNewBlock
        : startBlock;

    set((state) =>
      produce(state, (draft) => {
        draft[objectName] = {
          loading: false,
          lastBlockNumber,
          events: {
            borrowEvents,
            supplyEvents,
            repayEvents,
            liquidationEvents,
          },
        };
      }),
    );
  },
});
