import { emodesRouter } from './routers/emodes';
import { reservesRouter } from './routers/reserves';
import { umbrellasRouter } from './routers/umbrellas';
import { createCallerFactory, createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  reserves: reservesRouter,
  emodes: emodesRouter,
  umbrellas: umbrellasRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
