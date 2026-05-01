'use client';

import { useEffect, useRef, useState } from 'react';

const BOOT_LINES = [
  '> CAMELOT_OS v400.1.0 — LATTICE_RADIANT',
  '> Booting NEXUS terminal...',
  '> Knight roster: 9 / 9 ONLINE',
  '> OmniRoute :20128 — ACTIVE (60+ providers)',
  '> MCP Edge :3001 — ACTIVE',
  '> Integration Brain ST — 138 notebooks loaded',
  '> Control Plane :8080 — LIVE',
  '> Sentinel pass rate — 99.7%',
  '> HARMONY GATE — ARMED',
  '> SYSTEM STATE: SOVEREIGN ■',
];

const IDLE_PROMPTS = [
  '> Watching for //FORGE commands...',
  '> BASHR loop idle — awaiting input.',
  '> Triple-QFT stack: READY.',
  '> Ouroboros memory: compressed.',
  '> Context budget: 7.4 GB / 7.8 GB',
  '> Anya gate: OPEN.',
  '> NDR+S: hypothesize phase clear.',
  '> Harmony Gate: 12/12 checks armed.',
];

export default function AgentTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [cursor, setCursor] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let bootTimer: ReturnType<typeof setTimeout>;
    let idleInterval: ReturnType<typeof setInterval> | undefined;
    let i = 0;
    let j = 0;

    const addBootLine = () => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i++]]);
        bootTimer = setTimeout(addBootLine, 120 + Math.random() * 80);
      } else {
        idleInterval = setInterval(() => {
          setLines(prev => {
            const next = [...prev, IDLE_PROMPTS[j++ % IDLE_PROMPTS.length]];
            return next.length > 18 ? next.slice(-18) : next;
          });
        }, 5200);
      }
    };

    bootTimer = setTimeout(addBootLine, 300);
    return () => {
      clearTimeout(bootTimer);
      if (idleInterval) clearInterval(idleInterval);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    const t = setInterval(() => setCursor(c => !c), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col h-full min-h-[200px]">
      <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-3 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
        <span className="text-[9px] tracking-[0.45em] text-white/40 uppercase font-semibold">Agent Terminal</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed"
        style={{ scrollbarWidth: 'none' }}
      >
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={
              line.includes('SOVEREIGN') || line.includes('ONLINE') || line.includes('ARMED')
                ? 'text-[#D4AF37]'
                : 'text-white/45'
            }
          >
            {line}
          </div>
        ))}
        <div className="text-[#D4AF37] select-none">{cursor ? '▋' : ' '}</div>
      </div>
    </div>
  );
}
