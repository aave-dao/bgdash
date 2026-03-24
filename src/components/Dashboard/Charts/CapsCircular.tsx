import { Box, useTheme } from '@mui/system';
import { Chord } from '@visx/chord';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { scaleOrdinal } from '@visx/scale';
import { Arc, Pie } from '@visx/shape';
import React from 'react';

import { useStore } from '../../../providers/ZustandStoreProvider';
import { media } from '../../../styles/themeMUI';
import { useMediaQuery } from '../../../styles/useMediaQuery';
import { CustomSkeleton } from '../../CustomSkeleton';

type CapsCircularStatusProps = {
  value: number;
};

function determineValueDisplay(value: number) {
  if (value === 0) {
    return 'N/A';
  } else if (value < 0.01) {
    return '<0.01%';
  } else if (value > 100) {
    return '>100%';
  } else {
    return `${value.toFixed(2)}%`;
  }
}

function descending(a: number, b: number): number {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

export function CapsCircularStatus({ value }: CapsCircularStatusProps) {
  const theme = useTheme();
  const isRendered = useStore((store) => store.isRendered);

  const sm = useMediaQuery(media.sm);
  const lg = useMediaQuery(media.lg);

  if (value === 0) return null;

  const chartSize = sm && !lg ? 150 : sm && lg ? 150 : 120; // Width and height of the chart container
  const fontSize = sm && !lg ? 18 : sm && lg ? 18 : 15; // Width and height of the chart container

  const centerX = chartSize / 2; // X-coordinate of the center of the chart
  const centerY = chartSize / 2; // Y-coordinate of the center of the chart
  const radius = Math.min(chartSize, chartSize) / 3; // Radius of the chart
  const radiusOverfill = Math.min(chartSize, chartSize) / 2.5; // Radius of the chart
  const startAngle = 0; // Start angle at 0 degrees
  const endAngle = startAngle + 2 * Math.PI; // End angle at 2π (360 degrees)
  const strokeWidth = 3; // Thickness of the border
  const filledPercentage = Math.min(Math.max(value, 0), 100.02); // Limit progress between 0 and 100.01
  const filledAngle = (filledPercentage / 100) * (endAngle - startAngle);
  const overfilledPercentage = Math.max(value - 100.02, 0);
  const overfilledAngle =
    (overfilledPercentage / 100) * (endAngle - startAngle);

  const dangValue = 90;
  const isDangValue = filledPercentage > dangValue;

  const centerSize = 5;
  const outerRadius = Math.min(chartSize, chartSize) * 0.5 - (centerSize + 10);

  const dataMatrix = isDangValue
    ? [
        [dangValue, 0, 0, 0],
        [filledPercentage - dangValue, 0, 0, 0],
        [100 - filledPercentage, 0, 0, 0],
      ]
    : [
        [filledPercentage, 0, 0, 0],
        [100 - filledPercentage, 0, 0, 0],
      ];

  const color = scaleOrdinal<number, string>({
    domain: [0, 1, 2],
    range: isDangValue
      ? [theme.palette.$mainGreen, 'url(#dang)', theme.palette.$light]
      : [theme.palette.$mainGreen, theme.palette.$light],
  });

  return isRendered ? (
    <Box sx={{ position: 'relative', right: 10 }}>
      <svg width={chartSize} height={chartSize}>
        <LinearGradient
          id="dang"
          from={theme.palette.$mainRed}
          to={theme.palette.$mainGreen}
          vertical
        />

        <Group width="100%" top={centerY} left={centerX}>
          {overfilledPercentage > 0 ? (
            <>
              {/* Unfilled portion */}
              <Pie
                width={'100%'}
                data={[filledPercentage]}
                pieValue={(d) => d}
                outerRadius={radius}
                innerRadius={radius - strokeWidth} // Inner radius creates the empty center
                startAngle={startAngle + filledAngle}
                endAngle={endAngle}>
                {(pie) => (
                  <g>
                    <path
                      d={pie.path(pie.arcs[0]) || undefined}
                      fill={theme.palette.$light}
                      stroke={theme.palette.$light}
                    />
                  </g>
                )}
              </Pie>

              {/* Filled portion */}
              <Pie
                width={'100%'}
                data={[filledPercentage]}
                pieValue={(d) => d}
                outerRadius={radius}
                innerRadius={radius - strokeWidth} // Inner radius creates the empty center
                startAngle={startAngle}
                endAngle={startAngle + filledAngle}>
                {(pie) => (
                  <g>
                    <path
                      d={pie.path(pie.arcs[0]) || undefined}
                      fill={theme.palette.$mainRed}
                      stroke={theme.palette.$mainRed}
                    />
                  </g>
                )}
              </Pie>

              {/* Unfilled portion for Overfill */}
              {overfilledPercentage > 0 && (
                <Pie
                  width={'100%'}
                  data={[filledPercentage]}
                  pieValue={(d) => d}
                  outerRadius={radiusOverfill}
                  innerRadius={radiusOverfill - strokeWidth} // Inner radius creates the empty center
                  startAngle={startAngle + overfilledAngle}
                  endAngle={endAngle}>
                  {(pie) => (
                    <g>
                      <path
                        d={pie.path(pie.arcs[0]) || undefined}
                        fill={theme.palette.$light}
                        stroke={theme.palette.$light}
                      />
                    </g>
                  )}
                </Pie>
              )}

              {/* Overfill portion */}
              <Pie
                width={'100%'}
                data={[filledPercentage]}
                pieValue={(d) => d}
                outerRadius={radiusOverfill}
                innerRadius={radiusOverfill - strokeWidth} // Inner radius creates the empty center
                startAngle={startAngle}
                endAngle={startAngle + overfilledAngle}>
                {(pie) => (
                  <g>
                    <path
                      d={pie.path(pie.arcs[0]) || undefined}
                      fill={theme.palette.$mainRed}
                      stroke={theme.palette.$mainRed}
                    />
                  </g>
                )}
              </Pie>
            </>
          ) : (
            <>
              <Chord
                matrix={dataMatrix}
                padAngle={0}
                sortSubgroups={descending}>
                {({ chords }) => (
                  <g>
                    {chords.groups.map((group, i) => (
                      <Arc
                        key={`key-${i}`}
                        data={group}
                        innerRadius={outerRadius - (strokeWidth + 1)}
                        outerRadius={outerRadius}
                        style={{ fill: color(i) }}
                      />
                    ))}
                  </g>
                )}
              </Chord>
            </>
          )}

          {/* Progress number */}
          <text
            x={4}
            y={2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={
              isDangValue ? theme.palette.$mainRed : theme.palette.$mainGreen
            }
            fontSize={fontSize}
            fontWeight={600}>
            {determineValueDisplay(value)}
          </text>
        </Group>
      </svg>
    </Box>
  ) : (
    <Box
      sx={{
        pt: 15,
        pr: 25,
        pl: 5,
        [theme.breakpoints.up('sm')]: { pb: 17 },
      }}>
      <Box
        sx={{
          display: 'block',
          [theme.breakpoints.up('sm')]: { display: 'none' },
        }}>
        <CustomSkeleton circle width={90} height={90} />
      </Box>
      <Box
        sx={{
          display: 'none',
          [theme.breakpoints.up('sm')]: { display: 'block' },
        }}>
        <CustomSkeleton circle width={120} height={120} />
      </Box>
    </Box>
  );
}
