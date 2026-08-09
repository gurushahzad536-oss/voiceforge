import Link from "next/link";
import Waveform from "@/components/Waveform";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-6 py-32 text-center">
      <Waveform
        seed="page not found"
        bars={40}
        height={40}
        className="w-full h-10 mb-8 opacity-60"
        color="#3A3856"
      />
      <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">404</p>
      <h1 className="font-display text-4xl mb-4">This page went quiet.</h1>
      <p className="text-mute mb-8">
        Nothing's here — the link may be broken, or the page moved.
      </p>
      <Link
        href="/"
        className="inline-block rounded-sm bg-gold px-6 py-3 text-ink font-semibold hover:bg-paper transition-colors"
      >
        Back home
      </Link>
    </section>
  );
}
