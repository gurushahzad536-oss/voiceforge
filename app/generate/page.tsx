"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/useSession";
import { supabase } from "@/lib/supabaseClient";
import { LANGUAGES } from "@/lib/languages";
import Waveform from "@/components/Waveform";

type Voice = { id: string; name: string; ref_text: string };

export default function GeneratePage() {
  const { session, loading } = useSession();
  const router = useRouter();

  const [voices, setVoices] = useState<Voice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [cloneId, setCloneId] = useState("");
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<string>(LANGUAGES[0]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) router.push("/login?next=/generate");
  }, [loading, session, router]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      setVoicesLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voices`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (res.ok) {
        const data: Voice[] = await res.json();
        setVoices(data);
        if (data[0]) setCloneId(data[0].id);
      }
      setVoicesLoading(false);
    })();
  }, [session]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);
    setAudioUrl(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not logged in");

      const form = new FormData();
      form.append("clone_id", cloneId);
      form.append("text", text);
      form.append("language", language);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  const ready = cloneId !== "" && text.trim().length > 0 && status !== "loading";

  if (loading || !session) {
    return <section className="mx-auto max-w-3xl px-6 py-16 text-mute">Loading…</section>;
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">Generate</p>
      <h1 className="font-display text-4xl mb-2">Turn text into speech</h1>
      <p className="text-mute mb-2">Pick a clone, write a script, and get back audio in that voice.</p>
      <p className="font-mono text-xs text-mute mb-10">
        Best quality in English &amp; Mandarin — other languages depend on backend model support.
      </p>

      {voicesLoading ? (
        <p className="text-mute text-sm">Loading your voices…</p>
      ) : voices.length === 0 ? (
        <div className="rounded-lg border hairline bg-ink2 px-5 py-8 text-center">
          <p className="text-mute text-sm">
            No clones yet.{" "}
            <Link href="/clone" className="text-gold hover:underline">
              Create one first
            </Link>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleGenerate} className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-wider text-mute">Voice</span>
              <select
                value={cloneId}
                onChange={(e) => setCloneId(e.target.value)}
                className="mt-2 w-full rounded-sm border hairline bg-ink2 px-4 py-3 text-paper focus:border-gold outline-none"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-wider text-mute">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-2 w-full rounded-sm border hairline bg-ink2 px-4 py-3 text-paper focus:border-gold outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="font-mono text-xs uppercase tracking-wider text-mute">Script</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="Type or paste what you want this voice to say…"
              className="mt-2 w-full rounded-sm border hairline bg-ink2 px-4 py-3 text-paper placeholder:text-mute focus:border-gold outline-none resize-none"
            />
          </label>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!ready}
              className="rounded-sm bg-gold px-6 py-3 text-ink font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper transition-colors"
            >
              {status === "loading" ? "Generating…" : "Generate audio"}
            </button>
            {status === "error" && (
              <span className="font-mono text-sm text-coral">{errorMsg || "Something went wrong."}</span>
            )}
          </div>
        </form>
      )}

      {audioUrl && (
        <div className="mt-10 rounded-lg border hairline bg-ink2 px-6 py-6">
          <Waveform seed={text} bars={56} height={40} className="w-full h-10 mb-4" />
          <audio controls src={audioUrl} className="w-full" />
          <a
            href={audioUrl}
            download="generated.wav"
            className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-gold hover:text-paper transition-colors"
          >
            Download WAV
          </a>
        </div>
      )}
    </section>
  );
}
