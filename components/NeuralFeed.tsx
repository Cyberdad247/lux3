'use client';

import { useEffect, useRef, useState } from 'react';

type EventStatus = 'COMPLETE' | 'PASS' | 'ACTIVE' | 'STREAMING' | 'PENDING';

interface AgentEvent {
  id: string;
  agent: string;
  action: string;
  target: string;
  status: EventStatus;
  elapsed: string;
}

const SEED_EVENTS: AgentEvent[] = [
  { id: 'e01', agent: 'FORGE',    action: 'BUILD',     target: 'SovereignPage.tsx',       status: 'COMPLETE',  elapsed: '0:12' },
  { id: 'e02', agent: 'SENTINEL', action: 'AUDIT',     target: 'Phase 2 DNA spec',        status: 'PASS',      elapsed: '0:18' },
  { id: 'e03', agent: 'ANYA',     action: 'INGEST',    target: 'BriefingScript v1.0',     status: 'COMPLETE',  elapsed: '0:31' },
  { id: 'e04', agent: 'MERLIN',   action: 'ORACLE',    target: 'Task DAG Phase 3',        status: 'COMPLETE',  elapsed: '0:47' },
  { id: 'e05', agent: 'DEBUG',    action: 'TEST',      target: 'LiquidKinetic EMA decay', status: 'PASS',      elapsed: '1:02' },
  { id: 'e06', agent: 'CODEX',    action: 'BUNDLE',    target: 'WebGLHero gate <160kB',   status: 'PASS',      elapsed: '1:28' },
  { id: 'e07', agent: 'APIS',     action: 'FORAGE',    target: 'CoinGecko ticker stream',  status: 'STREAMING', elapsed: '1:44' },
  { id: 'e08', agent: 'HELIO',    action: 'BURST',     target: 'Gemini 2.5 Pro 1M ctx',   status: 'STREAMING', elapsed: '2:01' },
];

const CYCLE_EVENTS: Omit<AgentEvent, 'id' | 'elapsed'>[] = [
  { agent: 'SENTINEL', action: 'AUDIT',      target: 'MCPGateway XSS gate',         status: 'PASS'      },
  { agent: 'MERLIN',   action: 'SYNTHESIZE', target: 'SITE_3_DNA.json v1.0',        status: 'COMPLETE'  },
  { agent: 'APIS',     action: 'SYNC',       target: 'NotebookLM 138 notebooks',    status: 'COMPLETE'  },
  { agent: 'DEBUG',    action: 'TEST',       target: 'TelemetryGrid render cycle',  status: 'PASS'      },
  { agent: 'FORGE',    action: 'ARCHIVE',    target: 'Globe → .hive/archive',       status: 'COMPLETE'  },
  { agent: 'ANYA',     action: 'GATE',       target: 'Harmony Gate Phase 3',        status: 'ACTIVE'    },
  { agent: 'LINK',     action: 'ROUTE',      target: 'OmniRoute :20128 60+ pools',  status: 'STREAMING' },
  { agent: 'GHOST',    action: 'ISOLATE',    target: 'Air-gap privacy scan',        status: 'COMPLETE'  },
  { agent: 'SENTINEL', action: 'PASS',       target: 'DNA_MANIFEST cross-ref',      status: 'PASS'      },
  { agent: 'MERLIN',   action: 'CRYSTAL',    target: 'UKG νKG Crystal emit',        status: 'COMPLETE'  },
];

const STATUS_COLORS: Record<EventStatus, string> = {
  COMPLETE:  'text-white/30',
  PASS:      'text-emerald-400/60',
  ACTIVE:    'text-[#D4AF37]',
  STREAMING: 'text-sky-400/60',
  PENDING:   'text-white/20',
};

const AGENT_COLORS: Record<string, string> = {
  FORGE:    'text-[#D4AF37]',
  SENTINEL: 'text-emerald-400/70',
  ANYA:     'text-violet-400/70',
  MERLIN:   'text-sky-400/70',
  DEBUG:    'text-orange-400/70',
  CODEX:    'text-cyan-400/70',
  APIS:     'text-pink-400/70',
  HELIO:    'text-blue-400/70',
  LINK:     'text-indigo-400/70',
  GHOST:    'text-slate-400/70',
};

export default function NeuralFeed() {
  const [events, setEvents] = useState<AgentEvent[]>(SEED_EVENTS);
  const counterRef = useRef(SEED_EVENTS.length);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cycleIndex = 0;
    const interval = setInterval(() => {
      const template = CYCLE_EVENTS[cycleIndex % CYCLE_EVENTS.length];
      const totalSecs = ++counterRef.current * 4;
      const elapsed = `${Math.floor(totalSecs / 60)}:${String(totalSecs % 60).padStart(2, '0')}`;

      setEvents(prev => {
        const next = [...prev, { ...template, id: `e${String(counterRef.current).padStart(2, '0')}`, elapsed }];
        return next.length > 20 ? next.slice(-20) : next;
      });
      cycleIndex++;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="flex flex-col h-full min-h-[280px]">
      <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-3 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
        <span className="text-[9px] tracking-[0.45em] text-[#D4AF37] uppercase font-semibold">Neural Feed</span>
        <span className="ml-auto text-[8px] tracking-widest text-white/20 uppercase font-mono">
          Live · {events.length} events
        </span>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
      >
        {events.map((ev) => (
          <div
            key={ev.id}
            className="grid gap-2 px-4 sm:px-5 py-2 border-b border-white/[0.03] text-[10px] font-mono hover:bg-white/[0.02] transition-colors duration-200"
            style={{ gridTemplateColumns: '3rem 5rem minmax(0,1fr) 4.5rem' }}
          >
            <span className="text-white/20 tabular-nums">{ev.elapsed}</span>
            <span className={AGENT_COLORS[ev.agent] ?? 'text-white/50'}>{ev.agent}</span>
            <span className="min-w-0 truncate text-white/50">
              <span className="text-white/35">{ev.action}</span>
              <span className="hidden sm:inline text-white/20"> / </span>
              <span className="hidden sm:inline">{ev.target}</span>
            </span>
            <span className={`text-right ${STATUS_COLORS[ev.status]}`}>{ev.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
