import 'rc-tooltip/assets/bootstrap_white.css';

import { createTheme, ThemeProvider } from '@mui/system';
import React, { ReactNode, useState } from 'react';

import { getDesignTokens } from '../../styles/themeMUI';

export function MUIThemeProvider({ children }: { children: ReactNode }) {
  // const { resolvedTheme } = useTheme();
  const [currentTheme] = useState(
    createTheme(
      // getDesignTokens((resolvedTheme as 'light' | 'dark') || 'light'),
      getDesignTokens('light'),
    ),
  );

  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //   resolvedTheme === 'light'
  //     ? setCurrentTheme(createTheme(getDesignTokens('light')))
  //     : setCurrentTheme(createTheme(getDesignTokens('dark')));
  // }, [resolvedTheme]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  currentTheme.typography.body = {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: '15px',
    [currentTheme.breakpoints.up('sm')]: {
      fontSize: 14,
      lineHeight: '17px',
    },
  };

  return <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>;
}
