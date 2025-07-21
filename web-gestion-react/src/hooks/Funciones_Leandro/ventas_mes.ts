import { useState, useEffect } from "react";
import { ventasTotalesPorMes } from "@services/bodega.service";

type Body = {
  fecha_inicial?: string;
  fecha_final?: string;
};

export default function useVentasTotalesPorMes(body: Body) {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!body) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await ventasTotalesPorMes(body);
        if (res.status === "Success") {
          setTotal(res.data.total);
          setError(null);
        } else {
          setError(res.message || "Error desconocido");
        }
      } catch (err: unknown) {
        let mensaje = "Error de red";
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
  }, [JSON.stringify(body)]);

  return { total, loading, error };
}


