import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Package
} from "lucide-react"

interface Notificacion {
  id: number;
  tipo: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
  orden?: string;
}

interface NotificacionesPanelProps {
  notificaciones: Notificacion[]
}

export default function NotificacionesPanel({ notificaciones }: NotificacionesPanelProps) {
  const getNotificacionIcon = (tipo: string) => {
    switch (tipo) {
      case 'alerta_faltante':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'rechazo_calidad':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'completado':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'nueva_orden':
        return <Package className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getNotificacionColor = (tipo: string) => {
    switch (tipo) {
      case 'alerta_faltante':
        return 'bg-orange-50 border-orange-200'
      case 'rechazo_calidad':
        return 'bg-red-50 border-red-200'
      case 'completado':
        return 'bg-green-50 border-green-200'
      case 'nueva_orden':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notificaciones</CardTitle>
            {notificacionesNoLeidas > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notificacionesNoLeidas}
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm">
            Marcar todas como leídas
          </Button>
        </div>
        <CardDescription>
          Actividad reciente del sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {notificaciones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              notificaciones.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className={`p-3 rounded-lg border ${getNotificacionColor(notificacion.tipo)} ${
                    !notificacion.leida ? 'ring-2 ring-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificacionIcon(notificacion.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notificacion.mensaje}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {notificacion.tiempo}
                        </span>
                        {notificacion.orden && (
                          <Badge variant="outline" className="text-xs">
                            {notificacion.orden}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!notificacion.leida && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 