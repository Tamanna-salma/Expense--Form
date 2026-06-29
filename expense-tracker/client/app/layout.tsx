import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'A modern expense tracker built with Next.js and Express.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        
        {children}

      </body>
    </html>
  );
}
