'use client';

import { useEffect, useState } from 'react';

type StreamStatus = 'CONNECTED' | 'STREAMING' | 'IDLE' | 'DARK';

interface Stream {
  id: string;
  label: string;
  protocol: string;
  status: StreamStatus;
  latency: string;
}

// Security: no API keys, credentials, or tokens in this component.
// All data is static connection-status display only.
const STREAMS: Stream[] = [
  { id: 'omniroute',  label: 'OmniRoute',     protocol: ':20128', status: 'STREAMING', latency: '<1ms' },
  { id: 'notebooklm', label: 'NotebookLM ST', protocol: 'MCP',    status: 'CONNECTED', latency: '89ms' },
  { id: 'supabase',   label: 'Supabase',      protocol: 'REST',   status: 'CONNECTED', latency: '35ms' },
  { id: 'github',     label: 'GitHub',        protocol: 'REST',   status: 'CONNECTED', latency: '42ms' },
  { id: 'qdrant',     label: 'Qdrant',        protocol: ':6333',  status: 'IDLE',      latency: '--'   },
  { id: 'jira',       label: 'Jira',          protocol: 'ATC',    status: 'STREAMING', latency: '61ms' },
];

const STATUS_DOT: Record<StreamStatus, string> = {
  CONNECTED: 'bg-emerald-400/70',
  STREAMING: 'bg-[#D4AF37] animate-pulse',
  IDLE:      'bg-white/20',
  DARK:      'bg-red-400/50',
};

const STATUS_LABEL: Record<StreamStatus, string> = {
  CONNECTED: 'text-emerald-400/60',
  STREAMING: 'text-[#D4AF37]',
  IDLE:      'text-white/20',
  DARK:      'text-red-400/50',
};

export default function MCPGateway() {
  const [, setTick] = useState(0);

  // Periodic tick to keep latency display fresh-feeling
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const activeCount = STREAMS.filter(s => s.status !== 'DARK' && s.status !== 'IDLE').length;

  return (
    <div className="flex flex-col h-full min-h-[200px]">
      <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-3 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-sky-400/70 animate-pulse" />
        <span className="text-[9px] tracking-[0.45em] text-white/40 uppercase font-semibold">MCP Gateway</span>
        <span className="ml-auto text-[8px] tracking-widest text-white/20 uppercase font-mono">
          {activeCount} / {STREAMS.length} active
        </span>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3">
        {STREAMS.map((s) => (
          <div key={s.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:grid-cols-[auto_minmax(0,7rem)_auto_auto_auto] items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[s.status]}`} />
            <span className="text-[11px] text-white/50 font-mono truncate">{s.label}</span>
            <span className="hidden sm:inline text-[9px] text-white/20 tracking-wider font-mono">{s.protocol}</span>
            <span className={`text-[9px] font-mono tabular-nums ${STATUS_LABEL[s.status]}`}>
              {s.status}
            </span>
            <span className="text-[9px] text-white/20 font-mono tabular-nums w-10 text-right">{s.latency}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
