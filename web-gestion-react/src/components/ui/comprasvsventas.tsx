import { useMemo } from "react";
import useGetComprasMes from "@/hooks/Funciones_Leandro/compras_mes";
import useVentasTotalesPorMes from "@/hooks/Funciones_Leandro/ventas_mes";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AlertTriangle, Loader2 } from "lucide-react";

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
  const comprasBody = useMemo(() => ({
    id_bodega,
    fecha_inicial,
    fecha_final,
  }), [id_bodega, fecha_inicial, fecha_final]);

  const ventasBody = useMemo(() => ({
    fecha_inicial,
    fecha_final,
  }), [fecha_inicial, fecha_final]);

  const { total: totalCompras = 0, loading: loadingCompras, error: errorCompras } = useGetComprasMes(comprasBody);
  const { total: totalVentas = 0, loading: loadingVentas, error: errorVentas } = useVentasTotalesPorMes(ventasBody);

  if (loadingCompras || loadingVentas) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mb-2" />
        <p className="text-sm">Cargando datos...</p>
      </div>
    );
  }

  if (errorCompras && errorVentas) {
    return (
      <ErrorMessage message="No se encontraron compras ni ventas." />
    );
  }

  if (errorCompras) {
    return (
      <ErrorMessage message="No se encontraron compras." />
    );
  }

  if (errorVentas) {
    return (
      <ErrorMessage message="No se encontraron ventas." />
    );
  }

  const hasCompras = totalCompras > 0;
  const hasVentas = totalVentas > 0;

  if (!hasCompras && !hasVentas) return <ErrorMessage message="No se encontraron compras ni ventas." />;
  if (!hasCompras) return <ErrorMessage message="No se encontraron compras." />;
  if (!hasVentas) return <ErrorMessage message="No se encontraron ventas." />;

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
                {data.map((_, index) => (
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

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 text-red-600">
      <AlertTriangle className="w-6 h-6 mb-2" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
