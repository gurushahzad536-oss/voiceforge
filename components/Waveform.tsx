// Deterministic "waveform" whose bar heights are derived from a seed phrase.
// This is the page's signature element: the audio motif is not decorative
// noise, it is literally shaped by words relevant to the product.
type WaveformProps = {
  seed: string;
  bars?: number;
  className?: string;
  color?: string;
  height?: number;
};

function heightsFromSeed(seed: string, count: number) {
  const chars = seed.split("");
  const heights: number[] = [];
  for (let i = 0; i < count; i++) {
    const c = chars[i % chars.length].charCodeAt(0);
    const c2 = chars[(i * 3 + 1) % chars.length].charCodeAt(0);
    const wave = Math.sin(i * 0.4) * 0.5 + 0.5;
    const raw = ((c * 7 + c2 * 13) % 100) / 100;
    heights.push(0.18 + (raw * 0.55 + wave * 0.45) * 0.82);
  }
  return heights;
}

export default function Waveform({
  seed,
  bars = 64,
  className = "",
  color = "#E8B34C",
  height = 64,
}: WaveformProps) {
  const heights = heightsFromSeed(seed, bars);
  const gap = 3;
  const barWidth = 3;
  const width = bars * (barWidth + gap);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {heights.map((h, i) => {
        const barH = Math.max(2, h * height);
        const x = i * (barWidth + gap);
        const y = (height - barH) / 2;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barH}
            rx={1.5}
            fill={color}
            opacity={0.35 + h * 0.65}
          />
        );
      })}
    </svg>
  );
}
