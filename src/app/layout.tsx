import '@bgd-labs/react-web3-icons/dist/index.css';

import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { ReactNode } from 'react';

import AppLayout from '../components/layouts/AppLayout';
import Providers from '../providers';

const interNextFont = Inter({
  weight: ['300', '400', '600', '700', '800'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : new URL(`http://localhost:${process.env.PORT || 3000}`),
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
  reserveModal,
}: {
  children: ReactNode;
  reserveModal: ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        style={{
          fontFamily: interNextFont.style.fontFamily,
        }}>
        <NextTopLoader shadow={false} />
        <Providers>
          <AppLayout fontFamily={interNextFont.style.fontFamily}>
            {children}
            {reserveModal}
          </AppLayout>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
