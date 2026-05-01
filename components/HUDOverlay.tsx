'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Activity, Zap, Shield, Globe } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { openTypeform } from '@/lib/typeformPopup';
import type { TickerItem } from './LiquidTicker';

interface Props {
  tickers: TickerItem[];
}

function fmt(n: number) {
  if (n > 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function useCounter(target: number, duration = 2400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

const NAV = ['Protocol', 'Network', 'Terminal'];

export default function HUDOverlay({ tickers }: Props) {
  const btc  = tickers.find(t => t.symbol === 'BTC');
  const eth  = tickers.find(t => t.symbol === 'ETH');
  const vol  = useCounter(2_400_000_000, 2800);
  const txns = useCounter(14_892, 2200);
  const { scrollYProgress } = useScroll();
  const introOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.12], [0, -40]);

  return (
    <>
      {/* ── Fixed header bezel ── */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 py-4 pointer-events-none">
        <nav className="mx-auto max-w-7xl flex items-center justify-between pointer-events-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative w-9 h-9">
              <Image src="/assets/logo.png" alt="Luxora" fill className="object-contain" sizes="36px" />
            </div>
            <span className="text-white font-extralight tracking-[0.32em] text-xs uppercase">
              Luxora Payments
            </span>
          </div>

          {/* Nav pill */}
          <div
            className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full hud-glass fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            {NAV.map(n => (
              <button key={n}
                className="px-4 py-1.5 text-[11px] font-light tracking-[0.2em] uppercase text-white/50
                           hover:text-white rounded-full transition-colors duration-200 cursor-pointer"
              >
                {n}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end text-right">
              <span className="text-[9px] font-light tracking-[0.3em] uppercase text-white/35">
                Instant global payments
              </span>
              <a href="mailto:partners@luxorapayments.com" className="text-[10px] tracking-[0.18em] text-[#D4AF37]">
                partners@luxorapayments.com
              </a>
              <span className="text-[9px] tracking-[0.24em] uppercase text-white/30">Contact : partners@luxorapayments.com</span>
            </div>
            <button
              onClick={openTypeform}
              className="fade-up relative flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px]
                         font-light tracking-[0.2em] uppercase text-black cursor-pointer
                         transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
              style={{
                animationDelay: '0.6s',
                background: 'linear-gradient(135deg, #D4AF37 0%, #E8D48B 50%, #D4AF37 100%)',
              }}
            >
              <span className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: 'rgba(212,175,55,0.5)', animationDuration: '2.2s' }} />
              Apply Now
            </button>
          </div>
        </nav>
      </header>

      {/* ── Centre hero copy ── */}
      <motion.div
        className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
        style={{ opacity: introOpacity, y: introY }}
      >
        <div className="text-center px-6 max-w-3xl">
          <div className="fade-up flex items-center justify-center gap-3 mb-8" style={{ animationDelay: '0.8s' }}>
            <div className="w-8 h-px bg-[#D4AF37]/50" />
            <span className="text-[10px] font-light tracking-[0.45em] uppercase text-[#D4AF37]/70">
              Sovereign Network · 5 Global Nodes
            </span>
            <div className="w-8 h-px bg-[#D4AF37]/50" />
          </div>

          <h1
            className="fade-up font-extralight tracking-[0.08em] uppercase leading-[1.05] mb-6"
            style={{
              animationDelay: '1.0s',
              fontSize: 'clamp(2rem, 5vw + 0.5rem, 4.5rem)',
            }}
          >
            <span className="text-white">The Sovereign</span>
            <br />
            <em className="not-italic" style={{ color: '#D4AF37', fontStyle: 'italic' }}>
              Liquidity Network.
            </em>
          </h1>

          <p
            className="fade-up font-light tracking-[0.06em] text-white/50 mb-10"
            style={{
              animationDelay: '1.2s',
              fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
            }}
          >
            We assist businesses with onboarding and high-value transactions.<br />
            We can set up anyone in the world on any part of the globe. It pays to partner with Luxora.
          </p>

          <button
            onClick={openTypeform}
            className="fade-up pointer-events-auto relative inline-flex items-center gap-3 px-8 py-4
                       rounded-full font-light tracking-[0.2em] uppercase text-sm text-black cursor-pointer
                       transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_50px_rgba(212,175,55,0.45)]"
            style={{
              animationDelay: '1.4s',
              background: 'linear-gradient(135deg, #D4AF37 0%, #E8D48B 40%, #D4AF37 100%)',
            }}
          >
            <span className="absolute inset-0 rounded-full animate-ping opacity-15"
              style={{ background: 'rgba(212,175,55,0.5)', animationDuration: '2.4s' }} />
            <Globe size={15} />
            Apply Now
          </button>

          <div className="fade-up pointer-events-auto mt-8 grid gap-4 rounded-2xl border border-white/[0.08] bg-black/30 px-5 py-4 text-left sm:grid-cols-[1.2fr_0.8fr]"
            style={{ animationDelay: '1.55s' }}>
            <div className="space-y-1">
              <div className="text-[10px] tracking-[0.35em] uppercase text-white/35">Speak with our team</div>
              <div className="text-sm text-white/70">We assist businesses with onboarding and high-value transactions.</div>
              <div className="text-[10px] tracking-[0.28em] uppercase text-white/35">
                DONT MISS THE NEXT WAVE OF PAYMENTS
              </div>
            </div>
            <div className="space-y-2 sm:text-right">
              <div className="text-[10px] tracking-[0.35em] uppercase text-white/35">Contact us at</div>
              <a className="block text-[var(--color-gold)] hover:underline" href="mailto:partners@luxorapayments.com">
                partners@luxorapayments.com
              </a>
              <a className="block text-[var(--color-gold)] hover:underline" href="mailto:onboarding@luxorapayments.com">
                onboarding@luxorapayments.com
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Left HUD panel — Live Network Load ── */}
      <div
        className="fixed left-6 top-1/2 -translate-y-1/2 z-20 w-56 p-5 rounded-2xl hud-glass
                   fade-up platinum-leak hidden lg:block"
        style={{ animationDelay: '1.6s' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-[#D4AF37]" />
            <span className="text-[9px] font-light tracking-[0.3em] uppercase text-white/40">
              Network Load
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] text-emerald-400/80 font-mono">Live</span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'NYC → LON',  pct: 94, lat: '0.4ms' },
            { label: 'LON → ZUR',  pct: 78, lat: '0.2ms' },
            { label: 'ZUR → TOK',  pct: 61, lat: '0.8ms' },
            { label: 'TOK → SIN',  pct: 88, lat: '0.3ms' },
          ].map(({ label, pct, lat }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <span style={{ fontFamily: "'Space Mono', monospace" }}
                  className="text-[9px] text-white/50 tracking-[0.1em]">{label}</span>
                <span style={{ fontFamily: "'Space Mono', monospace" }}
                  className="text-[9px] text-[#D4AF37]/80 data-flicker">{lat}</span>
              </div>
              <div className="h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, #D4AF37, #E8D48B)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/[0.05]">
          <div className="flex justify-between">
            <span className="text-[9px] font-light tracking-[0.2em] uppercase text-white/25">Nodes Active</span>
            <span style={{ fontFamily: "'Space Mono', monospace" }}
              className="text-[10px] text-[#D4AF37]/80 data-flicker">5 / 5</span>
          </div>
        </div>
      </div>

      {/* ── Right HUD panel — Settlement Volume ── */}
      <div
        className="fixed right-6 top-1/2 -translate-y-1/2 z-20 w-56 p-5 rounded-2xl hud-glass
                   fade-up platinum-leak hidden lg:block"
        style={{ animationDelay: '1.8s' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-[#D4AF37]" />
            <span className="text-[9px] font-light tracking-[0.3em] uppercase text-white/40">
              Settlement Volume
            </span>
          </div>
        </div>

        {/* Big counter */}
        <div className="mb-4">
          <div className="text-white font-extralight tracking-[0.06em] data-flicker"
            style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)' }}>
            ${(vol / 1_000_000_000).toFixed(2)}B
          </div>
          <div className="text-[9px] font-light tracking-[0.2em] uppercase text-white/25 mt-0.5">
            USD equivalent · 24h
          </div>
        </div>

        <div className="space-y-3">
          {btc && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <span className="text-[8px] text-[#D4AF37]">₿</span>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace" }}
                  className="text-[10px] text-white/50 tracking-[0.1em]">BTC</span>
              </div>
              <div className="text-right">
                <div style={{ fontFamily: "'Space Mono', monospace" }}
                  className="text-[11px] text-white">{fmt(btc.price)}</div>
                <div className={`text-[9px] font-mono ${btc.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {btc.change24h >= 0 ? '+' : ''}{btc.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          )}
          {eth && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <span className="text-[8px] text-[#D4AF37]">Ξ</span>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace" }}
                  className="text-[10px] text-white/50 tracking-[0.1em]">ETH</span>
              </div>
              <div className="text-right">
                <div style={{ fontFamily: "'Space Mono', monospace" }}
                  className="text-[11px] text-white">{fmt(eth.price)}</div>
                <div className={`text-[9px] font-mono ${eth.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {eth.change24h >= 0 ? '+' : ''}{eth.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-white/[0.05]">
          <div className="flex justify-between">
            <span className="text-[9px] font-light tracking-[0.2em] uppercase text-white/25">Tx Settled</span>
            <span style={{ fontFamily: "'Space Mono', monospace" }}
              className="text-[10px] text-[#D4AF37]/80 data-flicker">
              {txns.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom status strip ── */}
      <div
        className="fixed bottom-0 inset-x-0 z-20 px-6 py-3 border-t border-white/[0.05]
                   fade-up"
        style={{
          animationDelay: '2.0s',
          background: 'rgba(1,1,1,0.8)',
          backdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Left — node status */}
          <div className="flex items-center gap-6">
            {['NYC · NY-04', 'LON · UK-02', 'ZUR · CH-01', 'TOK · JP-03', 'SIN · SG-01'].map(n => (
              <div key={n} className="hidden md:flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span style={{ fontFamily: "'Space Mono', monospace" }}
                  className="text-[9px] text-white/30 tracking-[0.15em]">{n}</span>
              </div>
            ))}
          </div>

          {/* Right — integrity */}
          <div className="flex items-center gap-3">
            <Shield size={10} className="text-[#D4AF37]/60" />
            <span className="text-[9px] font-light tracking-[0.25em] uppercase text-white/25">
              Chain Integrity · Verifying
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          </div>
        </div>
      </div>
    </>
  );
}
