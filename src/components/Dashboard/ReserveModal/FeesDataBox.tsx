import { Box, useTheme } from '@mui/system';
import React from 'react';

import { getPoolAddresses, ReserveVersion } from '../../../constants';
import { getScanLink } from '../../../helpers/getScanLink';
import { ColumnKeys, renderReserveField } from '../../../helpers/tableHelpers';
import { Link } from '../../Link';
import { LinkIcon } from '../../LinkIcon';
import { InfoBoxItem } from './InfoBoxItems';
import { InfoBoxProps, InfoBoxWrapperBig } from './InfoBoxWrapper';

export function FeesDataBox({ reserve }: InfoBoxProps) {
  const theme = useTheme();

  const COLLECTOR = getPoolAddresses(reserve)?.COLLECTOR;

  return (
    <InfoBoxWrapperBig>
      <>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20,
            [theme.breakpoints.up('lg')]: {
              gap: 40,
            },
          }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
            <Box component="strong" sx={{ typography: 'headline' }}>
              Fees data
            </Box>
            {COLLECTOR && (
              <Box>
                <Link
                  href={`${getScanLink(reserve.chainId)}/address/${COLLECTOR}`}
                  inNewWindow
                  css={{
                    typography: 'descriptor',
                    lineHeight: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    mr: 4,
                    hover: {
                      opacity: 0.7,
                    },
                    '.LinkIcon': { marginLeft: 0, lineHeight: 0 },
                  }}>
                  <Box sx={{ mr: 2 }}>Collector Contract</Box>{' '}
                  <LinkIcon color={theme.palette.$textSecondary} size={10} />
                </Link>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              [theme.breakpoints.up('sm')]: {
                gap: 20,
              },
            }}>
            <InfoBoxItem
              withoutMargin
              value={
                <Box>
                  <Box
                    component="strong"
                    sx={{
                      fontWeight: 700,
                      display: 'inline',
                      color: '$textSecondary',
                    }}>
                    Liquidation protocol fee
                  </Box>{' '}
                  <Box
                    component="p"
                    sx={{
                      display: 'inline',
                    }}>
                    {renderReserveField(
                      ColumnKeys.Liquidation_Protocol_Fee,
                      reserve,
                    )}
                  </Box>
                </Box>
              }
            />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 4 }}>
                <InfoBoxItem value="Reserve factor" isBig withoutMargin />
              </Box>
              <InfoBoxItem
                value={renderReserveField(ColumnKeys.RESERVE_FACTOR, reserve)}
                withoutMargin
              />
            </Box>

            {reserve.version === ReserveVersion.v3 && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 4 }}>
                  <InfoBoxItem
                    value="Fees (accruedToTreasury)"
                    isBig
                    withoutMargin
                  />
                </Box>
                <InfoBoxItem
                  value={renderReserveField(
                    ColumnKeys.ACCRUED_TO_TREASURY,
                    reserve,
                  )}
                  withoutMargin
                />
              </Box>
            )}
          </Box>
        </Box>
      </>
    </InfoBoxWrapperBig>
  );
}
