import { Box, useTheme } from '@mui/system';
import { ParentSize } from '@visx/responsive';
import React from 'react';

import { getScanLink } from '../../../helpers/getScanLink';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { ReserveItem } from '../../../types';
import { CustomSkeleton } from '../../CustomSkeleton';
import { Link } from '../../Link';
import { LinkIcon } from '../../LinkIcon';
import { GraphLegend } from './GraphLegend';
import { InterestRateModelGraph } from './InterestRateModelGraph';

type InterestRateModelGraphContainerProps = {
  reserve: ReserveItem;
};

export type Field = 'variableBorrowRate' | 'supplyRate' | 'utilizationRate';

export type Fields = { name: Field; color: string; text: string }[];

// This graph takes in its data via props, thus having no loading/error states
export function InterestRateModelGraphContainer({
  reserve,
}: InterestRateModelGraphContainerProps) {
  const theme = useTheme();

  const isRendered = useStore((store) => store.isRendered);

  const CHART_HEIGHT = 210;
  const fields: Fields = [
    {
      name: 'variableBorrowRate',
      text: 'Borrow APR',
      color: theme.palette.$mainGreen,
    },
    {
      name: 'supplyRate',
      text: 'Supply APR',
      color: theme.palette.$mainBlue,
    },
  ];

  return (
    <Box sx={{ mt: 8, mb: 10, width: '100%' }} id="chartContainer">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
        }}>
        <GraphLegend labels={fields} />

        <Box
          className="InterestRateModelGraphContainer__link"
          sx={{
            color: '$textSecondary',
            display: 'inline-flex',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          Interest rate strategy{' '}
          <Link
            inNewWindow
            css={{
              ml: 5,
              lineHeight: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              '.LinkIcon': { marginLeft: 0, lineHeight: 0 },
            }}
            href={`${getScanLink(reserve.chainId)}/address/${reserve.interestRateStrategyAddress}`}>
            <LinkIcon color={theme.palette.$textSecondary} size={14} />
          </Link>
        </Box>
      </Box>

      {isRendered ? (
        <Box>
          <ParentSize>
            {({ width }) => (
              <InterestRateModelGraph
                width={width}
                height={CHART_HEIGHT}
                fields={fields}
                reserve={reserve}
              />
            )}
          </ParentSize>
        </Box>
      ) : (
        <CustomSkeleton width="100%" height="210px" />
      )}
    </Box>
  );
}
