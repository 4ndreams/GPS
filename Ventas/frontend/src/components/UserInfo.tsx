import React, { useEffect, useState } from "react";
import axios from "axios";
import "@styles/userInfo.css";

interface Compra {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  productos: {
    nombre: string;
    cantidad: number;
  }[];
}

const UserInfo = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCompras(res.data.data))
      .catch((err) => console.error("Error al obtener compras:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando historial de compras...</p>;
  if (compras.length === 0) return <p>No se encontraron compras realizadas.</p>;

  return (
    <div className="user-info">
      <h2>Historial de Compras</h2>
      <table className="compras-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra) => (
            <tr key={compra.id}>
              <td>{new Date(compra.fecha).toLocaleDateString()}</td>
              <td>
                <ul>
                  {compra.productos.map((prod, idx) => (
                    <li key={idx}>
                      {prod.nombre} x {prod.cantidad}
                    </li>
                  ))}
                </ul>
              </td>
              <td>${compra.total.toFixed(2)}</td>
              <td>{compra.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserInfo;
