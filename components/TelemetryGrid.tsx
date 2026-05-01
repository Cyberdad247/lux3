'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

interface Metric {
  label: string;
  value: number;
  suffix: string;
  decimals: number;
  sub: string;
}

const METRICS: Metric[] = [
  { label: 'Active Knights', value: 9,     suffix: '',   decimals: 0, sub: 'All sectors online'     },
  { label: 'Tasks Complete', value: 4847,  suffix: '',   decimals: 0, sub: 'Session aggregate'      },
  { label: 'Avg Response',   value: 284,   suffix: 'ms', decimals: 0, sub: 'Doherty target < 400ms' },
  { label: 'Uptime',         value: 99.97, suffix: '%',  decimals: 2, sub: 'Institutional SLA'      },
];

const EASE_FLUID = [0.22, 1, 0.36, 1] as const;

function MetricCard({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const ctrl = animate(0, metric.value, {
      duration: 2.2,
      ease: EASE_FLUID,
      onUpdate: (v) => {
        el.textContent = v.toFixed(metric.decimals) + metric.suffix;
      },
    });
    return () => ctrl.stop();
  }, [inView, metric]);

  return (
    <div className="flex min-w-0 flex-col gap-2 p-4 sm:p-5 border-b border-r border-white/[0.05] last:border-r-0 even:border-r-0 sm:even:border-r sm:last:border-r-0">
      <p className="truncate text-[8px] sm:text-[9px] tracking-[0.18em] sm:tracking-[0.4em] text-white/25 uppercase font-medium">{metric.label}</p>
      <div
        className="text-2xl font-extralight text-[#D4AF37] leading-none"
        style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}
      >
        <span ref={ref}>0{metric.suffix}</span>
      </div>
      <p className="text-[8px] text-white/20 tracking-normal sm:tracking-wider">{metric.sub}</p>
    </div>
  );
}

export default function TelemetryGrid() {
  return (
    <div className="flex flex-col h-full min-h-[280px]">
      <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-3 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        <span className="text-[9px] tracking-[0.45em] text-[#D4AF37] uppercase font-semibold">Telemetry</span>
        <span className="ml-auto text-[8px] tracking-widest text-white/20 uppercase font-mono">Real-time</span>
      </div>

      <div className="flex-1 grid grid-cols-2">
        {METRICS.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </div>
    </div>
  );
}
