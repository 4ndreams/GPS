import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Filter, Layers, Package, MoreHorizontal, Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import EditMaterialRellenoDialog from './EditMaterialRellenoDialog';
import Notification from './Notification';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export interface Material {
  id_material: number;
  nombre_material: string;
  caracteristicas?: string;
}

export interface Relleno {
  id_relleno: number;
  nombre_relleno: string;
  caracteristicas?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message ?? 'Error en la petición');
  }
  return response.json();
};

export const obtenerMateriales = async (): Promise<Material[]> => {
  try {
    const result = await apiCall('/materiales');
    let data = result.data ?? [];
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      data = data[0];
    }
    return Array.isArray(data) ? data.filter(material => material?.id_material) : [];
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    throw new Error('No se pudieron cargar los materiales disponibles');
  }
};

export const obtenerRellenos = async (): Promise<Relleno[]> => {
  try {
    const result = await apiCall('/rellenos');
    let data = result.data ?? [];
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      data = data[0];
    }
    return Array.isArray(data) ? data.filter(relleno => relleno?.id_relleno) : [];
  } catch (error) {
    console.error('Error al obtener rellenos:', error);
    throw new Error('No se pudieron cargar los rellenos disponibles');
  }
};


type Item = {
  id: number;
  nombre: string;
  caracteristicas?: string;
  tipo: 'Material' | 'Relleno';
};

const MaterialesRellenos: React.FC = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [rellenos, setRellenos] = useState<Relleno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'Material' | 'Relleno'>('todos');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [mats, rells] = await Promise.all([
          obtenerMateriales(),
          obtenerRellenos(),
        ]);
        setMateriales(mats);
        setRellenos(rells);
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Unificar materiales y rellenos en un solo array
  const items: Item[] = [
    ...materiales.map((m) => ({
      id: m.id_material,
      nombre: m.nombre_material,
      caracteristicas: m.caracteristicas,
      tipo: 'Material' as const,
    })),
    ...rellenos.map((r) => ({
      id: r.id_relleno,
      nombre: r.nombre_relleno,
      caracteristicas: r.caracteristicas,
      tipo: 'Relleno' as const,
    })),
  ];

  // Filtros y orden descendente por id
  const filteredItems = items
    .filter(item => {
      const matchesTipo = tipoFiltro === 'todos' || item.tipo === tipoFiltro;
      const matchesNombre = searchTerm === '' || item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTipo && matchesNombre;
    })
    .sort((a, b) => b.id - a.id); // Ordenar por id descendente

  // Paginación
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, tipoFiltro, materiales, rellenos]);

  return (
    <div className="space-y-8">
      {/* Tarjetas de conteo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><Package className="h-5 w-5 text-blue-600" />Materiales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{materiales.length}</div>
            <p className="text-xs text-muted-foreground">Total de materiales registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><Layers className="h-5 w-5 text-green-600" />Rellenos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{rellenos.length}</div>
            <p className="text-xs text-muted-foreground">Total de rellenos registrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2"><Filter className="h-5 w-5" /><span>Filtros de búsqueda</span></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Buscar por nombre</div>
              <Input
                placeholder="Nombre de material o relleno..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Tipo</div>
              <Select value={tipoFiltro} onValueChange={v => setTipoFiltro(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Material">Material</SelectItem>
                  <SelectItem value="Relleno">Relleno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">Mostrando {filteredItems.length} de {items.length} registros</div>
        </CardContent>
      </Card>

      {/* Tabla unificada */}
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Características</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(() => {
              if (loading) {
                return <tr><td colSpan={5} className="text-center py-6">Cargando...</td></tr>;
              }
              if (error) {
                return <tr><td colSpan={5} className="text-center text-red-600 py-6">{error}</td></tr>;
              }
              if (filteredItems.length === 0) {
                return <tr><td colSpan={5} className="text-center py-6">No hay registros disponibles.</td></tr>;
              }
              return paginatedItems.map((item) => (
                <tr key={item.tipo + '-' + item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{item.id}</td>
                  <td className="px-4 py-2">{item.nombre}</td>
                  <td className="px-4 py-2">{item.tipo}</td>
                  <td className="px-4 py-2">
                    {(() => {
                      let displayCaracteristicas = '—';
                      if (item.caracteristicas) {
                        displayCaracteristicas =
                          item.caracteristicas.length > 30
                            ? item.caracteristicas.slice(0, 30) + '...'
                            : item.caracteristicas;
                      }
                      return displayCaracteristicas;
                    })()}
                  </td>
                  <td className="px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(item);
                            setShowDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(item);
                            setShowEdit(true);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-2" />Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>

        {/* Paginación */}
        {filteredItems.length > pageSize && (
          <div className="flex justify-between items-center mt-4 px-4 pb-4">
            <span className="text-sm text-gray-600 flex items-center h-8">
              Mostrando {((currentPage - 1) * pageSize) + 1}
              -{Math.min(currentPage * pageSize, filteredItems.length)} de {filteredItems.length}
            </span>
            <div className="flex gap-2 items-center h-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Anterior
              </Button>
              <span className="text-sm px-2 flex items-center" style={{ minHeight: '2rem' }}>Página {currentPage} de {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Siguiente →
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Modales de detalles y edición (solo placeholders, debes implementar los componentes reales) */}
      {/* Dialogo de detalles */}
      {showDetails && selectedItem && (
        <Dialog open={showDetails} onOpenChange={open => {
          if (!open) {
            setShowDetails(false);
            setSelectedItem(null);
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles de {selectedItem.tipo}</DialogTitle>
              <DialogDescription>
                Información detallada del {selectedItem.tipo.toLowerCase()} seleccionado.
              </DialogDescription>
            </DialogHeader>
            <div className="mb-2"><b>ID:</b> {selectedItem.id}</div>
            <div className="mb-2"><b>Nombre:</b> {selectedItem.nombre}</div>
            <div className="mb-2"><b>Tipo:</b> {selectedItem.tipo}</div>
            <div className="mb-2"><b>Características:</b> {selectedItem.caracteristicas || '—'}</div>
            <DialogFooter>
              <Button onClick={() => {
                setShowDetails(false);
                setSelectedItem(null);
              }} variant="outline">Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {/* Dialogo de edición */}
      {showEdit && selectedItem && (
        <Dialog open={showEdit} onOpenChange={open => {
          if (!open) {
            setShowEdit(false);
            setSelectedItem(null);
          }
        }}>
          <EditMaterialRellenoDialog
            item={selectedItem}
            onClose={() => {
              setShowEdit(false);
              setSelectedItem(null);
            }}
            onItemUpdated={async () => {
              setShowEdit(false);
              setSelectedItem(null);
              setLoading(true);
              try {
                const [mats, rells] = await Promise.all([
                  obtenerMateriales(),
                  obtenerRellenos(),
                ]);
                setMateriales(mats);
                setRellenos(rells);
                setNotification({
                  type: 'success',
                  title: 'Edición exitosa',
                  message: 'El registro fue actualizado correctamente.'
                });
              } catch (err: any) {
                setError(err.message || 'Error al cargar datos');
                setNotification({
                  type: 'error',
                  title: 'Error al actualizar',
                  message: err.message || 'No se pudo actualizar el registro.'
                });
              } finally {
                setLoading(false);
              }
            }}
          />
        </Dialog>
      )}

      {/* Notificación visual */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      
    </div>
  );
};

export default MaterialesRellenos;

