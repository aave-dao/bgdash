import createCache from '@emotion/cache';
import { ThemeOptions } from '@mui/system';

declare module '@mui/system' {
  interface BreakpointOverrides {
    xsm: true;
  }
}

export function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

export const media = {
  xs: '(min-width: 465px)',
  sm: '(min-width: 768px)',
  md: '(min-width: 1145px)',
  lg: '(min-width: 1400px)',
  xl: '(min-width: 1800px)',
};

export const getDesignTokens = (mode: 'light' | 'dark') => {
  const getColor = (lightColor: string, darkColor: string) =>
    mode === 'dark' ? darkColor : lightColor;

  return {
    unstable_sxConfig: {
      hover: {
        style: (props) => {
          const { hover } = props;
          return {
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover': {
                ...hover,
              },
            },
          };
        },
      },
    },
    breakpoints: {
      keys: ['xs', 'xsm', 'sm', 'md', 'lg', 'xl'],
      values: {
        xs: 0,
        xsm: 465,
        sm: 768,
        md: 1145,
        lg: 1400,
        xl: 1800,
      },
    },
    spacing: 1,
    palette: {
      mode,
      $main: getColor('#101423', '#ADAECF'),
      $secondary: getColor('#555069', '#090C16'),
      $middleLight: getColor('#C6C3D1', '#090C16'),
      $disabled: getColor('#CDC8E1', '#47557C'),
      $light: getColor('#F2F0F9', '#0C101E'),
      $mainGreen: getColor('#1AD4B3', '#1AD4B3'),
      $mainRed: getColor('#FC4F83', '#FC4F83'),
      $mainBlue: getColor('#1A9DD4', '#1A9DD4'),
      $error: getColor('#FF607B', '#FF607B'),
      $warning: getColor('#ff9966', '#ff9966'),
      $mainLight: getColor('#FFFFFF', '#212948'),
      $mainStable: getColor('#101423', '#212948'),
      $mainElements: getColor('#101423', '#090C16'),
      $headerGray: getColor('#C6C3D1', '#0C101E'),

      $lightStable: getColor('#F2F0F9', '#F2F0F9'),

      $mainButton: getColor('#101423', '#3E456A'),
      $buttonBorderBottom: getColor('#C6C3D1', '#47557C'),
      $buttonBorderLeft: getColor('#555069', '#475072'),
      $whiteButton: getColor('#FFFFFF', '#182038'),
      $buttonDisabled: getColor('#9A94B0', '#101423'),
      $whiteButtonBorderBottom: getColor('#F2F0F9', '#101423'),
      $whiteButtonBorderLeft: getColor('#C6C3D1', '#0C101E'),

      $paper: getColor('#FFFFFF', '#212948'),
      $backgroundOverlap: getColor('#292E4199', '#11141CA1'),
      $appBackground: getColor('#EDF0FC', '#1C2445'),

      $text: getColor('#1B2030', '#ADAECF'),
      $textLight: getColor('#F2F0F9', '#ADAECF'),
      $textSecondary: getColor('#555069', '#6A76A6'),
      $textDisabled: getColor('#CDC8E1', '#47557C'),
      $textWhite: getColor('#FFFFFF', '#FFFFFF'),

      $mainBorder: getColor('#101423', '#05070D'),
      $secondaryBorder: getColor('#555069', '#475072'),
      $disabledBorder: getColor('#C6C3D1', '#47557C'),
    },
    typography: {
      h5: undefined,
      h6: undefined,
      subtitle1: undefined,
      subtitle2: undefined,
      body1: undefined,
      body2: undefined,
      button: undefined,
      overline: undefined,
      h1: undefined,
      h2: undefined,
      h3: undefined,
      headline: {
        fontWeight: '700',
        fontSize: 20,
        lineHeight: '24px',
      },
      body: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: '17px',
      },
      descriptor: {
        fontWeight: '400',
        fontSize: 11,
        lineHeight: '12px',
      },
    },
  } as ThemeOptions;
};
