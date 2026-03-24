import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'node-html-parser';
import ReactDOMServer from 'react-dom/server';

import { InterestRateModelIRGraph } from '../../src/components/Dashboard/Charts/InterestRateModalIRGraph';

export const config = {
  unstable_allowDynamic: [
    '/lib/utilities.js', // allows a single file
    '/node_modules/function-bind/**', // use a glob to allow anything in the function-bind 3rd party module
  ],
};

function recharts2svgString({
  baseVariableBorrowRate,
  optimalUsageRatio,
  variableRateSlope1,
  variableRateSlope2,
}: {
  variableRateSlope1?: string;
  variableRateSlope2?: string;
  baseVariableBorrowRate?: string;
  optimalUsageRatio?: string;
}) {
  const reserve = {
    baseVariableBorrowRate: baseVariableBorrowRate || '0',
    optimalUsageRatio: optimalUsageRatio || '800000000000000000000000000',
    variableRateSlope1: variableRateSlope1 || '40000000000000000000000000',
    variableRateSlope2: variableRateSlope2 || '750000000000000000000000000',
  };

  const CHART_HEIGHT = 240;

  const htmlStringRoot = ReactDOMServer.renderToString(
    <InterestRateModelIRGraph
      width={1500}
      height={CHART_HEIGHT}
      reserve={{
        baseVariableBorrowRate: BigInt(
          Math.trunc(+reserve.baseVariableBorrowRate),
        ),
        optimalUsageRatio: BigInt(Math.trunc(+reserve.optimalUsageRatio)),
        variableRateSlope1: BigInt(Math.trunc(+reserve.variableRateSlope1)),
        variableRateSlope2: BigInt(Math.trunc(+reserve.variableRateSlope2)),
      }}
    />,
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const svgString = parse(htmlStringRoot).querySelector('svg').toString();

  const legendSvg =
    '<g style="color: black; font-size: 13px; font-family: sans-serif; transform: translate(18px, 25px);"><g><circle r="3" cx="-6" cy="-5" style="fill: #1AD4B3" /><text>Borrow APR, variable</text></g></g>';

  return (
    '<?xml version="1.0"?>' +
    svgString
      .replace(
        '<svg ',
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" style="background: white;" ',
      )
      .replace(
        `height="${CHART_HEIGHT}">`,
        `height="${CHART_HEIGHT + 60}"> ${legendSvg}`,
      )
      .replace('transform="translate(40, 20)"', 'transform="translate(40, 50)"')
  );
}

const ImageSvg = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {
    query: {
      baseVariableBorrowRate,
      optimalUsageRatio,
      variableRateSlope1,
      variableRateSlope2,
    },
  } = req;

  const reserve = {
    baseVariableBorrowRate,
    optimalUsageRatio,
    variableRateSlope1,
    variableRateSlope2,
  } as {
    variableRateSlope1?: string;
    variableRateSlope2?: string;
    baseVariableBorrowRate?: string;
    optimalUsageRatio?: string;
  };

  res.writeHead(200, {
    'Content-Type': 'image/svg+xml',
  });
  res.write(
    recharts2svgString({
      ...reserve,
    }),
  );
  res.end();
};

export default ImageSvg;
