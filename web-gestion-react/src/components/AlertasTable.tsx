import { useEffect, useState } from 'react';
import './DespachosTable.css'; // reutilizamos estilos

type Despacho = {
  id: number;
  productos: number;
  origen: string;
  destino: string;
  fecha: string;
  estado: string;
  alerta: boolean;
};

export default function AlertasTable() {
  const [despachos, setDespachos] = useState<Despacho[]>([]);

  useEffect(() => {
    fetch('/src/data/despachos.json')
      .then((res) => res.json())
      .then((data) => setDespachos(data.filter((d: Despacho) => d.alerta)))
      .catch((err) => console.error('Error cargando alertas:', err));
  }, []);

  const marcarRevisada = (id: number) => {
    setDespachos(prev => prev.filter(d => d.id !== id));
  };

  return (
    <section className="table-section">
      <h2>Alertas de Despacho</h2>
      {despachos.length === 0 ? (
        <p>✅ No hay alertas pendientes.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Productos</th>
              <th>Destino</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {despachos.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.productos}</td>
                <td>{d.destino}</td>
                <td>{d.fecha}</td>
                <td>
                  <span className="estado alerta">{d.estado}</span>
                </td>
                <td>
                  <button onClick={() => marcarRevisada(d.id)}>✅ Revisada</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
