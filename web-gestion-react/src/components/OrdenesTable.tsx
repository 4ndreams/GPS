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
  XCircle,
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

interface OrdenesTableProps {
  ordenesDespacho: OrdenDespacho[]
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
      completado: {
        variant: "default" as const,
        className: "bg-green-100 text-green-800",
        icon: CheckCircle2,
        texto: "Completado",
      },
      alerta: {
        variant: "destructive" as const,
        className: "bg-orange-100 text-orange-800",
        icon: AlertTriangle,
        texto: "Con Alertas",
      },
      pendiente: {
        variant: "secondary" as const,
        className: "bg-blue-100 text-blue-800",
        icon: Clock,
        texto: "Pendiente Recepción",
      },
      en_transito: { 
        variant: "default" as const, 
        className: "bg-purple-100 text-purple-800", 
        icon: Truck, 
        texto: "En Tránsito" 
      },
      rechazado: { 
        variant: "destructive" as const, 
        className: "bg-red-100 text-red-800", 
        icon: XCircle, 
        texto: "Rechazado" 
      },
    }

    const config = estadoConfig[estado as keyof typeof estadoConfig] || estadoConfig.pendiente
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
    const matchesSearch = orden.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orden.trabajadorFabrica.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orden.vendedora?.toLowerCase().includes(searchTerm.toLowerCase())
    
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
              placeholder="Buscar por ID, trabajador o vendedora..."
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
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="alerta">Con Alertas</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_transito">En Tránsito</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
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
                <TableHead>Trabajador</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vendedora</TableHead>
                <TableHead className="w-12">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrdenes.map((orden) => (
                <TableRow key={orden.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(orden.id)}
                      onCheckedChange={() => onSelectRow(orden.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{orden.id}</TableCell>
                  <TableCell>{orden.trabajadorFabrica}</TableCell>
                  <TableCell>{getEstadoBadge(orden.estado)}</TableCell>
                  <TableCell>{getPrioridadBadge(orden.prioridad)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3 text-gray-400" />
                      {orden.totalProductos} unidades
                    </div>
                  </TableCell>
                  <TableCell>${orden.valorTotal.toLocaleString()}</TableCell>
                  <TableCell>{orden.fecha}</TableCell>
                  <TableCell>{orden.vendedora || "-"}</TableCell>
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