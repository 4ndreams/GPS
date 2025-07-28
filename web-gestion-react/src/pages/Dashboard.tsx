"use client"

import  { useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import DashboardStats from '../components/DashboardStats'
import OrdenesTable from '../components/OrdenesTable'
import NotificacionesPanel from '../components/NotificacionesPanel'
import UsersManagement from '../components/UsersManagement'
import CotizacionesManagement from '../components/CotizacionesManagement'
import ComprarBodega from '../components/ComprarBodega'
import AñadirPuertasForm from '../components/añadirProducto'
import MaterialesRellenos from '../components/MaterialesRellenos'
import OrdenDetallesModal from '../components/OrdenDetallesModal'
import { useOrdenes } from "../hooks/useOrdenes"
import { useNotificaciones } from "../hooks/useNotificaciones"
import { useWebSocket } from "../hooks/useWebSocket"
import { useOrdenActions } from "../hooks/useOrdenActions"
import { exportToPDF, exportToExcel, exportToCSV } from "../services/exportService"

export default function Dashboard() {
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'ordenes' | 'usuarios' | 'cotizaciones' | 'compras' | 'produccion' | 'materiales'>('ordenes')
  const [modalOrden, setModalOrden] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Usar hooks para obtener datos del backend
  const { ordenes, loading: ordenesLoading, refetch: refetchOrdenes } = useOrdenes()
  const { notificacionesNoLeidas, marcarComoLeida, marcarTodasComoLeidas, refetch: refetchNotificaciones } = useNotificaciones()
  const { marcarComoCompletada, cancelarOrden } = useOrdenActions()

  // Callbacks estables para WebSocket
  const handleOrdenActualizada = useCallback(() => {
    console.log('🔄 Orden actualizada recibida')
    refetchOrdenes() // Recargar órdenes
  }, [refetchOrdenes])

  const handleNuevaNotificacion = useCallback(() => {
    console.log('🔔 Nueva notificación recibida')
    refetchNotificaciones() // Recargar notificaciones
  }, [refetchNotificaciones])

  // Configurar WebSocket para actualizaciones en tiempo real
  useWebSocket(handleOrdenActualizada, handleNuevaNotificacion)

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

  const ordenesDespacho = ordenesLoading ? [] : ordenes; // No usar datos de ejemplo

  const handleSelectAll = () => {
    setSelectedRows((prev: string[]) =>
      prev.length === ordenesDespacho.length
        ? []
        : ordenesDespacho.map((orden: any) => orden.id) // Cast to any to resolve type error
    )
  }

  const handleRefresh = () => {
    refetchOrdenes();
    refetchNotificaciones();
  }

  const handleExport = (format: string) => {
    const filename = `ordenes-despacho-${new Date().toISOString().split('T')[0]}`
    
    switch (format) {
      case 'pdf':
        exportToPDF(ordenesDespacho, filename)
        break
      case 'excel':
        exportToExcel(ordenesDespacho, filename)
        break
      case 'csv':
        exportToCSV(ordenesDespacho, filename)
        break
      default:
        console.log(`Formato no soportado: ${format}`)
    }
  }

  const handleVerDetalles = (orden: any) => {
    setModalOrden(orden)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalOrden(null)
  }

  if (!authContext?.usuario) {
    return null
  }

  return (
    <div className="space-y-6"> {/* Changed from min-h-screen bg-gray-50 */}
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard TERPLAC</h1>
        <p className="text-gray-600 mt-2">
          Sistema de Gestión de Despachos, Usuarios y Cotizaciones - Bienvenido, {authContext.usuario.nombre}.
        </p>

      </div>

      {/* Tab buttons */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('ordenes')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'ordenes'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Órdenes
        </button>
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'usuarios'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Usuarios
        </button>
        <button
          onClick={() => setActiveTab('cotizaciones')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'cotizaciones'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Cotizaciones
        </button>
        <button
          onClick={() => setActiveTab('compras')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'compras'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Compras
        </button>
        <button
          onClick={() => setActiveTab('produccion')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'produccion'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Producción
        </button>
        <button
          onClick={() => setActiveTab('materiales')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'materiales'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Materiales
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'ordenes' && <DashboardStats ordenesDespacho={ordenesDespacho as any} />}
      {activeTab === 'ordenes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OrdenesTable
              ordenesDespacho={ordenesDespacho as any}
              selectedRows={selectedRows}
              onSelectRow={handleSelectRow}
              onSelectAll={handleSelectAll}
              onRefresh={handleRefresh}
              onExport={handleExport}
              onVerDetalles={handleVerDetalles}
              onMarcarCompletada={marcarComoCompletada}
              onCancelarOrden={cancelarOrden}
            />
          </div>
          <div className="lg:col-span-1">
            <NotificacionesPanel 
              notificaciones={notificacionesNoLeidas as any} 
              onMarcarComoLeida={marcarComoLeida}
              onMarcarTodasComoLeidas={marcarTodasComoLeidas}
            />
          </div>
        </div>
      )}
      {activeTab === 'usuarios' && <UsersManagement />}
      {activeTab === 'cotizaciones' && <CotizacionesManagement />}
      {activeTab === 'compras' && <ComprarBodega />}
      {activeTab === 'produccion' && <AñadirPuertasForm />}
      {activeTab === 'materiales' && <MaterialesRellenos />}
      
      {/* Modal de detalles de orden */}
      <OrdenDetallesModal
        orden={modalOrden}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}