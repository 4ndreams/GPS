import { useState } from "react";
import { añadirPuertasService } from "@services/añadirPuertaService";

interface Body {
  nombre_producto: string;
  stock: number;
}

export default function useAñadirPuertas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const añadirPuertas = async (body: Body) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const { data, error } = await añadirPuertasService(body);

    if (error) {
      setError(error);
    } else {
      setResponse(data);
    }

    setLoading(false);
  };

  return {
    loading,
    error,
    response,
    añadirPuertas
  };
}