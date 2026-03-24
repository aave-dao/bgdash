import { ReservePool } from '../constants';

// TIP: NEW POOL NAME SHOULD ALSO PROCEED HERE
export function getPoolByName(name: string): ReservePool {
  const nameArray = name.split(' ').map((s) => s.toLowerCase());
  if (nameArray.includes('lido')) {
    return ReservePool.lido;
  } else if (nameArray.includes('etherfi')) {
    return ReservePool.etherfi;
  } else {
    return ReservePool.aave;
  }
}
