import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertTriangle,
  Eye,
  MoreHorizontal,
  Package,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Truck,
  Clock,
  RefreshCw,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { type Orden } from '../services/ordenService';

interface OrdenesTableProps {
  ordenesDespacho: Orden[]
  selectedRows: string[]
  onSelectRow: (id: string) => void
  onSelectAll: () => void
  onRefresh: () => void
  onExport: (format: string) => void
}

export default function OrdenesTable({
  ordenesDespacho,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onRefresh,
  onExport
}: OrdenesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [filterPrioridad, setFilterPrioridad] = useState("todos")

  const getEstadoBadge = (estado: string) => {
    const estadoConfig = {
      "Pendiente": {
        variant: "secondary" as const,
        className: "bg-blue-100 text-blue-800",
        icon: Clock,
        texto: "Pendiente",
      },
      "En producción": {
        variant: "default" as const,
        className: "bg-yellow-100 text-yellow-800",
        icon: Package,
        texto: "En Producción",
      },
      "Fabricada": {
        variant: "default" as const,
        className: "bg-green-100 text-green-800",
        icon: CheckCircle2,
        texto: "Fabricada",
      },
      "En tránsito": { 
        variant: "default" as const, 
        className: "bg-purple-100 text-purple-800", 
        icon: Truck, 
        texto: "En Tránsito" 
      },
      "Recibido": { 
        variant: "default" as const, 
        className: "bg-green-100 text-green-800", 
        icon: CheckCircle2, 
        texto: "Recibido" 
      },
      "Recibido con problemas": { 
        variant: "destructive" as const, 
        className: "bg-red-100 text-red-800", 
        icon: AlertTriangle, 
        texto: "Recibido con Problemas" 
      },
    }

    const config = estadoConfig[estado as keyof typeof estadoConfig] || estadoConfig["Pendiente"]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.texto}
      </Badge>
    )
  }

  const getPrioridadBadge = (prioridad: string) => {
    const prioridadConfig = {
      crítica: { variant: "destructive" as const, className: "text-xs animate-pulse" },
      alta: { variant: "destructive" as const, className: "bg-red-100 text-red-800 hover:bg-red-100 text-xs" },
      normal: { variant: "secondary" as const, className: "text-xs" },
      baja: { variant: "outline" as const, className: "text-xs" },
    }

    const config = prioridadConfig[prioridad as keyof typeof prioridadConfig] || prioridadConfig.normal

    return (
      <Badge variant={config.variant} className={config.className}>
        {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
      </Badge>
    )
  }

  const filteredOrdenes = ordenesDespacho.filter(orden => {
    const matchesSearch = orden.id_orden.toString().includes(searchTerm.toLowerCase()) ||
                         orden.usuario?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orden.producto?.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEstado = filterEstado === "todos" || orden.estado === filterEstado
    const matchesPrioridad = filterPrioridad === "todos" || orden.prioridad === filterPrioridad
    
    return matchesSearch && matchesEstado && matchesPrioridad
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Órdenes de Despacho ({filteredOrdenes.length})
            </CardTitle>
            <CardDescription>
              Gestión y seguimiento de órdenes de despacho TERPLAC
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Actualizar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onExport('excel')}>
                  Exportar a Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('pdf')}>
                  Exportar a PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('csv')}>
                  Exportar a CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por ID, usuario o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En producción">En Producción</SelectItem>
                <SelectItem value="Fabricada">Fabricada</SelectItem>
                <SelectItem value="En tránsito">En Tránsito</SelectItem>
                <SelectItem value="Recibido">Recibido</SelectItem>
                <SelectItem value="Recibido con problemas">Recibido con Problemas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPrioridad} onValueChange={setFilterPrioridad}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="crítica">Crítica</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === filteredOrdenes.length}
                    onCheckedChange={onSelectAll}
                  />
                </TableHead>
                <TableHead>ID Orden</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Fecha Solicitud</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead className="w-12">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrdenes.map((orden) => (
                <TableRow key={orden.id_orden} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(orden.id_orden.toString())}
                      onCheckedChange={() => onSelectRow(orden.id_orden.toString())}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{orden.id_orden}</TableCell>
                  <TableCell>{orden.usuario?.nombre || "-"}</TableCell>
                  <TableCell>{getEstadoBadge(orden.estado)}</TableCell>
                  <TableCell>{getPrioridadBadge(orden.prioridad || "normal")}</TableCell>
                  <TableCell>{orden.producto?.nombre_producto || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3 text-gray-400" />
                      {orden.cantidad} unidades
                    </div>
                  </TableCell>
                  <TableCell>{new Date(orden.fecha_solicitud).toLocaleDateString()}</TableCell>
                  <TableCell>{orden.origen || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Editar orden</DropdownMenuItem>
                        <DropdownMenuItem>Marcar como completada</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Cancelar orden
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 