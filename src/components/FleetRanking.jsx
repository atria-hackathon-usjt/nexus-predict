import { formatCurrency } from '../domain/financialImpactEngine'

const riskStyles = {
  low: 'risk-low',
  medium: 'risk-medium',
  high: 'risk-high',
  critical: 'risk-critical',
}

export function FleetRanking({ vehicles }) {
  return (
    <section className="mx-auto mt-4 mb-8 max-w-[1220px] px-6">
      <div className="theme-panel rounded-lg border p-5.5">
        <div>
          <p className="theme-eyebrow mb-2.5 text-xs font-black uppercase">
            Veículos
          </p>
          <h2 className="theme-title text-[1.35rem] font-black tracking-normal">
            Ranking preventivo da frota
          </h2>
        </div>

        <div
          className="theme-scroll mt-[18px] grid max-h-[560px] gap-2 overflow-y-auto pr-1 overscroll-contain lg:max-h-[620px]"
          role="table"
          aria-label="Ranking de veículos"
        >
          <div
            className="theme-accent hidden min-h-10 grid-cols-[1.35fr_0.55fr_1.4fr_0.65fr_0.95fr] gap-3.5 px-3.5 py-3 text-xs font-black uppercase lg:grid"
            role="row"
          >
            <span>Veículo</span>
            <span>Risco</span>
            <span>Manutenção</span>
            <span>CO2</span>
            <span>Impacto</span>
          </div>

          {vehicles.map((vehicle) => (
            <div
              className="theme-card grid min-h-[82px] grid-cols-1 items-center gap-3.5 rounded-[7px] border px-3.5 py-3 text-left lg:grid-cols-[1.35fr_0.55fr_1.4fr_0.65fr_0.95fr]"
              role="row"
              key={vehicle.id}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="theme-title block font-black">{vehicle.model}</strong>
                  {vehicle.isAssigned ? (
                    <span className="risk-low inline-flex rounded-full border px-2 py-0.5 text-[0.68rem] font-black uppercase">
                      Atribuído
                    </span>
                  ) : null}
                </div>
                <small className="theme-muted block text-xs font-bold">
                  {vehicle.id} · {vehicle.category} · {vehicle.plate}
                </small>
              </div>
              <div>
                <span
                  className={`inline-flex min-w-[76px] justify-center rounded-full border px-2 py-1 text-xs font-black ${riskStyles[vehicle.riskTone]}`}
                >
                  {vehicle.riskLevel}
                </span>
                <small className="theme-muted block text-xs font-bold">{vehicle.riskScore}/100</small>
              </div>
              <div>
                <strong className="theme-title block font-black">{vehicle.recommendation.action}</strong>
                <small className="theme-muted block text-xs font-bold">
                  {vehicle.recommendation.detail}
                </small>
              </div>
              <div>
                <strong className="theme-title block font-black">{vehicle.impact.co2Kg} kg</strong>
                <small className="theme-muted block text-xs font-bold">
                  {vehicle.impact.fuelLiters} L diesel estimados
                </small>
              </div>
              <div>
                <strong className="theme-title block font-black">
                  {formatCurrency(vehicle.impact.expectedUnplannedCostBrl)}
                </strong>
                <small className="theme-muted block text-xs font-bold">
                  {vehicle.impact.avoidableCo2Kg} kg CO2 evitável ·{' '}
                  {formatCurrency(vehicle.impact.estimatedCostBrl)} combustível
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
