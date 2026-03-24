import { getEmodesDataRPC } from '../fallbacks/getEmodesDataRPC';
import { publicProcedure } from '../trpc';

export const emodesRouter = {
  getAll: publicProcedure
    .query(async () => {
      return await getEmodesDataRPC();
    }),
};
