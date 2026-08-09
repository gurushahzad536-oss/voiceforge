"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useSession";
import { supabase } from "@/lib/supabaseClient";
import { LANGUAGES } from "@/lib/languages";
import Waveform from "@/components/Waveform";

type Mode = "upload" | "record";

export default function ClonePage() {
  const { session, loading } = useSession();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [cloneName, setCloneName] = useState("");
  const [language, setLanguage] = useState<string>(LANGUAGES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!loading && !session) router.push("/login?next=/clone");
  }, [loading, session, router]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      setFileName(file.name);
    }
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setFileName(file.name);
    }
  }

  async function startRecording() {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordedBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordedSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordedSeconds((s) => {
          if (s >= 30) {
            stopRecording();
            return s;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setErrorMsg("Microphone access denied or unavailable. Try \"Upload audio\" instead.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function toggleRecording() {
    if (isRecording) stopRecording();
    else startRecording();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not logged in");

      const form = new FormData();
      form.append("name", cloneName);
      form.append("ref_text", "");
      form.append("language", language);

      if (mode === "upload" && uploadedFile) {
        form.append("audio", uploadedFile);
      } else if (mode === "record" && recordedBlob) {
        form.append("audio", recordedBlob, "recording.webm");
      } else {
        throw new Error("No audio provided");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clone`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  const ready =
    cloneName.trim().length > 0 &&
    ((mode === "upload" && uploadedFile !== null) ||
      (mode === "record" && recordedBlob !== null));

  if (loading || !session) {
    return <section className="mx-auto max-w-3xl px-6 py-16 text-mute">Loading…</section>;
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">Step 1 of 1</p>
      <h1 className="font-display text-4xl mb-2">Clone a voice</h1>
      <p className="text-mute mb-10">
        Give it a clean 10–30 second sample. Background noise or music will lower clone quality.
      </p>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <div className="flex gap-2 mb-4 font-mono text-xs uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`rounded-sm px-4 py-2 border hairline transition-colors ${
                mode === "upload" ? "bg-gold text-ink border-gold" : "text-mute hover:text-paper"
              }`}
            >
              Upload audio
            </button>
            <button
              type="button"
              onClick={() => setMode("record")}
              className={`rounded-sm px-4 py-2 border hairline transition-colors ${
                mode === "record" ? "bg-gold text-ink border-gold" : "text-mute hover:text-paper"
              }`}
            >
              Record audio
            </button>
          </div>

          {mode === "upload" ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-lg border-2 border-dashed hairline bg-ink2 px-6 py-14 text-center hover:border-gold transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFilePick}
              />
              {fileName ? (
                <p className="font-mono text-sm text-paper">{fileName}</p>
              ) : (
                <>
                  <p className="font-display text-xl mb-1">Drop an audio file here</p>
                  <p className="text-mute text-sm">or click to browse — MP3, WAV, or M4A</p>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-lg border hairline bg-ink2 px-6 py-10 text-center">
              <Waveform
                seed={`recording ${recordedSeconds}`}
                bars={48}
                height={48}
                className="w-full h-12 mb-6"
                color={isRecording ? "#FF6B5B" : "#3A3856"}
              />
              <button
                type="button"
                onClick={toggleRecording}
                className={`rounded-full w-16 h-16 mx-auto flex items-center justify-center border-2 transition-colors ${
                  isRecording ? "border-coral bg-coral/10" : "border-gold hover:bg-gold/10"
                }`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                <span
                  className={isRecording ? "w-4 h-4 bg-coral rounded-sm" : "w-4 h-4 bg-gold rounded-full"}
                />
              </button>
              <p className="mt-4 font-mono text-sm text-mute">
                {isRecording
                  ? `Recording — ${recordedSeconds}s / 30s`
                  : recordedBlob
                  ? "Recording captured — ready to submit"
                  : "Tap to start recording"}
              </p>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-wider text-mute">Clone name</span>
            <input
              value={cloneName}
              onChange={(e) => setCloneName(e.target.value)}
              placeholder="e.g. Narrator — warm"
              className="mt-2 w-full rounded-sm border hairline bg-ink2 px-4 py-3 text-paper placeholder:text-mute focus:border-gold outline-none"
            />
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

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={!ready || status === "submitting"}
            className="rounded-sm bg-gold px-6 py-3 text-ink font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper transition-colors"
          >
            {status === "submitting" ? "Creating clone…" : "Create clone"}
          </button>
          {status === "done" && (
            <span className="font-mono text-sm text-gold">Clone created — check the dashboard.</span>
          )}
          {status === "error" && (
            <span className="font-mono text-sm text-coral">{errorMsg || "Something went wrong."}</span>
          )}
        </div>
        {errorMsg && status !== "error" && (
          <p className="font-mono text-xs text-coral">{errorMsg}</p>
        )}
      </form>
    </section>
  );
}
