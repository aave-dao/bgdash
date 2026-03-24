import { Box, useTheme } from '@mui/system';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Bar, Line, LinePath } from '@visx/shape';
import { Text } from '@visx/text';
import { defaultStyles, TooltipWithBounds, withTooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { max } from 'd3-array';
import React, { useCallback, useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { ReserveItem } from '../../../types';
import { BoxWith3D } from '../../BoxWith3D';
import { NumeralCol } from '../Cols/NumeralCol';
import type { Fields } from './InterestRateModelGraphContainer';
import {
  bisectDate,
  getDate,
  getRates,
  getSupplyRate,
  getVariableBorrowRate,
  TooltipData,
  tooltipValueAccessors,
} from './utils';

export type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  fields: Fields;
  reserve: ReserveItem;
};

export const InterestRateModelGraph = withTooltip<AreaProps, TooltipData>(
  ({
    width,
    height,
    margin = { top: 20, right: 30, bottom: 35, left: 45 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    fields,
    reserve,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    const theme = useTheme();

    // Formatting
    const formattedOptimalUtilizationRate = +formatUnits(
      reserve.optimalUsageRatio,
      25,
    );

    const formattedCurrentUtilizationRate = +(
      +reserve.supplyUsageRatio * 100
    ).toFixed(2);

    const data = useMemo(
      () =>
        getRates({
          ...reserve,
          reserveFactor: parseUnits(reserve.reserveFactor, 4),
        }),
      [reserve],
    );

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // scales
    const dateScale = useMemo(
      () =>
        scaleLinear({
          range: [0, innerWidth],
          domain: [0, 100],
          nice: true,
        }),
      [innerWidth],
    );
    const yValueScale = useMemo(() => {
      const maxY = Math.max(
        max(data, (d) => getVariableBorrowRate(d)) as number,
        max(data, (d) => getSupplyRate(d)) as number,
      );
      return scaleLinear({
        range: [innerHeight, 0],
        domain: [0, (maxY || 0) * 1.1],
        nice: true,
      });
    }, [innerHeight, data, reserve]);

    // tooltip handler
    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>,
      ) => {
        const { x: _x } = localPoint(event) || { x: 0 };
        const x = _x - margin.left;
        const x0 = dateScale.invert(x);
        const index = bisectDate(data, x0, 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
        });
      },
      [showTooltip, dateScale, data, margin],
    );

    if (width < 10) return null;

    const ticks = [
      {
        value: +formatUnits(reserve.optimalUsageRatio, 27) * 100,
        label: 'optimal',
      },
      {
        value: +reserve.supplyUsageRatio * 100,
        label: 'current',
      },
    ];

    return (
      <>
        <svg width={width} height={height}>
          <Group left={margin.left} top={margin.top}>
            {/* Horizontal Background Lines */}
            <GridRows
              scale={yValueScale}
              width={innerWidth}
              stroke={theme.palette.$textLight} // divider
              pointerEvents="none"
              numTicks={3}
            />

            {/* Variable Borrow APR Line */}
            <LinePath
              stroke={theme.palette.$mainGreen}
              strokeWidth={1.5}
              data={data}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => yValueScale(getVariableBorrowRate(d)) ?? 0}
              curve={curveMonotoneX}
            />

            {/* Supply APR Line */}
            <LinePath
              stroke={theme.palette.$mainBlue}
              strokeWidth={1.5}
              data={data}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => yValueScale(getSupplyRate(d)) ?? 0}
              curve={curveMonotoneX}
            />

            {/* X Axis */}
            <AxisBottom
              top={innerHeight}
              scale={dateScale}
              tickValues={[0, 25, 50, 75, 100]}
              hideAxisLine
              tickStroke={theme.palette.$textLight}
              tickLabelProps={() => ({
                fill: theme.palette.$text,
                fontSize: 11,
                textAnchor: 'middle',
              })}
              tickFormat={(n) => `${n}%`}
            />

            {/* Y Axis */}
            <AxisLeft
              scale={yValueScale}
              stroke={theme.palette.$textLight}
              tickStroke={theme.palette.$textLight}
              tickLabelProps={() => ({
                fill: theme.palette.$text,
                fontSize: 11,
                dx: -margin.left + 15,
              })}
              tickFormat={(value) => `${value}%`}
              numTicks={3}
            />

            {/* Background */}
            <Bar
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              onTouchStart={handleTooltip}
              onTouchMove={handleTooltip}
              onMouseMove={handleTooltip}
              onMouseLeave={() => hideTooltip()}
            />

            {/* Optimal Utilization Line */}
            <Line
              from={{ x: dateScale(ticks[0].value), y: margin.top + 8 }}
              to={{ x: dateScale(ticks[0].value), y: innerHeight }}
              stroke={theme.palette.$textDisabled}
              strokeWidth={1}
              pointerEvents="none"
              strokeDasharray="5"
            />
            <Text
              x={dateScale(ticks[0].value)}
              y={margin.top}
              textAnchor="middle"
              verticalAnchor="middle"
              fontSize="11px"
              fill={theme.palette.$textSecondary}
              stroke={theme.palette.$textDisabled}
              strokeWidth="1px">
              {`Optimal utilization ${formattedOptimalUtilizationRate}%`}
            </Text>
            <Text
              x={dateScale(ticks[0].value)}
              y={margin.top}
              textAnchor="middle"
              verticalAnchor="middle"
              fontSize="11px"
              fill={theme.palette.$textDisabled}>
              {`Optimal utilization ${formattedOptimalUtilizationRate}%`}
            </Text>

            {/* Current Utilization Line */}
            <Line
              from={{ x: dateScale(ticks[1].value), y: margin.top + 28 }}
              to={{ x: dateScale(ticks[1].value), y: innerHeight }}
              stroke={theme.palette.$textSecondary}
              strokeWidth={1}
              pointerEvents="none"
              strokeDasharray="5"
            />
            <Text
              x={dateScale(ticks[1].value)}
              y={margin.top + 20}
              textAnchor="middle"
              verticalAnchor="middle"
              fontSize="11px"
              fill={theme.palette.$textSecondary}
              stroke={theme.palette.$textSecondary}
              strokeWidth="1px">
              {`Utilization ${formattedCurrentUtilizationRate}%`}
            </Text>
            <Text
              x={dateScale(ticks[1].value)}
              y={margin.top + 20}
              textAnchor="middle"
              verticalAnchor="middle"
              fontSize="11px"
              fill={theme.palette.$textSecondary}>
              {`Utilization ${formattedCurrentUtilizationRate}%`}
            </Text>

            {/* Tooltip */}
            {tooltipData && (
              <g>
                {/* Vertical line */}
                <Line
                  from={{ x: tooltipLeft, y: 0 }}
                  to={{ x: tooltipLeft, y: innerHeight }}
                  stroke={theme.palette.$text}
                  strokeWidth={1}
                  pointerEvents="none"
                  strokeDasharray="5"
                />
                {/* Variable borrow rate circle */}
                <circle
                  cx={tooltipLeft}
                  cy={yValueScale(getVariableBorrowRate(tooltipData))}
                  r={3.3}
                  fill={theme.palette.$textDisabled}
                  stroke={theme.palette.$text}
                  fillOpacity={0.1}
                  strokeOpacity={0.1}
                  strokeWidth={2}
                  pointerEvents="none"
                />
                <circle
                  cx={tooltipLeft}
                  cy={yValueScale(getVariableBorrowRate(tooltipData))}
                  r={3.3}
                  fill={theme.palette.$textDisabled}
                  stroke={theme.palette.$mainGreen}
                  strokeWidth={2}
                  pointerEvents="none"
                />

                {/* Supply rate circle */}
                <circle
                  cx={tooltipLeft}
                  cy={yValueScale(getSupplyRate(tooltipData))}
                  r={3.3}
                  fill={theme.palette.$textDisabled}
                  stroke={theme.palette.$mainBlue}
                  fillOpacity={0.1}
                  strokeOpacity={0.1}
                  strokeWidth={2}
                  pointerEvents="none"
                />
                <circle
                  cx={tooltipLeft}
                  cy={yValueScale(getSupplyRate(tooltipData))}
                  r={3.3}
                  fill={theme.palette.$textDisabled}
                  stroke={theme.palette.$mainBlue}
                  strokeWidth={2}
                  pointerEvents="none"
                />
              </g>
            )}
          </Group>
        </svg>

        {/* Tooltip Info */}
        {tooltipData && (
          <div>
            <TooltipWithBounds
              top={20}
              left={tooltipLeft + 40}
              style={{
                ...defaultStyles,
                padding: '0',
                boxShadow: 'none',
                color: 'transparent',
                borderRadius: '0',
              }}>
              <BoxWith3D
                anySize
                borderSize={3}
                contentColor="$mainLight"
                css={{ p: 4, color: '$text' }}>
                <Box
                  sx={{
                    fontWeight: '700',
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 4,
                  }}>
                  <Box sx={{ mr: 12 }}>Utilization Rate</Box>
                  <Box>{tooltipData.utilization.toFixed(2)}%</Box>
                </Box>

                {fields.map((field) => (
                  <Box
                    key={field.name}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 4,
                      '&:last-of-type': { mb: 0 },
                    }}>
                    <Box
                      sx={{
                        fontSize: '11px',
                        color: '$textDisabled',
                        mr: 12,
                      }}>
                      {field.text}
                    </Box>
                    <Box sx={{ fontWeight: '700' }}>
                      {
                        +tooltipValueAccessors[field.name](tooltipData).toFixed(
                          2,
                        )
                      }
                      %
                    </Box>
                  </Box>
                ))}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 4,
                  }}>
                  {(tooltipData.utilization / 100) *
                    parseFloat(reserve.totalLiquidityUSD) -
                    parseFloat(reserve.totalDebtUSD) >
                  0 ? (
                    <>
                      <Box
                        sx={{
                          fontSize: '11px',
                          color: '$textDisabled',
                          mr: 12,
                        }}>
                        Liquidity outflow to increase utilization
                      </Box>

                      <Box sx={{ fontWeight: '700' }}>
                        <NumeralCol
                          value={
                            (tooltipData.utilization / 100) *
                              parseFloat(reserve.totalLiquidityUSD) -
                            parseFloat(reserve.totalDebtUSD)
                          }
                          isFirstUSD
                        />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          fontSize: '11px',
                          color: '$textDisabled',
                          mr: 12,
                        }}>
                        Liquidity inflow to decrease utilization
                      </Box>
                      <Box sx={{ fontWeight: '700' }}>
                        <NumeralCol
                          value={Math.abs(
                            (tooltipData.utilization / 100) *
                              parseFloat(reserve.totalLiquidityUSD) -
                              parseFloat(reserve.totalDebtUSD),
                          )}
                          isFirstUSD
                        />
                      </Box>
                    </>
                  )}
                </Box>
              </BoxWith3D>
            </TooltipWithBounds>
          </div>
        )}
      </>
    );
  },
);
