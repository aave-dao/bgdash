import { Box, useTheme } from '@mui/system';

import XIcon from '../assets/images/icons/twitterX.svg';
import WebIcon from '../assets/images/icons/web.svg';
import Github from '../assets/social/github.svg';
import { Link } from './Link';
import { LinkIcon } from './LinkIcon';
import { IconBox } from './primitives/IconBox';

const brandingLinks = [
  {
    href: 'https://twitter.com/bgdlabs',
    icon: XIcon,
  },
  {
    href: 'https://github.com/bgd-labs',
    icon: Github,
  },
  {
    href: 'https://bgdlabs.com',
    icon: WebIcon,
  },
];

export function Branding() {
  const theme = useTheme();

  return (
    <Box
      className="Branding"
      sx={{
        position: 'relative',
        zIndex: 2,
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <Box
          className="Branding__text"
          sx={{
            typography: 'body',
            color: '$textDisabled',
            [theme.breakpoints.up('sm')]: { typography: 'body', mr: 8 },
          }}>
          by BGD Labs
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
          {brandingLinks.map((link, index) => (
            <Link
              href={link.href}
              inNewWindow
              key={index}
              css={{
                transition: 'all 0.2s ease',
                ml: 6,
                hover: {
                  opacity: 0.7,
                },
              }}>
              <IconBox
                className="Branding__icon"
                sx={{
                  width: 14,
                  height: 14,
                  '> svg': {
                    width: 14,
                    height: 14,
                    transition: 'all 0.2s ease',
                    path: {
                      fill: theme.palette.$textDisabled,
                    },
                  },
                }}>
                <link.icon />
              </IconBox>
            </Link>
          ))}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', mt: 4 }}>
        <Link
          href="https://onaave.com/"
          inNewWindow
          css={{
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.$textDisabled,
            transition: 'all 0.2s ease',
            hover: {
              opacity: 0.7,
            },
            '.LinkIcon': {
              ml: 4,
            },
          }}>
          OnAave
          <LinkIcon size={16} color={theme.palette.$textDisabled} />
        </Link>
      </Box>
    </Box>
  );
}
