import { useEffect, useState } from 'react';
import './DespachosTable.css';

type Despacho = {
  id: number;
  productos: number;
  origen: string;
  destino: string;
  fecha: string;
  estado: 'Recibido' | 'Alerta' | 'En tránsito';
};

const getEstadoClase = (estado: string) => {
  switch (estado) {
    case 'Recibido': return 'recibido';
    case 'Alerta': return 'alerta';
    case 'En tránsito': return 'transito';
    default: return '';
  }
};

export default function DespachosTable() {
  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [filtro, setFiltro] = useState<string>('Todos');

  useEffect(() => {
    fetch('/src/data/despachos.json')
      .then((res) => res.json())
      .then((data) => setDespachos(data))
      .catch((err) => console.error('Error cargando despachos:', err));
  }, []);

  return (
    <section className="table-section">
      <h2>Despachos recientes</h2>
      <div className="filtro-container">
  <label htmlFor="filtro">Filtrar por estado: </label>
  <select
    id="filtro"
    value={filtro}
    onChange={(e) => setFiltro(e.target.value)}
  >
    <option value="Todos">Todos</option>
    <option value="Recibido">Recibido</option>
    <option value="Alerta">Alerta</option>
    <option value="En tránsito">En tránsito</option>
  </select>
</div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Productos</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Fecha envío</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
{despachos
  .filter((d) => filtro === 'Todos' || d.estado === filtro)
  .map((d) => (
    <tr key={d.id}>
      <td>{d.id}</td>
      <td>{d.productos}</td>
      <td>{d.origen}</td>
      <td>{d.destino}</td>
      <td>{d.fecha}</td>
      <td>
        <span className={`estado ${getEstadoClase(d.estado)}`}>
          {d.estado}
        </span>
      </td>
      <td><button>👁️</button></td>
    </tr>
))}
        </tbody>
      </table>
    </section>
  );
}
