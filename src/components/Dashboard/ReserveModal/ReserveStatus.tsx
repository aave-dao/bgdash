import { Box } from '@mui/system';
import React from 'react';

interface ReserveStatusProps {
  title: string;
  color: string;
}

export function ReserveStatus({ title, color }: ReserveStatusProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        ml: 10,
      }}>
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: color,
          mr: 5,
        }}
      />
      {title}
    </Box>
  );
}
