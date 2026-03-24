import { Box, useTheme } from '@mui/system';
import React from 'react';

import { ColumnKeys, renderReserveField } from '../../../helpers/tableHelpers';
import { InfoIcon } from '../../InfoIcon';
import { Tooltip } from '../../Tooltip';
import { NumeralCol } from '../Cols/NumeralCol';
import { InfoBoxItem } from './InfoBoxItems';
import { InfoBoxProps, InfoBoxWrapperBig } from './InfoBoxWrapper';
import { ReserveStatus } from './ReserveStatus';

export function VirtualAccDataBox({ reserve }: InfoBoxProps) {
  const theme = useTheme();
  const virtualAccActive = reserve.virtualAccActive;

  if (!virtualAccActive) return null;

  return (
    <InfoBoxWrapperBig wrappedCss={{ position: 'relative', zIndex: 5 }}>
      <>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexWrap: 'wrap',
            gap: 20,
            py: 10,
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
              }}>
              <Box sx={{ typography: 'headline' }}>
                Virtual accounting & Deficit
              </Box>
              <ReserveStatus color="$mainGreen" title="Active" />
            </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 4 }}>
                <InfoBoxItem
                  value="Virtual underlying balance"
                  isBig
                  withoutMargin
                />
              </Box>
              <InfoBoxItem
                value={renderReserveField(
                  ColumnKeys.VIRTUAL_UNDERLYING_BALANCE,
                  reserve,
                )}
                withoutMargin
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center' }}>
                <InfoBoxItem
                  value="Virtual accounting delta"
                  isBig
                  withoutMargin
                />
                <Box
                  className="InfoBox__icon"
                  sx={{ mx: 4, position: 'relative' }}>
                  <Tooltip
                    tooltipContent={
                      <Box>
                        <Box sx={{ lineHeight: 1.2, fontSize: 12, mb: 12 }}>
                          Difference between all the available withdrawal
                          liquidity if all debt would be closed and all
                          suppliers withdrawal rights. A zero or positive number
                          means the system is perfectly healthy
                        </Box>

                        <Box sx={{ fontWeight: 600, mb: 12, mt: 4 }}>
                          Formula:
                        </Box>
                        <Box
                          sx={{
                            fontStyle: 'italic',
                            lineHeight: 1.2,
                            fontSize: 12,
                          }}>
                          (totalDebt + virtualBalance) - (aTokenSupply +
                          accruedToTreasury)
                        </Box>
                      </Box>
                    }
                    position="top">
                    <InfoIcon />
                  </Tooltip>
                </Box>
              </Box>
              <InfoBoxItem
                value={renderReserveField(ColumnKeys.VO_DELTA, reserve)}
                withoutMargin
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center' }}>
                <InfoBoxItem
                  value="Virtual accounting delta (%)"
                  isBig
                  withoutMargin
                />
                <Box
                  className="InfoBox__icon"
                  sx={{ mx: 4, position: 'relative' }}>
                  <Tooltip
                    tooltipContent={
                      <Box>
                        <Box sx={{ fontWeight: 600, mb: 12, mt: 4 }}>
                          Formula:
                        </Box>
                        <Box
                          sx={{
                            fontStyle: 'italic',
                            lineHeight: 1.2,
                            fontSize: 12,
                          }}>
                          {`virtualAccountingDelta / virtualUnderlyingBalance * 100`}
                        </Box>
                      </Box>
                    }
                    position="top">
                    <InfoIcon />
                  </Tooltip>
                </Box>
              </Box>
              <InfoBoxItem
                value={renderReserveField(ColumnKeys.VO_DELTA_PERCENT, reserve)}
                withoutMargin
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: { xs: 0, sm: 0, md: 0, lg: 0 },
                width: '100%',
              }}>
              <Box sx={{ mr: 4 }}>
                <InfoBoxItem value="Deficit" isBig withoutMargin />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  '.InfoBoxItem': {
                    '&:first-of-type': { marginRight: '4px' },
                  },
                }}>
                <InfoBoxItem
                  withoutMargin
                  value={
                    <NumeralCol
                      value={Math.max(Number(reserve.deficitUSD), 0)}
                      isFirstUSD
                    />
                  }
                />
                <InfoBoxItem secondary withoutMargin value="(" />
                <InfoBoxItem
                  secondary
                  withoutMargin
                  value={
                    <NumeralCol value={Math.max(Number(reserve.deficit), 0)} />
                  }
                />
                <InfoBoxItem secondary withoutMargin value=")" />
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    </InfoBoxWrapperBig>
  );
}
