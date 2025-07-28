import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Package, Calendar, User, DollarSign, Truck, Clock, CheckCircle2 } from "lucide-react"

interface OrdenDespacho {
  id: string;
  fecha: string;
  trabajadorFabrica: string;
  estado: string;
  prioridad: string;
  totalProductos: number;
  valorTotal: number;
  vendedora?: string;
}

interface OrdenDetallesModalProps {
  orden: OrdenDespacho | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrdenDetallesModal({ orden, isOpen, onClose }: OrdenDetallesModalProps) {
  if (!isOpen || !orden) return null;

  const getEstadoBadge = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    
    const estadoConfig = {
      pendiente: {
        variant: "secondary" as const,
        className: "bg-blue-100 text-blue-800",
        icon: Clock,
        texto: "Pendiente",
      },
      "pendiente recepción": {
        variant: "secondary" as const,
        className: "bg-blue-100 text-blue-800",
        icon: Clock,
        texto: "Pendiente Recepción",
      },
      "en producción": {
        variant: "default" as const,
        className: "bg-orange-100 text-orange-800",
        icon: Package,
        texto: "En Producción",
      },
      "en produccion": {
        variant: "default" as const,
        className: "bg-orange-100 text-orange-800",
        icon: Package,
        texto: "En Producción",
      },
      fabricada: {
        variant: "default" as const,
        className: "bg-orange-100 text-orange-800",
        icon: Package,
        texto: "Fabricada",
      },
      "en tránsito": {
        variant: "default" as const,
        className: "bg-purple-100 text-purple-800",
        icon: Truck,
        texto: "En Tránsito",
      },
      "en transito": {
        variant: "default" as const,
        className: "bg-purple-100 text-purple-800",
        icon: Truck,
        texto: "En Tránsito",
      },
      recibido: {
        variant: "default" as const,
        className: "bg-green-100 text-green-800",
        icon: CheckCircle2,
        texto: "Recibido",
      },
      "recibido con problemas": {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800",
        icon: Package,
        texto: "Recibido con Problemas",
      },
      cancelado: {
        variant: "destructive" as const,
        className: "bg-gray-100 text-gray-800",
        icon: X,
        texto: "Cancelado",
      },
    };

    const config = estadoConfig[estadoLower as keyof typeof estadoConfig] || {
      variant: "secondary" as const,
      className: "bg-gray-100 text-gray-800",
      icon: Package,
      texto: estado,
    };

    const IconComponent = config.icon;
    return (
      <Badge variant={config.variant} className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.texto}
      </Badge>
    );
  };

  const getPrioridadBadge = (prioridad: string) => {
    const prioridadLower = prioridad.toLowerCase();
    
    const prioridadConfig = {
      crítica: {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800",
        texto: "Crítica",
      },
      alta: {
        variant: "default" as const,
        className: "bg-orange-100 text-orange-800",
        texto: "Alta",
      },
      media: {
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800",
        texto: "Media",
      },
      normal: {
        variant: "secondary" as const,
        className: "bg-blue-100 text-blue-800",
        texto: "Normal",
      },
      baja: {
        variant: "outline" as const,
        className: "bg-gray-100 text-gray-600",
        texto: "Baja",
      },
    };

    const config = prioridadConfig[prioridadLower as keyof typeof prioridadConfig] || {
      variant: "secondary" as const,
      className: "bg-gray-100 text-gray-800",
      texto: prioridad,
    };

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.texto}
      </Badge>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold">
              Detalles de la Orden #{orden.id}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Estado y Prioridad */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Estado:</span>
                {getEstadoBadge(orden.estado)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Prioridad:</span>
                {getPrioridadBadge(orden.prioridad)}
              </div>
            </div>

            {/* Información del Trabajador */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Trabajador</p>
                <p className="text-sm text-gray-600">{orden.trabajadorFabrica}</p>
              </div>
            </div>

            {/* Información de Productos */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Productos</p>
                <p className="text-sm text-gray-600">{orden.totalProductos} unidades</p>
              </div>
            </div>

            {/* Valor Total */}
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Valor Total</p>
                <p className="text-lg font-bold text-green-600">
                  ${orden.valorTotal.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Fecha */}
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fecha</p>
                <p className="text-sm text-gray-600">{orden.fecha}</p>
              </div>
            </div>

            {/* Vendedora */}
            {orden.vendedora && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <User className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Vendedora</p>
                  <p className="text-sm text-gray-600">{orden.vendedora}</p>
                </div>
              </div>
            )}

            {/* Botón de cerrar */}
            <div className="flex justify-end pt-4">
              <Button onClick={onClose} className="w-full">
                Cerrar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 