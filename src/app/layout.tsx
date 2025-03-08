import React from 'react';
import type { Metadata } from 'next';
import { GlobalLayout } from '@layout';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'People of Star Wars',
  icons: '/icon/icons8-lightsaber-32.png',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalLayout>{children}</GlobalLayout>
      </body>
    </html>
  );
}
