import { ReservePage } from '../../../components/Dashboard/ReservePage';
import { PreLoading } from '../../../components/PreLoading';
import { api } from '../../../trpc/server';

type PageParams = {
  id: string;
};

type PageProps = {
  params: PageParams;
};

export const revalidate = 60;

export default async function Page({ params }: PageProps) {
  const reserve = await api.reserves.getReserveDataById({
    id: params.id,
  });
  if (!reserve) return <PreLoading />;
  return (
    <ReservePage
      reserve={reserve.reserve}
      initialReserves={reserve.reservesData}
      initialEmodes={'emodesData' in reserve ? reserve.emodesData : undefined}
    />
  );
}
