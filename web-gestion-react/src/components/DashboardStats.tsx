
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Truck,
  Factory
} from "lucide-react"
import { type Orden } from '../services/ordenService';

interface DashboardStatsProps {
  ordenesDespacho: Orden[]
}

export default function DashboardStats({ ordenesDespacho }: DashboardStatsProps) {
  const stats = {
    totalOrdenes: ordenesDespacho.length,
    pendientes: ordenesDespacho.filter(o => o.estado === 'Pendiente').length,
    enProduccion: ordenesDespacho.filter(o => o.estado === 'En producción').length,
    fabricadas: ordenesDespacho.filter(o => o.estado === 'Fabricada').length,
    enTransito: ordenesDespacho.filter(o => o.estado === 'En tránsito').length,
    recibidas: ordenesDespacho.filter(o => o.estado === 'Recibido').length,
    recibidasConProblemas: ordenesDespacho.filter(o => o.estado === 'Recibido con problemas').length,
    totalCantidad: ordenesDespacho.reduce((sum, o) => sum + o.cantidad, 0)
  }

  const statCards = [
    {
      title: "Total Órdenes",
      value: stats.totalOrdenes,
      icon: Package,
      description: "Órdenes de despacho",
      color: "text-blue-600"
    },
    {
      title: "Pendientes",
      value: stats.pendientes,
      icon: Clock,
      description: "En espera de procesamiento",
      color: "text-blue-600"
    },
    {
      title: "En Producción",
      value: stats.enProduccion,
      icon: Factory,
      description: "En proceso de fabricación",
      color: "text-yellow-600"
    },
    {
      title: "Fabricadas",
      value: stats.fabricadas,
      icon: CheckCircle2,
      description: "Listas para despacho",
      color: "text-green-600"
    },
    {
      title: "En Tránsito",
      value: stats.enTransito,
      icon: Truck,
      description: "En camino",
      color: "text-purple-600"
    },
    {
      title: "Recibidas",
      value: stats.recibidas,
      icon: CheckCircle2,
      description: "Entregadas exitosamente",
      color: "text-green-600"
    },
    {
      title: "Con Problemas",
      value: stats.recibidasConProblemas,
      icon: AlertTriangle,
      description: "Recibidas con problemas",
      color: "text-red-600"
    },
    {
      title: "Total Cantidad",
      value: stats.totalCantidad,
      icon: Factory,
      description: "Unidades totales",
      color: "text-indigo-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 