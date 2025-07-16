import React, { useEffect, useState } from "react";
import "@styles/OrdersList.css";

interface VentaProduct {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

interface Venta {
  id_venta: number;
  fecha_solicitud: string;
  estado_pago: string;
  fecha_pago: string;
  id_usuario: number;
  products: VentaProduct[];  // productos en la venta
}

const dummyVentas: Venta[] = [
  {
    id_venta: 1,
    fecha_solicitud: "2025-06-20T10:00:00Z",
    estado_pago: "Completado",
    fecha_pago: "2025-06-21T15:30:00Z",
    id_usuario: 101,
    products: [
      { id: 1, nombre: 'Puerta Geno Enchape Wenge', precio: 105000, imagen: '1.png', cantidad: 1 },
      { id: 3, nombre: 'Moldura Roble 2m', precio: 45000, imagen: 'm1.jpg', cantidad: 2 },
    ],
  },
  {
    id_venta: 2,
    fecha_solicitud: "2025-06-18T14:30:00Z",
    estado_pago: "Pendiente",
    fecha_pago: "2025-06-19T09:45:00Z",
    id_usuario: 102,
    products: [
      { id: 2, nombre: 'Puerta Moderna Vidrio', precio: 210000, imagen: '2.jpeg', cantidad: 1 },
    ],
  },
  {
    id_venta: 3,
    fecha_solicitud: "2025-06-22T08:15:00Z",
    estado_pago: "Completado",
    fecha_pago: "2025-06-22T11:00:00Z",
    id_usuario: 103,
    products: [
      { id: 5, nombre: 'Puerta Seguridad Acero', precio: 320000, imagen: '3.jpeg', cantidad: 1 },
      { id: 6, nombre: 'Moldura Blanca Moderna', precio: 38000, imagen: 'm3.jpg', cantidad: 3 },
    ],
  },
];

const OrdersList: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);

  useEffect(() => {
    // Simulate fetching sales
    setTimeout(() => {
      setVentas(dummyVentas);
    }, 500);
  }, []);

  return (
    <div className="orders-container">
      {ventas.length > 0 ? (
        ventas.map((venta) => (
          <div key={venta.id_venta} className="order-card">
            <div className="order-products">
              {venta.products.map((p) => (
                <div key={p.id} className="order-product-item">
                  <img src={`@src/img/${p.id <= 5 ? 'puertas' : 'molduras'}/${p.imagen}`} alt={p.nombre} />
                  <p className="product-name">{p.nombre}</p>
                  <p className="product-qty">x{p.cantidad}</p>
                </div>
              ))}
            </div>
            <div className="order-details">
              <h4>Pedido #{venta.id_venta}</h4>
              <p><strong>Usuario ID:</strong> {venta.id_usuario}</p>
              <p><strong>Solicitado:</strong> {new Date(venta.fecha_solicitud).toLocaleString()}</p>
              <p><strong>Estado de Pago:</strong> <span className={`status ${venta.estado_pago === "Completado" ? "paid" : "pending"}`}>{venta.estado_pago}</span></p>
              <p><strong>Fecha de Pago:</strong> {new Date(venta.fecha_pago).toLocaleString()}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No hay pedidos para mostrar.</p>
      )}
    </div>
  );
};

export default OrdersList;
