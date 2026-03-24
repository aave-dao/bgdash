import { Box, SxProps, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import numeral from 'numeral';
import React from 'react';

import NoData from '../../../assets/images/icons/noData.svg';
import { getScanLink } from '../../../helpers/getScanLink';
import { ReserveEvent } from '../../../server/api/fallbacks/fetchEvents';
import { ReserveItem } from '../../../types';
import { BoxWith3D } from '../../BoxWith3D';
import { CustomSkeleton } from '../../CustomSkeleton';
import { Link } from '../../Link';
import { Loader } from '../../Loader';
import { Divider } from '../../primitives/Divider';
import { IconBox } from '../../primitives/IconBox';

interface EventsBoxProps {
  reserve: ReserveItem;
  title: string;
  loading?: boolean;
  events: ReserveEvent[];
  wrappedCss?: SxProps;
}

export function EventsBox({
  reserve,
  title,
  loading,
  events,
  wrappedCss,
}: EventsBoxProps) {
  const theme = useTheme();
  const isLoading = loading && !events.length;

  return (
    <BoxWith3D
      wrapperCss={{
        alignSelf: 'stretch',
        '> div, .BoxWith3D__content, .BoxWith3D__content--color': {
          height: '100%',
        },
        width: '100%',
        mb: 18,
        [theme.breakpoints.up('sm')]: {
          width: '49%',
          mb: 24,
        },
        '@media only screen and (min-width: 1230px)': {
          width: '24%',
        },
        ...wrappedCss,
      }}
      css={{ height: '100%', py: 12 }}
      contentColor="$mainLight">
      <Box sx={{ px: 18 }}>
        <Box sx={{ fontWeight: '700' }}>{title}</Box>
        <Divider sx={{ my: 12 }} />
      </Box>

      <Box sx={{ maxHeight: 130, overflowY: 'auto', px: 18 }}>
        {isLoading ? (
          <Box
            sx={{
              minHeight: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}>
            <Loader size={65} />
            <Box sx={{ mt: 18 }}>Loading ...</Box>
          </Box>
        ) : (
          <>
            {events.length ? (
              events
                .sort((a, b) => b.blockNumber - a.blockNumber)
                .map((event) => {
                  return (
                    <Link
                      key={event.transactionHash}
                      inNewWindow
                      href={`${getScanLink(reserve.chainId)}/tx/${event.transactionHash}`}
                      css={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                        p: '2px 6px',
                        mb: 5,
                        hover: {
                          backgroundColor: theme.palette.$light,
                          '.EventsBox__item--name': {
                            fontWeight: 700,
                            color: theme.palette.$textSecondary,
                          },
                          '.EventsBox__item--value': {
                            fontWeight: '700',
                          },
                        },
                      }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: '100%',
                          typography: 'body',
                          [theme.breakpoints.up('md')]: {
                            typography: 'descriptor',
                          },
                          [theme.breakpoints.up('lg')]: {
                            typography: 'body',
                          },
                        }}>
                        {event.timestamp ? (
                          <Box
                            className="EventsBox__item--name"
                            sx={{ transition: 'all 0.2s ease' }}>
                            {dayjs
                              .unix(event.timestamp)
                              .format('DD/MM | HH:mm')}
                          </Box>
                        ) : (
                          <Box>
                            <CustomSkeleton width={70} height={14} />
                          </Box>
                        )}
                        <Box
                          sx={{
                            transition: 'all 0.2s ease',
                            display: 'inline-flex',
                            textAlign: 'right',
                            alignItems: 'center',
                          }}>
                          <Box
                            className="EventsBox__item--value"
                            sx={{
                              typography: 'body',
                              mr: 4,
                              [theme.breakpoints.up('md')]: {
                                typography: 'descriptor',
                              },
                              [theme.breakpoints.up('lg')]: {
                                typography: 'body',
                              },
                            }}>
                            {(() => {
                              const numericAmount = +event.amount;
                              if (numericAmount > 10 ** 5) {
                                return numeral(event.amount).format('0.[00]a');
                              } else if (numericAmount > 10 ** 3) {
                                return numeral(event.amount).format('0.[00]');
                              } else if (numericAmount >= 0.001) {
                                return numeral(event.amount).format(
                                  '0.[000000]',
                                );
                              } else if (numericAmount > 0) {
                                const fixed = numericAmount.toFixed(18);
                                return fixed.replace(/\.?0+$/, '');
                              } else {
                                return '0';
                              }
                            })()}
                          </Box>{' '}
                          {reserve.symbol}
                        </Box>
                      </Box>
                    </Link>
                  );
                })
            ) : (
              <Box
                sx={{
                  minHeight: 130,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                <IconBox
                  sx={{
                    width: 45,
                    height: 45,
                    '> svg': {
                      width: 45,
                      height: 45,
                    },
                  }}>
                  <NoData />
                </IconBox>
                <Box sx={{ mt: 18 }}>No data</Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </BoxWith3D>
  );
}
