import { Box, useTheme } from '@mui/system';
import numeral from 'numeral';
import React from 'react';

interface ProgressBarProps {
  total: number;
  current: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ total, current }) => {
  const theme = useTheme();
  const currentPercent = (current / total) * 100;
  const filledWidth = `${currentPercent}%`;

  return (
    <Box sx={{ width: '100%', mt: 24 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Box sx={{ color: '$textSecondary' }}>Isolated debt ceiling</Box>
        <Box>
          ${numeral(current).format('0.0a')} of {numeral(total).format('0.0a')}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 8,
          border: `1px solid ${theme.palette.$mainBorder}`,
          borderTopWidth: 2,
          borderRightWidth: 3,
        }}>
        <Box
          sx={{
            width: filledWidth,
            height: '3px',
            backgroundColor: currentPercent > 90 ? '$mainRed' : '$mainGreen',
            transition: 'width 0.3s ease-in-out',
          }}
        />
      </Box>
    </Box>
  );
};
