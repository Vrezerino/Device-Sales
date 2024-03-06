import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import ReduxProvider from '@/redux/provider';

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
}
