import Link from "next/link";
import Waveform from "@/components/Waveform";

const steps = [
  {
    n: "01",
    title: "Upload a sample",
    body: "10 to 30 seconds of clean speech is enough. Record it in the browser or drop in a file.",
  },
  {
    n: "02",
    title: "We clone the voice",
    body: "The sample is cleaned, trimmed, and turned into a voice profile you can reuse.",
  },
  {
    n: "03",
    title: "Generate any script",
    body: "Type or paste text, pick the clone, and get back a WAV or MP3 in that voice.",
  },
];

const features = [
  { label: "Languages", value: "Multiple, auto-detected" },
  { label: "Output", value: "WAV · MP3" },
  { label: "Controls", value: "Speed · pitch · pauses" },
  { label: "History", value: "Every generation saved" },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <p className="font-mono text-xs uppercase tracking-widest text-gold mb-6">
          Voice cloning, self-hosted or free tier
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] max-w-3xl">
          Say it once.
          <br />
          <span className="italic text-mute">Let the clone</span> say it forever.
        </h1>
        <p className="mt-6 max-w-xl text-mute text-lg">
          VoiceForge turns a short recording into a reusable voice. Write any
          script afterward and it comes back spoken in that same voice —
          in seconds, not studio time.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/clone"
            className="rounded-sm bg-gold px-6 py-3 text-ink font-semibold hover:bg-paper transition-colors"
          >
            Clone your first voice
          </Link>
          <Link
            href="/dashboard"
            className="rounded-sm border hairline px-6 py-3 hover:border-mute transition-colors"
          >
            View dashboard
          </Link>
        </div>

        <div className="mt-16 rounded-lg border hairline bg-ink2 px-8 py-10">
          <Waveform
            seed="say it once let the clone say it forever"
            bars={72}
            height={72}
            className="w-full h-16"
          />
          <p className="mt-4 font-mono text-xs text-mute">
            ↑ this shape is drawn from the sentence above — every clone starts as a waveform like this
          </p>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="font-mono text-sm text-coral">{s.n}</span>
                <h3 className="font-display text-2xl mt-3 mb-2">{s.title}</h3>
                <p className="text-mute text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-line rounded-lg overflow-hidden">
            {features.map((f) => (
              <div key={f.label} className="bg-ink px-6 py-8">
                <p className="font-mono text-xs uppercase tracking-widest text-mute">
                  {f.label}
                </p>
                <p className="font-display text-xl mt-2">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t hairline">
        <div className="mx-auto max-w-6xl px-6 py-10 flex items-center justify-between text-xs text-mute font-mono">
          <span>VoiceForge</span>
          <span>Built on F5-TTS &amp; Vocos</span>
        </div>
      </footer>
    </>
  );
}
