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
    url: 'https://use-web-worker-docs.vercel.app/',
    siteName: 'useWebWorker',
    images: [
      {
        url: '/uww_1024.png',
        width: 1024,
        height: 1024,
        alt: 'useWebWorker - React Hook for Web Workers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'useWebWorker - React Hook for Web Workers',
    description: 'A powerful React hook for easy Web Worker integration with TypeScript support.',
    images: ['/uww_1024.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  metadataBase: new URL('https://use-web-worker-docs.vercel.app/'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/uww-icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/uww-icon.svg" type="image/svg+xml" sizes="any" />
      </head>
      <body className="grid-bg antialiased">{children}</body>
      <link rel="canonical" href="https://usewebworker.dev" />
    </html>
  );
}
