'use client';

import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import React, { ReactNode, useEffect } from 'react';

import { MUIThemeProvider } from '../components/layouts/MUIThemeProvider';
import { createEmotionCache } from '../styles/themeMUI';
import { useStore } from './ZustandStoreProvider';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export function AppGlobalStyles({
  children,
  emotionCache = clientSideEmotionCache,
}: {
  children: ReactNode;
  emotionCache?: EmotionCache;
}) {
  const setIsRendered = useStore((store) => store.setIsRendered);
  useEffect(() => setIsRendered(), []);

  return (
    // <PreferredThemeProvider
    //   disableTransitionOnChange={true}
    //   defaultTheme="light">
    //   <CacheProvider value={emotionCache}>
    //     <MUIThemeProvider>{children}</MUIThemeProvider>
    //   </CacheProvider>
    // </PreferredThemeProvider>

    <CacheProvider value={emotionCache}>
      <MUIThemeProvider>{children}</MUIThemeProvider>
    </CacheProvider>
  );
}
