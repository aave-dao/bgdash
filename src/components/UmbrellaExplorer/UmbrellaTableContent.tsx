import { Box } from '@mui/system';
import React from 'react';

import { UmbrellaColumnKeys } from '../../helpers/umbrellaTableHelpers';
import { useStore } from '../../providers/ZustandStoreProvider';
import { UmbrellaItem, UmbrellaMarket } from '../../types';
// import { BoxWith3D } from '../BoxWith3D';
import { NoData } from '../NoData';
import { TableContentLoading } from '../Table';
import { UmbrellaTableItem } from './UmbrellaTableItem';

interface UmbrellaTableContentProps {
  selectedColumns: Array<{ key: UmbrellaColumnKeys; label: string }>;
}

// function MarketTitleRow({ marketName }: { marketName: string }) {
//   return (
//     <Box>
//       <BoxWith3D
//         borderSize={10}
//         bottomBorderColor="$headerGray"
//         css={{
//           color: '$text',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'flex-start',
//           p: '10px 15px',
//           backgroundColor: '$mainLight',
//         }}>
//         <Box
//           sx={{
//             fontSize: '16px',
//             fontWeight: 700,
//             textAlign: 'left',
//           }}>
//           Umbrella on {marketName}
//         </Box>
//       </BoxWith3D>
//     </Box>
//   );
// }

export function UmbrellaTableContent({
  selectedColumns,
}: UmbrellaTableContentProps) {
  const umbrellas = useStore((store) => store.initialUmbrellas);
  const umbrellasAreLoading = useStore((store) => store.umbrellasAreLoading);

  if (umbrellasAreLoading) {
    return (
      <Box sx={{ pt: 18 }}>
        <TableContentLoading selectedColumns={selectedColumns} />
      </Box>
    );
  }

  if (!umbrellas.length) {
    return <NoData />;
  }

  // Group umbrella data by market
  const groupedData = umbrellas
    .filter((item): item is UmbrellaMarket => item !== null)
    .reduce((acc: Record<string, UmbrellaItem[]>, market) => {
      const marketName = market.market;
      if (!acc[marketName]) {
        acc[marketName] = [];
      }

      const stakeTokens: UmbrellaItem[] = (market.umbrellaData || []).map(
        (stakeTokenData, index) => ({
          ...stakeTokenData,
          market: market.market,
          umbrella: market.umbrella,
          oracle: market.oracle,
          id: `${market.market}-${index}`,
        }),
      );

      acc[marketName].push(...stakeTokens);
      return acc;
    }, {});

  if (Object.keys(groupedData).length === 0) {
    return <NoData />;
  }

  return (
    <Box sx={{ pt: 18 }}>
      {Object.entries(groupedData).map(([marketName, stakeTokens]) => (
        <React.Fragment key={marketName}>
          {/* <MarketTitleRow marketName={marketName} /> */}
          <Box sx={{ mt: -8 }}>
            {stakeTokens.map((item, index) => (
              <UmbrellaTableItem
                key={item.id || `stake-token-${index}`}
                item={item}
                selectedColumns={selectedColumns}
              />
            ))}
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
}
