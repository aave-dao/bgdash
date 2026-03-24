import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
import { Box, useTheme } from '@mui/system';
import React, { memo } from 'react';

import { ReservePool, ReserveVersion } from '../../../constants';
import { getScanLink } from '../../../helpers/getScanLink';
import { Link } from '../../Link';
import { LinkIcon } from '../../LinkIcon';
import { TokenIcon } from '../../TokenIcon';

interface SymbolColProps {
  initSymbol: string;
  initName: string;
  version: ReserveVersion;
  pool: ReservePool;
  chainId: number;
  link?: string;
  aTokenAddress?: string;
  variableDebtTokenAddress?: string;
}

export const SymbolCol = memo(
  ({
    initSymbol,
    version,
    pool,
    chainId,
    link,
    aTokenAddress,
    variableDebtTokenAddress,
  }: SymbolColProps) => {
    const theme = useTheme();

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TokenIcon symbol={initSymbol} size={link ? 56 : 24} />
        <Box sx={{ ml: 8 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <Box
              component="p"
              sx={{
                typography: link ? 'headline' : 'main',
                fontWeight: '700',
              }}>
              {initSymbol}
            </Box>{' '}
            {!!link && (
              <Link
                href={link}
                inNewWindow
                css={{
                  ml: 5,
                  lineHeight: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '.LinkIcon': { marginLeft: 0, lineHeight: 0 },
                }}>
                <LinkIcon color={theme.palette.$textSecondary} size={14} />
              </Link>
            )}
          </Box>
          <Box
            className="SymbolCol__pool--info"
            sx={{
              typography: 'descriptor',
              color: '$textSecondary',
              whiteSpace: 'nowrap',
            }}>
            {getChainName(chainId)} /{' '}
            {pool !== ReservePool.aave ? `${pool.toUpperCase()} / ` : ''}
            {version}
          </Box>

          {!!aTokenAddress && !!variableDebtTokenAddress && (
            <Box sx={{ display: 'flex', mt: 6 }}>
              <Link
                href={`${getScanLink(chainId)}/address/${aTokenAddress}`}
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
                <Box sx={{ mr: 2 }}>aToken</Box>{' '}
                <LinkIcon color={theme.palette.$textSecondary} size={10} />
              </Link>
              <Link
                href={`${getScanLink(chainId)}/address/${variableDebtTokenAddress}`}
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
                <Box sx={{ mr: 2 }}>vToken</Box>{' '}
                <LinkIcon color={theme.palette.$textSecondary} size={10} />
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    );
  },
);
