import { Box } from '@mui/system';

import CheckIcon from '../../../assets/images/icons/checkIcon.svg';
import CrossIcon from '../../../assets/images/icons/crossIcon.svg';
import { IconBox } from '../../primitives/IconBox';

interface BoolColProps {
  isChecked: boolean;
}
export function BoolCol({ isChecked }: BoolColProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}>
      <IconBox
        sx={(theme) => ({
          width: 12,
          height: 12,
          '> svg': {
            width: 12,
            height: 12,
            path: { stroke: theme.palette.$textSecondary },
          },
        })}>
        {isChecked ? <CheckIcon /> : <CrossIcon />}
      </IconBox>
    </Box>
  );
}
