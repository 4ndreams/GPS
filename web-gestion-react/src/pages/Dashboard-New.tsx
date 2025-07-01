import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, BarChart3, Check, Edit, Eye, Home, MoreHorizontal, Package, Search, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Datos de ejemplo expandidos
const inventoryData = [
  {
    id: 1,
    productos: 45,
    destino: "Almacén Central",
    fecha: "20-05-2025",
    estado: "completado",
    prioridad: "normal",
  },
  {
    id: 2,
    productos: 30,
    destino: "Tienda",
    fecha: "21-05-2025",
    estado: "alerta",
    prioridad: "alta",
  },
  {
    id: 3,
    productos: 67,
    destino: "Sucursal Norte",
    fecha: "22-05-2025",
    estado: "pendiente",
    prioridad: "normal",
  },
  {
    id: 4,
    productos: 12,
    destino: "Centro de Distribución",
    fecha: "23-05-2025",
    estado: "alerta",
    prioridad: "crítica",
  },
  {
    id: 5,
    productos: 89,
    destino: "Tienda Online",
    fecha: "24-05-2025",
    estado: "completado",
    prioridad: "baja",
  },
]

const getStatusBadge = (estado: string) => {
  switch (estado) {
    case "completado":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          Completado
        </Badge>
      )
    case "alerta":
      return (
        <Badge variant="destructive" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          Alerta
        </Badge>
      )
    case "pendiente":
      return <Badge variant="secondary">Pendiente</Badge>
    default:
      return <Badge variant="outline">{estado}</Badge>
  }
}

const getPriorityBadge = (prioridad: string) => {
  switch (prioridad) {
    case "crítica":
      return (
        <Badge variant="destructive" className="text-xs">
          Crítica
        </Badge>
      )
    case "alta":
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">
          Alta
        </Badge>
      )
    case "normal":
      return (
        <Badge variant="secondary" className="text-xs">
          Normal
        </Badge>
      )
    case "baja":
      return (
        <Badge variant="outline" className="text-xs">
          Baja
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-xs">
          {prioridad}
        </Badge>
      )
  }
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("inicio")

  const filteredData = inventoryData.filter(
    (item) => item.destino.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toString().includes(searchTerm),
  )

  const stats = {
    total: inventoryData.length,
    alertas: inventoryData.filter((item) => item.estado === "alerta").length,
    completados: inventoryData.filter((item) => item.estado === "completado").length,
    pendientes: inventoryData.filter((item) => item.estado === "pendiente").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mejorado */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Sistema de Inventario</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por destino o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navegación de pestañas mejorada */}
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="inicio" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Inicio
            </TabsTrigger>
            <TabsTrigger value="alertas" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas
              {stats.alertas > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {stats.alertas}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="graficos" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Gráficos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inicio" className="space-y-6">
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Envíos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Todos los registros</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alertas</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.alertas}</div>
                  <p className="text-xs text-muted-foreground">Requieren atención</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completados</CardTitle>
                  <Check className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.completados}</div>
                  <p className="text-xs text-muted-foreground">Finalizados</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                  <Package className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.pendientes}</div>
                  <p className="text-xs text-muted-foreground">En proceso</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabla mejorada */}
            <Card>
              <CardHeader>
                <CardTitle>Inventario de Productos</CardTitle>
                <CardDescription>Gestiona y monitorea todos los envíos de productos</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">ID</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">#{item.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            {item.productos} unidades
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.destino}</TableCell>
                        <TableCell className="text-gray-600">{item.fecha}</TableCell>
                        <TableCell>{getPriorityBadge(item.prioridad)}</TableCell>
                        <TableCell>{getStatusBadge(item.estado)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alertas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Alertas Activas
                </CardTitle>
                <CardDescription>Envíos que requieren atención inmediata</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData
                      .filter((item) => item.estado === "alerta")
                      .map((item) => (
                        <TableRow key={item.id} className="bg-orange-50 hover:bg-orange-100">
                          <TableCell className="font-medium">#{item.id}</TableCell>
                          <TableCell>{item.productos} unidades</TableCell>
                          <TableCell className="font-medium">{item.destino}</TableCell>
                          <TableCell>{item.fecha}</TableCell>
                          <TableCell>{getPriorityBadge(item.prioridad)}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              Resolver
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="graficos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Análisis y Gráficos
                </CardTitle>
                <CardDescription>Visualización de datos del inventario</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Los gráficos se mostrarán aquí</p>
                  <p className="text-sm">Próximamente disponible</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
