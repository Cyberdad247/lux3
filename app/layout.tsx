import type { Metadata } from 'next';
import './globals.css';
import '@typeform/embed/build/css/popup.css';

export const metadata: Metadata = {
  title: 'Luxora — The Sovereign Network.',
  description: 'We assist businesses with onboarding and high-value transactions. Instant global payments for businesses prepared for the next crypto wave.',
  keywords: ['crypto payments', 'institutional payments', 'high-value transactions', 'global onboarding', 'enterprise crypto'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ background: '#010101', overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
