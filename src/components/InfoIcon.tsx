import InfoI from '../assets/images/icons/info.svg';
import { IconBox } from './primitives/IconBox';

export function InfoIcon() {
  return (
    <IconBox
      sx={(theme) => ({
        width: 12,
        height: 12,
        cursor: 'pointer',
        '> svg': {
          width: 12,
          height: 12,
          path: { fill: theme.palette.$text },
        },
      })}>
      <InfoI />
    </IconBox>
  );
}
