import { Box, SxProps, useTheme } from '@mui/system';

import { useStore } from '../providers/ZustandStoreProvider';
import { Image } from './primitives/Image';

interface LoaderProps {
  size?: number;
  sx?: SxProps;
}

export function Loader({ size = 77, sx }: LoaderProps) {
  const theme = useTheme();
  const isRendered = useStore((store) => store.isRendered);

  if (!isRendered) {
    return (
      <Image
        alt="Loader"
        src={theme.palette.mode === 'dark' ? '/loaderDark.svg' : '/loader.svg'}
        style={{
          width: size,
          height: size,
        }}
      />
    );
  }

  return (
    <Box
      component="object"
      type="image/svg+xml"
      data={theme.palette.mode === 'dark' ? '/loaderDark.svg' : '/loader.svg'}
      sx={{
        width: size,
        height: size,
        ...sx,
      }}
    />
  );
}
