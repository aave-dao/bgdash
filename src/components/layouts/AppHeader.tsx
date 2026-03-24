import { Box, useTheme } from '@mui/system';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import React from 'react';

import HeaderLogo from '../../assets/headerLogo.svg';
import { useStore } from '../../providers/ZustandStoreProvider';
import { BoxWith3D } from '../BoxWith3D';

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const setSelectedFiltersToQuery = useStore(
    (store) => store.setSelectedFiltersToQuery,
  );
  const emodesSetSelectedFiltersToQuery = useStore(
    (store) => store.emodesSetSelectedFiltersToQuery,
  );
  const setUmbrellaSelectedFiltersToQuery = useStore(
    (store) => store.setUmbrellaSelectedFiltersToQuery,
  );
  const isFiltersOpenForLayout = useStore(
    (store) => store.isFiltersOpenForLayout,
  );

  const navigation = [
    {
      title: 'Dashboard',
      onClick: () => {
        setSelectedFiltersToQuery({
          router,
          pathName: '/',
          fromEmpty: true,
        });
      },
      pathName: '/',
    },
    {
      title: 'E-mode explorer',
      onClick: () => {
        emodesSetSelectedFiltersToQuery({
          router,
          pathName: '/emode-explorer/',
          fromEmpty: true,
        });
      },
      pathName: '/emode-explorer/',
    },
    {
      title: 'Umbrella',
      onClick: () => {
        setUmbrellaSelectedFiltersToQuery({
          router,
          pathName: '/umbrella/',
          fromEmpty: true,
        });
      },
      pathName: '/umbrella/',
    },
  ];

  return (
    <Box
      component="header"
      sx={{
        mt: 8,
        position: 'relative',
        transition: 'all 0.6s ease',
        zIndex: isFiltersOpenForLayout ? 1 : 3,
      }}>
      <BoxWith3D
        borderSize={10}
        contentColor="$mainLight"
        css={{
          color: '$textWhite',
          minHeight: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '10px 6px',
          [theme.breakpoints.up('sm')]: {
            minHeight: 70,
          },
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            position: 'relative',
            '.Header__logo': {
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              hover: { opacity: '0.7' },
            },
            [theme.breakpoints.up('xsm')]: {
              px: 8,
            },
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              className="Header__logo"
              onClick={() => {
                setSelectedFiltersToQuery({
                  router,
                  pathName: '/',
                  fromEmpty: true,
                });
              }}
              sx={{
                svg: {
                  width: 90,
                  height: 40,
                  [theme.breakpoints.up('sm')]: {
                    width: 111,
                    height: 44,
                  },
                  '#Group, #Group_4': {
                    fill: theme.palette.$text,
                  },
                },
              }}>
              <HeaderLogo />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: 6,
                [theme.breakpoints.up('xsm')]: {
                  ml: 24,
                },
                span: {
                  transition: 'all 0.2s ease',
                },
                b: {
                  position: 'absolute',
                  left: -1.4,
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                },
                '.Header__link': {
                  '&:last-of-type': {
                    mr: 0,
                  },
                },
              }}>
              {navigation.map((item, index) => (
                <Box
                  key={index}
                  className="Header__link"
                  onClick={item.onClick}
                  sx={{
                    color: '$text',
                    mr: 12,
                    position: 'relative',
                    cursor: pathname === item.pathName ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    [theme.breakpoints.up('sm')]: {
                      mr: 24,
                    },
                    b: {
                      opacity: pathname === item.pathName ? 1 : 0,
                    },
                    span: {
                      opacity: pathname !== item.pathName ? 1 : 0,
                    },
                    hover: {
                      span: {
                        opacity: 0,
                      },
                      b: {
                        opacity: 1,
                      },
                    },
                  }}>
                  <span>{item.title}</span>
                  <b>{item.title}</b>
                </Box>
              ))}
            </Box>
          </Box>

          {/*<ThemeSwitcher />*/}
        </Box>
      </BoxWith3D>
    </Box>
  );
}
