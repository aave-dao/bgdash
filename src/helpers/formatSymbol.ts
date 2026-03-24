import { formatSymbolForIcon } from '@bgd-labs/react-web3-icons/dist/utils';
export function formatSymbol(symbol: string) {
  const formatted = formatSymbolForIcon({ symbol });
  if (typeof formatted === 'string') {
    return formatted;
  } else {
    return formatted.iconSymbol;
  }
}
