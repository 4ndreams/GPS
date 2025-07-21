import React from "react";
import useGetComprasMes from "@/hooks/Funciones_Leandro/compras_mes";
import useVentasTotalesPorMes from "@/hooks/Funciones_Leandro/ventas_mes";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const generateColorPalette = (count: number): string[] =>
  Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 65%, 55%)`);

const RADIAN = Math.PI / 180;

type LabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
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

export default function ComprasVsVentasPieChart({
  id_bodega,
  fecha_inicial,
  fecha_final,
}: Props) {
  const { total: totalCompras = 0, loading: loadingCompras, error: errorCompras } = useGetComprasMes({
    id_bodega,
    fecha_inicial,
    fecha_final,
  });

  const { total: totalVentas = 0, loading: loadingVentas, error: errorVentas } = useVentasTotalesPorMes({
    fecha_inicial,
    fecha_final,
  });

  if (loadingCompras || loadingVentas) return <p>Cargando datos...</p>;
  if (errorCompras && errorVentas) return <p>Error al cargar datos: no se encontraron compras ni ventas </p>;
  if (errorCompras) return <p>Error al cargar compras: no se encontraron compras</p>;
  if (errorVentas) return <p>Error al cargar ventas: no se encontraron ventas</p>;

  const hasCompras = totalCompras > 0;
  const hasVentas = totalVentas > 0;

  // Mensajes si no hay datos
  if (!hasCompras && !hasVentas) return <p>No se encontraron compras ni ventas.</p>;
  if (!hasCompras) return <p>No se encontraron compras.</p>;
  if (!hasVentas) return <p>No se encontraron ventas.</p>;

  const data = [
    { name: "Compras", value: totalCompras },
    { name: "Ventas", value: totalVentas },
  ];

  const COLORS = generateColorPalette(data.length);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-center mb-4">
        Comparación de Compras y Ventas
      </h2>

      <div className="flex gap-6 items-start">
        {/* Gráfico circular */}
        <div className="flex-1 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Totales con colores */}
        <div className="w-48 space-y-3">
          <h3 className="text-sm font-semibold border-b pb-1">Totales</h3>
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="font-medium">{entry.name}:</span>
              </span>
              <span>{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

