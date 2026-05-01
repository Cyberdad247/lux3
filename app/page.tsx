import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import RefCapture from '@/components/RefCapture';
import HUDOverlay from '@/components/HUDOverlay';
import type { TickerItem } from '@/components/LiquidTicker';

// Dynamic import: WebGL canvas must not render on server
const GlobeScene = dynamic(() => import('@/components/GlobeScene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 flex items-center justify-center" style={{ background: '#010101' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border border-[#D4AF37]/20 animate-ping" />
        <span style={{ fontFamily: "'Space Mono', monospace" }}
          className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37]/40">
          Initialising orbit
        </span>
      </div>
    </div>
  ),
});

const FALLBACK: TickerItem[] = [
  { symbol: 'BTC',  price: 0, change24h: 0 },
  { symbol: 'ETH',  price: 0, change24h: 0 },
  { symbol: 'SOL',  price: 0, change24h: 0 },
  { symbol: 'USDC', price: 1, change24h: 0 },
];

async function getTickers(): Promise<TickerItem[]> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,usd-coin&vs_currencies=usd&include_24hr_change=true',
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return FALLBACK;
    const d = await res.json();
    return [
      { symbol: 'BTC',  price: d.bitcoin?.usd      ?? 0, change24h: d.bitcoin?.usd_24h_change      ?? 0 },
      { symbol: 'ETH',  price: d.ethereum?.usd     ?? 0, change24h: d.ethereum?.usd_24h_change     ?? 0 },
      { symbol: 'SOL',  price: d.solana?.usd        ?? 0, change24h: d.solana?.usd_24h_change        ?? 0 },
      { symbol: 'USDC', price: d['usd-coin']?.usd  ?? 1, change24h: d['usd-coin']?.usd_24h_change  ?? 0 },
    ];
  } catch {
    return FALLBACK;
  }
}

export default async function Home() {
  const tickers = await getTickers();

  return (
    <>
      <Suspense fallback={null}>
        <RefCapture />
      </Suspense>

      {/* 3D canvas — full viewport, behind everything */}
      <GlobeScene />

      {/* 2D HUD — floats above canvas */}
      <HUDOverlay tickers={tickers} />
    </>
  );
}
