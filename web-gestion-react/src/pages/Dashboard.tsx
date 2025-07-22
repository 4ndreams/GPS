"use client"

import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import UsersManagement from "../components/UsersManagement"
import CotizacionesManagement from "../components/CotizacionesManagement"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertTriangle,
  BarChart3,
  Eye,
  Home,
  MoreHorizontal,
  Package,
  Search,
  Filter,
  Download,
  Bell,
  MessageSquare,
  Clock,
  TrendingUp,
  Settings,
  FileText,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Target,
  ChevronRight,
  Truck,
  Factory,
  DoorOpen,
  TreePine,
  Phone,
  User,
  Users,
  LogOut,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

// Datos específicos de TERPLAC - Órdenes de despacho
const ordenesDespacho = [
  {
    id: "OD-2025-001",
    fecha: "2025-01-15",
    trabajadorFabrica: "Carlos Mendoza",
    estado: "completado",
    prioridad: "normal",
    productos: [
      { tipo: "Puerta Enchapada", modelo: "PE-001", cantidad: 15, medida: "80x200cm" },
      { tipo: "Marco", modelo: "MR-001", cantidad: 15, medida: "80x200cm" },
    ],
    totalProductos: 30,
    valorTotal: 450000,
    fechaCreacion: "2025-01-15 08:30",
    fechaRecepcion: "2025-01-15 14:20",
    vendedora: "María González",
    observaciones: "Entrega completa sin novedades",
    tiempoDespacho: "5h 50min",
  },
  {
    id: "OD-2025-002",
    fecha: "2025-01-16",
    trabajadorFabrica: "Luis Rodríguez",
    estado: "alerta",
    prioridad: "alta",
    productos: [
      { tipo: "Puerta MDF", modelo: "PM-002", cantidad: 8, medida: "70x200cm" },
      { tipo: "Puerta Terciada", modelo: "PT-001", cantidad: 12, medida: "80x200cm" },
      { tipo: "Moldura", modelo: "ML-003", cantidad: 25, medida: "2.5m" },
    ],
    totalProductos: 45,
    valorTotal: 380000,
    fechaCreacion: "2025-01-16 09:15",
    fechaRecepcion: null,
    vendedora: "María González",
    observaciones: "Faltan 3 puertas MDF - Problema en producción",
    tiempoDespacho: null,
    faltantes: [{ tipo: "Puerta MDF", modelo: "PM-002", cantidad: 3 }],
  },
  {
    id: "OD-2025-003",
    fecha: "2025-01-17",
    trabajadorFabrica: "Ana Martín",
    estado: "pendiente",
    prioridad: "normal",
    productos: [
      { tipo: "Puerta Enchapada Honeycomb", modelo: "PEH-001", cantidad: 20, medida: "90x210cm" },
      { tipo: "Marco Enchapado", modelo: "ME-001", cantidad: 20, medida: "90x210cm" },
    ],
    totalProductos: 40,
    valorTotal: 680000,
    fechaCreacion: "2025-01-17 07:45",
    fechaRecepcion: null,
    vendedora: null,
    observaciones: "Orden lista para despacho",
    tiempoDespacho: null,
  },
  {
    id: "OD-2025-004",
    fecha: "2025-01-18",
    trabajadorFabrica: "Pedro Silva",
    estado: "en_transito",
    prioridad: "alta",
    productos: [
      { tipo: "Puerta Terciada Premium", modelo: "PTP-001", cantidad: 10, medida: "80x200cm" },
      { tipo: "Enchapado Decorativo", modelo: "ED-002", cantidad: 50, medida: "1.2x2.4m" },
    ],
    totalProductos: 60,
    valorTotal: 520000,
    fechaCreacion: "2025-01-18 10:20",
    fechaRecepcion: null,
    vendedora: null,
    observaciones: "Productos especiales para cliente corporativo",
    tiempoDespacho: null,
  },
  {
    id: "OD-2025-005",
    fecha: "2025-01-19",
    trabajadorFabrica: "Roberto Vega",
    estado: "rechazado",
    prioridad: "crítica",
    productos: [
      { tipo: "Puerta MDF", modelo: "PM-003", cantidad: 5, medida: "75x200cm" },
      { tipo: "Moldura Decorativa", modelo: "MD-001", cantidad: 15, medida: "3m" },
    ],
    totalProductos: 20,
    valorTotal: 180000,
    fechaCreacion: "2025-01-19 11:30",
    fechaRecepcion: "2025-01-19 16:45",
    vendedora: "María González",
    observaciones: "Defectos de calidad en 3 puertas - Requiere reposición",
    tiempoDespacho: "5h 15min",
    defectos: [{ tipo: "Puerta MDF", modelo: "PM-003", cantidad: 3, motivo: "Rayones en superficie" }],
  },
]

// Notificaciones específicas de TERPLAC
const notificaciones = [
  {
    id: 1,
    tipo: "alerta_faltante",
    mensaje: "Orden OD-2025-002: Faltan 3 puertas MDF modelo PM-002",
    tiempo: "hace 15 min",
    leida: false,
    orden: "OD-2025-002",
  },
  {
    id: 2,
    tipo: "rechazo_calidad",
    mensaje: "Orden OD-2025-005: Rechazada por defectos de calidad",
    tiempo: "hace 1 hora",
    leida: false,
    orden: "OD-2025-005",
  },
  {
    id: 3,
    tipo: "completado",
    mensaje: "Orden OD-2025-001: Recibida exitosamente en tienda",
    tiempo: "hace 3 horas",
    leida: true,
    orden: "OD-2025-001",
  },
  {
    id: 4,
    tipo: "nueva_orden",
    mensaje: "Nueva orden creada por Carlos Mendoza",
    tiempo: "hace 5 horas",
    leida: true,
    orden: "OD-2025-003",
  },
]

// Productos TERPLAC
const tiposProductos = [
  "Puerta Enchapada",
  "Puerta Terciada",
  "Puerta MDF",
  "Puerta Enchapada Honeycomb",
  "Marco",
  "Marco Enchapado",
  "Moldura",
  "Moldura Decorativa",
  "Enchapado Decorativo",
]

const getEstadoBadge = (estado: string) => {
  const estadoConfig = {
    completado: {
      variant: "default",
      className: "bg-green-100 text-green-800",
      icon: CheckCircle2,
      texto: "Completado",
    },
    alerta: {
      variant: "destructive",
      className: "bg-orange-100 text-orange-800",
      icon: AlertTriangle,
      texto: "Con Alertas",
    },
    pendiente: {
      variant: "secondary",
      className: "bg-blue-100 text-blue-800",
      icon: Clock,
      texto: "Pendiente Recepción",
    },
    en_transito: { variant: "default", className: "bg-purple-100 text-purple-800", icon: Truck, texto: "En Tránsito" },
    rechazado: { variant: "destructive", className: "bg-red-100 text-red-800", icon: XCircle, texto: "Rechazado" },
  }

  const config = estadoConfig[estado as keyof typeof estadoConfig] || estadoConfig.pendiente
  const Icon = config.icon

  return (
    <Badge variant={config.variant as "default" | "destructive" | "secondary"} className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.texto}
    </Badge>
  )
}

const getPrioridadBadge = (prioridad: string) => {
  const prioridadConfig = {
    crítica: { variant: "destructive", className: "text-xs animate-pulse" },
    alta: { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-100 text-xs" },
    normal: { variant: "secondary", className: "text-xs" },
    baja: { variant: "outline", className: "text-xs" },
  }

  const config = prioridadConfig[prioridad as keyof typeof prioridadConfig] || prioridadConfig.normal

  return (
    <Badge variant={config.variant as "default" | "destructive" | "secondary" | "outline"} className={config.className}>
      {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
    </Badge>
  )
}

export default function TerplacMundoPuertas() {
  const navigate = useNavigate()
  const { usuario, logout: authLogout } = useAuth()
  
  // Verificar si el usuario es administrador
  const isAdmin = usuario?.rol === 'administrador'
  
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedFilters, setSelectedFilters] = useState({
    estado: "todos",
    prioridad: "todos",
    trabajador: "todos",
    tipoProducto: "todos",
  })
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" })
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [refreshing, setRefreshing] = useState(false)
  
  // Estados para el menú de usuario
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  // Usar datos del usuario del contexto
  const user = usuario ? {
    name: usuario.nombre,
    email: usuario.email
  } : { name: "Usuario", email: "usuario@terplac.com" }

  // Protección: redirigir si no es admin y trata de acceder a usuarios
  useEffect(() => {
    if (activeTab === "usuarios" && !isAdmin) {
      setActiveTab("dashboard")
    }
  }, [activeTab, isAdmin])

  // Simulación de datos en tiempo real desde la app móvil
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshing(true)
      setTimeout(() => setRefreshing(false), 1000)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Filtrado y búsqueda específica para TERPLAC
  const filteredData = useMemo(() => {
    const filtered = ordenesDespacho.filter((orden) => {
      const matchesSearch =
        orden.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orden.trabajadorFabrica.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orden.vendedora?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orden.productos.some(
          (p) =>
            p.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.modelo.toLowerCase().includes(searchTerm.toLowerCase()),
        )

      const matchesFilters =
        (selectedFilters.estado === "todos" || orden.estado === selectedFilters.estado) &&
        (selectedFilters.prioridad === "todos" || orden.prioridad === selectedFilters.prioridad) &&
        (selectedFilters.trabajador === "todos" || orden.trabajadorFabrica === selectedFilters.trabajador) &&
        (selectedFilters.tipoProducto === "todos" ||
          orden.productos.some((p) => p.tipo === selectedFilters.tipoProducto))

      return matchesSearch && matchesFilters
    })

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a]
        const bValue = b[sortConfig.key as keyof typeof b]
        if (aValue == null || bValue == null) return 0
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [searchTerm, selectedFilters, sortConfig])

  // Estadísticas específicas de TERPLAC
  const stats = useMemo(() => {
    const total = ordenesDespacho.length
    const completadas = ordenesDespacho.filter((o) => o.estado === "completado").length
    const conAlertas = ordenesDespacho.filter((o) => o.estado === "alerta").length
    const pendientes = ordenesDespacho.filter((o) => o.estado === "pendiente").length
    const rechazadas = ordenesDespacho.filter((o) => o.estado === "rechazado").length
    const enTransito = ordenesDespacho.filter((o) => o.estado === "en_transito").length
    const valorTotal = ordenesDespacho.reduce((sum, orden) => sum + orden.valorTotal, 0)
    const productosTotal = ordenesDespacho.reduce((sum, orden) => sum + orden.totalProductos, 0)
    const eficiencia = Math.round((completadas / total) * 100)
    const tiempoPromedio = "4h 30min"

    return {
      total,
      completadas,
      conAlertas,
      pendientes,
      rechazadas,
      enTransito,
      valorTotal,
      productosTotal,
      eficiencia,
      tiempoPromedio,
      tendencia: "+8%",
    }
  }, [])

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    setSelectedRows((prev) => (prev.length === filteredData.length ? [] : filteredData.map((orden) => orden.id)))
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  const exportData = (_format: string) => {
    // Aquí iría la lógica de exportación
  }

  const handleLogout = () => {
    // Mostrar confirmación antes de cerrar sesión
    const confirmarLogout = window.confirm("¿Estás seguro de que quieres cerrar sesión?")
    
    if (confirmarLogout) {
      // Usar la función logout del AuthContext
      authLogout()
      
      // Redirigir al login
      navigate('/login')
    }
  }

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header TERPLAC */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <DoorOpen className="h-8 w-8 text-amber-600" />
                <TreePine className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">TERPLAC - Mundo Puertas</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <Factory className="h-3 w-3 mr-1" />
                  <span>Gestión Fábrica → Tienda</span>
                  <ChevronRight className="h-3 w-3 mx-1" />
                  <span className="capitalize">{activeTab}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Búsqueda específica */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por orden, trabajador, producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>

              {/* Sincronización con app móvil */}
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Sincronizando..." : "Sincronizar"}
              </Button>

              {/* Notificaciones de la app móvil */}
              <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative bg-transparent">
                    <Bell className="h-4 w-4" />
                    {notificaciones.filter((n) => !n.leida).length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                        {notificaciones.filter((n) => !n.leida).length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificaciones de Fábrica</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-64">
                    {notificaciones.map((notif) => (
                      <DropdownMenuItem key={notif.id} className={`p-3 ${!notif.leida ? "bg-blue-50" : ""}`}>
                        <div className="flex flex-col space-y-1 w-full">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {notif.orden}
                            </Badge>
                            <span className="text-xs text-gray-500">{notif.tiempo}</span>
                          </div>
                          <p className="text-sm">{notif.mensaje}</p>
                          {!notif.leida && <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Exportar datos */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => exportData("excel")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportData("pdf")}>
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportData("csv")}>
                    <FileText className="h-4 w-4 mr-2" />
                    CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Menú de Usuario */}
              <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 overflow-x-auto scrollbar-hide">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2 min-w-fit">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="ordenes" className="flex items-center space-x-2 min-w-fit">
              <Package className="h-4 w-4" />
              <span>Órdenes</span>
            </TabsTrigger>
            <TabsTrigger value="cotizaciones" className="flex items-center space-x-2 min-w-fit">
              <DoorOpen className="h-4 w-4" />
              <span>Cotizaciones</span>
            </TabsTrigger>
            {/* Solo mostrar el tab de usuarios si el usuario es administrador */}
            {isAdmin && (
              <TabsTrigger value="usuarios" className="flex items-center space-x-2 min-w-fit">
                <Users className="h-4 w-4" />
                <span>Usuarios</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="reportes" className="flex items-center space-x-2 min-w-fit">
              <BarChart3 className="h-4 w-4" />
              <span>Reportes</span>
            </TabsTrigger>
            <TabsTrigger value="configuracion" className="flex items-center space-x-2 min-w-fit">
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    {stats.tendencia} vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.completadas}</div>
                  <Progress value={(stats.completadas / stats.total) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Con Alertas</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.conAlertas}</div>
                  <p className="text-xs text-muted-foreground">Requieren atención</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
                  <Target className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.eficiencia}%</div>
                  <p className="text-xs text-muted-foreground">Tiempo promedio: {stats.tiempoPromedio}</p>
                </CardContent>
              </Card>
            </div>

            {/* Resumen por estado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Órdenes</CardTitle>
                  <CardDescription>Distribución actual de órdenes por estado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Completadas</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{stats.completadas}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>Pendientes</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{stats.pendientes}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-purple-600" />
                      <span>En Tránsito</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">{stats.enTransito}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span>Con Alertas</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">{stats.conAlertas}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Rechazadas</span>
                    </div>
                    <Badge className="bg-red-100 text-red-800">{stats.rechazadas}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumen Financiero</CardTitle>
                  <CardDescription>Valor total de órdenes procesadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">${stats.valorTotal.toLocaleString("es-CO")}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Productos:</span>
                      <span className="font-medium">{stats.productosTotal} unidades</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Valor Promedio/Orden:</span>
                      <span className="font-medium">
                        ${Math.round(stats.valorTotal / stats.total).toLocaleString("es-CO")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Órdenes Activas:</span>
                      <span className="font-medium">{stats.total - stats.completadas - stats.rechazadas}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Órdenes recientes con alertas */}
            <Card>
              <CardHeader>
                <CardTitle>Órdenes que Requieren Atención</CardTitle>
                <CardDescription>Órdenes con alertas o pendientes de recepción</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ordenesDespacho
                    .filter((orden) => orden.estado === "alerta" || orden.estado === "rechazado")
                    .map((orden) => (
                      <div key={orden.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium">{orden.id}</div>
                            <div className="text-sm text-gray-500">{orden.trabajadorFabrica}</div>
                          </div>
                          <div className="flex space-x-2">
                            {getEstadoBadge(orden.estado)}
                            {getPrioridadBadge(orden.prioridad)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${orden.valorTotal.toLocaleString("es-CO")}</div>
                          <div className="text-sm text-gray-500">{orden.totalProductos} productos</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Órdenes Tab */}
          <TabsContent value="ordenes" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filtros de Búsqueda</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                      value={selectedFilters.estado}
                      onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, estado: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los estados</SelectItem>
                        <SelectItem value="completado">Completado</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="alerta">Con Alertas</SelectItem>
                        <SelectItem value="en_transito">En Tránsito</SelectItem>
                        <SelectItem value="rechazado">Rechazado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prioridad">Prioridad</Label>
                    <Select
                      value={selectedFilters.prioridad}
                      onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, prioridad: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las prioridades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas las prioridades</SelectItem>
                        <SelectItem value="crítica">Crítica</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="baja">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trabajador">Trabajador</Label>
                    <Select
                      value={selectedFilters.trabajador}
                      onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, trabajador: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los trabajadores" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los trabajadores</SelectItem>
                        {Array.from(new Set(ordenesDespacho.map((o) => o.trabajadorFabrica))).map((trabajador) => (
                          <SelectItem key={trabajador} value={trabajador}>
                            {trabajador}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="producto">Tipo de Producto</Label>
                    <Select
                      value={selectedFilters.tipoProducto}
                      onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, tipoProducto: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los productos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los productos</SelectItem>
                        {tiposProductos.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de órdenes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Órdenes de Despacho ({filteredData.length})</CardTitle>
                  <div className="flex items-center space-x-2">
                    {selectedRows.length > 0 && <Badge variant="secondary">{selectedRows.length} seleccionadas</Badge>}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedFilters({
                          estado: "todos",
                          prioridad: "todos",
                          trabajador: "todos",
                          tipoProducto: "todos",
                        })
                      }
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedRows.length === filteredData.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("id")}>
                          Orden ID
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("fecha")}>
                          Fecha
                        </TableHead>
                        <TableHead>Trabajador Fábrica</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Prioridad</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("valorTotal")}>
                          Valor Total
                        </TableHead>
                        <TableHead>Vendedora</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map((orden) => (
                        <TableRow key={orden.id} className="hover:bg-gray-50">
                          <TableCell>
                            <Checkbox
                              checked={selectedRows.includes(orden.id)}
                              onCheckedChange={() => handleSelectRow(orden.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{orden.id}</TableCell>
                          <TableCell>{orden.fecha}</TableCell>
                          <TableCell>{orden.trabajadorFabrica}</TableCell>
                          <TableCell>{getEstadoBadge(orden.estado)}</TableCell>
                          <TableCell>{getPrioridadBadge(orden.prioridad)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{orden.totalProductos} unidades</div>
                              <div className="text-gray-500">{orden.productos.length} tipos diferentes</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">${orden.valorTotal.toLocaleString("es-CO")}</TableCell>
                          <TableCell>{orden.vendedora || "Sin asignar"}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Contactar Fábrica
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Exportar Orden
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                      Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                      {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} órdenes
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cotizaciones Tab */}
          <TabsContent value="cotizaciones" className="space-y-6">
            <CotizacionesManagement />
          </TabsContent>

          {/* Usuarios Tab - Solo para administradores */}
          {isAdmin && (
            <TabsContent value="usuarios" className="space-y-6">
              <UsersManagement />
            </TabsContent>
          )}

          {/* Reportes Tab */}
          <TabsContent value="reportes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Productividad por Trabajador</CardTitle>
                  <CardDescription>Órdenes completadas por trabajador de fábrica</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(new Set(ordenesDespacho.map((o) => o.trabajadorFabrica))).map((trabajador) => {
                      const ordenesCompletadas = ordenesDespacho.filter(
                        (o) => o.trabajadorFabrica === trabajador && o.estado === "completado",
                      ).length
                      const totalOrdenes = ordenesDespacho.filter((o) => o.trabajadorFabrica === trabajador).length
                      const porcentaje = Math.round((ordenesCompletadas / totalOrdenes) * 100)

                      return (
                        <div key={trabajador} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{trabajador}</span>
                            <span>
                              {ordenesCompletadas}/{totalOrdenes} ({porcentaje}%)
                            </span>
                          </div>
                          <Progress value={porcentaje} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Productos Más Despachados</CardTitle>
                  <CardDescription>Top productos por cantidad despachada</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tiposProductos.slice(0, 5).map((tipo) => {
                      const cantidad = ordenesDespacho.reduce((sum, orden) => {
                        return (
                          sum + orden.productos.filter((p) => p.tipo === tipo).reduce((pSum, p) => pSum + p.cantidad, 0)
                        )
                      }, 0)

                      return (
                        <div key={tipo} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{tipo}</span>
                          <Badge variant="secondary">{cantidad} unidades</Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Tiempos de Despacho</CardTitle>
                <CardDescription>Tiempo promedio desde creación hasta recepción</CardDescription>
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
          </TabsContent>

          {/* Configuración Tab */}
          <TabsContent value="configuracion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
                <CardDescription>Ajustes para la sincronización con la app móvil de fábrica</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Sincronización Automática</Label>
                      <p className="text-sm text-gray-500">Actualizar datos cada 30 segundos</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Notificaciones Push</Label>
                      <p className="text-sm text-gray-500">Recibir alertas de órdenes con problemas</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Exportación Automática</Label>
                      <p className="text-sm text-gray-500">Generar reportes diarios automáticamente</p>
                    </div>
                    <Checkbox />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Contacto de Soporte</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">+57 (1) 234-5678</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">soporte@terplac.com</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full">Guardar Configuración</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
