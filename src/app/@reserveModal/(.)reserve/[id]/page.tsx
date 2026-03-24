'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BasicModal } from '../../../../components/BasicModal';
import { ReserveHiddenContent } from '../../../../components/Dashboard/ReserveModal/ReserveHiddenContent';
import { ReservePage } from '../../../../components/Dashboard/ReservePage';
import { PreLoading } from '../../../../components/PreLoading';
import { useStore } from '../../../../providers/ZustandStoreProvider';

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const reserves = useStore((store) => store.initialReserves);
  const reserve = reserves.filter((reserve) => reserve.id === params.id);

  useEffect(() => {
    if (reserve.length) {
      if (pathname?.split('/').includes(reserve[0].id)) {
        setIsModalOpen(true);
      }
      if (!pathname?.split('/').includes(reserve[0].id)) {
        setIsModalOpen(false);
      }
    }
  }, [pathname, reserve.length]);

  if (!reserve.length) return <PreLoading />;

  const formattedReserve = reserve[0];

  return (
    <>
      <BasicModal
        maxWidth={1520}
        withCloseButton
        setIsOpen={() => {
          setIsModalOpen(false);
          router.back();
        }}
        isOpen={isModalOpen}>
        <ReservePage reserve={formattedReserve} />
      </BasicModal>
      {/*Need for correct pie gradient visible*/}
      {isModalOpen && <ReserveHiddenContent reserve={formattedReserve} />}
    </>
  );
}
