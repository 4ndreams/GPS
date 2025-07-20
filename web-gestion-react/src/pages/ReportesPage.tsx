import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Package, Clock } from "lucide-react"

export default function ReportesPage() {
  // Datos simulados para los reportes
  const productividadTrabajadores = [
    { nombre: "Carlos Mendoza", completadas: 1, total: 1, porcentaje: 100 },
    { nombre: "Luis Rodríguez", completadas: 0, total: 1, porcentaje: 0 },
    { nombre: "Ana Martín", completadas: 0, total: 1, porcentaje: 0 },
    { nombre: "Pedro Silva", completadas: 0, total: 1, porcentaje: 0 },
    { nombre: "Roberto Vega", completadas: 0, total: 1, porcentaje: 0 },
  ];

  const productosMasDespachados = [
    { nombre: "Puerta Enchapada", unidades: 15 },
    { nombre: "Puerta Terciada", unidades: 12 },
    { nombre: "Puerta MDF", unidades: 13 },
    { nombre: "Puerta Enchapada Honeycomb", unidades: 20 },
    { nombre: "Marco", unidades: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reportes TERPLAC
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis y estadísticas del sistema de gestión
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productividad por Trabajador */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Productividad por Trabajador
            </CardTitle>
            <CardDescription>
              Órdenes completadas por trabajador de fábrica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productividadTrabajadores.map((trabajador, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{trabajador.nombre}</span>
                    <span>
                      {trabajador.completadas}/{trabajador.total} ({trabajador.porcentaje}%)
                    </span>
                  </div>
                  <Progress value={trabajador.porcentaje} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Productos Más Despachados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos Más Despachados
            </CardTitle>
            <CardDescription>
              Top productos por cantidad despachada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productosMasDespachados.map((producto, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{producto.nombre}</span>
                  <Badge variant="secondary">{producto.unidades} unidades</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de Tiempos de Despacho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Análisis de Tiempos de Despacho
          </CardTitle>
          <CardDescription>
            Tiempo promedio desde creación hasta recepción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">4h 30min</div>
              <div className="text-sm text-gray-500">Tiempo Promedio</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3h 15min</div>
              <div className="text-sm text-gray-500">Tiempo Mínimo</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">7h 45min</div>
              <div className="text-sm text-gray-500">Tiempo Máximo</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 