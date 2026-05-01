import type { Metadata } from 'next';
import './globals.css';
import '@typeform/embed/build/css/popup.css';

export const metadata: Metadata = {
  title: 'Luxora — The Sovereign Network.',
  description: 'Real-time crypto-to-fiat settlement across 5 global nodes. NYC · London · Zurich · Tokyo · Singapore.',
  keywords: ['crypto payments', 'institutional payments', 'bitcoin settlement', 'global liquidity', 'enterprise crypto'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ background: '#010101', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
