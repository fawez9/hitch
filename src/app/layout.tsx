import React from 'react';
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
  title: 'HITCH - Helping Issue-To-Contribution Handoffs',
  description: 'GitHub Issue Search',
  icons: {
    icon: '/favicon.png',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans overflow-x-hidden">{children}</body>
    </html>
  );
}
