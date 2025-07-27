import { useState, useEffect } from "react";
import { ventasTotalesPorMes } from "@services/bodega.service";

type Body = {
  fecha_inicial?: string;
  fecha_final?: string;
};

type ErrorType = string | null;

interface RespuestaBackend {
  status: string;
  message?: string;
  data?: {
    total: number;
  };
}

const useVentasTotalesPorMes = (body: Body) => {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ErrorType>(null);

  const fetchVentas = async () => {
    try {
      setLoading(true);

      const res: RespuestaBackend = await ventasTotalesPorMes(body);

      if (res.status !== "Success" || !res.data) {
        throw new Error(res.message || "Respuesta inválida del servidor");
      }

      setTotal(res.data.total);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al obtener las ventas");
      }
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  return { total, loading, error, fetchVentas };
};

export default useVentasTotalesPorMes;





