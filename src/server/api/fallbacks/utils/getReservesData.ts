import { IUiPoolDataProvider_ABI } from '@bgd-labs/aave-address-book/abis';
import { Address } from 'viem';
import { readContract } from 'viem/actions';

import { ReservePool, ReserveVersion } from '../../../../constants';
import { UIDataHelperABI } from '../abis';
import { serverViemPublicClient } from './chains';

export async function getReservesData({
  uiPoolAddress,
  poolAddressProviderAddress,
  chainId,
  version,
}: {
  uiPoolAddress: Address;
  poolAddressProviderAddress: Address;
  chainId: number;
  version: ReserveVersion;
  pool: ReservePool;
}) {
  const [reservesRaw, poolBaseCurrencyRaw] = await readContract(
    serverViemPublicClient[chainId],
    {
      abi:
        version === ReserveVersion.v3
          ? UIDataHelperABI
          : IUiPoolDataProvider_ABI,
      address: uiPoolAddress,
      functionName: 'getReservesData',
      args: [poolAddressProviderAddress],
    },
  );

  const baseCurrencyData = {
    // this is to get the decimals from the unit so 1e18 = string length of 19 - 1 to get the number of 0
    marketReferenceCurrencyDecimals:
      poolBaseCurrencyRaw.marketReferenceCurrencyUnit.toString().length - 1,
    marketReferenceCurrencyPriceInUsd:
      poolBaseCurrencyRaw.marketReferenceCurrencyPriceInUsd,
    networkBaseTokenPriceInUsd: poolBaseCurrencyRaw.networkBaseTokenPriceInUsd,
    networkBaseTokenPriceDecimals:
      poolBaseCurrencyRaw.networkBaseTokenPriceDecimals,
  };

  return {
    reservesData: reservesRaw,
    baseCurrencyData,
  };
}
