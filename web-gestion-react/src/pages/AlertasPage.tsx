import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package } from "lucide-react"
import despachos from '../data/despachos.json'

export default function AlertasPage() {
  const alertas = despachos.filter(item => item.alerta || item.estado === "Alerta")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <h1 className="text-xl font-semibold text-gray-900">Alertas de Despacho</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Alertas Activas ({alertas.length})
            </CardTitle>
            <CardDescription>Despachos que requieren atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            {alertas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay alertas activas</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertas.map((item) => (
                    <TableRow key={item.id} className="bg-orange-50 hover:bg-orange-100">
                      <TableCell className="font-medium">#{item.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          {item.productos} unidades
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.destino}</TableCell>
                      <TableCell>{item.fecha}</TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                          {item.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Resolver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
