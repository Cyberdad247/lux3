'use client';

import Image from 'next/image';
import { openTypeform } from '@/lib/typeformPopup';

export default function VipSection() {
  return (
    <section className="relative z-20 mt-[100svh] min-h-screen border-t border-white/10 bg-black">
      <div className="relative min-h-screen overflow-hidden">
        <Image
          src="/assets/vip-office.png"
          alt="Luxora VIP office"
          fill
          className="object-cover object-center opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.16)_0%,rgba(0,0,0,0.12)_45%,rgba(0,0,0,0.82)_100%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24">
          <div className="grid w-full gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-[10px] tracking-[0.55em] uppercase text-[var(--color-gold)]">V.I.P AREA</p>
              <h2 className="max-w-xl text-4xl font-extralight uppercase leading-[1.02] tracking-[0.08em] text-white sm:text-6xl">
                Speak with our team
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                We assist businesses with onboarding and high-value transactions.
              </p>
              <p className="max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                We can set up anyone in the world on any part of the globe. It pays to partner with Luxora.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={openTypeform}
                  className="pointer-events-auto rounded-full bg-[var(--color-gold)] px-7 py-3 text-[11px] font-bold tracking-[0.25em] uppercase text-black transition-transform hover:scale-[1.02]"
                >
                  Apply Now
                </button>
                <a
                  href="mailto:partners@luxorapayments.com"
                  className="rounded-full border border-white/15 px-7 py-3 text-[11px] font-semibold tracking-[0.22em] uppercase text-white/70 transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                >
                  partners@luxorapayments.com
                </a>
              </div>
            </div>

            <div className="relative flex min-h-[420px] items-center justify-center">
              <button
                onClick={openTypeform}
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-gold)] bg-black/70 px-9 py-4 text-sm font-bold tracking-[0.26em] uppercase text-[var(--color-gold)] shadow-[0_0_40px_rgba(212,175,55,0.24)] transition-transform hover:scale-[1.04]"
              >
                Open VIP Form
              </button>

              <div className="w-full max-w-lg rounded-[1.5rem] border border-white/10 bg-black/45 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <p className="text-[10px] tracking-[0.45em] uppercase text-white/35">Trusted by businesses preparing for the next crypto wave</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    'Close high-value buyers using crypto.',
                    'We make sure you never lose a serious buyer just because they want to pay in crypto.',
                    'Now onboarding a limited number of businesses ahead of the next market cycle.',
                    'Secure payment processing infrastructure for global operators.',
                  ].map((text) => (
                    <div key={text} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/65">
                      {text}
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-white/10 pt-4 text-[10px] tracking-[0.3em] uppercase text-white/30">
                  DONT MISS THE NEXT WAVE OF PAYMENTS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
