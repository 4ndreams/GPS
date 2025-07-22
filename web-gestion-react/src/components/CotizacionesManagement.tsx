import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { cotizacionService, type CotizacionResponse, ESTADOS_COTIZACION, type EstadoCotizacion } from '../services/cotizacionService';
import UnauthorizedAccess from './UnauthorizedAccess';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  RefreshCw,
  DollarSign,
  Settings,
  Eye,
  MoreHorizontal,
  XCircle,
  Search,
  DoorOpen,
  Clock,
  Package,
} from "lucide-react";

export default function CotizacionesManagement() {
  const { usuario } = useAuth();
  const [cotizaciones, setCotizaciones] = useState<CotizacionResponse[]>([]);
  const [loadingCotizaciones, setLoadingCotizaciones] = useState(false);
  const [cotizacionesError, setCotizacionesError] = useState<string | null>(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');

  // Estados para diálogos
  const [showPrecioDialog, setShowPrecioDialog] = useState(false);
  const [showEstadoDialog, setShowEstadoDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] = useState<CotizacionResponse | null>(null);
  const [precioInput, setPrecioInput] = useState('');
  const [estadoInput, setEstadoInput] = useState<EstadoCotizacion>('Solicitud Recibida');

  // Helper para verificar si hay filtros activos
  const hasActiveFilters = searchTerm || (selectedEstado !== '' && selectedEstado !== 'todos') || (selectedTipo !== '' && selectedTipo !== 'todos');

  // Helper function para obtener el color específico del estado
  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'Solicitud Recibida':
        return '#6b7280'; // Gris (outline style)
      case 'En Proceso':
        return '#9ca3af'; // Gris claro (secondary style)
      case 'Lista para retirar':
        return '#374151'; // Gris oscuro (default style)
      case 'Cancelada':
        return '#dc2626'; // Rojo (destructive style)
      case 'Producto Entregado':
        return '#16a34a'; // Verde (success style)
      default:
        return '#6b7280'; // Gris (outline style)
    }
  };

  // Helper function para determinar la variante del badge del estado
  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'Solicitud Recibida': return 'outline';
      case 'En Proceso': return 'secondary';
      case 'Lista para retirar': return 'default';
      case 'Cancelada': return 'destructive';
      case 'Producto Entregado': return 'default';
      default: return 'outline';
    }
  };

  // Helper function para obtener el icono del estado
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Solicitud Recibida': return Clock;
      case 'En Proceso': return Settings;
      case 'Lista para retirar': return Package;
      case 'Cancelada': return XCircle;
      case 'Producto Entregado': return Package;
      default: return Clock;
    }
  };

  // Función para filtrar y ordenar cotizaciones
  const filteredCotizaciones = cotizaciones
    .filter(cotizacion => {
      const matchesSearch = searchTerm === '' || 
        cotizacion.id_producto_personalizado.toString().includes(searchTerm) ||
        cotizacion.nombre_apellido_contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.email_contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.telefono_contacto.includes(searchTerm);
      
      const matchesEstado = selectedEstado === '' || selectedEstado === 'todos' || cotizacion.estado === selectedEstado;
      const matchesTipo = selectedTipo === '' || selectedTipo === 'todos' || cotizacion.tipo_puerta === selectedTipo;
      
      return matchesSearch && matchesEstado && matchesTipo;
    })
    .sort((a, b) => b.id_producto_personalizado - a.id_producto_personalizado); // Ordenar por ID de mayor a menor

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedEstado('');
    setSelectedTipo('');
  };

  // Función para cargar cotizaciones
  const loadCotizaciones = async () => {
    setLoadingCotizaciones(true);
    setCotizacionesError(null);
    try {
      const data = await cotizacionService.getAllCotizaciones();
      setCotizaciones(data);
    } catch (error) {
      setCotizacionesError(error instanceof Error ? error.message : 'Error al cargar cotizaciones');
    } finally {
      setLoadingCotizaciones(false);
    }
  };

  // Funciones para manejar diálogos
  const handleViewDetails = (cotizacion: CotizacionResponse) => {
    setSelectedCotizacion(cotizacion);
    setShowDetailsDialog(true);
  };

  const handleUpdatePrecio = (cotizacion: CotizacionResponse) => {
    setSelectedCotizacion(cotizacion);
    setPrecioInput(cotizacion.precio?.toString() || '');
    setShowPrecioDialog(true);
  };

  const handleUpdateEstado = (cotizacion: CotizacionResponse) => {
    setSelectedCotizacion(cotizacion);
    setEstadoInput(cotizacion.estado as EstadoCotizacion);
    setShowEstadoDialog(true);
  };

  // Función para actualizar precio
  const updatePrecio = async () => {
    if (!selectedCotizacion || !precioInput) return;
    
    try {
      const precio = parseInt(precioInput);
      if (precio <= 0) {
        alert('El precio debe ser mayor a 0');
        return;
      }

      await cotizacionService.updatePrecio(selectedCotizacion.id_producto_personalizado, { precio });
      setShowPrecioDialog(false);
      loadCotizaciones();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al actualizar precio');
    }
  };

  // Función para actualizar estado
  const updateEstado = async () => {
    if (!selectedCotizacion) return;
    
    try {
      await cotizacionService.updateEstado(selectedCotizacion.id_producto_personalizado, { estado: estadoInput });
      setShowEstadoDialog(false);
      loadCotizaciones();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al actualizar estado');
    }
  };

  // Formatear funciones
  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMedidas = (ancho: number, alto: number, largo: number): string => {
    return `${ancho}×${alto}×${largo}`;
  };

  const formatearTipoPuerta = (tipo: string): string => {
    switch (tipo) {
      case 'puertaPaso': return 'Puerta de Paso';
      case 'puertaCloset': return 'Puerta de Closet';
      default: return tipo;
    }
  };

  const formatearPrecio = (precio?: number): string => {
    if (!precio) return 'Sin asignar';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio);
  };

  // Función para calcular estadísticas por estado
  const getEstadisticasEstados = () => {
    const stats = ESTADOS_COTIZACION.map(estado => {
      const cantidad = cotizaciones.filter(c => c.estado === estado).length;
      return {
        estado,
        cantidad,
        color: getEstadoColor(estado),
        icon: getEstadoIcon(estado)
      };
    });
    
    // Agregar total
    const total = cotizaciones.length;
    return { stats, total };
  };

  useEffect(() => {
    loadCotizaciones();
  }, []);

  // Verificar permisos - Solo tienda, fábrica y administradores activos (clientes y usuarios bloqueados NO pueden acceder)
  if (!usuario || 
      usuario.rol === 'cliente' || 
      usuario.flag_blacklist === true) {
    return <UnauthorizedAccess />;
  }

  const canManage = usuario.rol === 'administrador' || usuario.rol === 'fabrica';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DoorOpen className="h-5 w-5" />
                Cotizaciones de Puertas
              </CardTitle>
              <CardDescription>
                Administra las cotizaciones ingresadas al sistema.
              </CardDescription>
            </div>
            <Button 
              onClick={loadCotizaciones} 
              disabled={loadingCotizaciones}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingCotizaciones ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tarjetas de estadísticas por estado */}
          {!loadingCotizaciones && !cotizacionesError && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {getEstadisticasEstados().stats.map(({ estado, cantidad, color, icon: IconComponent }) => (
                <Card key={estado} className="border-l-4" style={{ borderLeftColor: color }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{estado}</p>
                        <p className="text-2xl font-bold" style={{ color }}>{cantidad}</p>
                      </div>
                      <IconComponent className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {/* Tarjeta de total */}
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-blue-600">{getEstadisticasEstados().total}</p>
                    </div>
                    <DoorOpen className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por número, cliente, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedEstado} onValueChange={setSelectedEstado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                {ESTADOS_COTIZACION.map(estado => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTipo} onValueChange={setSelectedTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="puertaPaso">Puerta de Paso</SelectItem>
                <SelectItem value="puertaCloset">Puerta de Closet</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                <XCircle className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>

          {/* Estado de carga y errores */}
          {loadingCotizaciones && (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          )}

          {cotizacionesError && (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">{cotizacionesError}</p>
              <Button onClick={loadCotizaciones} variant="outline" className="mt-2">
                Reintentar
              </Button>
            </div>
          )}

          {/* Tabla de cotizaciones */}
          {!loadingCotizaciones && !cotizacionesError && (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Cotización</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Medidas</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCotizaciones.map((cotizacion) => {
                      const EstadoIcon = getEstadoIcon(cotizacion.estado);
                      return (
                        <TableRow key={cotizacion.id_producto_personalizado}>
                          <TableCell className="font-medium">
                            #{cotizacion.id_producto_personalizado}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={getEstadoBadgeVariant(cotizacion.estado)} 
                              className="flex items-center gap-1 w-fit"
                              style={{ backgroundColor: getEstadoColor(cotizacion.estado), color: 'white', border: 'none' }}
                            >
                              <EstadoIcon className="h-3 w-3" />
                              {cotizacion.estado}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{cotizacion.nombre_apellido_contacto}</div>
                              <div className="text-sm text-gray-500">{cotizacion.email_contacto}</div>
                            </div>
                          </TableCell>
                          <TableCell>{formatearTipoPuerta(cotizacion.tipo_puerta)}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatearMedidas(cotizacion.medida_ancho, cotizacion.medida_alto, cotizacion.medida_largo)}
                          </TableCell>
                          <TableCell>{cotizacion.material.nombre_material}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={cotizacion.precio ? 'text-green-600 font-medium' : 'text-gray-500'}>
                                {formatearPrecio(cotizacion.precio)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatearFecha(cotizacion.createdAt)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(cotizacion)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </DropdownMenuItem>
                                {canManage && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleUpdateEstado(cotizacion)}>
                                      <Settings className="mr-2 h-4 w-4" />
                                      Cambiar estado
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdatePrecio(cotizacion)}>
                                      <DollarSign className="mr-2 h-4 w-4" />
                                      Asignar precio
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {filteredCotizaciones.length === 0 && (
                <div className="text-center py-8">
                  <DoorOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    {hasActiveFilters ? 'No se encontraron cotizaciones con los filtros aplicados' : 'No hay cotizaciones registradas'}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de detalles */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de Cotización #{selectedCotizacion?.id_producto_personalizado}</DialogTitle>
            <DialogDescription>
              Información completa de la cotización
            </DialogDescription>
          </DialogHeader>
          {selectedCotizacion && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label className="font-medium">Cliente</Label>
                  <p className="text-sm">{selectedCotizacion.nombre_apellido_contacto}</p>
                </div>
                <div>
                  <Label className="font-medium">Email</Label>
                  <p className="text-sm">{selectedCotizacion.email_contacto}</p>
                </div>
                <div>
                  <Label className="font-medium">Teléfono</Label>
                  <p className="text-sm">{selectedCotizacion.telefono_contacto}</p>
                </div>
                <div>
                  <Label className="font-medium">RUT</Label>
                  <p className="text-sm">{selectedCotizacion.rut_contacto || 'No especificado'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="font-medium">Tipo de Puerta</Label>
                  <p className="text-sm">{formatearTipoPuerta(selectedCotizacion.tipo_puerta)}</p>
                </div>
                <div>
                  <Label className="font-medium">Medidas (cm)</Label>
                  <p className="text-sm font-mono">
                    {formatearMedidas(selectedCotizacion.medida_ancho, selectedCotizacion.medida_alto, selectedCotizacion.medida_largo)}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Material</Label>
                  <p className="text-sm">{selectedCotizacion.material.nombre_material}</p>
                </div>
                <div>
                  <Label className="font-medium">Relleno</Label>
                  <p className="text-sm">{selectedCotizacion.relleno.nombre_relleno}</p>
                </div>
              </div>
              <div className="col-span-2 space-y-3">
                <div>
                  <Label className="font-medium">Mensaje</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedCotizacion.mensaje}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Estado</Label>
                    <Badge 
                      variant={getEstadoBadgeVariant(selectedCotizacion.estado)} 
                      className="ml-2"
                      style={{ backgroundColor: getEstadoColor(selectedCotizacion.estado), color: 'white', border: 'none' }}
                    >
                      {selectedCotizacion.estado}
                    </Badge>
                  </div>
                  <div>
                    <Label className="font-medium">Precio</Label>
                    <p className="text-sm font-medium text-green-600">
                      {formatearPrecio(selectedCotizacion.precio)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para actualizar precio */}
      <Dialog open={showPrecioDialog} onOpenChange={setShowPrecioDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Precio</DialogTitle>
            <DialogDescription>
              Cotización #{selectedCotizacion?.id_producto_personalizado}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="precio">Precio (CLP)</Label>
              <Input
                id="precio"
                type="number"
                min="1"
                value={precioInput}
                onChange={(e) => setPrecioInput(e.target.value)}
                placeholder="Ingrese el precio"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPrecioDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={updatePrecio}>
                Asignar Precio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para actualizar estado */}
      <Dialog open={showEstadoDialog} onOpenChange={setShowEstadoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Estado</DialogTitle>
            <DialogDescription>
              Cotización #{selectedCotizacion?.id_producto_personalizado}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="estado">Nuevo Estado</Label>
              <Select value={estadoInput} onValueChange={(value) => setEstadoInput(value as EstadoCotizacion)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_COTIZACION.map(estado => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEstadoDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={updateEstado}>
                Cambiar Estado
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
