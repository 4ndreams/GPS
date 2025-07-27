import { useMemo } from "react";
import useGetComprasMes from "@Funciones_Leandro/compras_mes";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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

  if (loading) return <p>Cargando materiales...</p>;
  if (error) return <p>Error: no se encontraron compras</p>;

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

  if (data.length === 0) return <p>No hay datos para mostrar.</p>;

  const total = data.reduce((s, d) => s + d.value, 0);
  const colors = generateColorPalette(data.length);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-center mb-4">
        Cantidad de Materiales y Rellenos comprados
      </h2>

      <div className="flex h-72">
        {/* Gráfico */}
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
          {/* Scroll Materiales */}
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

          {/* Scroll Rellenos */}
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



