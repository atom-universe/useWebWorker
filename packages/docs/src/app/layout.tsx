import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'useWebWorker - React Hook for Web Workers',
  description:
    'A powerful React hook for easy Web Worker integration with TypeScript support, automatic cleanup, and comprehensive error handling.',
  keywords: ['React', 'Web Workers', 'TypeScript', 'Performance', 'Hook'],
  authors: [{ name: 'Atom Universe' }],
  openGraph: {
    title: 'useWebWorker - React Hook for Web Workers',
    description: 'A powerful React hook for easy Web Worker integration with TypeScript support.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="grid-bg antialiased">{children}</body>
    </html>
  );
}
