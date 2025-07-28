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
  id: number | string;
  tipo: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
  orden?: string;
}

interface NotificacionesPanelProps {
  notificaciones: Notificacion[]
  onMarcarComoLeida?: (id: number | string) => void
  onMarcarTodasComoLeidas?: () => void
}

export default function NotificacionesPanel({ notificaciones, onMarcarComoLeida, onMarcarTodasComoLeidas }: NotificacionesPanelProps) {
  const getNotificacionIcon = (tipo: string, mensaje: string) => {
    // Detectar el estado desde el mensaje
    const mensajeLower = mensaje.toLowerCase();
    
    // Estados de producción
    if (mensajeLower.includes('en producción') || mensajeLower.includes('en produccion') || mensajeLower.includes('fabricada')) {
      return <Package className="h-4 w-4 text-orange-600" />
    }
    
    // Estados de tránsito
    if (mensajeLower.includes('en tránsito') || mensajeLower.includes('en transito')) {
      return <Package className="h-4 w-4 text-purple-600" />
    }
    
    // Estados finales exitosos
    if (mensajeLower.includes('recibido') && !mensajeLower.includes('problema')) {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    }
    
    // Estados con problemas
    if (mensajeLower.includes('problema') || mensajeLower.includes('cancelado')) {
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    }
    
    // Estados pendientes
    if (mensajeLower.includes('pendiente')) {
      return <Clock className="h-4 w-4 text-blue-600" />
    }
    
    // Por defecto, gris
    return <Bell className="h-4 w-4 text-gray-600" />
  };

  const getNotificacionColor = (tipo: string, mensaje: string) => {
    // Detectar el estado desde el mensaje
    const mensajeLower = mensaje.toLowerCase();
    
    console.log('🎨 Detectando color para notificación:', { tipo, mensaje, mensajeLower });
    
    // Estados de producción
    if (mensajeLower.includes('en producción') || mensajeLower.includes('en produccion') || mensajeLower.includes('fabricada')) {
      console.log('🟠 Color naranja para producción');
      return 'text-orange-600';
    }
    
    // Estados de tránsito
    if (mensajeLower.includes('en tránsito') || mensajeLower.includes('en transito')) {
      console.log('🟣 Color morado para tránsito');
      return 'text-purple-600';
    }
    
    // Estados finales exitosos
    if (mensajeLower.includes('recibido') && !mensajeLower.includes('problema')) {
      console.log('🟢 Color verde para recibido');
      return 'text-green-600';
    }
    
    // Estados con problemas
    if (mensajeLower.includes('problema') || mensajeLower.includes('cancelado')) {
      console.log('🔴 Color rojo para problemas');
      return 'text-red-600';
    }
    
    // Estados pendientes
    if (mensajeLower.includes('pendiente')) {
      console.log('🔵 Color azul para pendiente');
      return 'text-blue-600';
    }
    
    // Por defecto, gris
    console.log('⚪ Color gris por defecto');
    return 'text-gray-600';
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length

  return (
    <Card className="max-h-[350px] overflow-hidden">
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              console.log('🖱️ Click en "Marcar todas como leídas"');
              onMarcarTodasComoLeidas?.();
            }}
          >
            Marcar todas como leídas
          </Button>
        </div>
        <CardDescription>
          Actividad reciente del sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[250px]">
        <ScrollArea className="h-[200px]">
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
                              className={`p-3 rounded-lg border ${getNotificacionColor(notificacion.tipo, notificacion.mensaje)} ${
                                !notificacion.leida ? 'ring-2 ring-blue-200' : ''
                              } cursor-pointer hover:bg-gray-50 transition-colors`}
                              onClick={() => {
                                console.log('🖱️ Click en notificación:', notificacion.id, 'Tipo:', typeof notificacion.id);
                                onMarcarComoLeida?.(notificacion.id);
                              }}
                            >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificacionIcon(notificacion.tipo, notificacion.mensaje)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black">
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