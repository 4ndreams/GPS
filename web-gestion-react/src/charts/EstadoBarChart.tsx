import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';

type EstadoDespacho = 'Recibido' | 'En tránsito' | 'Alerta';

type Despacho = {
  id: number;
  estado: EstadoDespacho;
};

type BarChartPayload = {
  payload: {
    estado: EstadoDespacho;
    cantidad: number;
  };
};

export default function EstadoBarChart() {
  const [data, setData] = useState([
    { estado: 'Recibido', cantidad: 0 },
    { estado: 'En tránsito', cantidad: 0 },
    { estado: 'Alerta', cantidad: 0 },
  ]);
  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<EstadoDespacho | null>(null);

  useEffect(() => {
    fetch('/src/data/despachos.json')
      .then((res) => res.json())
      .then((despachos: Despacho[]) => {
        const counts: Record<EstadoDespacho, number> = {
          'Recibido': 0,
          'En tránsito': 0,
          'Alerta': 0,
        };

        despachos.forEach((d) => {
          if (counts[d.estado] !== undefined) {
            counts[d.estado]++;
          }
        });

        setData([
          { estado: 'Recibido', cantidad: counts['Recibido'] },
          { estado: 'En tránsito', cantidad: counts['En tránsito'] },
          { estado: 'Alerta', cantidad: counts['Alerta'] },
        ]);

        setDespachos(despachos);
      });
  }, []);

  const handleBarClick = (data: BarChartPayload) => {
    if (data.payload?.estado) {
      setEstadoSeleccionado(data.payload.estado);
    }
  };

  const despachosFiltrados = estadoSeleccionado
    ? despachos.filter((d) => d.estado === estadoSeleccionado)
    : [];

  return (
    <div className="chart-container">
      <h2 style={{ marginBottom: '1rem' }}>Despachos por Estado</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%"
          onClick={({ activePayload }) => {
            if (activePayload && activePayload.length > 0) {
              handleBarClick(activePayload[0] as BarChartPayload);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="estado" />
          <YAxis />
          <Tooltip
            wrapperStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Legend />
          <Bar dataKey="cantidad" radius={[10, 10, 0, 0]} isAnimationActive={true}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.estado === 'Recibido'
                    ? '#2ecc71'
                    : entry.estado === 'En tránsito'
                    ? '#f39c12'
                    : '#e74c3c'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {estadoSeleccionado && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Despachos: {estadoSeleccionado}</h3>
            <button
              style={{
                backgroundColor: '#ccc',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 1rem',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              onClick={() => setEstadoSeleccionado(null)}
            >
              Limpiar filtro ✖️
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {despachosFiltrados.map((d) => (
                <tr key={d.id}>
                  <td style={{ padding: '0.5rem', borderTop: '1px solid #eee' }}>{d.id}</td>
                  <td style={{ padding: '0.5rem', borderTop: '1px solid #eee' }}>{d.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
