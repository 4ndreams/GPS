import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Package, Clock } from "lucide-react"

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