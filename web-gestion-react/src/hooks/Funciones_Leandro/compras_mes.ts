import { useState, useEffect } from "react";
import { comprasTotalesFiltradas } from "@services/bodega.service";
import type {
  Compra,
  ComprasFiltroBody,
  ComprasTotalesFiltradasResponse,
} from "@services/bodega.service";

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
        const res: ComprasTotalesFiltradasResponse =
          await comprasTotalesFiltradas(body);

        if (res.status === "Success" && res.data) {
          setCompras(res.data.compras);
          setTotal(res.data.total);
          setCantidad(res.data.cantidad);
          setError(null);
        } else {
          setError(res.message || "Error desconocido");
        }
      } catch (err: unknown) {
        let mensaje = "Error al obtener compras";
        if (err instanceof Error) {
          mensaje = err.message;
        } else if (typeof err === "object" && err && "message" in err) {
          mensaje = String((err as { message: unknown }).message);
        }
        setError(mensaje);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [body]); // gracias al useMemo, body solo cambia si sus valores internos cambian

  return { compras, total, cantidad, loading, error };
};

export default useGetComprasMes;


