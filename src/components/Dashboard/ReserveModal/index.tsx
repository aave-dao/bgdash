'use client';

import { Box, useTheme } from '@mui/system';
import numeral from 'numeral';
import React, { useEffect, useMemo, useState } from 'react';

import { PoolsWithVersions } from '../../../constants';
import { getScanLink } from '../../../helpers/getScanLink';
import { ColumnKeys, renderReserveField } from '../../../helpers/tableHelpers';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { selectReserveEvents } from '../../../store/selectors/reservesSelectors';
import { Emode, ReserveItem } from '../../../types';
import { Accordion } from '../../Accordion';
import { NumeralCol } from '../Cols/NumeralCol';
import { SymbolCol } from '../Cols/SymbolCol';
import { BorrowInfoBox } from './BorrowInfoBox';
import { BoxWrapper } from './BoxWrapper';
import { EmodesDataBox } from './EmodesDataBox';
import { EventsModule } from './EventsModule';
import { FeesDataBox } from './FeesDataBox';
import { InfoBoxItem } from './InfoBoxItems';
import { InterestRateBox } from './InterestRateBox';
import { ReserveHeaderInfoItem } from './ReserveHeaderInfoItem';
import { ReserveStatus } from './ReserveStatus';
import { SupplyInfoBox } from './SupplyInfoBox';
import { VirtualAccDataBox } from './VirtualAccDataBox';

export function ReserveModalContent({
  reserve,
  initialEmodes,
}: {
  reserve: ReserveItem;
  initialEmodes?: Emode[];
}) {
  const theme = useTheme();

  const getEvents = useStore((store) => store.getEvents);
  const updateEventsTimestamp = useStore(
    (store) => store.updateEventsTimestamp,
  );
  const reserveEvents = useStore((store) =>
    selectReserveEvents(store, reserve),
  );

  const [isEventsOpen, setIsEventsOpen] = useState(false);

  useEffect(() => {
    if (isEventsOpen && reserveEvents && !reserveEvents.loading) {
      updateEventsTimestamp({ reserve, events: reserveEvents.events });
    }
  }, [isEventsOpen, reserveEvents?.loading]);

  const handleAccordionClick = async () => {
    await getEvents(reserve);
  };

  const reserveHeaderInfo = [
    {
      title: 'Total supplied',
      value: (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            '.InfoBoxItem': { '&:first-of-type': { marginRight: '4px' } },
          }}>
          <InfoBoxItem
            withoutMargin
            value={<NumeralCol value={reserve.totalLiquidityUSD} isFirstUSD />}
          />
          <InfoBoxItem secondary withoutMargin value="(" />
          <InfoBoxItem
            secondary
            withoutMargin
            value={<NumeralCol value={reserve.totalLiquidity} />}
          />
          <InfoBoxItem secondary withoutMargin value=")" />
        </Box>
      ),
    },
    {
      title: 'Total borrowed',
      value: (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            '.InfoBoxItem': { '&:first-of-type': { marginRight: '4px' } },
          }}>
          <InfoBoxItem
            withoutMargin
            value={
              <NumeralCol
                value={Math.max(Number(reserve.totalDebtUSD), 0)}
                isFirstUSD
              />
            }
          />
          <InfoBoxItem secondary withoutMargin value="(" />
          <InfoBoxItem
            secondary
            withoutMargin
            value={
              <NumeralCol value={Math.max(Number(reserve.totalDebt), 0)} />
            }
          />
          <InfoBoxItem secondary withoutMargin value=")" />
        </Box>
      ),
    },
    {
      title: 'Available Liquidity',
      value: (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            '.InfoBoxItem': { '&:first-of-type': { marginRight: '4px' } },
          }}>
          <InfoBoxItem
            withoutMargin
            value={
              <NumeralCol
                value={Math.max(Number(reserve.availableLiquidityUSD), 0)}
                isFirstUSD
              />
            }
          />
          <InfoBoxItem secondary withoutMargin value="(" />
          <InfoBoxItem
            secondary
            withoutMargin
            value={
              <NumeralCol
                value={Math.max(Number(reserve.availableLiquidity), 0)}
              />
            }
          />
          <InfoBoxItem secondary withoutMargin value=")" />
        </Box>
      ),
    },
    {
      title: 'Utilization Rate',
      value: (
        <InfoBoxItem
          withoutMargin
          value={renderReserveField(ColumnKeys.SUPPLY_USAGE_RATIO, reserve)}
        />
      ),
    },
    {
      title: 'Price',
      value: (
        <InfoBoxItem
          withoutMargin
          value={numeral(reserve.priceInUSD).format('$0.[00]')}
        />
      ),
    },
    {
      title: 'ID',
      value: (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            '.InfoBoxItem': { '&:first-of-type': { marginRight: '4px' } },
          }}>
          <InfoBoxItem withoutMargin value={<div>{reserve.reserveId}</div>} />
        </Box>
      ),
    },
  ];

  const TopInfo = useMemo(() => {
    return (
      <BoxWrapper>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Box sx={{ [theme.breakpoints.up('sm')]: { mr: 24 } }}>
              <SymbolCol
                initSymbol={reserve.symbol}
                initName={reserve.name}
                version={reserve.version}
                chainId={reserve.chainId}
                link={`${getScanLink(reserve.chainId)}/address/${
                  reserve.underlyingAsset
                }`}
                aTokenAddress={reserve.aTokenAddress}
                variableDebtTokenAddress={reserve.variableDebtTokenAddress}
                pool={reserve.pool}
              />
            </Box>

            <Box
              sx={{
                display: 'none',
                [theme.breakpoints.up('md')]: {
                  display: 'flex',
                  gap: 4,
                  flexWrap: 'wrap',
                },
              }}>
              {reserveHeaderInfo.map((info, index) => (
                <ReserveHeaderInfoItem
                  key={index}
                  info={info}
                  link={`${getScanLink(reserve.chainId)}/address/${reserve.priceOracle}`}
                />
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}>
            {reserve.isFrozen && (
              <ReserveStatus color="$mainRed" title="Frozen" />
            )}
            {reserve.isPaused && (
              <ReserveStatus color="$disabled" title="Paused" />
            )}
            {reserve.isActive && (
              <ReserveStatus color="$mainGreen" title="Active" />
            )}
            {!reserve.isActive && (
              <ReserveStatus color="$secondary" title="Not Active" />
            )}
          </Box>
        </Box>
      </BoxWrapper>
    );
  }, [reserve.id]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
      }}>
      <Box sx={{ pt: 12 }}>
        {TopInfo}

        <Box sx={{ [theme.breakpoints.up('md')]: { display: 'none' } }}>
          <BoxWrapper
            css={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              p: '4px 18px 12px !important',
            }}>
            {reserveHeaderInfo.map((info, index) => (
              <ReserveHeaderInfoItem
                key={index}
                info={info}
                link={`${getScanLink(reserve.chainId)}/address/${reserve.priceOracle}`}
              />
            ))}
          </BoxWrapper>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.up('md')]: {
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          }}>
          <SupplyInfoBox reserve={reserve} />
          <BorrowInfoBox reserve={reserve} />
        </Box>

        <EmodesDataBox
          id={reserve.id}
          chainId={reserve.chainId}
          poolWithVersion={
            `${reserve.pool}_${reserve.version}` as PoolsWithVersions
          }
          initialEmodes={initialEmodes}
        />
        <FeesDataBox reserve={reserve} />
        <VirtualAccDataBox reserve={reserve} />

        <InterestRateBox reserve={reserve} />

        <Box sx={{ width: '100%', mt: 24 }}>
          <Accordion
            onClick={handleAccordionClick}
            isOpen={isEventsOpen}
            setIsOpen={setIsEventsOpen}
            label="Show last events"
            openLabel="Events for last 24 hours">
            <EventsModule reserve={reserve} reserveEvents={reserveEvents} />
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
}
