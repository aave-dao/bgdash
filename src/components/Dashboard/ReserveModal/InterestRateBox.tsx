import { Box, useTheme } from '@mui/system';
import React, { useRef } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { useStore } from '../../../providers/ZustandStoreProvider';
import { ReserveItem } from '../../../types';
import { Button } from '../../Button';
import { CustomSkeleton } from '../../CustomSkeleton';
import { FieldWrapper } from '../../FieldWrapper';
import { Input } from '../../primitives/Input';
import { InterestRateModelGraphContainer } from '../Charts/InterestRateModelGraphContainer';
import { InfoBoxItem } from './InfoBoxItems';
import { InfoBoxWrapperBig } from './InfoBoxWrapper';

const toText: { [key in string]: string } = {
  variableRateSlope1: 'Variable rate slope 1',
  variableRateSlope2: 'Variable rate slope 2',
  baseVariableBorrowRate: 'Base variable borrow rate',
  optimalUsageRatio: 'Optimal utilization',
};

function ReserveInputs({
  data,
  handleChange,
}: {
  data: { [key in string]: bigint };
  handleChange: (value: string, key: string) => void;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        [theme.breakpoints.up('md')]: {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridGap: '10px',
          mb: 12,
        },
      }}>
      {Object.keys(data).map((key) => (
        <Box
          key={key}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mb: 12,
            [theme.breakpoints.up('md')]: { mb: 0 },
          }}>
          <Box sx={{ color: '$textSecondary', mb: 8 }}>
            {toText[key]} ({formatUnits(data[key], 25)}%)
          </Box>
          <FieldWrapper>
            <Input
              sx={{
                background: 'transparent',
                width: '100%',
              }}
              value={data[key].toString(10)}
              onChange={(e) => {
                handleChange(e.target.value, key);
              }}
            />
          </FieldWrapper>
        </Box>
      ))}
    </Box>
  );
}

export function InterestRateBox({ reserve }: { reserve: ReserveItem }) {
  const theme = useTheme();
  const componentRef = useRef(null);

  const isRendered = useStore((store) => store.isRendered);

  const [isExplore, setIsExplore] = React.useState(false);

  const initialFirstRow: { [key in string]: bigint } = {
    variableRateSlope1: reserve.variableRateSlope1,
    variableRateSlope2: reserve.variableRateSlope2,
    baseVariableBorrowRate: reserve.baseVariableBorrowRate,
    optimalUsageRatio: reserve.optimalUsageRatio,
  };

  const [firstRowChanged, setFirstRowChanged] =
    React.useState<{ [key in string]: bigint }>(initialFirstRow);

  const handleChange = (value: string, key: string) => {
    if (initialFirstRow.hasOwnProperty(key)) {
      setFirstRowChanged({
        ...firstRowChanged,
        [key]: value === '0' ? 0n : parseUnits(value, 0),
      });
      return;
    }
  };

  const handleReset = () => {
    setFirstRowChanged(initialFirstRow);
  };

  const handleClose = () => {
    setIsExplore(false);
    handleReset();
  };

  return (
    <InfoBoxWrapperBig>
      <Box sx={{ minHeight: 281 }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column-reverse',
            [theme.breakpoints.up('sm')]: { flexDirection: 'row' },
          }}>
          <Box
            sx={{
              width: '100%',
              [theme.breakpoints.up('sm')]: {
                width: 220,
                pr: 12,
              },
              [theme.breakpoints.up('md')]: {
                width: 250,
              },
              [theme.breakpoints.up('lg')]: {
                width: '20%',
                minWidth: 250,
                pr: 24,
              },
            }}>
            <Box
              sx={{
                mt: 8,
                mb: 12,
                [theme.breakpoints.up('sm')]: {
                  mb: 24,
                },
              }}>
              <InfoBoxItem
                value={
                  isExplore ? 'Explore rate strategy' : 'Interest Rate Model'
                }
                isBig
              />
            </Box>
            <>
              {isExplore ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                  <Button
                    customWidth={165}
                    color="black"
                    onClick={async () => {
                      const { exportComponentAsPNG } = await import(
                        'react-component-export-image'
                      );
                      exportComponentAsPNG(componentRef);
                    }}>
                    Export PNG
                  </Button>
                  <Button
                    css={{ my: 12 }}
                    customWidth={165}
                    color="black"
                    onClick={handleReset}>
                    Reset
                  </Button>
                  <Button customWidth={165} color="white" onClick={handleClose}>
                    Close
                  </Button>
                </Box>
              ) : (
                <>
                  {Object.keys(firstRowChanged).map((key) => (
                    <Box
                      key={key}
                      sx={{
                        color: '$text',
                        display: 'inline-flex',
                        width: '100%',
                        justifyContent: 'space-between',
                        mb: 8,
                      }}>
                      <InfoBoxItem value={toText[key]} withoutMargin />{' '}
                      <InfoBoxItem
                        isBig
                        value={`${formatUnits(firstRowChanged[key], 25)}%`}
                        withoutMargin
                      />
                    </Box>
                  ))}

                  {isRendered ? (
                    <Button
                      customWidth={165}
                      css={{ mt: 24 }}
                      onClick={() => setIsExplore(!isExplore)}
                      color="white">
                      <Box sx={{ typography: 'body' }}>
                        Explore rate strategy
                      </Box>
                    </Button>
                  ) : (
                    <Box sx={{ mt: 24 }}>
                      <CustomSkeleton width={165} height={36} />
                    </Box>
                  )}
                </>
              )}
            </>
          </Box>

          <Box
            sx={{
              width: '100%',
              [theme.breakpoints.up('sm')]: {
                width: 'calc(100% - 220px)',
              },
              [theme.breakpoints.up('md')]: {
                width: 'calc(100% - 250px)',
              },
              [theme.breakpoints.up('lg')]: {
                width: '80%',
              },
            }}>
            <Box ref={componentRef}>
              <InterestRateModelGraphContainer
                reserve={{
                  ...reserve,
                  ...firstRowChanged,
                }}
              />
            </Box>
          </Box>
        </Box>

        {isExplore && (
          <Box sx={{ mt: 24 }}>
            <ReserveInputs data={firstRowChanged} handleChange={handleChange} />
          </Box>
        )}
      </Box>
    </InfoBoxWrapperBig>
  );
}
