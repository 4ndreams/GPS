import React from 'react';
import OrdenesTable from '../components/OrdenesTable';
import { useOrdenes } from '../hooks/useOrdenes';

export default function OrdenesPage() {
  const { ordenes, loading, error, refresh } = useOrdenes();
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev: string[]) => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows((prev: string[]) => 
      prev.length === ordenes.length 
        ? [] 
        : ordenes.map(orden => orden.id_orden.toString())
    );
  };

  const handleRefresh = () => {
    refresh();
  };

  const handleExport = (format: string) => {
    console.log(`Exportando en formato ${format}...`);
  };

  // Mostrar indicador de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">⚠️ Error al cargar órdenes</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
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

      {/* Tabla de órdenes */}
      <OrdenesTable
        ordenesDespacho={ordenes}
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />
    </div>
  );
} 