import { AxisBottom, AxisLeft } from '@visx/axis';
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Bar, Line, LinePath } from '@visx/shape';
import { Text } from '@visx/text';
import { withTooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { max } from 'd3-array';
import React, { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';

import {
  bisectDate,
  getDate,
  getRates,
  getVariableBorrowRate,
  InterestRateModelType,
  TooltipData,
} from './utils';

export type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  reserve: InterestRateModelType;
};

export const InterestRateModelIRGraph = withTooltip<AreaProps, TooltipData>(
  ({
    width,
    height,
    margin = { top: 50, right: 30, bottom: 35, left: 45 },
    showTooltip,
    hideTooltip,
    reserve,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    if (width < 10) return null;

    // Formatting
    const formattedOptimalUtilizationRate = +formatUnits(
      reserve.optimalUsageRatio,
      25,
    );

    const data = useMemo(() => getRates(reserve), [reserve]);

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
      const maxY = max(data, (d) => getVariableBorrowRate(d)) as number;
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

    const ticks = [
      {
        value: Number(formatUnits(reserve.optimalUsageRatio, 27)) * 100,
        label: 'Optimal utilization',
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
              stroke="#F2F0F9" // divider
              pointerEvents="none"
              numTicks={3}
            />

            {/* Variable Borrow APR Line */}
            <LinePath
              stroke="#1AD4B3"
              strokeWidth={2}
              data={data}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => yValueScale(getVariableBorrowRate(d)) ?? 0}
              curve={curveMonotoneX}
            />

            {/* X Axis */}
            <AxisBottom
              top={innerHeight}
              scale={dateScale}
              tickValues={[0, 25, 50, 75, 100]}
              hideAxisLine
              tickStroke="#F2F0F9"
              tickLabelProps={() => ({
                fill: '#1B2030',
                fontSize: 11,
                textAnchor: 'middle',
              })}
              tickFormat={(n) => `${n}%`}
            />

            {/* Y Axis */}
            <AxisLeft
              scale={yValueScale}
              stroke="#F2F0F9"
              tickStroke="#F2F0F9"
              tickLabelProps={() => ({
                fill: '#1B2030',
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
              stroke="#CDC8E1"
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
              fill="#555069"
              stroke="#FFFFFF"
              strokeWidth="1px">
              {`Optimal utilization ${formattedOptimalUtilizationRate}%`}
            </Text>
            <Text
              x={dateScale(ticks[0].value)}
              y={margin.top}
              textAnchor="middle"
              verticalAnchor="middle"
              fontSize="11px"
              fill="#CDC8E1">
              {`Optimal utilization ${formattedOptimalUtilizationRate}%`}
            </Text>
          </Group>
        </svg>
      </>
    );
  },
);
