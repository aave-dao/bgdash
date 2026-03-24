import { Box, useTheme } from '@mui/system';
import React from 'react';

import { ReserveVersion } from '../../../constants';
import { Divider } from '../../primitives/Divider';
import { NumeralCol } from '../Cols/NumeralCol';
import { InfoBoxItem, InfoBoxItemsWrapper } from './InfoBoxItems';
import { InfoBoxWrapper } from './InfoBoxWrapper';

export function InfoBorrowBoxLoading() {
  const theme = useTheme();

  return (
    <InfoBoxWrapper title="Borrow info">
      <>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <InfoBoxItemsWrapper version={ReserveVersion.v3}>
            <InfoBoxItem value="Total borrowed" />
            <InfoBoxItem isBig value={<NumeralCol value={0} loading />} />
          </InfoBoxItemsWrapper>
          <InfoBoxItemsWrapper version={ReserveVersion.v3}>
            <InfoBoxItem value="Variable" />
            <InfoBoxItem isBig value={<NumeralCol value={0} loading />} />
          </InfoBoxItemsWrapper>
          <InfoBoxItemsWrapper version={ReserveVersion.v3}>
            <InfoBoxItem value="Stable" />
            <InfoBoxItem isBig value={<NumeralCol value={0} loading />} />
          </InfoBoxItemsWrapper>
        </Box>

        <Box>
          <Box>
            <Divider sx={{ mb: 11 }} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Box>
                <Box sx={{ color: '$secondary', mb: 12 }}>
                  APY, variable <NumeralCol value={0} loading />
                </Box>
                <Box sx={{ color: '$secondary' }}>
                  APR, variable <NumeralCol value={0} loading />
                </Box>
              </Box>
              <Box sx={{ ml: 20, [theme.breakpoints.up('lg')]: { ml: 40 } }}>
                <Box sx={{ color: '$secondary', mb: 12 }}>
                  APY, stable <NumeralCol value={0} loading />
                </Box>
                <Box sx={{ color: '$secondary' }}>
                  APR, stable <NumeralCol value={0} loading />
                </Box>
              </Box>
            </Box>
            <Divider sx={{ mt: 10.5 }} />
          </Box>

          <Box
            sx={{
              marginTop: 14,
              marginBottom: 6,
              color: '$secondary',
            }}>
            {' '}
            Reserve factor: <NumeralCol value={0} loading />
          </Box>
        </Box>
      </>
    </InfoBoxWrapper>
  );
}
