'use client';

import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { brandsIconsPack } from '@bgd-labs/react-web3-icons/dist/iconsPacks/brandsIconsPack';
import { IconComponentBaseProps } from '@bgd-labs/react-web3-icons/dist/utils';
import { Box, SxProps } from '@mui/system';

import { CustomSkeleton } from './CustomSkeleton';

interface BrandIconProps extends IconComponentBaseProps {
  addressOrName: string;
  size?: number;
  css?: SxProps;
}

const BrandIcon = ({ addressOrName, size, css, ...props }: BrandIconProps) => {
  return (
    <Box
      sx={{
        lineHeight: 0,
        width: size ?? 12,
        height: size ?? 12,
        ...css,
      }}>
      <Web3Icon
        {...props}
        width={size ?? 12}
        height={size ?? 12}
        brandKey={addressOrName}
        iconsPack={brandsIconsPack}
        loader={
          <Box
            sx={{
              lineHeight: 0,
              width: size ?? 12,
              height: size ?? 12,
              ...css,
            }}>
            <CustomSkeleton circle width={size ?? 12} height={size ?? 12} />
          </Box>
        }
      />
    </Box>
  );
};

export default BrandIcon;
