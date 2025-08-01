import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  DollarSign,
  Truck,
  Factory
} from "lucide-react"

interface OrdenDespacho {
  id: string;
  estado: string;
  valorTotal: number;
  totalProductos: number;
}

interface DashboardStatsProps {
  ordenesDespacho: OrdenDespacho[]
}

export default function DashboardStats({ ordenesDespacho }: DashboardStatsProps) {
  const stats = {
    totalOrdenes: ordenesDespacho.length,
    completadas: ordenesDespacho.filter(o => o.estado.toLowerCase().includes('recibido') && !o.estado.toLowerCase().includes('problema')).length,
    alertas: ordenesDespacho.filter(o => o.estado.toLowerCase().includes('problema') || o.estado.toLowerCase().includes('cancelado')).length,
    pendientes: ordenesDespacho.filter(o => o.estado.toLowerCase().includes('pendiente')).length,
    enProduccion: ordenesDespacho.filter(o => o.estado.toLowerCase().includes('producción') || o.estado.toLowerCase().includes('produccion')).length,
    enTransito: ordenesDespacho.filter(o => o.estado.toLowerCase().includes('tránsito') || o.estado.toLowerCase().includes('transito')).length,
    rechazadas: ordenesDespacho.filter(o => o.estado.toLowerCase().includes('cancelado')).length,
    valorTotal: ordenesDespacho.reduce((sum, o) => sum + o.valorTotal, 0),
    totalProductos: ordenesDespacho.reduce((sum, o) => sum + o.totalProductos, 0)
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
      description: "En espera de stock",
      color: "text-blue-600"
    },
    {
      title: "En Producción",
      value: stats.enProduccion,
      icon: Factory,
      description: "En fabricación",
      color: "text-orange-600"
    },
    {
      title: "En Tránsito",
      value: stats.enTransito,
      icon: Truck,
      description: "En camino",
      color: "text-purple-600"
    },
    {
      title: "Completadas",
      value: stats.completadas,
      icon: CheckCircle2,
      description: "Entregadas exitosamente",
      color: "text-green-600"
    },
    {
      title: "Con Problemas",
      value: stats.alertas,
      icon: AlertTriangle,
      description: "Requieren atención",
      color: "text-red-600"
    },
    {
      title: "Valor Total",
      value: `$${stats.valorTotal.toLocaleString()}`,
      icon: DollarSign,
      description: "Valor de todas las órdenes",
      color: "text-green-600"
    },
    {
      title: "Total Productos",
      value: stats.totalProductos,
      icon: Package,
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