"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { useDashboardData } from "../hooks/useDashboardData"

import DashboardStats from "../components/DashboardStats"
import OrdenesTable from "../components/OrdenesTable"
import NotificacionesPanel from "../components/NotificacionesPanel"

// Las interfaces se importan desde los servicios

// Los datos ahora se obtienen desde el backend a través del hook useDashboardData

export default function Dashboard() {
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'ordenes' | 'usuarios' | 'cotizaciones'>('ordenes')
  
  // Usar el hook personalizado para obtener datos del dashboard
  const { ordenes, notificaciones, loading, error, refresh } = useDashboardData()

  // Verificar autenticación
  if (!authContext?.usuario) {
    navigate("/login")
    return null
  }

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev: string[]) => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    setSelectedRows((prev: string[]) => 
      prev.length === ordenes.length 
        ? [] 
        : ordenes.map(orden => orden.id_orden.toString())
    )
  }

  const handleRefresh = () => {
    refresh()
  }

  const handleExport = (format: string) => {
    // Aquí se implementaría la lógica para exportar
    console.log(`Exportando en formato ${format}...`)
  }

  if (!authContext?.usuario) {
    return null
  }

  // Mostrar indicador de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del dashboard...</p>
        </div>
      </div>
    )
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">⚠️ Error al cargar datos</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
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
            Sistema de Gestión de Despachos, Usuarios y Cotizaciones - Bienvenido, {authContext.usuario.nombre}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-2">
        <button
          className={`px-5 py-2 rounded-xl font-semibold shadow-sm transition-all duration-200 border focus:outline-none
            ${activeTab === 'ordenes'
              ? 'bg-white text-[#b71c1c] border-[#b71c1c] shadow-md'
              : 'bg-transparent text-gray-600 border-transparent hover:bg-[#fff3f3] hover:text-[#b71c1c]'}
          `}
          onClick={() => setActiveTab('ordenes')}
        >Órdenes</button>
        <button
          className={`px-5 py-2 rounded-xl font-semibold shadow-sm transition-all duration-200 border focus:outline-none
            ${activeTab === 'usuarios'
              ? 'bg-white text-[#b71c1c] border-[#b71c1c] shadow-md'
              : 'bg-transparent text-gray-600 border-transparent hover:bg-[#fff3f3] hover:text-[#b71c1c]'}
          `}
          onClick={() => setActiveTab('usuarios')}
        >Usuarios</button>
        <button
          className={`px-5 py-2 rounded-xl font-semibold shadow-sm transition-all duration-200 border focus:outline-none
            ${activeTab === 'cotizaciones'
              ? 'bg-white text-[#b71c1c] border-[#b71c1c] shadow-md'
              : 'bg-transparent text-gray-600 border-transparent hover:bg-[#fff3f3] hover:text-[#b71c1c]'}
          `}
          onClick={() => setActiveTab('cotizaciones')}
        >Cotizaciones</button>
      </div>

      {/* Estadísticas solo para Órdenes */}
      {activeTab === 'ordenes' && <DashboardStats ordenesDespacho={ordenes} />}

      {/* Contenido principal según la pestaña activa */}
      {activeTab === 'ordenes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tabla de órdenes */}
          <div className="lg:col-span-2">
            <OrdenesTable
              ordenesDespacho={ordenes}
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
      )}
        {/* Panel de notificaciones */}
        <div className="lg:col-span-1">
          <NotificacionesPanel notificaciones={notificaciones} />
        </div>
      </div>
  )
}