import type { Metadata } from 'next';

import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: 'Tiger OpenAPI Playground',
  description: 'Debug tiger-openapi directly in your browser.',
  icons: {
    icon: `${publicBasePath}/tiger-openapi-icon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
