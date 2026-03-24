import type { Metadata } from 'next';
import { Suspense } from 'react';

import { DashboardPage } from '../components/Dashboard/DashboardPage';
import { api } from '../trpc/server';

export const metadata: Metadata = {
  title: `Aave - Dashboard`,
  description:
    'Aave dashboard interface for exploring Aave markets reserves on a single page.',
  openGraph: {
    title: `Aave - Dashboard`,
    description:
      'Aave dashboard interface for exploring Aave markets reserves on a single page.',
  },
};

export const revalidate = 60;

export default async function Page() {
  const [reserves, emodes] = await Promise.all([
    api.reserves.getAll({}),
    api.emodes.getAll(),
  ]);
  return (
    <Suspense>
      <DashboardPage initialReserves={reserves} initialEmodes={emodes} />
    </Suspense>
  );
}
