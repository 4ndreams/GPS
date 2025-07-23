"use client"

import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import DashboardStats from "../components/DashboardStats"
import OrdenesTable from "../components/OrdenesTable"
import NotificacionesPanel from "../components/NotificacionesPanel"

interface OrdenDespacho {
  id: string;
  fecha: string;
  trabajadorFabrica: string;
  estado: string;
  prioridad: string;
  productos: Array<{
    tipo: string;
    modelo: string;
    cantidad: number;
    medida: string;
  }>;
  totalProductos: number;
  valorTotal: number;
  fechaCreacion: string;
  fechaRecepcion: string | null;
  vendedora: string | undefined;
  observaciones: string;
  tiempoDespacho: string | null;
  faltantes?: Array<{
    tipo: string;
    modelo: string;
    cantidad: number;
  }>;
  defectos?: Array<{
    tipo: string;
    modelo: string;
    cantidad: number;
    motivo: string;
  }>;
}

interface Notificacion {
  id: number;
  tipo: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
  orden?: string;
}

// Datos específicos de TERPLAC - Órdenes de despacho
const ordenesDespacho: OrdenDespacho[] = [
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
    vendedora: undefined,
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
    vendedora: undefined,
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
const notificaciones: Notificacion[] = [
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

export default function Dashboard() {
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  useEffect(() => {
    if (!authContext?.usuario) {
      navigate("/login")
    }
  }, [authContext?.usuario, navigate])

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev: string[]) => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    setSelectedRows((prev: string[]) => 
      prev.length === ordenesDespacho.length 
        ? [] 
        : ordenesDespacho.map(orden => orden.id)
    )
  }

  const handleRefresh = () => {
    // Aquí se implementaría la lógica para refrescar los datos
    console.log("Refrescando datos...")
  }

  const handleExport = (format: string) => {
    // Aquí se implementaría la lógica para exportar
    console.log(`Exportando en formato ${format}...`)
  }

  if (!authContext?.usuario) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard TERPLAC
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema de Gestión de Despachos - Bienvenido, {authContext.usuario.nombre}
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <DashboardStats ordenesDespacho={ordenesDespacho} />

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de órdenes */}
        <div className="lg:col-span-2">
          <OrdenesTable
            ordenesDespacho={ordenesDespacho}
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />
        </div>

        {/* Panel de notificaciones */}
        <div className="lg:col-span-1">
          <NotificacionesPanel notificaciones={notificaciones} />
        </div>
      </div>
    </div>
  )
}