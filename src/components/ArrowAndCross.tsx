import { Box, SxProps } from '@mui/system';

interface ArrowAndCrossProps {
  isTopArrow?: boolean;
  isCross?: boolean;
  size?: number;
  sx?: SxProps;
}

export function ArrowAndCross({
  isTopArrow,
  isCross,
  size,
  sx,
}: ArrowAndCrossProps) {
  const localSize = size || 10;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <Box
        className="ArrowAndCross"
        sx={{
          display: 'inline-block',
          position: 'relative',
          width: localSize,

          div: {
            width: isTopArrow
              ? localSize
              : isCross
                ? localSize / 1.4
                : localSize,
            height: isTopArrow ? 1 : isCross ? 2 : 1,
            minHeight: 1.01,
            backgroundColor: '$main',
            position: 'absolute',
            top: 0,
            left: 0,
            transition: 'all 0.3s ease',
            transformOrigin: '50%',
            '&:nth-of-type(1)': {
              left: isTopArrow ? -2 : isCross ? 0 : -2,
              transform: isTopArrow
                ? 'translateX(-25%) rotate(-45deg) scaleX(1)'
                : isCross
                  ? 'translateX(0) rotate(45deg) scaleX(2)'
                  : 'translateX(-25%) rotate(45deg) scaleX(1)',
            },
            '&:nth-of-type(2)': {
              transform: isTopArrow
                ? 'translateX(25%) rotate(45deg) scaleX(1)'
                : isCross
                  ? 'translateX(0) rotate(-45deg) scaleX(2)'
                  : 'translateX(25%) rotate(-45deg) scaleX(1)',
            },
          },
          ...sx,
        }}>
        <Box className="ArrowAndCross__line" />
        <Box className="ArrowAndCross__line" />
      </Box>
    </Box>
  );
}
