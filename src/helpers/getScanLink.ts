import { viemChains } from '../constants';

export function getScanLink(chainId: number) {
  const chain = viemChains[chainId];
  return chain?.blockExplorers?.default.url;
}
