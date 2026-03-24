import { getUmbrellasDataRPC } from '../fallbacks/getUmbrellasDataRPC';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const umbrellasRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async () => {
      return await getUmbrellasDataRPC();
    }),
});
