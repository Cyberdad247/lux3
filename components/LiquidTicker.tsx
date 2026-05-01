'use client';

export interface TickerItem {
  symbol: string;
  price: number;
  change24h: number;
}

export default function LiquidTicker({ tickers }: { tickers: TickerItem[] }) {
  return null; // Ticker is embedded in HUDOverlay for this layout
}
