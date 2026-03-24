import { createTRPCClient, httpLink } from '@trpc/client';
import SuperJSON from 'superjson';

import { AppRouter } from '../server/api/root';

export const api = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: '/api/trpc',
      transformer: SuperJSON,
    }),
  ],
});
