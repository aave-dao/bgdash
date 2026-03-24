import { Box } from '@mui/system';

interface GraphLegendProps {
  labels: { text: string; color: string }[];
}

export function GraphLegend({ labels }: GraphLegendProps) {
  return (
    <Box>
      {labels.map((label) => (
        <Box
          key={label.text}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: 16,
          }}>
          <Box
            className="GraphLegend__label"
            sx={{ color: '$textSecondary', lineHeight: 1 }}>
            {label.text}
          </Box>
          <Box
            sx={{
              lineHeight: 1,
              ml: 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: label.color,
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
