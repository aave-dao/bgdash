import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { Box, SxProps, useTheme } from '@mui/system';

import { CustomSkeleton } from './CustomSkeleton';

export interface TokenIconProps {
  symbol: string;
  aToken?: boolean;
  stkToken?: boolean;
  stkStataToken?: boolean;
  size?: number;
  sx?: SxProps;
}

function SingleTokenIcon({
  symbol,
  aToken,
  stkToken,
  stkStataToken,
  sx,
  size,
}: TokenIconProps) {
  const s = size || 22;
  const theme = useTheme();

  const getAssetTag = () => {
    if (aToken) return 'a';
    if (stkToken) return 'stk';
    if (stkStataToken) return 'stkStata';
    return undefined;
  };

  return (
    <Box
      sx={{
        width: s + 2,
        height: s + 2,
        lineHeight: 0,
        borderRadius: '50%',
        background: theme.palette.$light,
        border:
          stkToken || stkStataToken
            ? undefined
            : `1px solid ${theme.palette.$textSecondary}`,
        img: {
          background: 'white',
          borderRadius: '50%',
        },
        svg: {
          background: 'white',
          borderRadius: '50%',
        },
        ...sx,
      }}>
      <Web3Icon
        symbol={symbol}
        width="100%"
        height="100%"
        assetTag={getAssetTag()}
        loader={<CustomSkeleton width={s} height={s} circle />}
        fallbackProps={{
          style: {
            height: '100%',
            width: '100%',
            fontSize: '11px',
            fontWeight: 700,
          },
        }}
      />
    </Box>
  );
}

export default SingleTokenIcon;
