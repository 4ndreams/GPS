import { useState, useEffect } from "react";
import { comprasTotalesFiltradas } from "@services/bodega.service";
import type {
  Compra,
  ComprasFiltroBody,
  ComprasTotalesFiltradasResponse,
} from "@services/bodega.service"; // ajusta la ruta según tu estructura

const useGetComprasMes = (body: ComprasFiltroBody) => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!body) return;

    const fetch = async () => {
      setLoading(true);
      try {
        console.log("Cuerpo de la solicitud compras_mes.ts:", body);
        const res: ComprasTotalesFiltradasResponse = await comprasTotalesFiltradas(body);
        console.log("Compras totales filtradas response:", res.data.compras);
        if (res.status === "Success" && res.data) {
          setCompras(res.data.compras);
          setTotal(res.data.total);
          setCantidad(res.data.cantidad);
          setError(null);
        } else {
          setError(res.message || "Error desconocido");
        }
      } catch (err: any) {
        setError(err.message || "Error al obtener compras");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [JSON.stringify(body)]); // detecta cambios en el objeto

  return { compras, total, cantidad, loading, error };
};

export default useGetComprasMes;
