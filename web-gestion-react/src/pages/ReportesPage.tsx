import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Users,
  Package,
  Calendar as CalendarIcon,
  BarChart3
} from "lucide-react";
import useGetAllBodega from '@Funciones_Leandro/useGetAllBodegas';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// 📊 Importa el gráfico circular
import MaterialStockPieChart from '@components/ui/materialstock';
import ComprasVsVentasPieChart from '@components/ui/comprasvsventas';

export default function ReportesPage() {
  const { bodegas, loading, error } = useGetAllBodega();
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [graficoSeleccionado, setGraficoSeleccionado] = useState<'materiales' | 'ventas' | 'puertas'>('materiales');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [ordenSeleccionado, setOrdenSeleccionado] = useState<'nombre' | 'stock'>('nombre');

  if (loading) return <p>Cargando bodegas...</p>;
  if (error) return <p>Error: {error}</p>;

  const toggleSeleccion = (id: number) => {
    setSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSeleccionarTodos = (tipo: 'material' | 'relleno') => {
    const idsTipo = bodegas.filter(b => b.tipo === tipo).map(b => b.id);
    const todosSeleccionados = idsTipo.every(id => seleccionadas.includes(id));

    setSeleccionadas(prev =>
      todosSeleccionados
        ? prev.filter(id => !idsTipo.includes(id))
        : [...new Set([...prev, ...idsTipo])]
    );
  };

const datosCheckout = {
  id_bodega: seleccionadas.length > 0 ? seleccionadas.join(',') : undefined,
  ...(date?.from ? { fecha_inicial: format(date.from, 'yyyy-MM-dd') } : undefined),
  ...(date?.to ? { fecha_final: format(date.to, 'yyyy-MM-dd') } : undefined)
};


  const renderGrafico = () => {
    switch (graficoSeleccionado) {
      case 'materiales':
        return (
          <MaterialStockPieChart
            id_bodega={datosCheckout.id_bodega}
            fecha_inicial={datosCheckout.fecha_inicial ?? undefined}
            fecha_final={datosCheckout.fecha_final ?? undefined}
          />
        );
      case 'ventas':
        return <ComprasVsVentasPieChart
          fecha_inicial={datosCheckout.fecha_inicial ?? undefined}
          fecha_final={datosCheckout.fecha_final ?? undefined}
        />;
      case 'puertas':
        return <div className="text-center py-10">Gráfico: Comparación de puertas vendidas</div>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes TERPLAC</h1>
          <p className="text-gray-600 mt-1">
            Análisis y estadísticas del sistema de gestión
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filtros: materiales/rellenos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Filtro material y relleno
            </CardTitle>
            <CardDescription>
              Seleccione materiales o rellenos para filtrar las compras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="w-full p-2 border mb-4 rounded"
            />
            <div className="mb-4">
              <label className="text-sm font-medium mr-2">Ordenar por:</label>
              <Select value={ordenSeleccionado} onValueChange={(val) => setOrdenSeleccionado(val as 'nombre' | 'stock')}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nombre">Nombre</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {['material', 'relleno'].map((tipo) => {
                const itemsFiltrados = bodegas
                  .filter(b => b.tipo === tipo && b.nombre.toLowerCase().includes(filtroNombre.toLowerCase()))
                  .sort((a, b) =>
                    ordenSeleccionado === 'nombre'
                      ? a.nombre.localeCompare(b.nombre)
                      : b.stock - a.stock
                  );

                if (itemsFiltrados.length === 0) return null;

                const idsTipo = itemsFiltrados.map(b => b.id);
                const todosSeleccionados = idsTipo.every(id => seleccionadas.includes(id));

                return (
                  <div key={tipo}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold capitalize">{tipo}</h3>
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => toggleSeleccionarTodos(tipo as 'material' | 'relleno')}
                      >
                        {todosSeleccionados ? 'Quitar todos' : 'Añadir todos'}
                      </button>
                    </div>
                    <div className="space-y-2 ml-4 max-h-48 overflow-y-auto pr-1">
                      {itemsFiltrados.map((bodega) => (
                        <label key={bodega.id} className="flex items-center justify-between p-2 border rounded-md cursor-pointer">
                          <div>
                            <p className="font-medium">{bodega.nombre}</p>
                            <p className="text-sm text-gray-500">Stock: {bodega.stock}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={seleccionadas.includes(bodega.id)}
                            onChange={() => toggleSeleccion(bodega.id)}
                            className="w-5 h-5 accent-blue-600"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filtro por fechas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Filtrar por fecha
            </CardTitle>
            <CardDescription>
              Si no selecciona una fecha, se filtrarán por el año actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
                    ) : (
                      format(date.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Selecciona un rango de fechas</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  defaultMonth={new Date()}
                  captionLayout="dropdown"
                  disabled={{ after: new Date() }}
                />


              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico dinámico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Visualización de Datos
          </CardTitle>
          <CardDescription>
            Cambia entre los distintos tipos de gráficos disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 border-b mb-4 pb-2">
            <button
              onClick={() => setGraficoSeleccionado('materiales')}
              className={`px-3 py-1 rounded-t-md ${graficoSeleccionado === 'materiales' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              Cantidad de compras de Materiales/Rellenos
            </button>
            <button
              onClick={() => setGraficoSeleccionado('ventas')}
              className={`px-3 py-1 rounded-t-md ${graficoSeleccionado === 'ventas' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              Ventas vs Compras
            </button>
          </div>
          <div className="min-h-[200px]">{renderGrafico()}</div>
        </CardContent>
      </Card>

      {/* Debug */}
    </div>
  );
}

