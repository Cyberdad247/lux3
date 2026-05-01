import type { Metadata } from 'next';
import './globals.css';
import '@typeform/embed/build/css/popup.css';

export const metadata: Metadata = {
  title: 'Nexus — Camelot-OS Agentic Ops Terminal',
  description: 'Sovereign agentic operations dashboard. Real-time telemetry, MCP streams, and knight dispatch for Camelot-OS v400.1.0.',
  keywords: ['camelot os', 'agentic dashboard', 'mcp streams', 'sovereign ops', 'ai agents'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ background: '#000000' }}>
        {children}
      </body>
    </html>
  );
}
