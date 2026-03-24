import { Box } from '@mui/system';
import numeral from 'numeral';

import { CustomSkeleton } from '../../CustomSkeleton';
import { NumeralTooltip } from '../../NumeralTooltip';

interface NumeralColProps {
  value: number | string;
  isFirstUSD?: boolean;
  valueUSD?: number | string;
  loading?: boolean;
  withoutNegativeBlock?: boolean;
  decimals?: string;
  toolTipSuffix?: string;
  toolTipPrefix?: string;
}

export function NumeralCol({
  value,
  isFirstUSD,
  valueUSD,
  loading,
  withoutNegativeBlock = false,
  decimals = '00',
  toolTipSuffix,
  toolTipPrefix,
}: NumeralColProps) {
  const formatValue = (val: number | string, isUSD = false): string => {
    const numValue = Number(val);

    if (!withoutNegativeBlock && numValue < 0.01 && numValue !== 0) {
      return isUSD ? '< $0.01' : '< 0.01';
    }

    if (numeral(val).format('0.[00]a') === 'NaN') {
      return '0';
    }

    const format = isUSD ? `$0.[${decimals}]a` : `0.[${decimals}]a`;
    return numeral(val).format(format);
  };

  if (loading) {
    return <CustomSkeleton width={60} height={14} />;
  }

  return (
    <Box>
      <NumeralTooltip
        value={value}
        suffix={toolTipSuffix}
        prefix={toolTipPrefix}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}>
          <Box>{formatValue(value, isFirstUSD)}</Box>

          {(valueUSD || valueUSD === 0) && (
            <Box
              sx={{
                typography: 'descriptor',
                mt: 4,
                color: '$textSecondary',
              }}>
              {formatValue(valueUSD, true)}
            </Box>
          )}
        </Box>
      </NumeralTooltip>
    </Box>
  );
}
