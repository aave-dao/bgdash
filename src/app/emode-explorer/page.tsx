import { Metadata } from 'next';
import { Suspense } from 'react';

import { EmodeExplorerPage } from '../../components/EmodeExplorer/EmodeExplorerPage';
import { api } from '../../trpc/server';

export const metadata: Metadata = {
  title: `Aave - Dashboard | eMode Explorer`,
  description:
    'Aave dashboard interface for exploring Aave markets reserves on a single page.',
  openGraph: {
    title: `Aave - Dashboard | eMode Explorer`,
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
      <EmodeExplorerPage initialReserves={reserves} initialEmodes={emodes} />
    </Suspense>
  );
}
