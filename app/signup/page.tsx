"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-3xl mb-4">Check your email</h1>
        <p className="text-mute">
          We sent a confirmation link to <span className="text-paper">{email}</span>. Click it, then{" "}
          <Link href="/login" className="text-gold hover:underline">
            log in
          </Link>
          .
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">Get started</p>
      <h1 className="font-display text-4xl mb-2">Create an account</h1>
      <p className="text-mute mb-10">Your voices and generations stay private to you.</p>

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
            minLength={6}
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
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-mute">
        Already have an account?{" "}
        <Link href="/login" className="text-gold hover:underline">
          Log in
        </Link>
      </p>
    </section>
  );
}
