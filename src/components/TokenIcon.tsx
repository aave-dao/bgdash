import { formatSymbolForIcon } from '@bgd-labs/react-web3-icons/dist/utils';
import { Box, SxProps } from '@mui/system';

import SingleTokenIcon, { TokenIconProps } from './SingleTokenIcon';

interface MultiTokenIconProps {
  symbols: string[];
  badgeSymbol?: string;
  aToken?: boolean;
  stkToken?: boolean;
  stkStataToken?: boolean;
  sx?: SxProps;
}

export function MultiTokenIcon({
  symbols,
  badgeSymbol,
  sx,
}: MultiTokenIconProps) {
  if (!badgeSymbol)
    return (
      <Box sx={{ display: 'inline-flex', position: 'relative' }}>
        {symbols.map((symbol, ix) => (
          <SingleTokenIcon
            key={symbol}
            symbol={symbol}
            sx={{ ml: ix === 0 ? 0 : `calc(-1 * 0.5em)`, ...sx }}
          />
        ))}
      </Box>
    );
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <SingleTokenIcon
        size={16}
        symbol={badgeSymbol}
        sx={{ ml: -8, mb: -8, position: 'relative', zIndex: 2 }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {symbols.map((symbol, ix) => (
          <SingleTokenIcon
            key={symbol}
            symbol={symbol}
            sx={{ ml: ix === 0 ? 0 : 'calc(-1 * 0.5em)', ...sx }}
          />
        ))}
      </Box>
    </Box>
  );
}

export function TokenIcon({ symbol, ...rest }: TokenIconProps) {
  const formatted = formatSymbolForIcon({
    symbol,
    marketPrefix: 'AMM',
  });

  const symbolChunks =
    typeof formatted === 'string'
      ? formatted.split('_')
      : formatted.iconSymbol.split('_');

  if (symbolChunks.length > 1) {
    const [badge, ...symbols] = symbolChunks;
    return <MultiTokenIcon {...rest} symbols={symbols} badgeSymbol={badge} />;
  }

  return <SingleTokenIcon symbol={symbol} {...rest} />;
}
