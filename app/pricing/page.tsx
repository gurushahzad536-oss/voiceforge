import Link from "next/link";

const monthly = 2000;

const plans = [
  {
    name: "Monthly",
    price: `Rs ${monthly.toLocaleString()}`,
    period: "/ month",
    note: "Pay as you go, cancel anytime.",
    discount: null as string | null,
  },
  {
    name: "6 Months",
    price: "Rs 9,000",
    period: "/ 6 months",
    note: "Rs 1,500 per month, billed every 6 months.",
    discount: `Save 25% vs monthly`,
  },
  {
    name: "Yearly",
    price: "Rs 15,000",
    period: "/ year",
    note: "Rs 1,250 per month, billed yearly.",
    discount: `Save 37.5% vs monthly`,
    highlight: true,
  },
];

const features = [
  "Unlimited voice clones",
  "Unlimited text-to-speech generations",
  "WAV download",
  "Multiple languages (see Generate page)",
  "Dashboard with clone & generation history",
];

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">Pricing</p>
      <h1 className="font-display text-4xl mb-2">Simple, honest pricing</h1>
      <p className="text-mute mb-4 max-w-xl">
        Every plan starts with a <span className="text-paper">10-day free trial</span> — no
        restrictions during the trial.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-lg border px-6 py-8 flex flex-col ${
              p.highlight ? "border-gold bg-ink2" : "hairline bg-ink2"
            }`}
          >
            {p.highlight && (
              <span className="font-mono text-xs uppercase tracking-wider text-gold mb-3">
                Best value
              </span>
            )}
            <h2 className="font-display text-2xl mb-1">{p.name}</h2>
            <p className="mb-1">
              <span className="font-display text-4xl">{p.price}</span>{" "}
              <span className="text-mute text-sm">{p.period}</span>
            </p>
            {p.discount && (
              <p className="font-mono text-xs text-coral mb-3">{p.discount}</p>
            )}
            <p className="text-mute text-sm mb-6">{p.note}</p>
            <Link
              href="/signup"
              className={`mt-auto text-center rounded-sm px-6 py-3 font-semibold transition-colors ${
                p.highlight
                  ? "bg-gold text-ink hover:bg-paper"
                  : "border hairline hover:border-mute"
              }`}
            >
              Start free trial
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-lg border hairline bg-ink2 px-8 py-8">
        <h3 className="font-display text-xl mb-4">Every plan includes</h3>
        <ul className="grid sm:grid-cols-2 gap-3 font-mono text-sm text-mute">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="text-gold">—</span> {f}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 text-xs text-mute font-mono">
        Payments aren't wired up yet — connect a payment provider (Stripe, JazzCash, or EasyPaisa)
        to start charging. "Start free trial" currently just creates an account.
      </p>
    </section>
  );
}
