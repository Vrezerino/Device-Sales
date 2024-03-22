import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import ReduxProvider from '@/redux/provider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Device Sales Dashboard',
    default: 'Device Sales Dashboard',
  },
  description: 'Manage devices, customers and invoices. App built with App Router.',
  metadataBase: new URL('https://device-sales.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Device Sales</title>
      </head>
      <ReduxProvider>
        <body className={`${inter.className} antialiased`}>{children}</body>
      </ReduxProvider>
    </html>
  );
};
