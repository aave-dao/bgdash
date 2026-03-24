import { Box, styled, SxProps } from '@mui/system';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { ReactNode } from 'react';

interface LinkProps extends NextLinkProps {
  title?: string;
  href: string;
  inNewWindow?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  css?: SxProps;
  className?: string;
}

const BaseLink = styled('a')({
  textDecoration: 'none',
});

export function Link({
  href,
  inNewWindow,
  children,
  css,
  as,
  disabled,
  className,
  ...props
}: LinkProps) {
  const isExternal =
    href.indexOf('http') === 0 || href.indexOf('mailto:') === 0;

  return (
    <>
      {disabled ? (
        <Box
          className={className}
          sx={{
            color: '$text',
            typography: 'body',
            cursor: 'pointer',
            ...css,
          }}>
          {children}
        </Box>
      ) : (
        <>
          {!isExternal ? (
            <NextLink href={href} passHref prefetch={false} as={as} {...props}>
              <Box
                className={className}
                sx={{ color: '$text', typography: 'body', ...css }}>
                {children}
              </Box>
            </NextLink>
          ) : (
            <BaseLink
              className={className}
              href={href}
              rel="noreferrer"
              sx={{ color: '$text', ...css }}
              target={inNewWindow ? '_blank' : undefined}
              {...props}>
              {children}
            </BaseLink>
          )}
        </>
      )}
    </>
  );
}
