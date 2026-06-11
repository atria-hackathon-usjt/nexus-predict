import { useMemo, useState } from 'react'
import { FleetRanking } from './components/FleetRanking'
import { Hero } from './components/Hero'
import { MetricsGrid } from './components/MetricsGrid'
import { RoutePlanner } from './components/RoutePlanner'
import { vehicles } from './data/vehicles.mock'
import { routes } from './data/routes.mock'
import { calculateSustainabilityImpact } from './domain/financialImpactEngine'
import { findBestVehicle, getMaintenanceRecommendation } from './domain/maintenanceEngine'
import { calculateVehicleRisk, classifyRisk, getRiskTone } from './domain/riskEngine'
import {
  calculateRouteStress,
  estimateRouteFuelLiters,
  getRouteDifficulty,
} from './domain/routeStressEngine'

function App() {
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0].id)
  const selectedRoute = routes.find((route) => route.id === selectedRouteId)

  const fleetAnalysis = useMemo(() => {
    const rankedVehicles = vehicles.map((vehicle) => {
      const riskScore = calculateVehicleRisk(vehicle, selectedRoute)

      return {
        ...vehicle,
        riskScore,
        riskLevel: classifyRisk(riskScore),
        riskTone: getRiskTone(riskScore),
        fuelLiters: estimateRouteFuelLiters(selectedRoute, vehicle),
      }
    })

    const bestVehicle = findBestVehicle(rankedVehicles)

    return rankedVehicles
      .map((vehicle) => ({
        ...vehicle,
        recommendation: getMaintenanceRecommendation(vehicle, vehicle.riskScore, selectedRoute),
        impact: calculateSustainabilityImpact(selectedRoute, vehicle, vehicle.riskScore, bestVehicle),
        isBest: vehicle.id === bestVehicle.id,
      }))
      .sort((a, b) => a.riskScore - b.riskScore)
  }, [selectedRoute])

  const bestVehicle = fleetAnalysis.find((vehicle) => vehicle.isBest)
  const criticalVehicles = fleetAnalysis.filter((vehicle) => vehicle.riskScore >= 82).length
  const routeStress = calculateRouteStress(selectedRoute)
  const averageRisk = Math.round(
    fleetAnalysis.reduce((total, vehicle) => total + vehicle.riskScore, 0) / fleetAnalysis.length,
  )
  const avoidableCo2 = fleetAnalysis.reduce(
    (total, vehicle) => total + vehicle.impact.avoidableCo2Kg,
    0,
  )

  const metrics = [
    {
      label: 'Risco médio da frota',
      value: `${averageRisk}/100`,
      detail: 'score operacional',
    },
    {
      label: 'Veículos críticos',
      value: criticalVehicles,
      detail: 'exigem ação preventiva',
    },
    {
      label: 'Estresse da rota',
      value: `${routeStress}/100`,
      detail: getRouteDifficulty(routeStress),
    },
    {
      label: 'CO2 evitável',
      value: `${avoidableCo2.toFixed(1)} kg`,
      detail: 'comparando com o melhor veículo',
    },
  ]

  return (
    <main className="min-h-screen bg-[#f7f8f3] bg-[linear-gradient(180deg,rgba(235,242,238,0.92),rgba(250,251,247,0.98)_38%)] text-[#17201b]">
      <Hero />
      <MetricsGrid metrics={metrics} />
      <RoutePlanner
        bestVehicle={bestVehicle}
        routes={routes}
        selectedRoute={selectedRoute}
        selectedRouteId={selectedRouteId}
        onSelectRoute={setSelectedRouteId}
      />
      <FleetRanking vehicles={fleetAnalysis} />
    </main>
  )
}

export default App
