"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useSession";
import { supabase } from "@/lib/supabaseClient";

const links = [
  { href: "/clone", label: "Clone a voice" },
  { href: "/generate", label: "Generate" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
];

export default function Nav() {
  const { session, loading } = useSession();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="border-b hairline">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight">
          Voice<span className="text-gold">Forge</span>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-mute">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-paper transition-colors">
              {l.label}
            </Link>
          ))}

          {loading ? null : session ? (
            <>
              <span className="hidden sm:inline text-mute normal-case tracking-normal">
                {session.user.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-sm border hairline px-4 py-2 text-paper font-body normal-case tracking-normal hover:border-mute transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-paper transition-colors">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-sm bg-gold px-4 py-2 text-ink font-body font-semibold normal-case tracking-normal hover:bg-paper transition-colors"
              >
                Start free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
