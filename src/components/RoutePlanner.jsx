import { useEffect, useMemo, useState } from 'react'

const statusStyles = {
  available: {
    label: 'Disponível',
    color: '#19e68c',
    soft: 'var(--status-available-soft)',
    badge: 'status-badge status-available',
  },
  attention: {
    label: 'Atenção',
    color: '#f5c84c',
    soft: 'var(--status-attention-soft)',
    badge: 'status-badge status-attention',
  },
  delayed: {
    label: 'Em atraso',
    color: '#ff5c72',
    soft: 'var(--status-delayed-soft)',
    badge: 'status-badge status-delayed',
  },
  restricted: {
    label: 'Restrita',
    color: '#b273ff',
    soft: 'var(--status-restricted-soft)',
    badge: 'status-badge status-restricted',
  },
}

const mapWidth = 1100
const mapHeight = 785

const regionalRouteLayout = {
  'RT-SP-01': {
    origin: { x: 516, y: 642 },
    destination: { x: 496, y: 681 },
    control: { x: 535, y: 662 },
    label: { x: 546, y: 685 },
  },
  'RT-CPS-02': {
    origin: { x: 420, y: 568 },
    destination: { x: 414, y: 652 },
    control: { x: 460, y: 614 },
    label: { x: 452, y: 606 },
  },
  'RT-BH-03': {
    origin: { x: 705, y: 386 },
    destination: { x: 733, y: 377 },
    control: { x: 724, y: 356 },
    label: { x: 744, y: 354 },
  },
  'RT-PR-04': {
    origin: { x: 272, y: 748 },
    destination: { x: 422, y: 736 },
    control: { x: 346, y: 710 },
    label: { x: 404, y: 708 },
  },
  'RT-RJ-05': {
    origin: { x: 706, y: 650 },
    destination: { x: 748, y: 646 },
    control: { x: 730, y: 620 },
    label: { x: 762, y: 620 },
  },
  'RT-PE-06': {
    origin: { x: 864, y: 446 },
    destination: { x: 922, y: 358 },
    control: { x: 938, y: 410 },
    label: { x: 942, y: 392 },
  },
  'RT-RS-07': {
    origin: { x: 272, y: 748 },
    destination: { x: 370, y: 693 },
    control: { x: 296, y: 690 },
    label: { x: 306, y: 678 },
  },
  'RT-BA-08': {
    origin: { x: 834, y: 134 },
    destination: { x: 942, y: 252 },
    control: { x: 930, y: 170 },
    label: { x: 948, y: 180 },
  },
  'RT-GO-09': {
    origin: { x: 352, y: 162 },
    destination: { x: 438, y: 106 },
    control: { x: 378, y: 102 },
    label: { x: 378, y: 82 },
  },
  'RT-SC-10': {
    origin: { x: 410, y: 760 },
    destination: { x: 316, y: 746 },
    control: { x: 362, y: 710 },
    label: { x: 344, y: 716 },
  },
  'RT-CE-11': {
    origin: { x: 922, y: 300 },
    destination: { x: 868, y: 386 },
    control: { x: 902, y: 342 },
    label: { x: 876, y: 326 },
  },
  'RT-MG-12': {
    origin: { x: 705, y: 386 },
    destination: { x: 681, y: 582 },
    control: { x: 742, y: 492 },
    label: { x: 740, y: 526 },
  },
}

const fallbackRouteLayouts = [
  {
    origin: { x: 420, y: 568 },
    destination: { x: 516, y: 642 },
    control: { x: 480, y: 590 },
    label: { x: 482, y: 558 },
  },
  {
    origin: { x: 516, y: 642 },
    destination: { x: 706, y: 650 },
    control: { x: 610, y: 612 },
    label: { x: 604, y: 598 },
  },
  {
    origin: { x: 705, y: 386 },
    destination: { x: 681, y: 582 },
    control: { x: 742, y: 492 },
    label: { x: 740, y: 526 },
  },
]

export function RoutePlanner({
  bestVehicle,
  routeOperations,
  selectedRouteId,
  selectedRouteOperation,
  onAssignVehicle,
  onSelectRoute,
}) {
  const [statusFilter, setStatusFilter] = useState('all')
  const visibleOperations = useMemo(
    () =>
      statusFilter === 'all'
        ? routeOperations
        : routeOperations.filter((operation) => operation.status === statusFilter),
    [routeOperations, statusFilter],
  )
  const selectedOperation =
    visibleOperations.find((operation) => operation.route.id === selectedRouteId) ??
    visibleOperations[0] ??
    selectedRouteOperation ??
    routeOperations[0]

  useEffect(() => {
    if (!visibleOperations.length) return

    const selectedIsVisible = visibleOperations.some(
      (operation) => operation.route.id === selectedRouteId,
    )

    if (!selectedIsVisible) {
      onSelectRoute(visibleOperations[0].route.id)
    }
  }, [onSelectRoute, selectedRouteId, visibleOperations])

  return (
    <section className="mx-auto mt-4 grid max-w-[1220px] grid-cols-1 items-stretch gap-4 px-6 lg:grid-cols-[minmax(320px,0.68fr)_minmax(0,1.32fr)]">
      <RouteList
        operations={visibleOperations}
        selectedRouteId={selectedOperation.route.id}
        statusFilter={statusFilter}
        onSelectRoute={onSelectRoute}
      />

      <div className="grid gap-4">
        <RouteMap
          operations={visibleOperations}
          selectedRouteId={selectedOperation.route.id}
          statusFilter={statusFilter}
          allOperations={routeOperations}
          onSelectRoute={onSelectRoute}
          onSetStatusFilter={setStatusFilter}
        />
        <RouteDetails
          operation={selectedOperation}
          allOperations={routeOperations}
          fallbackVehicle={bestVehicle}
          onAssignVehicle={onAssignVehicle}
        />
      </div>
    </section>
  )
}

function RouteList({ operations, selectedRouteId, statusFilter, onSelectRoute }) {
  const filterLabel =
    statusFilter === 'all' ? 'Todas as rotas' : statusStyles[statusFilter]?.label ?? 'Rotas'

  return (
    <div className="theme-panel flex h-full min-h-[560px] flex-col rounded-lg border p-5.5">
      <div className="flex items-start justify-between gap-3">
        <SectionHeading eyebrow="Rotas" title="Malha de expedição" />
        <span className="theme-pill rounded-full border px-2.5 py-1 text-xs font-black">
          {operations.length}
        </span>
      </div>
      <p className="theme-accent mt-1 text-xs font-bold">{filterLabel}</p>

      <div className="theme-scroll mt-[18px] grid min-h-0 flex-1 content-start gap-2.5 overflow-y-auto pr-1 overscroll-contain">
        {operations.map((operation) => {
          const route = operation.route
          const status = statusStyles[operation.status]
          const isSelected = route.id === selectedRouteId

          return (
            <button
              className={
                isSelected
                  ? 'theme-route-card-selected min-h-[104px] w-full cursor-pointer rounded-[7px] border px-4 py-3.5 text-left'
                  : 'theme-route-card min-h-[104px] w-full cursor-pointer rounded-[7px] border px-4 py-3.5 text-left transition'
              }
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              type="button"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{ backgroundColor: status.color }}
                  aria-hidden="true"
                />
                <span className="truncate text-[0.98rem] font-black">{route.name}</span>
              </span>
              <small className="theme-muted mt-2 block text-sm font-bold">
                {route.distanceKm} km · {operation.assignedVehicle.id} · {status.label}
              </small>
              <small className="theme-accent mt-1 block text-sm font-bold">
                Estresse {operation.routeStress}/100 · {operation.difficulty}
                {operation.assignmentMode === 'manual' ? ' · manual' : ''}
              </small>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RouteMap({
  operations,
  selectedRouteId,
  statusFilter,
  allOperations,
  onSelectRoute,
  onSetStatusFilter,
}) {
  return (
    <div className="theme-panel rounded-lg border p-5.5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <SectionHeading eyebrow="Mapa operacional" title="Rodovias federais" />
        <StatusFilters
          operations={allOperations}
          activeFilter={statusFilter}
          onSetStatusFilter={onSetStatusFilter}
        />
      </div>

      <div className="theme-map-frame mt-[18px] overflow-hidden rounded-lg border">
        <svg
          className="h-[520px] w-full md:h-[600px] lg:h-[680px]"
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          role="group"
          aria-label="Mapa interativo de rotas sobre imagem de rodovias federais do Sudeste"
        >
          <image
            href="/sudeste-rodovias.jpg"
            x="0"
            y="0"
            width={mapWidth}
            height={mapHeight}
            preserveAspectRatio="xMidYMid meet"
          />

          {operations.map((operation) => (
            <RouteTrace
              key={operation.route.id}
              operation={operation}
              isSelected={operation.route.id === selectedRouteId}
              onSelectRoute={onSelectRoute}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

function RouteTrace({ operation, isSelected, onSelectRoute }) {
  const route = operation.route
  const status = statusStyles[operation.status]
  const geometry = getRouteGeometry(route)
  const path = `M ${geometry.start.x} ${geometry.start.y} Q ${geometry.control.x} ${geometry.control.y} ${geometry.end.x} ${geometry.end.y}`
  const vehicleCode = operation.assignedVehicle.id.replace('NX-', '')
  const markerRadius = vehicleCode.length > 3 ? (isSelected ? 29 : 23) : isSelected ? 26 : 21
  const markerFontSize = vehicleCode.length > 3 ? (isSelected ? 15 : 12) : isSelected ? 16 : 13

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectRoute(route.id)
    }
  }

  return (
    <g
      className="cursor-pointer outline-none"
      role="button"
      tabIndex="0"
      aria-label={`${route.name}, ${status.label}, caminhão ${operation.assignedVehicle.id}`}
      onClick={() => onSelectRoute(route.id)}
      onKeyDown={handleKeyDown}
    >
      <path d={path} fill="none" stroke="transparent" strokeWidth="58" strokeLinecap="round" />
      <path
        d={path}
        fill="none"
        stroke="var(--route-trace-outline)"
        strokeWidth={isSelected ? 18 : 14}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isSelected ? 0.96 : 0.82}
      />
      <path
        d={path}
        fill="none"
        stroke={status.color}
        strokeWidth={isSelected ? 12 : 8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isSelected ? 1 : 0.88}
      />
      <RoutePin
        x={geometry.start.x}
        y={geometry.start.y}
        color={status.color}
        isSelected={isSelected}
        variant="origin"
      />
      <RoutePin
        x={geometry.end.x}
        y={geometry.end.y}
        color={status.color}
        isSelected={isSelected}
        variant="destination"
      />
      <circle
        cx={geometry.mid.x}
        cy={geometry.mid.y}
        r={markerRadius}
        fill="var(--marker-fill)"
        opacity={isSelected ? 0.96 : 0.9}
        stroke="var(--marker-stroke)"
        strokeWidth={isSelected ? 4 : 3}
      />
      <text
        x={geometry.mid.x}
        y={geometry.mid.y + 5}
        textAnchor="middle"
        fill="var(--marker-text)"
        fontSize={markerFontSize}
        fontWeight="900"
        pointerEvents="none"
      >
        {vehicleCode}
      </text>
      <text
        x={geometry.label.x}
        y={geometry.label.y}
        fill="var(--text-primary)"
        fontSize={isSelected ? 17 : 14}
        fontWeight={isSelected ? '900' : '800'}
        paintOrder="stroke"
        stroke="var(--map-label-stroke)"
        strokeWidth="5"
        pointerEvents="none"
      >
        {route.id}
      </text>
    </g>
  )
}

function RoutePin({ x, y, color, isSelected, variant }) {
  const scale = isSelected ? 1.06 : 0.9
  const fill = variant === 'destination' ? color : 'var(--pin-origin-fill)'
  const stroke = variant === 'destination' ? 'var(--pin-destination-stroke)' : color

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} pointerEvents="none">
      <path
        d="M0 -28 C14 -28 26 -16 26 -2 C26 15 8 26 0 38 C-8 26 -26 15 -26 -2 C-26 -16 -14 -28 0 -28Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="5"
      />
      <circle cx="0" cy="-3" r="8" fill={variant === 'destination' ? 'var(--pin-destination-stroke)' : color} />
    </g>
  )
}

function RouteDetails({ operation, allOperations, fallbackVehicle, onAssignVehicle }) {
  const [assignmentErrorState, setAssignmentErrorState] = useState({
    routeId: '',
    message: '',
  })
  const route = operation.route
  const assignedVehicle = operation.assignedVehicle ?? fallbackVehicle
  const recommendedVehicle = operation.recommendedVehicle ?? assignedVehicle
  const status = statusStyles[operation.status]
  const delayText =
    operation.delayRiskMinutes > 0 ? `+${operation.delayRiskMinutes} min` : 'No prazo'
  const assignmentLabel = operation.assignmentMode === 'manual' ? 'Manual' : 'Automática'
  const manualAssignmentsByVehicle = new Map(
    allOperations
      .filter(
        (routeOperation) =>
          routeOperation.route.id !== route.id && routeOperation.manualAssignedVehicleId,
      )
      .map((routeOperation) => [
        routeOperation.manualAssignedVehicleId,
        routeOperation.route.name,
      ]),
  )
  const assignmentError =
    assignmentErrorState.routeId === route.id ? assignmentErrorState.message : ''

  function handleVehicleAssignment(event) {
    const result = onAssignVehicle(route.id, event.target.value)

    if (result?.ok === false) {
      setAssignmentErrorState({
        routeId: route.id,
        message: result.message,
      })
      return
    }

    setAssignmentErrorState({
      routeId: '',
      message: '',
    })
  }

  return (
    <div className="theme-panel rounded-lg border p-5.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeading eyebrow="Ficha da rota" title={route.name} />
        <span
          className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black uppercase ${status.badge}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-[18px] grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label="Trajeto" value={`${route.map.origin.label} → ${route.map.destination.label}`} />
        <Stat label="Distância" value={`${route.distanceKm} km`} />
        <Stat label="Estresse" value={`${operation.routeStress}/100`} detail={operation.difficulty} />
        <Stat label="Congestionamento" value={`${route.congestionLevel}%`} />
        <Stat label="Prazo" value={`${route.deadlineHours} h`} />
        <Stat label="Pressão de atraso" value={delayText} />
      </div>

      <div className="theme-card mt-[18px] rounded-lg border p-3.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label
            className="theme-eyebrow text-xs font-black uppercase"
            htmlFor={`vehicle-assignment-${route.id}`}
          >
            Atribuição de caminhão
          </label>
          <span className="theme-pill inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-black">
            {assignmentLabel}
          </span>
        </div>
        <select
          className="theme-field mt-3 min-h-11 w-full rounded-[7px] border px-3 text-sm font-bold outline-none transition"
          id={`vehicle-assignment-${route.id}`}
          value={operation.manualAssignedVehicleId ?? ''}
          onChange={handleVehicleAssignment}
        >
          <option value="">
            Automático · {recommendedVehicle.id} · {recommendedVehicle.model}
          </option>
          {operation.fleetAnalysis.map((vehicle) => {
            const assignedRouteName = manualAssignmentsByVehicle.get(vehicle.id)
            const isCritical = vehicle.riskScore >= 82

            return (
              <option disabled={Boolean(assignedRouteName)} key={vehicle.id} value={vehicle.id}>
                {vehicle.id} · {vehicle.model} · risco {vehicle.riskScore}/100
                {assignedRouteName ? ` · atribuído em ${assignedRouteName}` : ''}
                {isCritical ? ' · bloqueado: crítico' : ''}
              </option>
            )
          })}
        </select>
        {assignmentError ? (
          <div
            className="theme-error mt-3 rounded-[7px] border px-3 py-2 text-sm font-bold"
            role="alert"
          >
            {assignmentError}
          </div>
        ) : null}
        <p className="theme-muted mt-2 text-xs font-bold">
          Caminhões já confirmados em outra rota ficam indisponíveis; caminhões críticos são
          recusados ao tentar confirmar.
        </p>
      </div>

      <div className="theme-success-callout mt-[18px] rounded-lg p-[18px] text-left">
        <span className="mb-2.5 inline-flex rounded-full bg-[#19e68c] px-2 py-1 text-[0.72rem] font-black text-[#001312] uppercase">
          Caminhão atribuído
        </span>
        <strong className="block">{assignedVehicle.model}</strong>
        <p className="mt-1.5">
          {assignedVehicle.id} · {assignedVehicle.plate} · risco {assignedVehicle.riskScore}/100 (
          {assignedVehicle.riskLevel}).
        </p>
        <p className="mt-2">
          Estimativa de {assignedVehicle.impact.co2Kg} kg de CO2 e{' '}
          {assignedVehicle.impact.fuelLiters} L de diesel nesta operação.
        </p>
      </div>
    </div>
  )
}

function StatusFilters({ operations, activeFilter, onSetStatusFilter }) {
  const counts = operations.reduce(
    (totals, operation) => ({
      ...totals,
      [operation.status]: (totals[operation.status] ?? 0) + 1,
    }),
    {},
  )

  return (
    <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-5 xl:max-w-[560px]">
      <FilterButton
        label="Todas"
        count={operations.length}
        isActive={activeFilter === 'all'}
        onClick={() => onSetStatusFilter('all')}
      />
      {Object.entries(statusStyles).map(([key, status]) => (
        <FilterButton
          key={key}
          label={status.label}
          count={counts[key] ?? 0}
          color={status.color}
          soft={status.soft}
          isActive={activeFilter === key}
          onClick={() => onSetStatusFilter(key)}
        />
      ))}
    </div>
  )
}

function FilterButton({ label, count, color, soft, isActive, onClick }) {
  return (
    <button
      className={
        isActive
          ? 'theme-filter-button-active inline-flex min-h-10 items-center justify-between gap-2 rounded-full border px-3 py-1.5 font-black'
          : 'theme-filter-button inline-flex min-h-10 items-center justify-between gap-2 rounded-full border px-3 py-1.5 font-black transition'
      }
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-2">
        {color ? (
          <span
            className="h-3.5 w-3.5 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 0 5px ${soft}` }}
            aria-hidden="true"
          />
        ) : null}
        {label}
      </span>
      <span className={isActive ? 'text-[#001312]/70' : 'theme-accent'}>{count}</span>
    </button>
  )
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div>
      <p className="theme-eyebrow mb-2.5 text-xs font-black uppercase">
        {eyebrow}
      </p>
      <h2 className="theme-title text-[1.35rem] font-black tracking-normal">{title}</h2>
    </div>
  )
}

function Stat({ label, value, detail }) {
  return (
    <div className="theme-card min-h-[72px] rounded-[7px] border p-3.5">
      <span className="theme-accent text-xs font-bold">{label}</span>
      <strong className="theme-title mt-1.5 block text-base font-black">{value}</strong>
      {detail ? <small className="theme-muted mt-0.5 block text-xs">{detail}</small> : null}
    </div>
  )
}

function getRouteGeometry(route) {
  const layout = regionalRouteLayout[route.id] ?? getFallbackRouteLayout(route.id)
  const start = layout.origin
  const end = layout.destination
  const control = layout.control

  return {
    start,
    end,
    control,
    label: layout.label,
    mid: getQuadraticPoint(start, control, end, 0.5),
  }
}

function getFallbackRouteLayout(routeId) {
  const hash = [...routeId].reduce((total, character) => total + character.charCodeAt(0), 0)
  return fallbackRouteLayouts[hash % fallbackRouteLayouts.length]
}

function getQuadraticPoint(start, control, end, t) {
  const inverse = 1 - t

  return {
    x: Number((inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x).toFixed(1)),
    y: Number((inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y).toFixed(1)),
  }
}
