import { useMemo } from "react";
import useGetComprasMes from "@Funciones_Leandro/compras_mes";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Loader2, AlertTriangle } from "lucide-react";

// Generador de colores dinámicos
const generateColorPalette = (count: number): string[] =>
  Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 65%, 55%)`);

const RADIAN = Math.PI / 180;

// Etiqueta personalizada dentro del gráfico
type LabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
};

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

type Props = {
  id_bodega?: number | string | number[];
  fecha_inicial?: string;
  fecha_final?: string;
};

export default function MaterialStockPieChart({
  id_bodega,
  fecha_inicial,
  fecha_final,
}: Props) {
  const filtroCompras = useMemo(() => ({
    id_bodega,
    fecha_inicial,
    fecha_final,
  }), [id_bodega, fecha_inicial, fecha_final]);

  const { compras, loading, error } = useGetComprasMes(filtroCompras);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mb-2" />
        <p className="text-sm">Cargando materiales y rellenos...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="No se encontraron compras registradas." />;
  }

  const materiales: Record<string, number> = {};
  const rellenos: Record<string, number> = {};

  compras.forEach((c) => {
    const nombre = c.nombre_producto;
    const tipo = c.bodega?.material ? "material" : c.bodega?.relleno ? "relleno" : "otro";
    if (tipo === "material") {
      materiales[nombre] = (materiales[nombre] || 0) + c.stock;
    } else if (tipo === "relleno") {
      rellenos[nombre] = (rellenos[nombre] || 0) + c.stock;
    }
  });

  const data = [
    ...Object.entries(materiales).map(([name, value]) => ({ name, value, tipo: "material" })),
    ...Object.entries(rellenos).map(([name, value]) => ({ name, value, tipo: "relleno" })),
  ];

  if (data.length === 0) {
    return <ErrorMessage message="No hay datos de materiales o rellenos para mostrar." />;
  }

  const total = data.reduce((s, d) => s + d.value, 0);
  const colors = generateColorPalette(data.length);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-center mb-4">
        Cantidad de Materiales y Rellenos Comprados
      </h2>

      <div className="flex h-72">
        {/* Gráfico circular */}
        <div className="flex-1">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={colors[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Leyendas separadas */}
        <div className="w-44 ml-4 flex flex-col gap-4">
          {/* Materiales */}
          <div className="overflow-y-auto max-h-32 pr-1">
            <h4 className="text-sm font-semibold mb-1">Materiales</h4>
            <ul className="space-y-1 text-xs">
              {data
                .map((d, i) => ({ ...d, color: colors[i] }))
                .filter((d) => d.tipo === "material")
                .map((entry) => (
                  <li key={entry.name} className="flex items-center">
                    <span
                      className="inline-block w-3 h-3 rounded-sm mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="flex-1 truncate">{entry.name}</span>
                    <span className="ml-1 font-medium whitespace-nowrap">
                      {entry.value} ({((entry.value / total) * 100).toFixed(0)}%)
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Rellenos */}
          <div className="overflow-y-auto max-h-32 pr-1">
            <h4 className="text-sm font-semibold mb-1">Rellenos</h4>
            <ul className="space-y-1 text-xs">
              {data
                .map((d, i) => ({ ...d, color: colors[i] }))
                .filter((d) => d.tipo === "relleno")
                .map((entry) => (
                  <li key={entry.name} className="flex items-center">
                    <span
                      className="inline-block w-3 h-3 rounded-sm mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="flex-1 truncate">{entry.name}</span>
                    <span className="ml-1 font-medium whitespace-nowrap">
                      {entry.value} ({((entry.value / total) * 100).toFixed(0)}%)
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de mensaje de error reutilizable
function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 text-red-600">
      <AlertTriangle className="w-6 h-6 mb-2" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
