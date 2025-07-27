import { useEffect, useState } from "react";
import { getBodegas } from "@services/bodega.service";
import type { Bodega } from "@services/bodega.service";

export default function useGetAllBodegas() {
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBodegas = async () => {
      setLoading(true);
      const result = await getBodegas();
      if (result.status === "Error") {
        setError(result.message ?? "Error desconocido");
      } else {
        setBodegas(result.data ?? []);
      }
      setLoading(false);
    };

    fetchBodegas();
  }, []);

  return { bodegas, loading, error };
}
