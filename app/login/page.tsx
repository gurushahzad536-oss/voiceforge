"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">Welcome back</p>
      <h1 className="font-display text-4xl mb-2">Log in</h1>
      <p className="text-mute mb-10">Access your voices and generated audio.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-mute">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-sm border hairline bg-ink2 px-4 py-3 text-paper focus:border-gold outline-none"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-mute">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-sm border hairline bg-ink2 px-4 py-3 text-paper focus:border-gold outline-none"
          />
        </label>

        {error && <p className="font-mono text-sm text-coral">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-gold px-6 py-3 text-ink font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper transition-colors"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-mute">
        No account?{" "}
        <Link href="/signup" className="text-gold hover:underline">
          Sign up
        </Link>
      </p>
    </section>
  );
}
