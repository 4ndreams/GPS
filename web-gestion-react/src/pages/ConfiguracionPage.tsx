import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Settings, Phone, Mail } from "lucide-react"

export default function ConfiguracionPage() {
  const [configuracion, setConfiguracion] = useState({
    sincronizacionAutomatica: true,
    notificacionesPush: true,
    exportacionAutomatica: false,
  });

  const handleConfiguracionChange = (key: keyof typeof configuracion, value: boolean) => {
    setConfiguracion(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGuardarConfiguracion = () => {
    console.log('Guardando configuración:', configuracion);
    // Aquí se implementaría la lógica para guardar la configuración
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Configuración del Sistema
          </h1>
          <p className="text-gray-600 mt-1">
            Ajustes para la sincronización con la app móvil de fábrica
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración del Sistema
          </CardTitle>
          <CardDescription>
            Ajustes para la sincronización con la app móvil de fábrica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Opciones de configuración */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Sincronización Automática</Label>
                <p className="text-sm text-gray-500">Actualizar datos cada 30 segundos</p>
              </div>
              <Checkbox 
                checked={configuracion.sincronizacionAutomatica}
                onCheckedChange={(checked) => 
                  handleConfiguracionChange('sincronizacionAutomatica', checked as boolean)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Notificaciones Push</Label>
                <p className="text-sm text-gray-500">Recibir alertas de órdenes con problemas</p>
              </div>
              <Checkbox 
                checked={configuracion.notificacionesPush}
                onCheckedChange={(checked) => 
                  handleConfiguracionChange('notificacionesPush', checked as boolean)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Exportación Automática</Label>
                <p className="text-sm text-gray-500">Generar reportes diarios automáticamente</p>
              </div>
              <Checkbox 
                checked={configuracion.exportacionAutomatica}
                onCheckedChange={(checked) => 
                  handleConfiguracionChange('exportacionAutomatica', checked as boolean)
                }
              />
            </div>
          </div>

          {/* Contacto de Soporte */}
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Contacto de Soporte</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">+57 (1) 234-5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">soporte@terplac.com</span>
              </div>
            </div>
          </div>

          {/* Botón de guardar */}
          <div className="pt-4 border-t">
            <Button 
              onClick={handleGuardarConfiguracion}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Guardar Configuración
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 