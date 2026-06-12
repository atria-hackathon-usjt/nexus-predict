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
    <article className="theme-panel rounded-lg border p-[18px] text-left">
      <span className="theme-eyebrow text-xs font-black uppercase">{label}</span>
      <strong className="theme-title mt-2 mb-1 block text-3xl leading-none font-black">
        {value}
      </strong>
      <small className="theme-muted text-xs font-bold">{detail}</small>
    </article>
  )
}
