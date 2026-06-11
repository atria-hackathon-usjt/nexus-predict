export function MetricsGrid({ metrics }) {
  return (
    <section
      className="mx-auto grid max-w-[1220px] grid-cols-1 gap-3 px-6 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Indicadores principais"
    >
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </section>
  )
}

function MetricCard({ label, value, detail }) {
  return (
    <article className="rounded-lg border border-[#d8ded6] bg-white/80 p-[18px] text-left shadow-[0_16px_40px_rgba(33,54,42,0.08)]">
      <span className="text-xs text-[#65756c]">{label}</span>
      <strong className="mt-2 mb-1 block text-3xl leading-none text-[#13251b]">{value}</strong>
      <small className="text-xs text-[#65756c]">{detail}</small>
    </article>
  )
}
