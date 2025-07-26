import React, { useState } from 'react';
import { useProductos } from '../hooks/useProductos';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Package, 
  DollarSign, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function ProductosPage() {
  const { productos, loading, error, refresh, deleteProducto } = useProductos();
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  // Filtrar productos por término de búsqueda
  const filteredProductos = productos.filter(producto =>
    producto?.nombre_producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto?.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto?.id_producto?.toString().includes(searchTerm)
  );

  // Función para formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Función para manejar eliminación de producto
  const handleDeleteProducto = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const success = await deleteProducto(id);
      if (success) {
        alert('Producto eliminado exitosamente');
      } else {
        alert('Error al eliminar el producto');
      }
    }
  };

  // Función para obtener el color del badge según el stock
  const getStockBadgeColor = (stock: number) => {
    if (stock === 0) return 'destructive';
    if (stock < 10) return 'secondary';
    return 'default';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando productos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error al cargar productos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Productos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona el catálogo de puertas y productos disponibles
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar productos por nombre, descripción o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(productos.reduce((sum, p) => sum + p.precio, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {productos.filter(p => p.stock === 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {productos.filter(p => p.stock > 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProductos.map((producto) => (
          <Card key={producto.id_producto} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{producto.nombre_producto}</CardTitle>
                  <CardDescription className="mt-1">
                    ID: {producto.id_producto}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => console.log('Editar producto:', producto.id_producto)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteProducto(producto.id_producto)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Precio:</span>
                  <span className="font-semibold text-lg text-green-600">
                    {formatPrice(producto.precio)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <Badge variant={getStockBadgeColor(producto.stock) as "destructive" | "secondary" | "default"}>
                    {producto.stock} unidades
                  </Badge>
                </div>

                {producto.descripcion && (
                  <div>
                    <span className="text-sm text-gray-600">Descripción:</span>
                    <p className="text-sm mt-1 text-gray-800 line-clamp-2">
                      {producto.descripcion}
                    </p>
                  </div>
                )}

                {(producto.medida_ancho || producto.medida_largo || producto.medida_alto) && (
                  <div>
                    <span className="text-sm text-gray-600">Medidas:</span>
                    <p className="text-sm mt-1 text-gray-800">
                      {producto.medida_ancho && `${producto.medida_ancho}cm ancho`}
                      {producto.medida_largo && ` × ${producto.medida_largo}cm largo`}
                      {producto.medida_alto && ` × ${producto.medida_alto}cm alto`}
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-2">
                  Creado: {new Date(producto.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProductos.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda' 
              : 'Agrega productos al catálogo para comenzar'
            }
          </p>
        </div>
      )}
    </div>
  );
} 