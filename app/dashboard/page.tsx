"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/useSession";
import Waveform from "@/components/Waveform";

type Voice = { id: string; name: string; created_at?: string };

export default function Dashboard() {
  const { session, loading } = useSession();
  const router = useRouter();
  const [clones, setClones] = useState<Voice[]>([]);
  const [clonesLoading, setClonesLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) router.push("/login?next=/dashboard");
  }, [loading, session, router]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      setClonesLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voices`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (res.ok) setClones(await res.json());
      } finally {
        setClonesLoading(false);
      }
    })();
  }, [session]);

  if (loading || !session) {
    return <section className="mx-auto max-w-6xl px-6 py-16 text-mute">Loading…</section>;
  }

  const usage = [
    { label: "Signed in as", value: session.user.email ?? "—", of: "" },
    { label: "Voice clones", value: String(clones.length), of: "" },
    { label: "Generations this month", value: "—", of: "not tracked yet" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-2">Dashboard</p>
          <h1 className="font-display text-4xl">Your voices &amp; audio</h1>
        </div>
        <Link
          href="/clone"
          className="rounded-sm bg-gold px-5 py-2.5 text-ink font-semibold hover:bg-paper transition-colors"
        >
          New clone
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-px bg-line rounded-lg overflow-hidden mb-16">
        {usage.map((u) => (
          <div key={u.label} className="bg-ink px-6 py-6">
            <p className="font-mono text-xs uppercase tracking-wider text-mute">{u.label}</p>
            <p className="font-display text-2xl mt-2 truncate">
              {u.value} <span className="text-mute text-base font-body">{u.of}</span>
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-2xl mb-6">Your clones</h2>
        {clonesLoading ? (
          <p className="text-mute text-sm">Loading…</p>
        ) : clones.length === 0 ? (
          <div className="rounded-lg border hairline bg-ink2 px-5 py-8 text-center">
            <p className="text-mute text-sm">
              No clones yet.{" "}
              <Link href="/clone" className="text-gold hover:underline">
                Create your first one
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-3">
            {clones.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border hairline bg-ink2 px-5 py-4 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="font-body font-medium truncate">{c.name}</p>
                  <Link
                    href={`/generate?clone=${c.id}`}
                    className="font-mono text-xs text-gold hover:underline mt-1 inline-block"
                  >
                    Generate with this voice →
                  </Link>
                </div>
                <Waveform seed={c.name} bars={18} height={28} className="w-20 h-7 shrink-0" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
