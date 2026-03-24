import { Box, useTheme } from '@mui/system';
import React from 'react';

import { ReserveVersion } from '../../../constants';
import { Divider } from '../../primitives/Divider';
import { NumeralCol } from '../Cols/NumeralCol';
import { InfoBoxItem, InfoBoxItemsWrapper } from './InfoBoxItems';
import { InfoBoxWrapper } from './InfoBoxWrapper';

function LTVInfoItemsLoading() {
  return (
    <InfoBoxItemsWrapper version={ReserveVersion.v3}>
      <InfoBoxItem
        value={
          <Box>
            Max LTV: <NumeralCol value={0} loading />
          </Box>
        }
      />
      <InfoBoxItem
        value={
          <Box sx={{ typography: 'body', color: '$textSecondary' }}>
            Liquidation threshold: <NumeralCol value={0} loading />
          </Box>
        }
      />
      <InfoBoxItem
        value={
          <Box>
            Liquidation penalty: <NumeralCol value={0} loading />
          </Box>
        }
      />
    </InfoBoxItemsWrapper>
  );
}

export function InfoSupplyBoxLoading() {
  const theme = useTheme();

  return (
    <InfoBoxWrapper title="Supply info">
      <>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <InfoBoxItemsWrapper version={ReserveVersion.v3}>
            <InfoBoxItem value="Total supplied" />
            <InfoBoxItem value={<NumeralCol value={0} loading />} />
          </InfoBoxItemsWrapper>

          <InfoBoxItemsWrapper version={ReserveVersion.v3}>
            <InfoBoxItem value="APY" />
            <InfoBoxItem value={<NumeralCol value={0} loading />} />
          </InfoBoxItemsWrapper>

          <Box
            sx={{
              display: 'none',
              [theme.breakpoints.up('sm')]: { display: 'block' },
            }}>
            <LTVInfoItemsLoading />
          </Box>
        </Box>

        <Box
          sx={{
            [theme.breakpoints.up('sm')]: { display: 'none' },
          }}>
          <Divider sx={{ mb: 12 }} />
          <LTVInfoItemsLoading />
          <Divider sx={{ mb: 12 }} />
        </Box>

        <Box
          sx={{
            mt: 12,
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
          <Box sx={{ color: '$textSecondary' }}>
            Collateral Usage: <NumeralCol value={0} loading />
          </Box>
        </Box>
      </>
    </InfoBoxWrapper>
  );
}
