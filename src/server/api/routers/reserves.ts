import dayjs from 'dayjs';
import { getBlock } from 'viem/actions';
import { z } from 'zod';

import { marketHelper, ReservePool, ReserveVersion } from '../../../constants';
import type { ReserveItem } from '../../../types';
import { fetchAndFormatReservesDataFromRPC } from '../fallbacks/fetchAndFormatReservesDataFromRPC';
import { fetchEvents } from '../fallbacks/fetchEvents';
import { getAllReservesDataRPC } from '../fallbacks/getAllReservesDataRPC';
import { getDataByChainRPC } from '../fallbacks/getDataByChainRPC';
import { serverViemPublicClient } from '../fallbacks/utils/chains';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const reservesRouter = createTRPCRouter({
  getReserveDataById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const params = input.id.split('-');
      const currentTimestamp = dayjs().unix();
      const chainId = Number.parseInt(
        params[0],
        10,
      ) as keyof typeof marketHelper;
      const pool = params[2] as ReservePool;
      const version = params[params.length - 1] as ReserveVersion;

      if (version === ReserveVersion.v2) {
        const reservesData = await fetchAndFormatReservesDataFromRPC(
          version,
          pool,
          chainId,
          currentTimestamp,
        );

        if (reservesData) {
          return {
            reserve: reservesData.filter(
              (reserve) => reserve.id === input.id,
            )[0],
            reservesData,
          };
        }
      } else {
        return await getDataByChainRPC({
          version,
          pool,
          chainId,
          currentTimestamp,
          reserveId: input.id,
        });
      }
    }),

  getAll: publicProcedure
    .input(z.object({}))
    .query(async () => {
      return await getAllReservesDataRPC();
    }),

  getEventsByPool: publicProcedure
    .input(
      z.object({
        latestBlock: z.number(),
        reserve: z.object({
          pool: z.nativeEnum(ReservePool),
          version: z.nativeEnum(ReserveVersion),
          chainId: z.custom<keyof typeof marketHelper>((value) => {
            return Object.keys(marketHelper).indexOf(value) > -1;
          }),
          decimals: z.number(),
        }),
      }),
    )
    .query(async ({ input }) => {
      const client = serverViemPublicClient[input.reserve.chainId];

      let startBlock = input.latestBlock > 0 ? input.latestBlock : 0;
      if (startBlock === 0) {
        const block = await getBlock(client);
        startBlock = Number(block.number) - 10000;
      }

      const [
        newSupplyEvents,
        newBorrowEvents,
        newRepayEvents,
        newLiquidationEvents,
      ] = await fetchEvents(
        client,
        {
          ...input.reserve,
          chainId: input.reserve.chainId,
        },
        startBlock,
      );

      return {
        startBlock,
        events: {
          newSupplyEvents,
          newBorrowEvents,
          newRepayEvents,
          newLiquidationEvents,
        },
      };
    }),
});
