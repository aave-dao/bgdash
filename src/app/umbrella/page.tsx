import { Metadata } from 'next';
import { Suspense } from 'react';

import { UmbrellaExplorerPage } from '../../components/UmbrellaExplorer/UmbrellaExplorerPage';
import { api } from '../../trpc/server';

export const metadata: Metadata = {
  title: `Aave - Dashboard | Umbrella Explorer`,
  description:
    'Aave dashboard interface for exploring Aave markets reserves on a single page.',
  openGraph: {
    title: `Aave - Dashboard | Umbrella Explorer`,
    description:
      'Aave dashboard interface for exploring Aave markets reserves on a single page.',
  },
};

export const revalidate = 60;

export default async function Page() {
  const umbrellas = await api.umbrellas.getAll();
  return (
    <Suspense>
      <UmbrellaExplorerPage initialUmbrellas={umbrellas} />
    </Suspense>
  );
}
