import { GlobalStyles as GS } from '@mui/system';
import React from 'react';

import { media } from './themeMUI';

export function GlobalStyles() {
  const defaultStyles = {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      outline: 'none',
      '&:after, &:before': {
        boxSizing: 'border-box',
      },
    },

    html: {
      scrollBehavior: 'smooth',
    },

    body: {
      minWidth: 365,
      fontWeight: '400',
      fontSize: 12,
      lineHeight: '15px',
      [`@media only screen and (${media.sm})`]: {
        fontSize: 14,
        lineHeight: '17px',
      },
    },

    '#root': {
      background: 'inherit',
    },

    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      marginBlock: 0,
      fontSize: 'unset',
    },

    a: {
      transition: 'all 0.2s ease',
      textDecoration: 'none',
    },

    ul: {
      listStyleType: 'none',
    },

    input: {
      width: '100%',
      borderRadius: 0,
      WebkitAppearance: 'none',
    },
    button: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      '&:disabled': {
        cursor: 'not-allowed',
      },
    },
  };

  const stylesForSSR = {
    ':root': {
      body: {
        backgroundColor: '#FFFFFF',
        color: '#101423',
      },
      '.react-loading-skeleton': {
        backgroundColor: '#F2F0F9 !important',
        '&:after': {
          backgroundImage: `linear-gradient(90deg, #F2F0F9, #C6C3D1, #F2F0F9) !important`,
        },
      },

      '#nprogress .bar': {
        background: '#101423',
      },
      '#nprogress .spinner-icon': {
        borderTopColor: '#101423',
        borderLeftColor: '#101423',
      },
      '.rc-tooltip-arrow': {
        borderTopColor: '#101423',
      },
    },
    "[data-theme='dark']": {
      body: {
        backgroundColor: '#212948',
        color: '#ADAECF',
      },
      a: {
        color: '#6A76A6',
        svg: {
          path: {
            stroke: '#6A76A6',
          },
        },
      },
      '.react-loading-skeleton': {
        backgroundColor: '#0C101E !important',
        '&:after': {
          backgroundImage: `linear-gradient(90deg, #0C101E, #090C16, #0C101E) !important`,
        },
      },
      '.BoxWith3D': {
        '.BoxWith3D__left-shadow': {
          backgroundColor: '#05070D',
        },
        '.BoxWith3D__bottom-shadow': {
          backgroundColor: '#05070D',
        },
        '.BoxWith3D__content--color': {
          backgroundColor: '#212948',
        },
        '.Header__logo': {
          svg: {
            '#Group, #Group_4': {
              fill: '#ADAECF',
            },
          },
        },
        '.Header__link': {
          color: '#ADAECF',
        },
      },
      '#nprogress .bar': {
        background: '#ADAECF',
      },
      '#nprogress .spinner-icon': {
        borderTopColor: '#ADAECF',
        borderLeftColor: '#ADAECF',
      },
      '.rc-tooltip-arrow': {
        borderTopColor: '#ADAECF',
      },
      '.SymbolCol__pool--info, .InterestRateModelGraphContainer__link, .GraphLegend__label':
        {
          color: '#6A76A6',
        },
      '.InfoBoxItem': {
        '&.InfoBoxItem_bold, &.InfoBoxItem_secondary': {
          color: '#6A76A6',
        },
        color: '#ADAECF',
        strong: {
          color: '#6A76A6',
        },
        p: {
          color: '#ADAECF',
        },
      },
      '.ParameterItem': {
        color: '#6A76A6',
        b: {
          color: '#ADAECF',
        },
      },
      '.InfoBox__icon': {
        svg: {
          path: {
            fill: '#6A76A6',
          },
        },
      },
    },
  };

  return (
    <GS
      styles={{
        ...defaultStyles,
        // styles for SSR
        ...stylesForSSR,
      }}
    />
  );
}
