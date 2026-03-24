import { Box, useTheme } from '@mui/system';
import React from 'react';

import { ReserveVersion } from '../../../constants';
import {
  calculateUtilization,
  ColumnKeys,
  renderReserveField,
} from '../../../helpers/tableHelpers';
import { CapsCircularStatus } from '../Charts/CapsCircular';
import { InfoBoxItem, InfoBoxItemsWrapper } from './InfoBoxItems';
import { InfoBoxProps, InfoBoxWrapper } from './InfoBoxWrapper';

export function BorrowInfoBox({ reserve }: InfoBoxProps) {
  const theme = useTheme();

  return (
    <InfoBoxWrapper
      wrappedCss={{ [theme.breakpoints.up('md')]: { width: '44%' } }}
      chart={
        reserve.version === ReserveVersion.v3 ? (
          <CapsCircularStatus
            value={calculateUtilization(+reserve.totalDebt, +reserve.borrowCap)}
          />
        ) : undefined
      }
      title="Borrow data">
      <>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            [theme.breakpoints.up('xsm')]: { flexDirection: 'row' },
          }}>
          <InfoBoxItemsWrapper version={reserve.version}>
            <InfoBoxItem value="Total borrowed" isBig />
            <InfoBoxItem
              value={`${renderReserveField(
                ColumnKeys.TOTAL_DEBT_MODAL,
                reserve,
              )}${reserve.version === ReserveVersion.v3 ? ' / ' + renderReserveField(ColumnKeys.BORROW_CAP_MODAL, reserve) : ''}`}
            />
            <InfoBoxItem
              secondary
              value={
                <Box
                  sx={{
                    mt: -4,
                  }}>{`$${renderReserveField(
                  ColumnKeys.TOTAL_DEBT_USD,
                  reserve,
                )}${reserve.version === ReserveVersion.v3 ? ' / $' + renderReserveField(ColumnKeys.BORROW_CAP_USD, reserve) : ''}`}</Box>
              }
            />
          </InfoBoxItemsWrapper>

          <Box>
            <Box
              sx={{
                mb: 12,
                display: 'flex',
                div: { '&:first-of-type': { mr: 4 } },
              }}>
              <InfoBoxItem withoutMargin value="APY, variable" isBig />{' '}
              <InfoBoxItem
                withoutMargin
                value={renderReserveField(
                  ColumnKeys.VARIABLE_BORROW_APY,
                  reserve,
                )}
              />
            </Box>
            <Box
              sx={{ display: 'flex', div: { '&:first-of-type': { mr: 4 } } }}>
              <InfoBoxItem withoutMargin value="APR, variable" isBig />{' '}
              <InfoBoxItem
                withoutMargin
                value={renderReserveField(
                  ColumnKeys.VARIABLE_BORROW_APR,
                  reserve,
                )}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Box sx={{ mb: 16 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                [theme.breakpoints.up('xsm')]: {
                  flexDirection: 'row',
                },
              }}>
              <Box
                sx={{
                  marginRight: 15,
                  [theme.breakpoints.up('md')]: {
                    marginRight:
                      reserve.version === ReserveVersion.v3 ? 20 : 30,
                  },
                  [theme.breakpoints.up('lg')]: {
                    marginRight:
                      reserve.version === ReserveVersion.v3 ? 40 : 100,
                  },
                }}>
                {reserve.version === ReserveVersion.v3 &&
                  +reserve.liquidationGracePeriodUntil !== 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        div: { '&:first-of-type': { mr: 4 } },
                      }}>
                      <InfoBoxItem
                        withoutMargin
                        value="Liquidation grace period until"
                        isBig
                      />{' '}
                      <InfoBoxItem
                        withoutMargin
                        value={renderReserveField(
                          ColumnKeys.LIQUIDATION_GRACE_PERIOD_UTIL,
                          reserve,
                        )}
                      />
                    </Box>
                  )}
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    </InfoBoxWrapper>
  );
}
