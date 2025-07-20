import React from 'react';
import OrdenesTable from '../components/OrdenesTable';

// Datos específicos de TERPLAC - Órdenes de despacho
const ordenesDespacho = [
  {
    id: "OD-2025-001",
    fecha: "2025-01-15",
    trabajadorFabrica: "Carlos Mendoza",
    estado: "completado",
    prioridad: "normal",
    totalProductos: 30,
    valorTotal: 450000,
    vendedora: "María González",
  },
  {
    id: "OD-2025-002",
    fecha: "2025-01-16",
    trabajadorFabrica: "Luis Rodríguez",
    estado: "alerta",
    prioridad: "alta",
    totalProductos: 45,
    valorTotal: 380000,
    vendedora: "María González",
  },
  {
    id: "OD-2025-003",
    fecha: "2025-01-17",
    trabajadorFabrica: "Ana Martín",
    estado: "pendiente",
    prioridad: "normal",
    totalProductos: 40,
    valorTotal: 680000,
    vendedora: undefined,
  },
  {
    id: "OD-2025-004",
    fecha: "2025-01-18",
    trabajadorFabrica: "Pedro Silva",
    estado: "en_transito",
    prioridad: "alta",
    totalProductos: 60,
    valorTotal: 520000,
    vendedora: undefined,
  },
  {
    id: "OD-2025-005",
    fecha: "2025-01-19",
    trabajadorFabrica: "Roberto Vega",
    estado: "rechazado",
    prioridad: "crítica",
    totalProductos: 20,
    valorTotal: 180000,
    vendedora: "María González",
  },
];

export default function OrdenesPage() {
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
      prev.length === ordenesDespacho.length 
        ? [] 
        : ordenesDespacho.map(orden => orden.id)
    );
  };

  const handleRefresh = () => {
    console.log("Refrescando datos...");
  };

  const handleExport = (format: string) => {
    console.log(`Exportando en formato ${format}...`);
  };

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
        ordenesDespacho={ordenesDespacho}
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />
    </div>
  );
} 