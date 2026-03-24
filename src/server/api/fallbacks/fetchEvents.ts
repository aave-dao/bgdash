import { Address, Client, formatUnits, Hex, zeroAddress, zeroHash } from 'viem';
import { getBlock, getContractEvents } from 'viem/actions';

import {
  BlockPeriod,
  getPoolAddresses,
  ReserveVersion,
} from '../../../constants';
import { blockLimit, getEventsBySteps } from '../../../helpers/eventsHelpers';
import { ReserveItem } from '../../../types';
import {
  borrowEventV2,
  borrowEventV3,
  liquidationCallEventV2,
  liquidationCallEventV3,
  repayEventV2,
  repayEventV3,
  supplyEventV2,
  supplyEventV3,
} from './abis';

export type ReserveEvent = {
  address: Address;
  amount: string;
  chainId: number;
  transactionHash: Hex;
  blockNumber: number;
  timestamp?: number;
};

export enum EventType {
  repayEventV2 = 'repayEventV2',
  repayEventV3 = 'repayEventV3',
  borrowEventV2 = 'borrowEventV2',
  borrowEventV3 = 'borrowEventV3',
  supplyEventV2 = 'supplyEventV2',
  supplyEventV3 = 'supplyEventV3',
  liquidationCallEventV2 = 'liquidationCallEventV2',
  liquidationCallEventV3 = 'liquidationCallEventV3',
}

enum EventName {
  Repay = 'Repay',
  Borrow = 'Borrow',
  Deposit = 'Deposit',
  Supply = 'Supply',
  LiquidationCall = 'LiquidationCall',
}

const eventsAbis = {
  [EventType.repayEventV2]: {
    abi: repayEventV2,
    eventName: EventName.Repay,
  },
  [EventType.repayEventV3]: {
    abi: repayEventV3,
    eventName: EventName.Repay,
  },
  [EventType.borrowEventV2]: {
    abi: borrowEventV2,
    eventName: EventName.Borrow,
  },
  [EventType.borrowEventV3]: {
    abi: borrowEventV3,
    eventName: EventName.Borrow,
  },
  [EventType.supplyEventV2]: {
    abi: supplyEventV2,
    eventName: EventName.Deposit,
  },
  [EventType.supplyEventV3]: {
    abi: supplyEventV3,
    eventName: EventName.Supply,
  },
  [EventType.liquidationCallEventV2]: {
    abi: liquidationCallEventV2,
    eventName: EventName.LiquidationCall,
  },
  [EventType.liquidationCallEventV3]: {
    abi: liquidationCallEventV3,
    eventName: EventName.LiquidationCall,
  },
};

async function getEventData({
  contractAddress,
  client,
  startBlock,
  endBlock,
  chainId,
  eventType,
  decimals,
}: {
  contractAddress: Address;
  client: Client;
  startBlock: number;
  endBlock: number;
  endBlockTimestamp: number;
  chainId: number;
  eventType: EventType;
  decimals: number;
}) {
  const events = await getContractEvents(client, {
    address: contractAddress,
    abi: eventsAbis[eventType].abi,
    eventName: eventsAbis[eventType].eventName,
    fromBlock: BigInt(startBlock),
    toBlock: BigInt(endBlock),
  });

  const eventsData = await Promise.all(
    events
      .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
      .map(async (event) => {
        return {
          address:
            eventsAbis[eventType].eventName === EventName.LiquidationCall
              ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                event.args.collateralAsset
              : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                event.args.reserve,
          amount:
            eventsAbis[eventType].eventName === EventName.LiquidationCall
              ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                event.args.liquidatedCollateralAmount
              : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                event.args.amount,
          chainId,
          transactionHash: event.transactionHash,
          blockNumber: Number(event.blockNumber),
        };
      }),
  );

  return eventsData.map((event) => {
    return {
      ...event,
      amount: Number(formatUnits(event.amount, decimals)).toFixed(18),
    };
  });
}

export async function getEventByStep({
  client,
  reserve,
  eventType,
  startBlock,
}: {
  client: Client;
  reserve: Pick<ReserveItem, 'pool' | 'version' | 'chainId' | 'decimals'>;
  eventType: EventType;
  startBlock: number;
}) {
  const endBlock = await getBlock(client);

  const callbackFunc = async (
    startBlockNumber: number,
    endBlockNumber: number,
  ) => {
    return await getEventData({
      contractAddress: getPoolAddresses(reserve)?.POOL ?? zeroAddress,
      client,
      startBlock: startBlockNumber,
      endBlock: endBlockNumber,
      endBlockTimestamp: Number(endBlock.timestamp),
      chainId: reserve.chainId,
      eventType,
      decimals: reserve.decimals,
    });
  };

  return getEventsBySteps(
    startBlock,
    Number(endBlock.number),
    blockLimit,
    callbackFunc,
    [
      {
        address: zeroAddress,
        amount: '0',
        chainId: reserve.chainId,
        transactionHash: zeroHash,
        blockNumber: startBlock,
      },
    ],
  );
}

export function calculateApproximateTimestampByBlockNumber({
  blockNumber,
  currentBlockNumber,
  currentBlockTimestamp,
  chainId,
}: {
  blockNumber: number;
  currentBlockNumber: number;
  currentBlockTimestamp: number;
  chainId: number;
}) {
  const blockDiff = currentBlockNumber - blockNumber;
  const timeSinceBlock = blockDiff * BlockPeriod[chainId];

  return currentBlockTimestamp - timeSinceBlock;
}

export async function fetchEvents(
  client: Client,
  reserve: Pick<ReserveItem, 'pool' | 'version' | 'chainId' | 'decimals'>,
  startBlock: number,
) {
  const isV2Events = reserve.version === ReserveVersion.v2;

  const repayEvent = isV2Events
    ? EventType.repayEventV2
    : EventType.repayEventV3;
  const borrowEvent = isV2Events
    ? EventType.borrowEventV2
    : EventType.borrowEventV3;
  const supplyEvent = isV2Events
    ? EventType.supplyEventV2
    : EventType.supplyEventV3;
  const liquidationEvent = isV2Events
    ? EventType.liquidationCallEventV2
    : EventType.liquidationCallEventV3;

  const [supplyEvents, borrowEvents, repayEvents, liquidationEvents] =
    await Promise.all([
      getEventByStep({
        client,
        reserve,
        eventType: supplyEvent,
        startBlock,
      }),
      getEventByStep({
        client,
        reserve,
        eventType: borrowEvent,
        startBlock,
      }),
      getEventByStep({
        client,
        reserve,
        eventType: repayEvent,
        startBlock,
      }),
      getEventByStep({
        client,
        reserve,
        eventType: liquidationEvent,
        startBlock,
      }),
    ]);

  return [supplyEvents, borrowEvents, repayEvents, liquidationEvents];
}
