import { Suspense } from 'react';
import RefCapture from '@/components/RefCapture';
import NeuralFeed from '@/components/NeuralFeed';
import AgentTerminal from '@/components/AgentTerminal';
import MCPGateway from '@/components/MCPGateway';
import TelemetryGrid from '@/components/TelemetryGrid';

// ISR: revalidate 60s — static shell renders instantly, client islands hydrate after
export default async function Home() {
  return (
    <main className="relative isolate min-h-screen flex flex-col overflow-x-hidden bg-[#000000]">
      <Suspense fallback={null}><RefCapture /></Suspense>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(212,175,55,0.16)_0%,rgba(212,175,55,0.045)_34%,transparent_68%)]" />
        <div className="absolute left-1/2 top-[8%] h-[56vw] max-h-[620px] min-h-[300px] w-[56vw] min-w-[300px] max-w-[620px] -translate-x-1/2 rounded-full border border-[#D4AF37]/15 shadow-[0_0_90px_rgba(212,175,55,0.12),inset_0_0_80px_rgba(212,175,55,0.06)]" />
        <div className="absolute left-1/2 top-[17%] h-[36vw] max-h-[420px] min-h-[220px] w-[36vw] min-w-[220px] max-w-[420px] -translate-x-1/2 rotate-12 rounded-full border border-white/[0.06]" />
        <div className="absolute inset-x-[-10%] bottom-[34%] h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      </div>

      {/* Nexus header strip */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-[10px] tracking-[0.5em] text-[#D4AF37] uppercase font-semibold">Nexus</span>
        </div>
        <span className="hidden sm:block text-[9px] tracking-[0.3em] text-white/15 uppercase font-mono">
          Camelot-OS v400.1.0 · LATTICE_RADIANT
        </span>
        <span className="text-[8px] sm:text-[9px] tracking-[0.14em] sm:tracking-[0.25em] text-white/20 uppercase">Sovereign Ops</span>
      </header>

      {/* Main content grid — NeuralFeed (3 cols) + TelemetryGrid (2 cols) */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-5 border-b border-white/[0.05]">
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-white/[0.05]">
          <NeuralFeed />
        </div>
        <div className="lg:col-span-2">
          <TelemetryGrid />
        </div>
      </div>

      {/* Bottom row — AgentTerminal + MCPGateway */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2">
        <div className="border-b md:border-b-0 md:border-r border-white/[0.05]">
          <AgentTerminal />
        </div>
        <MCPGateway />
      </div>
    </main>
  );
}
