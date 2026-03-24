import tokenlist from '@bgd-labs/aave-address-book/tokenlist';
import { Box, useTheme } from '@mui/system';
import React from 'react';

import { ReserveVersion } from '../../../constants';
import { getScanLink } from '../../../helpers/getScanLink';
import {
  calculateUtilization,
  ColumnKeys,
  renderReserveField,
} from '../../../helpers/tableHelpers';
import { Link } from '../../Link';
import { LinkIcon } from '../../LinkIcon';
import { CapsCircularStatus } from '../Charts/CapsCircular';
import { InfoBoxItem, InfoBoxItemsWrapper } from './InfoBoxItems';
import { InfoBoxProps, InfoBoxWrapper } from './InfoBoxWrapper';
import { LTVInfoItems } from './LTVInfoItems';
import { ProgressBar } from './Progressbar';

export function SupplyInfoBox({ reserve }: InfoBoxProps) {
  const theme = useTheme();

  const stataToken = tokenlist.tokens
    .filter((t) => t.tags.includes('staticAT'))
    .filter(
      (token) =>
        token.extensions?.underlying.toLowerCase() ===
        reserve.underlyingAsset.toLowerCase(),
    )[0];

  return (
    <InfoBoxWrapper
      wrappedCss={{ zIndex: 4, [theme.breakpoints.up('md')]: { width: '54%' } }}
      chart={
        reserve.version === ReserveVersion.v3 ? (
          <CapsCircularStatus
            value={calculateUtilization(
              +reserve.totalLiquidity,
              +reserve.supplyCap,
            )}
          />
        ) : undefined
      }
      additionalContent={
        <Box
          sx={{
            mt: 12,
            display: 'block',
            [theme.breakpoints.up('sm')]: { display: 'none' },
          }}>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}>
            {Number(reserve.debtCeiling) !== 0 && (
              <ProgressBar
                total={+reserve.debtCeilingUSD}
                current={+reserve.isolationModeTotalDebtUSD}
              />
            )}
          </Box>
        </Box>
      }>
      <>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <InfoBoxItemsWrapper version={reserve.version}>
            <Box sx={{ mb: 16, typography: 'headline' }}>Supply data</Box>
            <Box sx={{ mb: 16 }}>
              <InfoBoxItem value="Total supplied" isBig />
              <InfoBoxItem
                value={`${renderReserveField(
                  ColumnKeys.TOTAL_SUPPLY,
                  reserve,
                )}${reserve.version === ReserveVersion.v3 ? ' / ' + renderReserveField(ColumnKeys.SUPPLY_CAP_MODAL, reserve) : ''}`}
              />
              <InfoBoxItem
                withoutMargin
                secondary
                value={
                  <Box
                    sx={{
                      mt: -4,
                    }}>{`$${renderReserveField(
                    ColumnKeys.TOTAL_SUPPLY_USD,
                    reserve,
                  )}${reserve.version === ReserveVersion.v3 ? ' / $' + renderReserveField(ColumnKeys.SUPPLY_CAP_USD, reserve) : ''}`}</Box>
                }
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 4 }}>
                <InfoBoxItem value="APY" isBig />
              </Box>
              <InfoBoxItem
                value={renderReserveField(ColumnKeys.SUPPLY_APY, reserve)}
              />
            </Box>

            {!!stataToken && (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 4 }}>
                    <InfoBoxItem value="APR" isBig withoutMargin />
                  </Box>
                  <InfoBoxItem
                    value={renderReserveField(ColumnKeys.SUPPLY_APY, reserve)}
                    withoutMargin
                  />
                </Box>
                <Box>
                  <Link
                    href={`${getScanLink(reserve.chainId)}/address/${stataToken.address}`}
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
                    <Box sx={{ mr: 2 }}>stataToken</Box>{' '}
                    <LinkIcon color={theme.palette.$textSecondary} size={10} />
                  </Link>
                </Box>
              </Box>
            )}
          </InfoBoxItemsWrapper>

          <Box
            sx={{
              display: 'none',
              [theme.breakpoints.up('sm')]: { display: 'block', flex: 1 },
            }}>
            <LTVInfoItems reserve={reserve} />
          </Box>
        </Box>

        <Box
          sx={{
            [theme.breakpoints.up('sm')]: { display: 'none' },
          }}>
          <LTVInfoItems reserve={reserve} />
        </Box>

        <Box
          sx={{
            mt: 12,
            display: 'none',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            [theme.breakpoints.up('sm')]: {
              display: 'flex',
            },
          }}>
          {Number(reserve.debtCeiling) !== 0 && (
            <ProgressBar
              total={+reserve.debtCeilingUSD}
              current={+reserve.isolationModeTotalDebtUSD}
            />
          )}
        </Box>
      </>
    </InfoBoxWrapper>
  );
}
