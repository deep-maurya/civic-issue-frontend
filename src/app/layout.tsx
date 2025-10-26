import type { Metadata } from 'next';
import { Geist, Geist_Mono, Poppins, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import ReactQueryProvider from '@/context/ReactQuery.provider';
import { Toaster } from '@/components/ui/sonner';
import ReduxProvider from '@/redux/ReduxProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-spacegrotesk',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Public Pulse',
  description: 'Report civic issues instantly. Free, fast, and easy to use.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${spaceGrotesk.variable} antialiased`}
      >

          <ReactQueryProvider>
            <ThemeProvider>
            <ReduxProvider>
              {children}
              <Toaster position="top-right" richColors />
              </ReduxProvider>
            </ThemeProvider>
          </ReactQueryProvider>
      </body>
    </html>
  );
}
