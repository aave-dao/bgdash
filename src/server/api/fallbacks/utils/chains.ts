import { Client, createClient, http } from 'viem';

import { viemChains } from '../../../../constants';
import { env } from '../../../../env';

const alchemySubdomains: Record<number, string> = {
  1: 'eth-mainnet',
  10: 'opt-mainnet',
  56: 'bnb-mainnet',
  100: 'gnosis-mainnet',
  137: 'polygon-mainnet',
  146: 'sonic-mainnet',
  324: 'zksync-mainnet',
  1088: 'metis-mainnet',
  1868: 'soneium-mainnet',
  5000: 'mantle-mainnet',
  8453: 'base-mainnet',
  42161: 'arb-mainnet',
  42220: 'celo-mainnet',
  43114: 'avax-mainnet',
  57073: 'ink-mainnet',
  59144: 'linea-mainnet',
  534352: 'scroll-mainnet',
};

function getRPCUrl(chainId: number): string | undefined {
  const chain = viemChains[chainId];
  if (!chain) return undefined;

  // Check for explicit RPC_* env var override
  const envKey = `RPC_${chain.name.toUpperCase().replace(/\s+/g, '_')}`;
  const explicit = process.env[envKey];
  if (explicit) return explicit;

  // Try Alchemy
  const subdomain = alchemySubdomains[chainId];
  if (subdomain && env.ALCHEMY_API_KEY) {
    return `https://${subdomain}.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`;
  }

  // Fall back to chain's default public RPC
  return chain.rpcUrls.default.http[0];
}

const clients = Object.entries(viemChains).map(([chainId, chain]) => {
  return createClient({
    batch: {
      multicall: true,
    },
    chain,
    transport: http(getRPCUrl(Number(chainId))),
  });
});

export const serverViemPublicClient: Record<number, Client> = {};
clients.forEach((client) => (serverViemPublicClient[client.chain.id] = client));
