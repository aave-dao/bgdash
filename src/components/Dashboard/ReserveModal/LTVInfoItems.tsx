import { Box } from '@mui/system';
import React from 'react';

import { PoolsWithVersions } from '../../../constants';
import { ColumnKeys, renderReserveField } from '../../../helpers/tableHelpers';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { InfoBoxItem, InfoBoxItemsWrapper } from './InfoBoxItems';
import { InfoBoxProps } from './InfoBoxWrapper';

export function LTVInfoItems({ reserve }: InfoBoxProps) {
  const emodes = useStore((store) => store.initialEmodes);

  const poolWithVersion =
    `${reserve.pool}_${reserve.version}` as PoolsWithVersions;

  const isCollateralInEmode = emodes.some(
    (emode) =>
      emode.chainId === reserve.chainId &&
      emode.poolWithVersion === poolWithVersion &&
      emode.collateralAssets.some((asset) => asset.id === reserve.id),
  );

  const getCollateralStatus = () => {
    if (reserve.usageAsCollateralEnabled) {
      return 'Can be collateral';
    }
    if (isCollateralInEmode) {
      return "Can't be collateral outside emodes";
    }
    return "Can't be collateral";
  };

  return (
    <InfoBoxItemsWrapper version={reserve.version} withoutMargin>
      <Box
        sx={{
          mt: 5,
          mb: 16,
          display: 'inline-flex',
          alignItems: 'center',
        }}>
        <InfoBoxItem value={getCollateralStatus()} isBig withoutMargin />
        <Box
          sx={{
            ml: 4,
            width: '6px',
            height: '6px',
            display: 'block',
            borderRadius: '50%',
            backgroundColor: reserve.usageAsCollateralEnabled
              ? '$mainGreen'
              : '$mainRed',
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', div: { '&:first-of-type': { mr: 4 } } }}>
        <InfoBoxItem withoutMargin value="Max LTV" isBig />{' '}
        <InfoBoxItem
          value={
            <>
              {renderReserveField(ColumnKeys.BASE_LTV_AS_COLLATERAL, reserve)}
              {+reserve.pendingLTV !== 0 && (
                <Box
                  component="span"
                  sx={{
                    color: '$textDisabled',
                    display: 'inline-block',
                    ml: 4,
                  }}>
                  ({renderReserveField(ColumnKeys.PENDING_LTV, reserve)})
                </Box>
              )}
            </>
          }
        />
      </Box>
      <Box sx={{ display: 'flex', div: { '&:first-of-type': { mr: 4 } } }}>
        <InfoBoxItem withoutMargin value="Liquidation threshold" isBig />{' '}
        <InfoBoxItem
          value={renderReserveField(
            ColumnKeys.RESERVE_LIQUIDATION_THRESHOLD,
            reserve,
          )}
        />
      </Box>
      <Box sx={{ display: 'flex', div: { '&:first-of-type': { mr: 4 } } }}>
        <InfoBoxItem withoutMargin value="Liquidation penalty" isBig />{' '}
        <InfoBoxItem
          withoutMargin
          value={renderReserveField(
            ColumnKeys.RESERVE_LIQUIDATION_BONUS,
            reserve,
          )}
        />
      </Box>
    </InfoBoxItemsWrapper>
  );
}
