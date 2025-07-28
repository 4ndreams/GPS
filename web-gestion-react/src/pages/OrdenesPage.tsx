import React, { useCallback, useState } from 'react';
import OrdenesTable from '../components/OrdenesTable';
import { useOrdenes } from '../hooks/useOrdenes';
import { useNotificaciones } from '../hooks/useNotificaciones';
import { useOrdenActions } from '../hooks/useOrdenActions';
import NotificacionesPanel from '../components/NotificacionesPanel';
import OrdenDetallesModal from '../components/OrdenDetallesModal';
import { useWebSocket } from '../hooks/useWebSocket';
import { exportToPDF, exportToExcel, exportToCSV } from "../services/exportService"

export default function OrdenesPage() {
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [modalOrden, setModalOrden] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Usar hooks para obtener datos del backend
  const { ordenes, loading: ordenesLoading, refetch: refetchOrdenes } = useOrdenes();
  const { notificacionesNoLeidas, marcarComoLeida, marcarTodasComoLeidas, refetch: refetchNotificaciones } = useNotificaciones();
  const { marcarComoCompletada, cancelarOrden } = useOrdenActions();

  // Callbacks estables para WebSocket
  const handleOrdenActualizada = useCallback(() => {
    console.log('🔄 Orden actualizada recibida');
    refetchOrdenes(); // Recargar órdenes
  }, [refetchOrdenes]);

  const handleNuevaNotificacion = useCallback(() => {
    console.log('🔔 Nueva notificación recibida');
    refetchNotificaciones(); // Recargar notificaciones
  }, [refetchNotificaciones]);

  // Configurar WebSocket para actualizaciones en tiempo real
  useWebSocket(handleOrdenActualizada, handleNuevaNotificacion);

  // Usar solo datos del backend - si no hay datos, mostrar array vacío
  const ordenesDespacho = ordenesLoading ? [] : ordenes;

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev: string[]) =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows((prev: string[]) =>
      prev.length === ordenesDespacho.length
        ? []
        : ordenesDespacho.map((orden: any) => orden.id)
    );
  };

  const handleRefresh = () => {
    // Refrescar datos del backend
    refetchOrdenes();
    refetchNotificaciones();
  };

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
  };

  const handleVerDetalles = (orden: any) => {
    setModalOrden(orden)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalOrden(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Órdenes de Despacho
          </h1>
          <p className="text-gray-600 mt-1">
            Gestión y seguimiento de órdenes de despacho TERPLAC
          </p>

        </div>
      </div>

      {/* Layout con tabla y notificaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de órdenes */}
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
        {/* Panel de notificaciones */}
        <div className="lg:col-span-1 h-fit">
          <NotificacionesPanel 
            notificaciones={notificacionesNoLeidas as any} 
            onMarcarComoLeida={marcarComoLeida}
            onMarcarTodasComoLeidas={marcarTodasComoLeidas}
          />
        </div>
      </div>
      
      {/* Modal de detalles de orden */}
      <OrdenDetallesModal
        orden={modalOrden}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
} 